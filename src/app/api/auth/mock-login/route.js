import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || '';

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

  // Generate a mock OAuth authorization code
  const mockCode = 'mock_code_' + crypto.randomBytes(16).toString('hex');

  // Automatically redirect to the callback page on our own live domain
  return NextResponse.redirect(`${origin}/api/auth/callback?code=${mockCode}&state=${state}`);
}
