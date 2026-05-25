import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { chatRouted, ChatMessage } from '@/lib/ai/router';
import { getSiteSettings } from '@/lib/models/SiteSettings';

// Build system prompt dynamically — pulls phone/WhatsApp from SiteSettings cache
// Admin can change contact info via /admin/site-settings without code changes
async function buildSystemPrompt(): Promise<string> {
  const s = await getSiteSettings().catch(() => null);
  const phone = s?.phone || '+91 99420 00413';
  const whatsapp = s?.whatsapp || '919942000413';
  const email = s?.salesEmail || 'sales@kvlsolutions.in';

  return `You are "KVL AI", the assistant for KVL Business Solutions — an Indian enterprise tech company.
You help customers with:
- Software products: ERP (₹49,999/yr), Billing (₹15,999), Inventory (₹19,999), GPS Tracking (₹2,999/vehicle), School ERP (₹29,999), HMS (₹59,999), CRM (₹24,999), Payroll (₹14,999), Attendance (₹11,999), AI Business (₹89,999), Construction (₹39,999), Workshop (₹17,999)
- Services: Custom software, websites, Android apps, GPS, civil work, mechanical, automation, CCTV, ERP, cloud, AI, digital marketing
- Industries: Construction, Mechanical, Manufacturing, Transport, Schools, Hospitals, Retail, Real Estate, Government
- Cloud + On-Premise hosting, lifetime support, free installation, 7-day trial.

Contact info (use these EXACTLY when sharing — do NOT invent other numbers):
- Phone: ${phone}
- WhatsApp: https://wa.me/${whatsapp}
- Email: ${email}
- Website: kvlbusinesssolutions.com

Keep replies concise (2-4 sentences), warm and helpful. If user wants to buy or needs human help, suggest WhatsApp or contact form. Reply in the user's language (English or Hindi).`;
}

export async function POST(req: Request) {
  const limit = rateLimit(`chat:${clientIp(req)}`, 30, 60_000);
  if (!limit.allowed) return NextResponse.json({ reply: 'Slow down a bit — too many messages. Try again in a minute.' });

  try {
    const { history } = await req.json();
    const messages: ChatMessage[] = (history || [])
      .filter((m: any) => m.content?.trim())
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    if (messages.length === 0) {
      messages.push({ role: 'user', content: 'Hi' });
    }

    const lastMsg = messages[messages.length - 1].content.trim().toLowerCase();
    const cacheKey = messages.length === 1 ? `chat-greeting:${lastMsg.slice(0, 80)}` : undefined;

    const SYSTEM = await buildSystemPrompt();

    const result = await chatRouted({
      messages,
      system: SYSTEM,
      maxTokens: 400,
      temperature: 0.7,
      cacheKey,
    });

    return NextResponse.json({
      reply: result.reply,
      _meta: {
        provider: result.provider,
        cached: result.cached,
        fallbacks: result.fallbackChain.length,
        cost: result.cost.toFixed(6),
      },
    });
  } catch (e: any) {
    console.error('chatbot error', e);
    return NextResponse.json({ reply: 'Sorry, I am having trouble. Please WhatsApp +91 99420 00413 for instant help.' });
  }
}
