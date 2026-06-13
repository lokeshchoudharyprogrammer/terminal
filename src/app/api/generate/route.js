import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, model } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        text: `\n  ⚠️ **GEMINI_API_KEY is not set in the server environment.**\n\n  To get real AI answers, please add your \`GEMINI_API_KEY\` environment variable to Vercel (and Render if needed).\n`
      });
    }

    // Map user models to official Gemini model names
    let geminiModel = 'gemini-1.5-flash';
    if (model && model.toLowerCase().includes('pro')) {
      geminiModel = 'gemini-1.5-pro';
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json({
        text: `\n  🔴 **Gemini API Error:** ${response.statusText} (${response.status})\n  ${JSON.stringify(errData)}\n`
      });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text returned.';

    return NextResponse.json({ text: reply });
  } catch (err) {
    return NextResponse.json({ text: `\n  🔴 **Internal Error:** ${err.message}\n` }, { status: 500 });
  }
}
