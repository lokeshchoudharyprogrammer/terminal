export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return new Response(`<h2>Auth error: ${error}</h2><p>You can close this tab.</p>`, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Antigravity Auth</title>
    <style>body{background:#06070a;color:#e4e4e7;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;flex-direction:column;gap:16px;}
    .code{background:#0d0f17;border:1px solid rgba(99,102,241,.4);padding:16px 24px;border-radius:10px;font-size:14px;color:#a5b4fc;word-break:break-all;}
    h2{color:#34d399;}</style></head>
    <body>
      <h2>✅ Authorization successful</h2>
      <p id="status-text" style="color:#71717a">Transferring code automatically to your terminal...</p>
      <div class="code" id="code">${code || 'NO_CODE_RETURNED'}</div>
      <button onclick="navigator.clipboard.writeText('${code}').then(()=>this.textContent='Copied!')"
        style="background:#6366f1;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-family:monospace;font-weight:700">
        Copy Code
      </button>
      <p style="color:#52525b;font-size:11px">You can close this tab and return to your terminal.</p>

      <script>
        try {
          // 1. Same-origin Broadcast
          const channel = new BroadcastChannel('antigravity_auth');
          channel.postMessage({ type: 'code', code: '${code}' });
        } catch (e) {}

        try {
          // 2. Cross-origin Popup Message
          if (window.opener) {
            window.opener.postMessage({ type: 'antigravity_code', code: '${code}' }, '*');
          }
        } catch (e) {}

        setTimeout(() => {
          window.close();
        }, 1200);
      </script>
    </body></html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
