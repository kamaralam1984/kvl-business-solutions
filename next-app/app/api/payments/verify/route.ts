import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { verifySignature } from '@/lib/razorpay';
import { markOrderPaid } from '@/lib/payments/mark-paid';
import { sendPurchaseCapiEvent, capiRequestContext } from '@/lib/metaCapi';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const limit = rateLimit(`payment-verify:${clientIp(req)}`, 10, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
    }
    await connectDB();

    // markOrderPaid is idempotent — safe even if this fires twice (retry,
    // or the payment.captured webhook wins the race first) and never
    // re-sends emails/regenerates the license key on a repeat call.
    const { order, wasFirst } = await markOrderPaid(razorpay_order_id, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });
    if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });

    if (wasFirst) {
      const ctx = capiRequestContext(req, clientIp(req));
      sendPurchaseCapiEvent({
        eventId: order.orderId,
        email: order.email,
        phone: order.billing?.phone,
        value: order.amount,
        currency: order.currency,
        ...ctx,
      }).catch(e => console.error('[payments/verify] Meta CAPI failed:', e?.message || e));
    }

    return NextResponse.json({ ok: true, orderId: order.orderId, licenseKey: order.licenseKey });
  } catch (e) {
    return apiError(e);
  }
}
