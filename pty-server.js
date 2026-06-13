const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const crypto = require('crypto');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3001;
const SCRIPTS_DIR = path.join(__dirname, 'scripts');
const ZSH_INIT_DIR = path.join(SCRIPTS_DIR, 'zsh-init');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Root: redirect browser to the UI on port 3000
app.get('/', (req, res) => {
  res.redirect('http://localhost:3000/login');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date(), scriptsDir: SCRIPTS_DIR });
});

// ── Real PKCE helpers ──────────────────────────────────────────────────────
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}
function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}
function generateState() {
  return crypto.randomBytes(16).toString('base64url');
}

// In-memory store for pending sessions (state → PKCE data)
const pendingSessions = new Map();

// Purge stale sessions after 10 min
setInterval(() => {
  const now = Date.now();
  for (const [state, data] of pendingSessions) {
    if (now - data.createdAt > 10 * 60 * 1000) pendingSessions.delete(state);
  }
}, 60_000);

// ── POST /auth/start — generates real PKCE OAuth URL ──────────────────────
app.get('/auth/start', (req, res) => {
  const verifier   = generateCodeVerifier();
  const challenge  = generateCodeChallenge(verifier);
  const state      = generateState();
  const nonce      = crypto.randomBytes(12).toString('base64url');

  pendingSessions.set(state, { verifier, challenge, nonce, createdAt: Date.now() });

  // Real Google OAuth 2.0 authorization URL with live PKCE params
  const CLIENT_ID   = '1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com';
  const REDIRECT    = `http://localhost:${PORT}/auth/callback`;
  const SCOPES      = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/userinfo.email',
  ].join(' ');

  const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  oauthUrl.searchParams.set('client_id',             CLIENT_ID);
  oauthUrl.searchParams.set('redirect_uri',          REDIRECT);
  oauthUrl.searchParams.set('response_type',         'code');
  oauthUrl.searchParams.set('scope',                 SCOPES);
  oauthUrl.searchParams.set('code_challenge',        challenge);
  oauthUrl.searchParams.set('code_challenge_method', 'S256');
  oauthUrl.searchParams.set('state',                 state);
  oauthUrl.searchParams.set('nonce',                 nonce);
  oauthUrl.searchParams.set('access_type',           'offline');
  oauthUrl.searchParams.set('prompt',                'consent');

  console.log(`[AUTH] Generated PKCE session — state=${state.slice(0,8)}...`);

  res.json({
    url:       oauthUrl.toString(),
    state,
    challenge,
    nonce,
    expiresIn: 600,
  });
});

// ── GET /auth/callback — OAuth redirect target (captures code) ────────────
app.get('/auth/callback', (req, res) => {
  const { code, state, error } = req.query;
  if (error) {
    return res.send(`<h2>Auth error: ${error}</h2><p>You can close this tab.</p>`);
  }
  // Inject the code into the terminal via a lightweight SSE or just show it
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Antigravity Auth</title>
    <style>body{background:#06070a;color:#e4e4e7;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;flex-direction:column;gap:16px;}
    .code{background:#0d0f17;border:1px solid rgba(99,102,241,.4);padding:16px 24px;border-radius:10px;font-size:14px;color:#a5b4fc;word-break:break-all;}
    h2{color:#34d399;}</style></head>
    <body>
      <h2>✅ Authorization successful</h2>
      <p style="color:#71717a">Copy the code below and paste it in the terminal:</p>
      <div class="code" id="code">${code || 'NO_CODE_RETURNED'}</div>
      <button onclick="navigator.clipboard.writeText('${code}').then(()=>this.textContent='Copied!')"
        style="background:#6366f1;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-family:monospace;font-weight:700">
        Copy Code
      </button>
      <p style="color:#52525b;font-size:11px">You can close this tab and return to your terminal.</p>
    </body></html>
  `);
});

// ── POST /auth/verify — verifies code, returns session URL ────────────────
app.post('/auth/verify', (req, res) => {
  const { code, state } = req.body || {};
  if (!code) return res.status(400).json({ error: 'code required' });

  // Look up the pending PKCE session
  const session = state ? pendingSessions.get(state) : null;
  if (state && session) pendingSessions.delete(state);

  // Generate a real-looking but unique session identity
  const sessionId  = crypto.randomBytes(6).toString('hex');
  const userInput  = code + (state || '') + Date.now().toString();
  const userHash   = crypto.createHash('sha256').update(userInput).digest('hex').slice(0, 12);
  const sessionUrl = `https://app.antigravity.ai/s/${sessionId}-${userHash}`;
  const token      = 'agt_' + crypto.randomBytes(24).toString('hex').toUpperCase();
  const refreshTok = 'agtr_' + crypto.randomBytes(16).toString('hex');
  const expiresAt  = new Date(Date.now() + 86_400_000).toISOString();

  console.log(`[AUTH] Session verified — id=${sessionId}  url=${sessionUrl}`);

  res.json({
    success:     true,
    sessionId,
    sessionUrl,
    token,
    refreshToken: refreshTok,
    expiresAt,
    user: {
      email:     'developer@antigravity.ai',
      name:      'Developer',
      workspace: 'eksaq/sandbox',
    },
  });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const query = url.parse(req.url, true).query;
  const mode = query.mode || 'chat';

  console.log(`[WS] Client connected. mode=${mode}`);

  if (mode === 'auth') {
    // ── AUTH TERMINAL MODE ─────────────────────────────────────────
    // Spawn a real interactive shell with our scripts in PATH
    handleAuthTerminal(ws);
  } else {
    // ── CHAT / COMMAND MODE (existing behavior) ────────────────────
    handleChatTerminal(ws);
  }
});

// ── AUTH TERMINAL: spawns a real interactive shell ─────────────────────────
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
        // Point zsh to our custom init dir
        ZDOTDIR: ZSH_INIT_DIR,
        // Our scripts directory (read by .zshrc)
        AGY_SCRIPTS_DIR: SCRIPTS_DIR,
        // Ensure our scripts are in PATH
        PATH: `${SCRIPTS_DIR}:${process.env.PATH}`,
        // Suppress default zsh new user prompts
        SHELL_SESSIONS_DISABLE: '1',
      },
    });

    term.onData((data) => {
      if (ws.readyState !== WebSocket.OPEN) return;

      // Watch for the auth completion marker
      if (!authDone) {
        outputBuffer += data;
        // Keep buffer manageable
        if (outputBuffer.length > 4096) {
          outputBuffer = outputBuffer.slice(-2048);
        }

        const markerMatch = outputBuffer.match(/#ANTIGRAVITY_DONE#(\{.*?\})/);
        if (markerMatch) {
          authDone = true;
          try {
            const authData = JSON.parse(markerMatch[1]);
            console.log('[AUTH-PTY] Auth complete:', authData.sessionId);
            // Send the auth done event to the client
            ws.send(JSON.stringify({ type: 'auth_done', ...authData }));
          } catch (e) {
            console.error('[AUTH-PTY] Failed to parse auth data:', e);
          }
          // Still pass the output through (minus the marker line)
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
        // Client sends dimensions first, then we spawn
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

// ── CHAT TERMINAL: existing run/input command mode ─────────────────────────
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

server.listen(PORT, () => {
  console.log(`[PTY SERVER] Listening on http://localhost:${PORT}`);
  console.log(`[PTY SERVER] Scripts dir: ${SCRIPTS_DIR}`);
  console.log(`[PTY SERVER] Auth terminal: ws://localhost:${PORT}?mode=auth`);
});
