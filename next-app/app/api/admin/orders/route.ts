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
    const all = await Order.find({}).lean();
    const stats = {
      total: all.length,
      paid: all.filter((o: any) => o.status === 'paid').length,
      pending: all.filter((o: any) => o.status === 'created').length,
      failed: all.filter((o: any) => o.status === 'failed').length,
      refunded: all.filter((o: any) => o.status === 'refunded').length,
      revenue: all.filter((o: any) => o.status === 'paid').reduce((s: number, o: any) => s + (o.amount || 0), 0),
      todayRevenue: all.filter((o: any) => o.status === 'paid' && new Date(o.createdAt) > new Date(Date.now() - 86400000)).reduce((s: number, o: any) => s + (o.amount || 0), 0),
    };
    return NextResponse.json({ ok: true, orders, stats });
  } catch (e) {
    return apiError(e);
  }
}
