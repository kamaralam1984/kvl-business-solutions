import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Referral } from '@/lib/models/Referral';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// Called (fire-and-forget) from middleware.ts whenever a ?ref=<code> link is
// landed on, to record a real click against that referral code. Runs on the
// default Node.js runtime (unlike middleware's edge runtime) so it can use
// mongoose directly.
export async function POST(req: Request) {
  const limit = rateLimit(`referral-click:${clientIp(req)}`, 30, 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  try {
    const body = await req.json().catch(() => null);
    const code = typeof body?.code === 'string' ? body.code : '';
    if (!/^[A-Za-z0-9]{4,20}$/.test(code)) {
      return NextResponse.json({ ok: false, error: 'Invalid code' }, { status: 400 });
    }
    await connectDB();
    await Referral.updateOne({ code }, { $inc: { clicksCount: 1 } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('referral click tracking error', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
