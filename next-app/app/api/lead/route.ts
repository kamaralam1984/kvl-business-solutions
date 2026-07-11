import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { Referral } from '@/lib/models/Referral';
import { sendNotification, leadEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { fireTrigger } from '@/lib/workflows/runner';
import { sendLeadWhatsApp, notifyAdminWhatsApp } from '@/lib/whatsapp';
import { computeLeadTier } from '@/lib/lead-tier';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  service: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  companyName: z.string().optional(),
  country: z.string().optional(),
  businessType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`lead:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many submissions, try again later' }, { status: 429 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();

    // Referral attribution (task 14) — only attribute to a code that matches
    // a real Referral document, captured earlier as a cookie by middleware.ts
    // from a ?ref=<code> landing link.
    const refCookie = cookies().get('kvl_ref')?.value;
    let referralCode: string | undefined;
    if (refCookie) {
      const referral = await Referral.findOne({ code: refCookie }).select('_id').lean();
      if (referral) referralCode = refCookie;
    }

    const lead = await Lead.create({
      ...data,
      leadTier: computeLeadTier(data),
      followUpStage: 1,  // WhatsApp sent on creation, next = call at 1hr
      followUpNextAt: new Date(Date.now() + 60 * 60_000), // 1 hour
      ...(referralCode ? { referralCode } : {}),
    });
    if (referralCode) {
      Referral.updateOne({ code: referralCode }, { $inc: { signupsCount: 1 } }).catch(() => {});
    }
    // AI scoring — fire & forget (non-blocking)
    import('@/lib/ai/lead-scorer').then(({ scoreLeadAsync }) =>
      scoreLeadAsync(lead._id.toString(), data).catch(() => {})
    );
    sendNotification(`New Lead — ${data.name}`, leadEmail(data));
    // WhatsApp auto-message — fire & forget
    sendLeadWhatsApp({ name: data.name, phone: data.phone, service: data.service }).catch(() => {});
    notifyAdminWhatsApp({ name: data.name, phone: data.phone, email: data.email, service: data.service, source: data.source }).catch(() => {});
    fireTrigger('new_lead', {
      name: data.name, email: data.email, phone: data.phone,
      service: data.service, message: data.message, source: data.source,
      leadId: lead._id.toString(),
    });
    return NextResponse.json({ ok: true, id: lead._id });
  } catch (e) {
    return apiError(e);
  }
}
