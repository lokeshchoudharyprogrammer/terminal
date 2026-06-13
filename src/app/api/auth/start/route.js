import { NextResponse } from 'next/server';
import crypto from 'crypto';

if (!global.pendingSessions) {
  global.pendingSessions = new Map();
}

if (!global.pendingSessionsCleanupInterval) {
  global.pendingSessionsCleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [state, data] of global.pendingSessions) {
      if (now - data.createdAt > 10 * 60 * 1000) global.pendingSessions.delete(state);
    }
  }, 60_000);
}

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}
function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}
function generateState() {
  return crypto.randomBytes(16).toString('base64url');
}

export async function GET(request) {
  const verifier   = generateCodeVerifier();
  const challenge  = generateCodeChallenge(verifier);
  const state      = generateState();
  const nonce      = crypto.randomBytes(12).toString('base64url');

  global.pendingSessions.set(state, { verifier, challenge, nonce, createdAt: Date.now() });

  let origin = 'http://localhost:3000';
  const forwardedHost = request.headers.get('x-forwarded-host');
  if (forwardedHost) {
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    origin = `${forwardedProto}://${forwardedHost}`;
  } else {
    try {
      const urlObj = new URL(request.url);
      origin = urlObj.origin;
    } catch {}
  }

  const mockLoginUrl = `${origin}/api/auth/mock-login?state=${state}`;

  console.log(`[AUTH] Generated PKCE session (Next.js) — state=${state.slice(0,8)}...`);

  return NextResponse.json({
    url:       mockLoginUrl,
    state,
    challenge,
    nonce,
    expiresIn: 600,
  });
}
