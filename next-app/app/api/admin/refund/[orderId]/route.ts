import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { rzp } from '@/lib/razorpay';
import { requireAdmin } from '@/lib/admin-guard';
import { sendNotification, orderEmail } from '@/lib/email';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  reason: z.string().min(3).optional(),
  amount: z.number().int().positive().optional(), // partial refund (paise); default = full
});

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  if (!rzp) return NextResponse.json({ ok: false, error: 'Razorpay not configured' }, { status: 500 });

  try {
    const body = await req.json().catch(() => ({}));
    const { reason, amount } = schema.parse(body);

    await connectDB();
    const order = await Order.findOne({ orderId: params.orderId });
    if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
    if (order.status !== 'paid') return NextResponse.json({ ok: false, error: 'Only paid orders can be refunded' }, { status: 400 });
    if (!order.razorpayPaymentId) return NextResponse.json({ ok: false, error: 'No payment ID on order' }, { status: 400 });

    const refundAmountPaise = amount ?? order.amount * 100;
    const refund = await rzp.payments.refund(order.razorpayPaymentId, {
      amount: refundAmountPaise,
      notes: { orderId: order.orderId, reason: reason || 'Admin-initiated refund' },
    });

    order.status = 'refunded';
    order.refundedAt = new Date();
    order.refundReason = reason || 'Admin-initiated refund';
    await order.save();

    sendNotification(`Refund processed — ${order.orderId}`, orderEmail(order), order.email);
    sendNotification(`💸 Refund processed — ${order.orderId}`, orderEmail(order));

    logActivity({
      action: 'order.refund',
      actorEmail: g.session?.user?.email || undefined,
      actorRole: 'admin',
      target: 'Order',
      targetId: order.orderId,
      details: { amount: refundAmountPaise, reason: reason || 'Admin-initiated', refundId: (refund as any).id },
      req,
    });

    return NextResponse.json({ ok: true, refundId: (refund as any).id, amount: refundAmountPaise });
  } catch (e: any) {
    console.error('refund error', e);
    return NextResponse.json({ ok: false, error: e.error?.description || e.message }, { status: 500 });
  }
}
