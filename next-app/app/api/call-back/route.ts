import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { initiateCall } from '@/lib/vapi';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { sendNotification, callBackEmail } from '@/lib/email';
import { sendCustomWhatsApp } from '@/lib/whatsapp';
import { fireTrigger } from '@/lib/workflows/runner';
import { sendLeadCapiEvent, capiRequestContext } from '@/lib/metaCapi';
import { linkVisitorToLead } from '@/lib/vip/link';

const schema = z.object({
  name: z.string().min(1).default('Customer'),
  phone: z.string().min(7),
  // Lets callers (e.g. the website-offer ad-funnel pages' own callback
  // mini-form) tag the Lead with where the request actually came from,
  // instead of every callback landing in Admin → Leads as generic
  // "call-back-widget" regardless of source page.
  source: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`callback:${clientIp(req)}`, 3, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  try {
    const body = schema.parse(await req.json());
    const phone = body.phone.replace(/\D/g, '');
    if (phone.length < 10) return NextResponse.json({ ok: false, error: 'Invalid phone number' }, { status: 400 });

    await connectDB();

    // Create or find lead
    let lead = await Lead.findOne({ phone: { $regex: phone.slice(-10) }, createdAt: { $gte: new Date(Date.now() - 24 * 3600_000) } });
    if (!lead) {
      lead = await Lead.create({
        name: body.name,
        email: `callback_${Date.now()}@kvl.auto`,
        phone: body.phone,
        source: body.source || 'call-back-widget',
        message: body.message || 'Customer requested immediate callback via website widget',
      });
      const ctx = capiRequestContext(req, clientIp(req));
      sendLeadCapiEvent({ eventId: lead._id.toString(), phone: body.phone, ...ctx })
        .catch(e => console.error('[call-back] Meta CAPI failed:', e?.message || e));
      // AI scoring — fire & forget. Call-back requests are high-intent (the
      // visitor explicitly asked to be called right now), but previously only
      // the main lead form triggered scoring, leaving these permanently
      // unscored ("?") in Admin → Leads.
      import('@/lib/ai/lead-scorer').then(({ scoreLeadAsync }) =>
        scoreLeadAsync(lead._id.toString(), {
          name: body.name,
          email: lead.email,
          phone: body.phone,
          message: 'Customer requested an immediate callback via the website widget.',
        }).catch(() => {})
      );
    }

    // Admin alerts fire immediately — independent of whether the AI voice call below
    // succeeds, so a missing/misconfigured Vapi key never silently loses a lead.
    sendNotification(`📞 Call Back Requested — ${body.name}`, callBackEmail({ name: body.name, phone: body.phone }));
    if (process.env.ADMIN_WHATSAPP_PHONE) {
      sendCustomWhatsApp({
        phone: process.env.ADMIN_WHATSAPP_PHONE,
        message: `🔔 *Call Me Back Request!*\n\n👤 Name: ${body.name}\n📞 Phone: ${body.phone}\n\n_Customer was promised a call back within 4 hours — call them soon._`,
      }).catch(() => {});
    }
    fireTrigger('call_back_requested', { name: body.name, phone: body.phone, leadId: lead._id.toString() });
    linkVisitorToLead({ leadId: lead._id.toString(), name: body.name, phone: body.phone }).catch(() => {});

    // AI voice call — best-effort. A missing/failing Vapi key must not block the
    // lead capture or admin alerts above, which have already happened by this point.
    let callId: string | null = null;
    try {
      const result = await initiateCall({ name: body.name, phone: body.phone, leadId: lead._id.toString() });
      callId = result.callId;
      await Lead.findByIdAndUpdate(lead._id, { callStatus: 'calling', callId, calledAt: new Date() });
    } catch (e: any) {
      console.error('[call-back] AI call failed:', e.message);
      await Lead.findByIdAndUpdate(lead._id, { callStatus: 'failed' });
    }

    return NextResponse.json({ ok: true, callId, callInitiated: Boolean(callId), leadId: lead._id.toString() });
  } catch (e) {
    return apiError(e);
  }
}
