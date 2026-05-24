import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const SYSTEM = `You are "KVL AI", the assistant for KVL Business Solutions — an Indian enterprise tech company.
You help customers with:
- Software products: ERP (₹49,999/yr), Billing (₹15,999), Inventory (₹19,999), GPS Tracking (₹2,999/vehicle), School ERP (₹29,999), HMS (₹59,999), CRM (₹24,999), Payroll (₹14,999), Attendance (₹11,999), AI Business (₹89,999), Construction (₹39,999), Workshop (₹17,999)
- Services: Custom software, websites, Android apps, GPS, civil work, mechanical, automation, CCTV, ERP, cloud, AI, digital marketing
- Industries: Construction, Mechanical, Manufacturing, Transport, Schools, Hospitals, Retail, Real Estate, Government
- Cloud + On-Premise hosting, lifetime support, free installation, 7-day trial.

Keep replies concise (2-4 sentences), warm and helpful. If user wants to buy or needs human help, suggest WhatsApp +91 90000 00000 or contact form. Reply in the user's language (English or Hindi).`;

export async function POST(req: Request) {
  const limit = rateLimit(`chat:${clientIp(req)}`, 30, 60_000);
  if (!limit.allowed) return NextResponse.json({ reply: 'Slow down a bit — too many messages. Try again in a minute.' });
  try {
    const { history } = await req.json();
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ reply: 'AI is offline. Please WhatsApp +91 90000 00000 for instant help.' });
    }
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const messages = (history || []).filter((m: any) => m.content?.trim()).map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }] as any,
      messages: messages.length ? messages : [{ role: 'user', content: 'Hi' }],
    });
    const reply = msg.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n');
    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error('chatbot error', e);
    return NextResponse.json({ reply: 'Sorry, I am having trouble. Please WhatsApp +91 90000 00000 for instant help.' });
  }
}
