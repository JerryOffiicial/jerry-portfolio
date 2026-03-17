import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    timestamp: new Date().toISOString()
  });
}
