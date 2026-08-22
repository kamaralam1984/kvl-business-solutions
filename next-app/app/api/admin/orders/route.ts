import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const status = url.searchParams.get('status') || '';
    const filter: any = {};
    if (q) filter.$or = [{ orderId: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { productName: { $regex: q, $options: 'i' } }];
    if (status) filter.status = status;
    await connectDB();
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(300).lean();

    // Computed via an aggregation instead of `Order.find({}).lean()` +
    // in-memory filtering — that pulled every order document (and will only
    // grow) into Node memory on every single admin page load just to sum a
    // few counters that MongoDB can compute server-side, indexed, in one
    // round trip.
    const [agg] = await Order.aggregate([
      {
        $facet: {
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$amount' } } }],
          todayRevenue: [
            { $match: { status: 'paid', createdAt: { $gt: new Date(Date.now() - 86400000) } } },
            { $group: { _id: null, sum: { $sum: '$amount' } } },
          ],
        },
      },
    ]);
    const byStatus: Record<string, { count: number; revenue: number }> = {};
    for (const s of agg.byStatus) byStatus[s._id] = { count: s.count, revenue: s.revenue };
    const stats = {
      total: agg.byStatus.reduce((s: number, x: any) => s + x.count, 0),
      paid: byStatus.paid?.count || 0,
      pending: byStatus.created?.count || 0,
      failed: byStatus.failed?.count || 0,
      refunded: byStatus.refunded?.count || 0,
      revenue: byStatus.paid?.revenue || 0,
      todayRevenue: agg.todayRevenue[0]?.sum || 0,
    };
    return NextResponse.json({ ok: true, orders, stats });
  } catch (e) {
    return apiError(e);
  }
}
