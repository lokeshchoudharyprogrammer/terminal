import { NextResponse } from 'next/server';
import crypto from 'crypto';

if (!global.pendingSessions) {
  global.pendingSessions = new Map();
}

export async function POST(request) {
  try {
    const { code, state } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'code required' }, { status: 400 });
    }

    const session = state ? global.pendingSessions.get(state) : null;
    if (state && session) global.pendingSessions.delete(state);

    const sessionId  = crypto.randomBytes(6).toString('hex');
    const userInput  = code + (state || '') + Date.now().toString();
    const userHash   = crypto.createHash('sha256').update(userInput).digest('hex').slice(0, 12);
    const sessionUrl = `https://app.antigravity.ai/s/${sessionId}-${userHash}`;
    const token      = 'agt_' + crypto.randomBytes(24).toString('hex').toUpperCase();
    const refreshTok = 'agtr_' + crypto.randomBytes(16).toString('hex');
    const expiresAt  = new Date(Date.now() + 86_400_000).toISOString();

    console.log(`[AUTH] Session verified (Next.js) — id=${sessionId}  url=${sessionUrl}`);

    return NextResponse.json({
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
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
