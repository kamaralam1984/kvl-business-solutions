import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { VipVisitor } from '@/lib/models/VipVisitor';
import { VipSession } from '@/lib/models/VipSession';
import { VipPageView } from '@/lib/models/VipPageView';
import { VipLeadScore } from '@/lib/models/VipLeadScore';
import { requireAdmin } from '@/lib/admin-guard';

// Module 11 (Live Dashboard) + Module 7 (Page Intelligence) overview — every
// number here is a real aggregation over VIP's own collections. "Live" is
// polling-based (visitors active in the last 5 minutes), not a websocket/SSE
// stream — a deliberate Phase A simplification (see PHASE22-VIP-ARCHITECTURE.md).
export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();

  const now = new Date();
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const since5min = new Date(now.getTime() - 5 * 60 * 1000);

  const [
    liveVisitorCount, visitorsToday, visitorsLast7d, sessionsToday,
    topPagesRaw, topChannelsRaw, topCountriesRaw, recentKnownVisitors,
  ] = await Promise.all([
    VipSession.countDocuments({ lastActivityAt: { $gte: since5min } }),
    VipVisitor.countDocuments({ firstSeenAt: { $gte: since24h } }),
    VipVisitor.countDocuments({ firstSeenAt: { $gte: since7d } }),
    VipSession.countDocuments({ startedAt: { $gte: since24h } }),
    VipPageView.aggregate([
      { $match: { createdAt: { $gte: since7d } } },
      { $group: { _id: '$path', visitors: { $addToSet: '$vid' }, count: { $sum: 1 }, avgTime: { $avg: '$timeOnPageSeconds' }, avgScroll: { $avg: '$scrollDepthPct' } } },
      { $project: { path: '$_id', count: 1, uniqueVisitors: { $size: '$visitors' }, avgTimeSeconds: { $round: ['$avgTime', 0] }, avgScrollPct: { $round: ['$avgScroll', 0] } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]),
    VipSession.aggregate([
      { $match: { startedAt: { $gte: since7d } } },
      { $group: { _id: '$channel', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    VipSession.aggregate([
      { $match: { startedAt: { $gte: since7d }, 'geo.country': { $exists: true, $ne: null } } },
      { $group: { _id: '$geo.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    VipVisitor.find({ $or: [{ knownLeadId: { $ne: null } }, { knownDealId: { $ne: null } }] })
      .sort({ lastSeenAt: -1 }).limit(20).lean(),
  ]);

  const scores = await VipLeadScore.find({ vid: { $in: recentKnownVisitors.map((v: any) => v.vid) } }).lean();
  const scoreByVid = new Map(scores.map((s: any) => [s.vid, s]));

  return NextResponse.json({
    ok: true,
    liveVisitorCount,
    visitorsToday,
    visitorsLast7d,
    sessionsToday,
    topPages: topPagesRaw,
    topChannels: topChannelsRaw.map((c: any) => ({ channel: c._id || 'unknown', count: c.count })),
    topCountries: topCountriesRaw.map((c: any) => ({ country: c._id, count: c.count })),
    knownVisitors: recentKnownVisitors.map((v: any) => ({
      vid: v.vid, name: v.knownName, email: v.knownEmail,
      sessionCount: v.sessionCount, pageViewCount: v.pageViewCount,
      lastSeenAt: v.lastSeenAt, hasLead: !!v.knownLeadId, hasDeal: !!v.knownDealId,
      score: scoreByVid.get(v.vid)?.score ?? null, tier: scoreByVid.get(v.vid)?.tier ?? null,
    })),
  });
}
