import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { VipVisitor } from '@/lib/models/VipVisitor';
import { VipSession } from '@/lib/models/VipSession';
import { requireAdmin } from '@/lib/admin-guard';

// "Landing Page Views" — a session's `landingPage` is the first page that
// session entered on (captured once, client-side, at session start — see
// lib/models/VipSession.ts), which is the real definition of a landing page
// hit (as opposed to any page view mid-session). Answers: which day, which
// page, which country/city, which channel, and — for visitors who later
// identified themselves via a Lead/Booking/Quote — their name/email/phone.
export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const days = Math.min(90, Math.max(1, Number(searchParams.get('days')) || 30));
  const pathFilter = searchParams.get('path') || undefined;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const match: Record<string, any> = { startedAt: { $gte: since }, landingPage: { $exists: true, $ne: null } };
  if (pathFilter) match.landingPage = pathFilter;

  const [dailyRaw, hourlyRaw, byDeviceRaw, byPageRaw, byCountryRaw, byCityRaw, byChannelRaw, recentSessions] = await Promise.all([
    VipSession.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$startedAt', timezone: 'Asia/Kolkata' } }, count: { $sum: 1 }, visitors: { $addToSet: '$vid' } } },
      { $project: { date: '$_id', count: 1, uniqueVisitors: { $size: '$visitors' }, _id: 0 } },
      { $sort: { date: 1 } },
    ]),
    // Peak-hours pattern (IST) — which hour of day this landing page gets
    // the most traffic, aggregated across the whole selected range (like
    // Ads Manager/AdSense's "time of day" breakdown, not just a single day).
    VipSession.aggregate([
      { $match: match },
      { $group: { _id: { $hour: { date: '$startedAt', timezone: 'Asia/Kolkata' } }, count: { $sum: 1 } } },
      { $project: { hour: '$_id', count: 1, _id: 0 } },
      { $sort: { hour: 1 } },
    ]),
    VipSession.aggregate([
      { $match: { ...match, 'device.type': { $exists: true, $ne: null } } },
      { $group: { _id: '$device.type', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]),
    VipSession.aggregate([
      { $match: match },
      { $group: { _id: '$landingPage', count: { $sum: 1 }, visitors: { $addToSet: '$vid' } } },
      { $project: { path: '$_id', count: 1, uniqueVisitors: { $size: '$visitors' }, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]),
    VipSession.aggregate([
      { $match: { ...match, 'geo.country': { $exists: true, $ne: null } } },
      { $group: { _id: '$geo.country', count: { $sum: 1 } } },
      { $project: { country: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 12 },
    ]),
    VipSession.aggregate([
      { $match: { ...match, 'geo.city': { $exists: true, $ne: null } } },
      { $group: { _id: { city: '$geo.city', country: '$geo.country', region: '$geo.region' }, count: { $sum: 1 } } },
      { $project: { city: '$_id.city', country: '$_id.country', region: '$_id.region', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]),
    VipSession.aggregate([
      { $match: match },
      { $group: { _id: '$channel', count: { $sum: 1 } } },
      { $project: { channel: { $ifNull: ['$_id', 'direct'] }, count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    VipSession.find(match).sort({ startedAt: -1 }).limit(50).lean(),
  ]);

  const vids = Array.from(new Set(recentSessions.map((s: any) => s.vid)));
  const visitors = await VipVisitor.find({ vid: { $in: vids } }).lean();
  const visitorByVid = new Map(visitors.map((v: any) => [v.vid, v]));

  const recent = recentSessions.map((s: any) => {
    const v = visitorByVid.get(s.vid);
    return {
      vid: s.vid,
      landingPage: s.landingPage,
      startedAt: s.startedAt,
      device: s.device,
      geo: s.geo,
      channel: s.channel,
      utm: s.utm,
      name: v?.knownName || null,
      email: v?.knownEmail || null,
      phone: v?.knownPhone || null,
      isBotHeuristic: !!s.isBotHeuristic,
    };
  });

  const totalViews = dailyRaw.reduce((sum: number, d: any) => sum + d.count, 0);
  const totalUnique = new Set(recentSessions.map((s: any) => s.vid)).size;

  return NextResponse.json({
    ok: true,
    days,
    pathFilter: pathFilter || null,
    totalViews,
    totalUniqueVisitors: totalUnique,
    daily: dailyRaw,
    // Zero-fill all 24 hours so the chart doesn't skip silent hours.
    hourly: Array.from({ length: 24 }, (_, hour) => ({ hour, count: hourlyRaw.find((h: any) => h.hour === hour)?.count || 0 })),
    byDevice: byDeviceRaw,
    byPage: byPageRaw,
    byCountry: byCountryRaw,
    byCity: byCityRaw,
    byChannel: byChannelRaw.map((c: any) => ({ channel: c.channel || 'direct', count: c.count })),
    recentVisitors: recent,
  });
  } catch (e) {
    return apiError(e);
  }
}
