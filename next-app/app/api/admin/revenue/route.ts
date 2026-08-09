import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Deal, DEAL_STAGES } from '@/lib/models/Deal';
import { Lead } from '@/lib/models/Lead';
import { Order } from '@/lib/models/Order';
import { Booking } from '@/lib/models/Booking';
import { VisitDailyLog } from '@/lib/models/VisitDailyLog';
import { AnalyticsEvent } from '@/lib/models/AnalyticsEvent';
import { requireAdmin } from '@/lib/admin-guard';

// CEO-level revenue/pipeline dashboard — every number here comes from this
// site's own Mongo data (Deal, Lead, Order, Booking, VisitDailyLog,
// AnalyticsEvent). Campaign ROI and paid-traffic-source breakdown are
// deliberately left as "not available" rather than estimated — there's no ad
// account connected yet (see WEBSITE-STATUS.md §2.5), and guessing a number
// there would be exactly the fabricated data this dashboard is built to avoid.
export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
  await connectDB();

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [deals, leadsLast30, allTimeLeadCount, ordersLast30, bookingsLast30, dailyVisitsRaw, landingPagesRaw] = await Promise.all([
    Deal.find({}).lean(),
    Lead.find({ createdAt: { $gte: since30 } }).lean(),
    Lead.countDocuments({}),
    Order.find({ status: 'paid', createdAt: { $gte: since30 } }).lean(),
    Booking.find({ createdAt: { $gte: since30 } }).lean(),
    VisitDailyLog.find({}).sort({ date: -1 }).limit(30).lean(),
    AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: since30 }, name: 'lead_submit' } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  // Pipeline / deal stage breakdown — value in the "lost" stage excluded from
  // pipeline value (matches the existing /api/analytics/insights convention).
  const stageCounts: Record<string, { count: number; value: number }> = {};
  DEAL_STAGES.forEach(s => { stageCounts[s] = { count: 0, value: 0 }; });
  let pipelineValue = 0;
  deals.forEach((d: any) => {
    stageCounts[d.stage].count++;
    stageCounts[d.stage].value += d.value || 0;
    if (d.stage !== 'lost') pipelineValue += d.value || 0;
  });
  const wonDeals = deals.filter((d: any) => d.stage === 'won' || d.stage === 'repeat');
  const wonValue = wonDeals.reduce((s: number, d: any) => s + (d.value || 0), 0);
  const avgDealSize = wonDeals.length > 0 ? Math.round(wonValue / wonDeals.length) : 0;

  // Lead source breakdown — real `source` field on every Lead document
  // (contact-form, lead-magnet-audit, lead-magnet-ai-consultation,
  // callback-widget, referral, chat_*, etc.)
  const bySource: Record<string, number> = {};
  leadsLast30.forEach((l: any) => { const s = l.source || 'unknown'; bySource[s] = (bySource[s] || 0) + 1; });
  const topSources = Object.entries(bySource).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, count]) => ({ source, count }));

  // "Top requested services" as an honest proxy for industry interest — Lead
  // has no dedicated industry field, so this reports what's actually tracked
  // (the `service` field) rather than inventing an industry taxonomy.
  const byService: Record<string, number> = {};
  leadsLast30.forEach((l: any) => { const s = l.service || 'unspecified'; byService[s] = (byService[s] || 0) + 1; });
  const topServices = Object.entries(byService).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([service, count]) => ({ service, count }));

  const qualifiedLeads = leadsLast30.filter((l: any) => l.leadTier === 'high' || l.leadTier === 'medium' || l.status === 'qualified').length;
  const conversionRate = allTimeLeadCount > 0 ? Math.round((wonDeals.length / allTimeLeadCount) * 1000) / 10 : 0;

  const dailyVisitors = dailyVisitsRaw.map((d: any) => ({ date: d.date, count: d.count })).reverse();
  const totalRevenue30d = ordersLast30.reduce((s: number, o: any) => s + (o.amount || 0), 0);

  return NextResponse.json({
    ok: true,
    kpis: {
      dailyVisitorsAvg: dailyVisitors.length ? Math.round(dailyVisitors.reduce((s, d) => s + d.count, 0) / dailyVisitors.length) : 0,
      qualifiedLeads30d: qualifiedLeads,
      meetingsBooked30d: bookingsLast30.length,
      proposalsInFlight: stageCounts.proposal.count,
      wonDeals: wonDeals.length,
      wonValue,
      pipelineValue,
      avgDealSize,
      conversionRatePct: conversionRate,
      orderRevenue30d: totalRevenue30d,
    },
    dailyVisitors,
    stageCounts,
    topSources,
    topServices,
    topLandingPagesForLeads: landingPagesRaw.map((r: any) => ({ path: r._id || '(unknown)', count: r.count })),
    campaignRoi: { available: false, reason: 'No ad platform (Google Ads / Meta Ads) connected yet — see WEBSITE-STATUS.md §2.5' },
  });
  } catch (e) {
    return apiError(e);
  }
}
