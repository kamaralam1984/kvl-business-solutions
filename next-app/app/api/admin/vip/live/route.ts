import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { VipVisitor } from '@/lib/models/VipVisitor';
import { VipSession } from '@/lib/models/VipSession';
import { VipPageView } from '@/lib/models/VipPageView';
import { requireAdmin } from '@/lib/admin-guard';

// "Who's online right now, and on which page" — polled by the admin UI every
// ~7s (no websocket/SSE infra on this VPS, see app/api/admin/vip/overview/route.ts's
// same Phase-A-polling note). A session counts as live if it had any activity
// in the last LIVE_WINDOW_MIN minutes.
const LIVE_WINDOW_MIN = 5;

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();

  const since = new Date(Date.now() - LIVE_WINDOW_MIN * 60 * 1000);
  const sessions = await VipSession.find({ lastActivityAt: { $gte: since } })
    .sort({ lastActivityAt: -1 })
    .limit(200)
    .lean();

  if (sessions.length === 0) {
    return NextResponse.json({ ok: true, count: 0, visitors: [] });
  }

  const sessionIds = sessions.map((s: any) => s.sessionId);
  const vids = Array.from(new Set(sessions.map((s: any) => s.vid)));

  const [visitors, currentPages] = await Promise.all([
    VipVisitor.find({ vid: { $in: vids } }).lean(),
    // Most recent page view per session — that's what the visitor is looking at right now.
    VipPageView.aggregate([
      { $match: { sessionId: { $in: sessionIds } } },
      { $sort: { enteredAt: -1 } },
      { $group: { _id: '$sessionId', path: { $first: '$path' }, enteredAt: { $first: '$enteredAt' } } },
    ]),
  ]);

  const visitorByVid = new Map(visitors.map((v: any) => [v.vid, v]));
  const pageBySession = new Map(currentPages.map((p: any) => [p._id, p]));

  const live = sessions.map((s: any) => {
    const visitor = visitorByVid.get(s.vid);
    const page = pageBySession.get(s.sessionId);
    return {
      vid: s.vid,
      sessionId: s.sessionId,
      name: visitor?.knownName || null,
      email: visitor?.knownEmail || null,
      phone: visitor?.knownPhone || null,
      isKnown: !!(visitor?.knownName || visitor?.knownEmail || visitor?.knownLeadId),
      currentPath: page?.path || s.landingPage || null,
      onPageSince: page?.enteredAt || s.lastActivityAt,
      landingPage: s.landingPage,
      device: s.device,
      geo: s.geo,
      channel: s.channel,
      startedAt: s.startedAt,
      lastActivityAt: s.lastActivityAt,
      isBotHeuristic: !!s.isBotHeuristic,
    };
  });

  return NextResponse.json({ ok: true, count: live.length, visitors: live });
}
