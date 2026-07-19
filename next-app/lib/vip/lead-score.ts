import { VipVisitor } from '@/lib/models/VipVisitor';
import { VipSession } from '@/lib/models/VipSession';
import { VipPageView } from '@/lib/models/VipPageView';
import { VipEvent } from '@/lib/models/VipEvent';
import { VipLeadScore } from '@/lib/models/VipLeadScore';

export type ScoreBreakdownItem = { signal: string; weight: number; value: number; points: number };

// Module 9 (AI Lead Scoring) — "AI" describes what the signals represent
// (real tracked browsing behaviour), not that a model invents a number. This
// is the same deterministic-rubric approach as lib/lead-tier.ts (which scores
// explicit form fields); this one scores real behavioural signals instead.
// Every point traces back to something actually tracked — nothing here is
// estimated, and there is no "vibe" component.
const CAPS = {
  sessionCount: { max: 10, weight: 2 },       // up to 20 pts
  pageViewCount: { max: 20, weight: 1 },      // up to 20 pts
  pricingVisits: { max: 5, weight: 4 },       // up to 20 pts
  portfolioVisits: { max: 5, weight: 3 },     // up to 15 pts
  contactAttempts: { max: 5, weight: 5 },     // up to 25 pts — strongest intent signal
  distinctServices: { max: 5, weight: 2 },    // up to 10 pts
  distinctIndustries: { max: 5, weight: 2 },  // up to 10 pts
  timeOnSiteMinutes: { max: 30, weight: 0.5 },// up to 15 pts
};
const KNOWN_LEAD_BONUS = 10;

function cap(value: number, key: keyof typeof CAPS): ScoreBreakdownItem {
  const { max, weight } = CAPS[key];
  const clamped = Math.min(value, max);
  return { signal: key, weight, value, points: Math.round(clamped * weight) };
}

export async function computeVipLeadScore(vid: string): Promise<{ score: number; tier: 'hot' | 'warm' | 'cold'; breakdown: ScoreBreakdownItem[] }> {
  const [visitor, sessions, pageViews, contactEvents] = await Promise.all([
    VipVisitor.findOne({ vid }).lean<any>(),
    VipSession.find({ vid }).select('durationSeconds').lean<any[]>(),
    VipPageView.find({ vid }).select('path').lean<any[]>(),
    VipEvent.countDocuments({ vid, type: 'form_submit' }),
  ]);

  if (!visitor) return { score: 0, tier: 'cold', breakdown: [] };

  const pricingVisits = pageViews.filter(p => p.path?.startsWith('/pricing')).length;
  const portfolioVisits = pageViews.filter(p => p.path?.startsWith('/projects') || p.path?.startsWith('/software')).length;
  const contactPageVisits = pageViews.filter(p => p.path?.startsWith('/contact') || p.path?.startsWith('/book-demo')).length;
  const contactAttempts = contactEvents + contactPageVisits;
  const distinctServices = new Set(pageViews.filter(p => p.path?.startsWith('/services/')).map(p => p.path)).size;
  const distinctIndustries = new Set(pageViews.filter(p => p.path?.startsWith('/industries/')).map(p => p.path)).size;
  const timeOnSiteMinutes = Math.round(sessions.reduce((s, sess) => s + (sess.durationSeconds || 0), 0) / 60);

  const breakdown: ScoreBreakdownItem[] = [
    cap(visitor.sessionCount || 0, 'sessionCount'),
    cap(visitor.pageViewCount || 0, 'pageViewCount'),
    cap(pricingVisits, 'pricingVisits'),
    cap(portfolioVisits, 'portfolioVisits'),
    cap(contactAttempts, 'contactAttempts'),
    cap(distinctServices, 'distinctServices'),
    cap(distinctIndustries, 'distinctIndustries'),
    cap(timeOnSiteMinutes, 'timeOnSiteMinutes'),
  ];

  if (visitor.knownLeadId) {
    breakdown.push({ signal: 'knownLead', weight: KNOWN_LEAD_BONUS, value: 1, points: KNOWN_LEAD_BONUS });
  }

  const rawScore = breakdown.reduce((s, b) => s + b.points, 0);
  const score = Math.min(100, rawScore);
  const tier: 'hot' | 'warm' | 'cold' = score >= 60 ? 'hot' : score >= 30 ? 'warm' : 'cold';

  return { score, tier, breakdown };
}

export async function recomputeAndSaveVipLeadScore(vid: string) {
  const result = await computeVipLeadScore(vid);
  const visitor = await VipVisitor.findOne({ vid }).select('knownLeadId').lean<any>();
  await VipLeadScore.findOneAndUpdate(
    { vid },
    { $set: { ...result, leadId: visitor?.knownLeadId || null, computedAt: new Date() } },
    { upsert: true }
  );
  return result;
}
