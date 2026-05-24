import { NextResponse } from 'next/server';
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
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
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
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
