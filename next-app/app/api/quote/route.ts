import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Quote } from '@/lib/models/Quote';
import { sendNotification, quoteEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { linkVisitorToLead } from '@/lib/vip/link';
import { sendLeadCapiEvent, capiRequestContext } from '@/lib/metaCapi';

const schema = z.object({
  type: z.string(),
  scope: z.string(),
  timeline: z.string(),
  estimateLow: z.number(),
  estimateHigh: z.number(),
  contact: z.object({ name: z.string(), email: z.string().email(), phone: z.string() }),
});

export async function POST(req: Request) {
  const limit = rateLimit(`quote:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const q = await Quote.create(data);
    sendNotification(`New Quote — ${data.contact.email}`, quoteEmail(data));
    linkVisitorToLead({ name: data.contact.name, email: data.contact.email, phone: data.contact.phone }).catch(() => {});
    const ctx = capiRequestContext(req, clientIp(req));
    sendLeadCapiEvent({ eventId: q._id.toString(), email: data.contact.email, phone: data.contact.phone, ...ctx })
      .catch(e => console.error('[quote] Meta CAPI failed:', e?.message || e));
    return NextResponse.json({ ok: true, id: q._id });
  } catch (e) {
    return apiError(e);
  }
}
