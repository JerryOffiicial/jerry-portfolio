import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '@/lib/supabase';
import { DEFAULT_KNOWLEDGE_BASE } from '@/lib/constants';

interface HistoryMessage {
  text: string;
  sender: 'user' | 'ai';
}

const FALLBACK_KNOWLEDGE_BASE = DEFAULT_KNOWLEDGE_BASE;

let cachedKnowledgeBase: string | null = null;
let kbCacheTime: number = 0;
const KB_CACHE_TTL = 60 * 60 * 1000;

async function fetchKnowledgeBase(): Promise<string> {
  const now = Date.now();
  if (cachedKnowledgeBase && (now - kbCacheTime < KB_CACHE_TTL)) {
    return cachedKnowledgeBase;
  }

  try {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('content')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data?.content) {
      console.warn('Could not fetch knowledge base from DB, using fallback:', error?.message);
      cachedKnowledgeBase = FALLBACK_KNOWLEDGE_BASE;
    } else {
      cachedKnowledgeBase = data.content;
    }
  } catch (err) {
    console.warn('Error fetching knowledge base:', err);
    cachedKnowledgeBase = FALLBACK_KNOWLEDGE_BASE;
  }

  kbCacheTime = Date.now();
  return cachedKnowledgeBase as string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Processing chat message, length:', message.length);
    }

    const knowledgeBase = await fetchKnowledgeBase();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents = (history as HistoryMessage[])
      .filter((msg) => msg && msg.text && msg.sender)
      .slice(-5)
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
      config: {
        systemInstruction: knowledgeBase,
      }
    });

    const aiResponse = response.text;

    if (!aiResponse) {
      console.error('No text in AI response');
      return NextResponse.json(
        { error: "I couldn't come up with a response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: aiResponse.trim()
    });

  } catch (error) {
    console.error('Chat API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });

    if (error instanceof Error) {
      if (error.message.includes('API_KEY') || error.message.includes('authentication')) {
        return NextResponse.json(
          { error: "I'm having trouble connecting right now. Please try again later." },
          { status: 500 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: "I'm a little overwhelmed right now. Please try again in a moment." },
          { status: 500 }
        );
      }
      if (error.message.includes('safety') || error.message.includes('filter')) {
        return NextResponse.json(
          { error: "I couldn't process that one. Try rephrasing your question!" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong on my end. Please try again shortly." },
      { status: 500 }
    );
  }
}