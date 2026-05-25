import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { initiateCall } from '@/lib/vapi';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';

const schema = z.object({
  name: z.string().min(1).default('Customer'),
  phone: z.string().min(7),
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
        source: 'call-back-widget',
        message: 'Customer requested immediate callback via website widget',
      });
    }

    const { callId } = await initiateCall({
      name: body.name,
      phone: body.phone,
      leadId: lead._id.toString(),
    });

    await Lead.findByIdAndUpdate(lead._id, { callStatus: 'calling', callId, calledAt: new Date() });

    return NextResponse.json({ ok: true, callId });
  } catch (e: any) {
    console.error('[call-back]', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
