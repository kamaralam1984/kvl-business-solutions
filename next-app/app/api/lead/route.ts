import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { sendNotification, leadEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { fireTrigger } from '@/lib/workflows/runner';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  service: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`lead:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many submissions, try again later' }, { status: 429 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();
    const lead = await Lead.create(data);
    // AI scoring — fire & forget (non-blocking)
    import('@/lib/ai/lead-scorer').then(({ scoreLeadAsync }) =>
      scoreLeadAsync(lead._id.toString(), data).catch(() => {})
    );
    sendNotification(`New Lead — ${data.name}`, leadEmail(data));
    fireTrigger('new_lead', {
      name: data.name, email: data.email, phone: data.phone,
      service: data.service, message: data.message, source: data.source,
      leadId: lead._id.toString(),
    });
    return NextResponse.json({ ok: true, id: lead._id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
