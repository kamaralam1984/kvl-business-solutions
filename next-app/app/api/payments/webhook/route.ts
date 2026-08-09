import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { sendNotification, orderEmail } from '@/lib/email';
import { markOrderPaid } from '@/lib/payments/mark-paid';

// Razorpay sends payment events here as a backup to client-side verify.
// Configure: Razorpay Dashboard → Settings → Webhooks → POST {SITE}/api/payments/webhook
// Events: payment.captured, payment.failed, refund.processed
export async function POST(req: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return NextResponse.json({ ok: false, error: 'Webhook secret not configured' }, { status: 500 });

    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (expected !== signature) return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });

    const evt = JSON.parse(body);
    const event: string = evt.event;
    const payment = evt.payload?.payment?.entity;
    const refund = evt.payload?.refund?.entity;
    const rzpOrderId: string | undefined = payment?.order_id || refund?.payment?.entity?.order_id;
    if (!rzpOrderId) return NextResponse.json({ ok: true, ignored: true });

    await connectDB();

    if (event === 'payment.captured') {
      // Shared with /api/payments/verify — atomic, idempotent, only the
      // first of the two paths to arrive actually sends emails/generates
      // the license key.
      await markOrderPaid(rzpOrderId, { razorpayPaymentId: payment.id });
    } else if (event === 'payment.failed') {
      // Only ever flips a still-open order — never clobbers one that verify
      // (or an earlier payment.captured webhook) already marked paid, which
      // a delayed/retried payment.failed webhook for an earlier attempt on
      // the same order could otherwise do.
      await Order.updateOne(
        { razorpayOrderId: rzpOrderId, status: 'created' },
        {
          $set: {
            status: 'failed',
            failureReason: payment.error_description || payment.error_reason || 'Payment failed',
            failureCode: payment.error_code,
          },
        }
      );
    } else if (event === 'refund.processed') {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: rzpOrderId, status: { $ne: 'refunded' } },
        { $set: { status: 'refunded', refundedAt: new Date() } },
        { new: true }
      );
      if (order) sendNotification(`Refund processed — ${order.orderId}`, orderEmail(order), order.email);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
