'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Load xterm with no SSR — avoids the 49s compile on first visit
const XTerminal = dynamic(() => import('./XTerminal'), {
  ssr: false,
  loading: () => (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#6366f1',
            animation: `ag-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: '#52525b', fontFamily: 'monospace' }}>
        Initializing PTY terminal…
      </span>
    </div>
  ),
});

export default function LoginPage() {
  const router   = useRouter();
  const termRef  = useRef(null);
  const wsRef    = useRef(null);
  const [status, setStatus] = useState('connecting');

  // ── Check if already authed ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('antigravity_user')) router.push('/chat');
  }, []);

  const connectWS = useCallback((cols, rows) => {
    let wsUrl = process.env.NEXT_PUBLIC_PTY_SERVER_URL;
    if (wsUrl) {
      const separator = wsUrl.includes('?') ? '&' : '?';
      wsUrl = `${wsUrl}${separator}mode=auth`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}/api/pty?mode=auth`;
    }
    console.log('[PTY] Connecting to:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('ready');
      ws.send(JSON.stringify({ type: 'init', cols, rows }));
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'output') {
          termRef.current?.write(msg.data);
        } else if (msg.type === 'auth_done') {
          setStatus('done');
          saveSession(msg);
          setTimeout(() => router.push('/chat'), 800);
        } else if (msg.type === 'shell_exit') {
          termRef.current?.writeln('\r\n\x1b[38;2;248;113;113m  [Shell exited — refresh to reconnect]\x1b[0m');
        }
      } catch {}
    };

    ws.onerror = () => {
      setStatus('error');
      termRef.current?.writeln(
        '\r\n\x1b[38;2;248;113;113m  ✗ Cannot reach PTY server at localhost:3001.\x1b[0m\r\n' +
        '\x1b[38;2;113;113;122m  Make sure you ran: npm run dev\x1b[0m\r\n'
      );
    };

    return ws;
  }, [router]);

  // Called by XTerminal once it's mounted and knows its dimensions
  const handleReady = useCallback(({ cols, rows, resized }) => {
    if (resized) {
      // Just send a resize event
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'resize', cols, rows }));
      }
      return;
    }
    // First ready — connect WS and spawn shell
    connectWS(cols, rows);
  }, [connectWS]);

  // Forward all keystrokes to the real PTY
  const handleData = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'input', data }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { wsRef.current?.close(); } catch {}
    };
  }, []);

  const saveSession = ({ url: sessionUrl, sessionId, token }) => {
    localStorage.setItem('antigravity_user', JSON.stringify({
      name: 'Developer',
      email: 'developer@antigravity.ai',
      sessionId, sessionUrl, token,
      authenticatedAt: new Date().toISOString(),
    }));
    localStorage.setItem('antigravity_session_url', sessionUrl);
    localStorage.setItem('antigravity_selected_model', 'Gemini 3.5 Flash (High)');
    localStorage.setItem('antigravity_vfs', JSON.stringify({
      'README.md': `# Antigravity Workspace\nSession: ${sessionId}\nURL: ${sessionUrl}\n`,
      'src/index.js': '// Antigravity workspace\nconsole.log("Session active");\n',
    }));
  };

  // ── Status styles ────────────────────────────────────────────────────────
  const statusColor = {
    connecting: '#fbbf24',
    ready:      '#6366f1',
    auth:       '#22d3ee',
    done:       '#34d399',
    error:      '#f87171',
  }[status] || '#71717a';

  const statusLabel = {
    connecting: 'CONNECTING',
    ready:      'READY',
    auth:       'AUTHENTICATING',
    done:       'DONE',
    error:      'ERROR',
  }[status] || status.toUpperCase();

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: '#06070a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glows */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{
          position:'absolute', top:'8%', left:'3%',
          width:700, height:700, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
          filter:'blur(80px)',
        }}/>
        <div style={{
          position:'absolute', bottom:'5%', right:'3%',
          width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)',
          filter:'blur(60px)',
        }}/>
      </div>

      {/* Grid */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
        backgroundSize:'28px 28px',
      }}/>

      {/* Top badge */}
      <div style={{
        position:'absolute', top:20, left:'50%', transform:'translateX(-50%)',
        display:'flex', alignItems:'center', gap:8,
        padding:'5px 16px', borderRadius:999,
        border:'1px solid rgba(99,102,241,0.3)',
        background:'rgba(99,102,241,0.07)',
        backdropFilter:'blur(12px)', zIndex:20, whiteSpace:'nowrap',
      }}>
        <div style={{
          width:6, height:6, borderRadius:'50%',
          background: statusColor,
          boxShadow:`0 0 8px ${statusColor}`,
          animation: status !== 'done' && status !== 'error' ? 'ag-pulse 2s infinite' : 'none',
        }}/>
        <span style={{
          fontSize:10, fontWeight:700, color:'#a5b4fc',
          letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'monospace',
        }}>
          Antigravity · Auth Terminal · Real PTY · zsh
        </span>
        <span style={{
          fontSize:9, fontWeight:700, color: statusColor,
          letterSpacing:'0.08em', fontFamily:'monospace',
          background:`${statusColor}18`, padding:'1px 6px', borderRadius:4,
        }}>
          {statusLabel}
        </span>
      </div>

      {/* ── Terminal window ── */}
      <div style={{
        width:'96vw', maxWidth:1200,
        height:'82vh', minHeight:540,
        borderRadius:14,
        border:'1px solid rgba(99,102,241,0.2)',
        background:'rgba(6,7,10,0.97)',
        boxShadow:'0 0 0 1px rgba(99,102,241,0.08),0 40px 100px rgba(0,0,0,0.75),0 0 80px rgba(99,102,241,0.06)',
        display:'flex', flexDirection:'column',
        overflow:'hidden', position:'relative', zIndex:10,
      }}>
        {/* Title bar */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'11px 16px',
          background:'rgba(8,9,14,0.95)',
          borderBottom:'1px solid rgba(255,255,255,0.045)',
          flexShrink:0, userSelect:'none',
        }}>
          <div style={{ display:'flex', gap:7 }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background:'#ef4444', opacity:0.8 }}/>
            <div style={{ width:12, height:12, borderRadius:'50%', background:'#f59e0b', opacity:0.8 }}/>
            <div style={{ width:12, height:12, borderRadius:'50%', background:'#22c55e', opacity:0.8 }}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
              <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
            <span style={{
              fontSize:11, fontWeight:700, color:'#52525b',
              letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'monospace',
            }}>
              zsh — antigravity-auth — PTY
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{
              width:6, height:6, borderRadius:'50%',
              background: statusColor,
              boxShadow:`0 0 6px ${statusColor}aa`,
            }}/>
            <span style={{ fontSize:9, color:'#52525b', fontFamily:'monospace', fontWeight:700, letterSpacing:'0.08em' }}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* xterm.js — fills remaining height */}
        <XTerminal
          ref={termRef}
          onReady={handleReady}
          onData={handleData}
        />
      </div>

      {/* Bottom hint */}
      <div style={{
        marginTop:16, display:'flex', alignItems:'center', gap:14,
        fontSize:10.5, color:'#3f3f46', fontFamily:'monospace', zIndex:10,
      }}>
        <span style={{ color:'#1d4ed8' }}>UI → localhost:3000</span>
        <span style={{ color:'#27272a' }}>·</span>
        <span style={{ color:'#166534' }}>PTY API → localhost:3001</span>
        <span style={{ color:'#27272a' }}>·</span>
        <span>Ctrl+C interrupt</span>
        <span style={{ color:'#27272a' }}>·</span>
        <span>Ctrl+L clear</span>
        <span style={{ color:'#27272a' }}>·</span>
        <span style={{ color:'#4338ca' }}>node-pty · xterm.js · zsh</span>
      </div>

      <style>{`
        @keyframes ag-pulse {
          0%,100%{opacity:1} 50%{opacity:.35}
        }
        @keyframes ag-bounce {
          0%,80%,100%{transform:scale(0.6);opacity:.5}
          40%{transform:scale(1);opacity:1}
        }
        .xterm { height:100% !important; flex:1; }
        .xterm-viewport { border-radius:4px; overflow-y:auto !important; }
        .xterm-screen  { height:100% !important; }
      `}</style>
    </div>
  );
}
