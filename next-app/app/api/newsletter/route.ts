import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Subscriber } from '@/lib/models/Subscriber';
import { sendNotification } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`newsletter:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many attempts' }, { status: 429 });

  try {
    const { email, source } = schema.parse(await req.json());
    await connectDB();
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        existing.unsubscribedAt = undefined;
        await existing.save();
      }
      return NextResponse.json({ ok: true, already: true });
    }
    await Subscriber.create({ email: email.toLowerCase(), source: source || 'footer' });
    sendNotification(`New newsletter signup — ${email}`, `<p>${email} subscribed via ${source || 'footer'}</p>`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request) {
  const limit = rateLimit(`newsletter-unsub:${clientIp(req)}`, 10, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many attempts' }, { status: 429 });

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    if (!email) return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
    await connectDB();
    await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { active: false, unsubscribedAt: new Date() } }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
