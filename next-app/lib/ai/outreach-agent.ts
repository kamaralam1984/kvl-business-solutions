import { chatRouted } from './router';

// Appended to every auto-sent outreach email — not AI-generated, always
// present verbatim. This is unsolicited cold email; a physical address and a
// one-line opt-out are the baseline compliance expectation (CAN-SPAM style,
// and good practice under India's IT rules too) and also give a genuine
// human reviewer of this feature an easy way to see the real sender.
export const OUTREACH_FOOTER = `
<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0"/>
<p style="font-size:11px;color:#94a3b8">
  KVL Business Solutions · Patna, Bihar, India<br/>
  You're receiving this because we thought our work might be relevant to your company. Reply <b>STOP</b> to opt out — we won't contact you again.
</p>`;

export interface OutreachProspectLike {
  name: string;
  company?: string;
}

// Writes a short, personalized cold-outreach pitch email for one prospect.
// campaignBrief is the campaign's bodyTemplate — used as a style/service
// brief for the AI, not filled in verbatim (autoSend campaigns get a fresh
// AI-written email per prospect instead of a templated blanket send).
export async function draftOutreachEmail(prospect: OutreachProspectLike, campaignBrief: string): Promise<{ subject: string; body: string }> {
  const result = await chatRouted({
    messages: [{
      role: 'user',
      content: `Write a short, personalized cold-outreach email to a potential client.
Prospect name: ${prospect.name}
Prospect company: ${prospect.company || 'unknown — do not guess, keep it generic if missing'}
What we're offering (brief): ${campaignBrief}

We are KVL Business Solutions, an Indian enterprise software company. Our portfolio PDF is attached to this email — reference it naturally ("attached our portfolio").
Return ONLY a JSON object: {"subject":"...","body":"..."}
- subject: short, specific, no clickbait, no emoji, no ALL CAPS
- body: plain text (no HTML), 3 short paragraphs max, warm and specific to their likely business needs, one clear soft CTA (reply if interested), no spam language, no fake urgency`,
    }],
    system: 'You are a top B2B sales development rep. Write concise, genuine, non-spammy cold emails that get replies. Never overpromise or fabricate claims about the prospect\'s business.',
    maxTokens: 500,
    temperature: 0.7,
  });

  const jsonMatch = result.reply.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.subject && parsed.body) return { subject: parsed.subject, body: parsed.body };
    } catch { /* fall through to fallback below */ }
  }

  // AI unavailable/malformed — fall back to a plain, honest generic pitch
  // rather than failing the whole send.
  return {
    subject: `Quick question about ${prospect.company || 'your business'}'s software`,
    body: `Hi ${prospect.name},\n\nWe're KVL Business Solutions — we build custom business software (ERP, booking, billing, CRM) for companies in India. I've attached our portfolio in case it's useful.\n\nWorth a quick chat if you're evaluating anything in this space?\n\nBest,\nKVL Business Solutions`,
  };
}

export interface NegotiationResult {
  reply: string;
  ready: boolean;
  readySummary?: string;
  unsubscribe: boolean;
}

// Given the full conversation so far (including the prospect's latest
// reply), decides how to respond and whether this prospect looks ready to
// buy. Mirrors the JSON-output pattern used by lib/ai/lead-scorer.ts.
export async function draftNegotiationReply(
  conversation: { role: 'assistant' | 'prospect'; body: string }[],
  prospect: OutreachProspectLike
): Promise<NegotiationResult> {
  const transcript = conversation.map(m => `${m.role === 'assistant' ? 'KVL' : prospect.name}: ${m.body}`).join('\n\n');

  const result = await chatRouted({
    messages: [{ role: 'user', content: `Conversation so far with a cold-outreach prospect:\n\n${transcript}\n\nWrite the next reply from KVL and assess whether they're ready to move forward (explicitly asking about pricing, contract, next steps, a call/meeting, or a clear "yes"/"interested"). If they asked to stop/unsubscribe/remove, set unsubscribe true and ready false.` }],
    system: `You are a skilled, honest B2B sales closer for KVL Business Solutions (Indian enterprise software). Be genuinely helpful, answer objections directly, never pressure or use dark patterns, never invent pricing or facts not already in the conversation — if asked for exact pricing, offer a call instead. Return ONLY this JSON, no markdown:
{"reply":"plain text reply body, 2-3 short paragraphs max","ready":false,"readySummary":"one line, only if ready is true","unsubscribe":false}`,
    maxTokens: 600,
    temperature: 0.4,
  });

  const jsonMatch = result.reply.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        reply: parsed.reply || 'Thanks for your reply — someone from our team will follow up shortly.',
        ready: Boolean(parsed.ready),
        readySummary: parsed.readySummary,
        unsubscribe: Boolean(parsed.unsubscribe),
      };
    } catch { /* fall through */ }
  }

  return { reply: 'Thanks for getting back to us! Someone from our team will follow up shortly.', ready: false, unsubscribe: false };
}
