import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { generateLicenseKey } from '@/lib/license';
import { sendNotification, orderEmail } from '@/lib/email';

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
    const order = await Order.findOne({ razorpayOrderId: rzpOrderId });
    if (!order) return NextResponse.json({ ok: true, message: 'Order not found' });

    if (event === 'payment.captured' && order.status !== 'paid') {
      order.razorpayPaymentId = payment.id;
      order.status = 'paid';
      if (!order.licenseKey) order.licenseKey = generateLicenseKey();
      await order.save();
      sendNotification(`Your KVL License — ${order.productName}`, orderEmail(order), order.email);
      sendNotification(`💰 New Paid Order — ${order.productName}`, orderEmail(order));
    } else if (event === 'payment.failed') {
      order.status = 'failed';
      await order.save();
    } else if (event === 'refund.processed') {
      order.status = 'refunded';
      order.refundedAt = new Date();
      await order.save();
      sendNotification(`Refund processed — ${order.orderId}`, orderEmail(order), order.email);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
