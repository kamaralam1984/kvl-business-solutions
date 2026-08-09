import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { AnalyticsEvent } from '@/lib/models/AnalyticsEvent';
import { requireAdmin } from '@/lib/admin-guard';

// Real, first-party conversion/CTA reporting — built entirely from events
// this site's own visitors trigger (components/analytics/track.ts →
// /api/events), with zero dependency on the GA4 Data API or any ad platform.
export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();

    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [byName, byPath, dailyRaw] = await Promise.all([
      AnalyticsEvent.aggregate([
        { $match: { createdAt: { $gte: since30 } } },
        { $group: { _id: '$name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { createdAt: { $gte: since30 }, name: { $in: ['cta_click', 'lead_submit', 'proposal_request', 'booking_submit'] } } },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { createdAt: { $gte: since30 } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const dailyMap = new Map(dailyRaw.map((d: any) => [d._id, d.count]));
    const daily: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      daily.push({ date, count: dailyMap.get(date) || 0 });
    }

    return NextResponse.json({
      ok: true,
      byName: byName.map((r: any) => ({ name: r._id, count: r.count })),
      topLandingPages: byPath.map((r: any) => ({ path: r._id || '(unknown)', count: r.count })),
      daily,
    });
  } catch (e) {
    return apiError(e);
  }
}
