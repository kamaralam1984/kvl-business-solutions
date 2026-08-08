import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { verifySignature } from '@/lib/razorpay';
import { generateLicenseKey } from '@/lib/license';
import { sendNotification, orderEmail } from '@/lib/email';
import { notify } from '@/lib/models/Notification';
import { fireTrigger } from '@/lib/workflows/runner';
import { sendPurchaseCapiEvent, capiRequestContext } from '@/lib/metaCapi';
import { clientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
    }
    await connectDB();
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.status = 'paid';
    order.licenseKey = generateLicenseKey();
    await order.save();

    // Send confirmation email to customer + sales
    sendNotification(`Your KVL License — ${order.productName}`, orderEmail(order), order.email);
    sendNotification(`💰 New Paid Order — ${order.productName}`, orderEmail(order));

    notify(order.email, {
      type: 'order',
      title: `Order paid · ${order.productName}`,
      message: `Your license key is ready. Click to view order details and download invoice.`,
      link: `/dashboard/orders/${order.orderId}`,
    });

    fireTrigger('order_paid', {
      name: order.billing?.name || order.email,
      email: order.email,
      phone: order.billing?.phone || '',
      amount: order.amount,
      productName: order.productName,
      orderId: order.orderId,
      licenseKey: order.licenseKey,
      link: `/dashboard/orders/${order.orderId}`,
    });

    const ctx = capiRequestContext(req, clientIp(req));
    sendPurchaseCapiEvent({
      eventId: order.orderId,
      email: order.email,
      phone: order.billing?.phone,
      value: order.amount,
      currency: order.currency,
      ...ctx,
    }).catch(e => console.error('[payments/verify] Meta CAPI failed:', e?.message || e));

    return NextResponse.json({ ok: true, orderId: order.orderId, licenseKey: order.licenseKey });
  } catch (e) {
    return apiError(e);
  }
}
