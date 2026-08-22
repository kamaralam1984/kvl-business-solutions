import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { VipVisitor } from '@/lib/models/VipVisitor';
import { VipSession } from '@/lib/models/VipSession';
import { VipPageView } from '@/lib/models/VipPageView';
import { VipEvent } from '@/lib/models/VipEvent';
import { requireAdmin } from '@/lib/admin-guard';
import { recomputeAndSaveVipLeadScore } from '@/lib/vip/lead-score';

// Module 8 (Lead Journey) — the full real timeline for one visitor: every
// session, every page they viewed (in order), and their most notable
// behavioural events. Score is computed fresh on every open (not read from
// the possibly-stale cron-computed cache) since a human is looking at this
// one record right now and a stale number here would be actively misleading.
export async function GET(_req: Request, { params }: { params: { vid: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
  await connectDB();

  const visitor = await VipVisitor.findOne({ vid: params.vid })
    .populate('knownLeadId', 'name email service status leadTier')
    .populate('knownDealId', 'title stage value')
    .lean<any>();
  if (!visitor) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const [sessions, pageViews, notableEvents, score] = await Promise.all([
    VipSession.find({ vid: params.vid }).sort({ startedAt: -1 }).limit(50).lean(),
    VipPageView.find({ vid: params.vid }).sort({ enteredAt: 1 }).limit(500).lean(),
    VipEvent.find({ vid: params.vid, type: { $in: ['form_submit', 'rage_click', 'whatsapp_click', 'call_click', 'download', 'proposal_download', 'book_meeting_complete', 'js_error'] } })
      .sort({ ts: -1 }).limit(100).lean(),
    recomputeAndSaveVipLeadScore(params.vid),
  ]);

  const pageViewsBySession = new Map<string, any[]>();
  for (const pv of pageViews) {
    if (!pageViewsBySession.has(pv.sessionId)) pageViewsBySession.set(pv.sessionId, []);
    pageViewsBySession.get(pv.sessionId)!.push(pv);
  }

  return NextResponse.json({
    ok: true,
    visitor,
    score,
    sessions: sessions.map((s: any) => ({ ...s, pageViews: pageViewsBySession.get(s.sessionId) || [] })),
    notableEvents,
  });
  } catch (e) {
    return apiError(e);
  }
}
