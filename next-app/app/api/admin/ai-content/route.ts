import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/admin-guard';
import { chatRouted } from '@/lib/ai/router';

const PROMPTS: Record<string, (topic: string, platform?: string) => string> = {
  blog: (topic) => `Write a helpful SEO blog post in Hindi+English mix (Hinglish) for KVL Business Solutions website.
Topic: "${topic}"
Format: Include H2 headings, short paragraphs, bullet points where needed.
Length: 500-700 words. Include a CTA at the end to book a free demo.
Target: Indian business owners (SMEs, manufacturers, retailers, schools).
Return full blog post with title.`,

  social_facebook: (topic) => `Write a Facebook post in Hindi+English mix for KVL Business Solutions.
Topic: "${topic}"
Style: Conversational, warm, engaging. Use emojis. 3-4 short paragraphs.
End with: website link kvlbusinesssolutions.com and contact +91 99420 00413
Include 5-7 relevant hashtags at the end.`,

  social_instagram: (topic) => `Write an Instagram caption in Hindi+English mix for KVL Business Solutions.
Topic: "${topic}"
Style: Short, punchy, inspiring. Use emojis heavily. Max 150 words.
Include 15-20 relevant hashtags. End with CTA.`,

  social_whatsapp: (topic) => `Write a WhatsApp broadcast message in Hindi+English mix for KVL Business Solutions.
Topic: "${topic}"
Style: Friendly, personal, like a message from a friend. Short (100-150 words). No hashtags.
Include offer or tip. End with contact: +91 99420 00413`,

  meta: (topic) => `Generate SEO meta tags for a page about "${topic}" for KVL Business Solutions (Indian enterprise software company).
Return ONLY this JSON format:
{"title":"...(max 60 chars)","description":"...(max 160 chars)","keywords":"...(comma separated, 8-10 keywords)"}`,

  product: (topic) => `Write a product description for "${topic}" software by KVL Business Solutions.
Style: Professional yet warm. Hinglish OK. 3-4 paragraphs covering: what it does, key features (bullet list), who it's for, pricing hint.
Length: 250-350 words. Include benefits, not just features.`,
};

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;

  try {
    const { type, topic, platform } = await req.json();
    if (!type || !topic) return NextResponse.json({ ok: false, error: 'type and topic required' }, { status: 400 });

    const key = type === 'social' ? `social_${platform || 'facebook'}` : type;
    const promptFn = PROMPTS[key];
    if (!promptFn) return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });

    const result = await chatRouted({
      messages: [{ role: 'user', content: promptFn(topic, platform) }],
      system: 'You are a top Indian digital marketing expert and copywriter. Write engaging, SEO-friendly content for Indian B2B audiences.',
      maxTokens: 1000,
      temperature: 0.85,
    });

    return NextResponse.json({ ok: true, content: result.reply, provider: result.provider });
  } catch (e) {
    return apiError(e);
  }
}
