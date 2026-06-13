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

  const CLIENT_ID   = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com';
  const REDIRECT    = `${origin}/api/auth/callback`;
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

  console.log(`[AUTH] Generated PKCE session (Next.js) — state=${state.slice(0,8)}...`);

  return NextResponse.json({
    url:       oauthUrl.toString(),
    state,
    challenge,
    nonce,
    expiresIn: 600,
  });
}
