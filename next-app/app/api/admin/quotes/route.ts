import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Quote } from '@/lib/models/Quote';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const status = url.searchParams.get('status') || '';
    const filter: any = {};
    if (q) filter.$or = [{ 'contact.name': { $regex: q, $options: 'i' } }, { 'contact.email': { $regex: q, $options: 'i' } }];
    if (status) filter.status = status;
    await connectDB();
    const quotes = await Quote.find(filter).sort({ createdAt: -1 }).limit(300).lean();

    // Computed via an aggregation instead of `Quote.find({}).lean()` +
    // in-memory filtering — same reasoning as the orders route: this ran on
    // every admin page load and scales linearly with quote volume for no
    // reason, when MongoDB can group/sum this server-side in one query.
    const [agg] = await Quote.aggregate([
      {
        $facet: {
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          totalValue: [{ $group: { _id: null, sum: { $sum: { $divide: [{ $add: [{ $ifNull: ['$estimateLow', 0] }, { $ifNull: ['$estimateHigh', 0] }] }, 2] } } } }],
        },
      },
    ]);
    const byStatus: Record<string, number> = {};
    for (const s of agg.byStatus) byStatus[s._id] = s.count;
    const stats = {
      total: agg.byStatus.reduce((s: number, x: any) => s + x.count, 0),
      submitted: byStatus.submitted || 0,
      followUp: byStatus['follow-up'] || 0,
      closed: byStatus.closed || 0,
      totalValue: agg.totalValue[0]?.sum || 0,
    };
    return NextResponse.json({ ok: true, quotes, stats });
  } catch (e) {
    return apiError(e);
  }
}
