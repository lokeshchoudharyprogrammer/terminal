const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const crypto = require('crypto');
const path = require('path');
const url = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: __dirname, webpack: true, turbopack: false });
const nextHandler = nextApp.getRequestHandler();

const PORT = process.env.PORT || 3000;
const SCRIPTS_DIR = path.join(__dirname, 'scripts');
const ZSH_INIT_DIR = path.join(SCRIPTS_DIR, 'zsh-init');

nextApp.prepare().then(() => {
  const app = express();
  app.use((req, res, nextMiddleware) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    nextMiddleware();
  });

  // Next.js page and asset handler — handles all standard page requests
  app.all(/.*/, (req, res) => {
    return nextHandler(req, res);
  });

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/api/pty') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws, req) => {
    const query = url.parse(req.url, true).query;
    const mode = query.mode || 'chat';

    console.log(`[WS] Client connected. mode=${mode}`);

    if (mode === 'auth') {
      handleAuthTerminal(ws);
    } else {
      handleChatTerminal(ws);
    }
  });

  function handleAuthTerminal(ws) {
    const shell = process.env.SHELL || '/bin/zsh';
    const useZsh = shell.includes('zsh') || process.platform === 'darwin';

    let term = null;
    let authDone = false;
    let outputBuffer = '';

    const spawnShell = (cols, rows) => {
      console.log(`[AUTH-PTY] Spawning real shell: ${shell}`);
      const spawnArgs = useZsh ? ['-i'] : ['-i'];

      term = pty.spawn(shell, spawnArgs, {
        name: 'xterm-256color',
        cols: cols || 220,
        rows: rows || 50,
        cwd: process.env.HOME || process.cwd(),
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          COLORTERM: 'truecolor',
          ZDOTDIR: ZSH_INIT_DIR,
          AGY_SCRIPTS_DIR: SCRIPTS_DIR,
          PATH: `${SCRIPTS_DIR}:${process.env.PATH}`,
          SHELL_SESSIONS_DISABLE: '1',
        },
      });

      term.onData((data) => {
        if (ws.readyState !== WebSocket.OPEN) return;

        if (!authDone) {
          outputBuffer += data;
          if (outputBuffer.length > 4096) {
            outputBuffer = outputBuffer.slice(-2048);
          }

          const markerMatch = outputBuffer.match(/#ANTIGRAVITY_DONE#(\{.*?\})/);
          if (markerMatch) {
            authDone = true;
            try {
              const authData = JSON.parse(markerMatch[1]);
              console.log('[AUTH-PTY] Auth complete:', authData.sessionId);
              ws.send(JSON.stringify({ type: 'auth_done', ...authData }));
            } catch (e) {
              console.error('[AUTH-PTY] Failed to parse auth data:', e);
            }
            const cleaned = data.replace(/#ANTIGRAVITY_DONE#\{.*?\}\r?\n?/g, '');
            if (cleaned) ws.send(JSON.stringify({ type: 'output', data: cleaned }));
            return;
          }
        }

        ws.send(JSON.stringify({ type: 'output', data }));
      });

      term.onExit(({ exitCode }) => {
        console.log(`[AUTH-PTY] Shell exited: code=${exitCode}`);
        term = null;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'shell_exit', exitCode }));
        }
      });
    };

    ws.on('message', (message) => {
      try {
        const payload = JSON.parse(message);
        if (payload.type === 'init') {
          const cols = parseInt(payload.cols, 10) || 220;
          const rows = parseInt(payload.rows, 10) || 50;
          spawnShell(cols, rows);
        } else if (payload.type === 'input') {
          if (term) term.write(payload.data);
        } else if (payload.type === 'resize') {
          if (term) {
            const cols = parseInt(payload.cols, 10);
            const rows = parseInt(payload.rows, 10);
            if (cols > 0 && rows > 0) term.resize(cols, rows);
          }
        }
      } catch (err) {
        console.error('[AUTH-WS] Error:', err.message);
      }
    });

    ws.on('close', () => {
      console.log('[AUTH-WS] Client disconnected.');
      try { if (term) term.kill(); } catch {}
    });
  }

  function handleChatTerminal(ws) {
    console.log('[CHAT-WS] Client connected to chat bridge.');
    let activeProcess = null;

    const spawnCommand = (fullCommand) => {
      if (activeProcess) {
        try { activeProcess.kill(); } catch {}
      }

      const shell = process.env.SHELL || 'zsh';
      console.log(`[CHAT-PTY] Spawning: ${shell} -c "${fullCommand}"`);

      try {
        activeProcess = pty.spawn(shell, ['-c', fullCommand], {
          name: 'xterm-256color',
          cols: 120,
          rows: 36,
          cwd: process.env.HOME || process.cwd(),
          env: { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' },
        });

        activeProcess.onData((data) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'output', data }));
          }
        });

        activeProcess.onExit(({ exitCode }) => {
          console.log(`[CHAT-PTY] Exited: code=${exitCode}`);
          activeProcess = null;
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'done', exitCode }));
          }
        });
      } catch (err) {
        console.error('[CHAT-PTY] Spawn error:', err.message);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'error', message: err.message }));
        }
      }
    };

    ws.on('message', (message) => {
      try {
        const payload = JSON.parse(message);
        if (payload.type === 'run') {
          spawnCommand(payload.command);
        } else if (payload.type === 'input') {
          if (activeProcess) activeProcess.write(payload.data);
        } else if (payload.type === 'resize') {
          if (activeProcess) {
            const cols = parseInt(payload.cols, 10);
            const rows = parseInt(payload.rows, 10);
            if (cols > 0 && rows > 0) activeProcess.resize(cols, rows);
          }
        } else if (payload.type === 'cancel') {
          if (activeProcess) {
            activeProcess.write('\u0003');
            setTimeout(() => { try { if (activeProcess) activeProcess.kill(); } catch {} }, 300);
          }
        }
      } catch (err) {
        console.error('[CHAT-WS] Error:', err.message);
      }
    });

    ws.on('close', () => {
      console.log('[CHAT-WS] Disconnected.');
      try { if (activeProcess) activeProcess.kill(); } catch {}
    });
  }

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`[SERVER] Custom Next.js + PTY Server listening on http://localhost:${PORT}`);
  });
});
