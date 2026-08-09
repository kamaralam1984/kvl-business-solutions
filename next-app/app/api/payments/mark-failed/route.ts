import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// Razorpay's checkout modal fires `payment.failed` client-side the instant a
// payment is declined — this records that immediately, so a failed payment
// shows up in Admin > Orders even when the Razorpay webhook isn't configured
// (webhook is still the authoritative backup for anything the browser
// misses, e.g. the tab closing mid-failure).
const schema = z.object({
  razorpay_order_id: z.string().min(1),
  code: z.string().optional(),
  description: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`mark-failed:${clientIp(req)}`, 10, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  try {
    const data = schema.parse(await req.json());
    await connectDB();
    // Never clobber a payment that actually succeeded (verify/webhook may
    // race with this) or one already refunded — only a still-open order can
    // be marked failed from here.
    await Order.updateOne(
      { razorpayOrderId: data.razorpay_order_id, status: 'created' },
      { $set: { status: 'failed', failureReason: data.description || data.reason || 'Payment failed', failureCode: data.code } }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
