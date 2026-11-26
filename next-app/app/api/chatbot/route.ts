import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { chatRouted, ChatMessage } from '@/lib/ai/router';
import { getSiteSettings } from '@/lib/models/SiteSettings';

async function buildSystemPrompt(): Promise<string> {
  const s = await getSiteSettings().catch(() => null);
  const phone = s?.phone || '+91 99420 00413';
  const whatsapp = (s?.whatsapp || '919942000413').replace(/\D/g, '');
  const email = s?.salesEmail || 'sales@kvlbusinesssolutions.com';

  return `You are "Khushi", the AI assistant for KVL Business Solutions — an Indian enterprise tech company, founded in 2015 by Kamar Alam, who owns and runs the company today.
If someone asks who owns the company/website, who the founder or CEO is, or similar, answer with: Kamar Alam is the founder and owner of KVL Business Solutions. Never say you don't know this, and never invent a different name.

TONE: Talk like a warm, caring human, not a corporate script. Be soft, friendly and genuinely encouraging — the way a helpful friend would talk, not a formal support agent. Use simple, natural language, show real interest in what the person needs, and keep things light and reassuring even when answering a technical question.

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

IMPORTANT: If a customer seems seriously interested (asking about price, demo, or purchase), naturally ask for their name and phone number so our team can assist them better. Say something like: "May I have your name and mobile number so our team can assist you personally?"

Keep replies concise (2-4 sentences), warm and helpful.

MULTILINGUAL: Detect the language the user writes in and always reply in that same language. Supported languages include (but are not limited to): Hindi, Urdu, Bengali, Tamil, Telugu, Punjabi, Chinese (Mandarin), Japanese, Korean, Arabic, Persian/Farsi, Turkish, English, French, Spanish, German, Italian, Portuguese, Russian, Polish, Dutch, Greek, Swahili, Hebrew, Indonesian, Malay, Vietnamese, and any other language the user uses. Never switch languages unless the user does first.`;
}

// Check if conversation has enough turns to attempt lead extraction
function shouldAttemptExtraction(messages: ChatMessage[]): boolean {
  const userMsgs = messages.filter(m => m.role === 'user');
  return userMsgs.length >= 3;
}

// Simple regex check before calling AI extractor
function hasContactSignals(messages: ChatMessage[]): boolean {
  const text = messages.map(m => m.content).join(' ').toLowerCase();
  const hasPhone = /[6-9]\d{9}|\d{10}/.test(text.replace(/\s/g, ''));
  const hasIntent = /buy|purchase|price|demo|interested|kharid|lena|chahiye|contact|call me|whatsapp me/.test(text);
  return hasPhone && hasIntent;
}

export async function POST(req: Request) {
  const limit = rateLimit(`chat:${clientIp(req)}`, 30, 60_000);
  if (!limit.allowed) return NextResponse.json({ reply: 'Slow down a bit — too many messages. Try again in a minute.' });

  try {
    const { history, sessionId } = await req.json();
    const messages: ChatMessage[] = (history || [])
      .filter((m: any) => m.content?.trim())
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    if (messages.length === 0) messages.push({ role: 'user', content: 'Hi' });

    const lastMsg = messages[messages.length - 1].content.trim().toLowerCase();
    const cacheKey = messages.length === 1 ? `chat-greeting:${lastMsg.slice(0, 80)}` : undefined;

    const SYSTEM = await buildSystemPrompt();
    const result = await chatRouted({ messages, system: SYSTEM, maxTokens: 400, temperature: 0.7, cacheKey });

    // Auto lead capture — only if conversation has contact signals
    let leadCaptured = false;
    let leadScore = 0;
    let leadIntent = '';

    if (shouldAttemptExtraction(messages) && hasContactSignals(messages)) {
      try {
        const { extractLeadFromChat, scoreLeadAsync } = await import('@/lib/ai/lead-scorer');
        const extracted = await extractLeadFromChat(messages);
        if (extracted) {
          const { connectDB } = await import('@/lib/mongodb');
          const { Lead } = await import('@/lib/models/Lead');
          await connectDB();

          // Avoid duplicate leads from same phone in last 24h
          const existing = await Lead.findOne({
            phone: { $regex: extracted.phone.replace(/\D/g, '').slice(-10) },
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          });

          if (!existing) {
            const chatSummary = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
            const lead = await Lead.create({
              name: extracted.name,
              email: extracted.email || `chat_${Date.now()}@kvl.auto`,
              phone: extracted.phone,
              service: extracted.service || '',
              source: 'chatbot',
              message: `Auto-captured from chat. Service interest: ${extracted.service || 'not specified'}`,
              chatMessages: chatSummary,
            });

            // Score in background
            scoreLeadAsync(lead._id.toString(), {
              name: extracted.name,
              email: extracted.email || '',
              phone: extracted.phone,
              service: extracted.service,
              chatMessages: chatSummary,
            }).catch(() => {});

            leadCaptured = true;
            console.log(`[chatbot] Auto-lead captured: ${extracted.name} (${extracted.phone})`);
          }
        }
      } catch (e) {
        console.error('[chatbot] Lead capture error:', e);
      }
    }

    // Persist the full conversation for quality review in Admin → Chatbot Logs.
    // Fire-and-forget — a logging failure must never break the chat reply.
    if (sessionId) {
      (async () => {
        const { connectDB } = await import('@/lib/mongodb');
        const { ChatLog } = await import('@/lib/models/ChatLog');
        await connectDB();
        await ChatLog.findOneAndUpdate(
          { sessionId },
          {
            $set: {
              messages: [...messages, { role: 'assistant', content: result.reply }],
              lastMessageAt: new Date(),
            },
            $max: { leadCaptured },
          },
          { upsert: true }
        );
      })().catch(e => console.error('[chatbot] log persist error:', e));
    }

    return NextResponse.json({
      reply: result.reply,
      leadCaptured,
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
