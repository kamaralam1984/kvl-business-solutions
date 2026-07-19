import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { VipVisitor } from '@/lib/models/VipVisitor';
import { recomputeAndSaveVipLeadScore } from '@/lib/vip/lead-score';
import { requireCronAuth } from '@/lib/cron-auth';
import { logCronRun } from '@/lib/cron-log';

// Batch-recomputes VIP lead scores for every visitor who's become identifiable
// (has a knownLeadId/Deal/User) — keeps the admin visitor list's score column
// fresh without computing it live on every page render. Visitor-detail pages
// still compute on-demand for a guaranteed-fresh single read.
export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  try {
    await connectDB();
    const known = await VipVisitor.find({
      $or: [{ knownLeadId: { $ne: null } }, { knownDealId: { $ne: null } }, { knownUserId: { $ne: null } }],
    }).select('vid').limit(500).lean();

    let done = 0;
    for (const v of known) {
      try { await recomputeAndSaveVipLeadScore(v.vid); done++; } catch (e) { console.error('[vip-lead-scoring]', v.vid, e); }
    }

    await logCronRun('vip-lead-scoring', 'success', `Recomputed ${done} of ${known.length}`);
    return NextResponse.json({ ok: true, recomputed: done });
  } catch (e: any) {
    await logCronRun('vip-lead-scoring', 'error', 'Run failed', e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
