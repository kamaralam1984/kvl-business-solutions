import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { sendNotification, projectDeliveredEmail } from '@/lib/email';
import { DELIVERY_STAGES } from '@/lib/delivery-stages';

const schema = z.object({
  deliveryStage: z.enum(DELIVERY_STAGES.map(s => s.key) as [string, ...string[]]).optional(),
  deliveryNotes: z.string().max(1000).optional(),
});

// Looked up by the human-facing orderId (e.g. "KVL-ORD-XXXXX"), matching
// every other order route (verify/webhook/dashboard links) rather than the
// Mongo _id.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const data = schema.parse(await req.json());
  await connectDB();

  const before = await Order.findOne({ orderId: params.id });
  if (!before) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });

  const justDelivered = data.deliveryStage === 'delivered' && before.deliveryStage !== 'delivered';
  const update: any = { ...data };
  if (justDelivered) update.deliveredAt = new Date();

  const order = await Order.findOneAndUpdate({ orderId: params.id }, { $set: update }, { new: true }).lean<any>();

  logActivity({
    action: 'order.delivery-update',
    actorEmail: g.session?.user?.email || undefined,
    actorRole: 'admin',
    target: 'Order',
    targetId: params.id,
    details: data,
    req,
  });

  if (justDelivered) {
    sendNotification(`Your project is delivered! — ${order.orderId}`, projectDeliveredEmail(order), order.email);
  }

  return NextResponse.json({ ok: true, order });
}
