import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { VipSession } from '@/lib/models/VipSession';
import { Order } from '@/lib/models/Order';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// Real, never-fabricated numbers for the ad-landing pages' urgency widgets —
// live viewer count (sessions that entered on this exact path, active in
// the last 5 min) and recent real purchases (first name + city only, no
// email/phone/full name — this is public-facing). If there's genuinely
// nothing to show, the response says so honestly instead of the caller
// padding with a fake number.
export async function GET(req: Request) {
  const limit = rateLimit(`social-proof:${clientIp(req)}`, 30, 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path') || undefined;

  try {
    await connectDB();
    const since5min = new Date(Date.now() - 5 * 60 * 1000);
    const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const [liveCount, recentOrders] = await Promise.all([
      VipSession.countDocuments({
        lastActivityAt: { $gte: since5min },
        ...(path ? { landingPage: path } : {}),
      }),
      Order.find({ status: 'paid', createdAt: { $gte: since48h } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('billing.name billing.address.city productName createdAt')
        .lean(),
    ]);

    const recentPurchases = recentOrders
      .filter((o: any) => o.billing?.name)
      .map((o: any) => ({
        firstName: String(o.billing.name).trim().split(/\s+/)[0],
        city: o.billing?.address?.city || null,
        product: o.productName,
        minutesAgo: Math.max(1, Math.round((Date.now() - new Date(o.createdAt).getTime()) / 60_000)),
      }));

    return NextResponse.json({ ok: true, liveCount, recentPurchases });
  } catch (e) {
    return apiError(e);
  }
}
