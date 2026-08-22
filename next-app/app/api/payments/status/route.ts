import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// Fallback for the checkout page when /api/payments/verify can't be reached
// (network drop right after a successful charge) — lets the browser poll
// whether the payment.captured webhook already confirmed the order
// independently, instead of leaving the customer stuck on a scary error
// screen for a payment that actually went through. Keyed by Razorpay's own
// order id, which the browser only knows because create-order handed it back
// to that same session — same trust boundary /verify already relies on.
export async function GET(req: Request) {
  const limit = rateLimit(`payment-status:${clientIp(req)}`, 30, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  try {
    const razorpayOrderId = new URL(req.url).searchParams.get('razorpayOrderId');
    if (!razorpayOrderId) return NextResponse.json({ ok: false, error: 'Missing razorpayOrderId' }, { status: 400 });

    await connectDB();
    const order = await Order.findOne({ razorpayOrderId }).select('orderId status licenseKey').lean();
    if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });

    return NextResponse.json({
      ok: true,
      status: (order as any).status,
      orderId: (order as any).orderId,
      licenseKey: (order as any).status === 'paid' ? (order as any).licenseKey : undefined,
    });
  } catch (e) {
    return apiError(e);
  }
}
