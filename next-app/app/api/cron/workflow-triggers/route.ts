import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { Order } from '@/lib/models/Order';
import { fireTrigger } from '@/lib/workflows/runner';
import { requireCronAuth } from '@/lib/cron-auth';

// Time-based workflow triggers — runs daily
export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;
  await connectDB();

  const now = new Date();
  const results: Record<string, number> = {};

  // lead_inactive_3d — leads created 3 days ago, status still 'new'
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  const inactiveLeads: any[] = await Lead.find({
    status: { $in: ['new', null, undefined] },
    createdAt: { $gte: fourDaysAgo, $lte: threeDaysAgo },
  }).lean();

  for (const l of inactiveLeads) {
    fireTrigger('lead_inactive_3d', {
      name: l.name, email: l.email, phone: l.phone,
      service: l.service, message: l.message, leadId: l._id.toString(),
      daysOld: 3,
    });
  }
  results.lead_inactive_3d = inactiveLeads.length;

  // cart_abandoned — orders created 24h ago, still 'created'
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const abandoned: any[] = await Order.find({
    status: 'created',
    createdAt: { $gte: twoDaysAgo, $lte: oneDayAgo },
  }).lean();

  for (const o of abandoned) {
    fireTrigger('cart_abandoned', {
      name: o.billing?.name || o.email,
      email: o.email,
      phone: o.billing?.phone || '',
      amount: o.amount,
      productName: o.productName,
      orderId: o.orderId,
      link: `/checkout?product=${o.productSlug}&host=${o.hosting}`,
    });
  }
  results.cart_abandoned = abandoned.length;

  return NextResponse.json({ ok: true, triggered: results, timestamp: now.toISOString() });
}
