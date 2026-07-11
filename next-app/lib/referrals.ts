import crypto from 'crypto';
import { connectDB } from './mongodb';
import { Referral } from './models/Referral';
import { Lead } from './models/Lead';
import { Deal } from './models/Deal';

/** Real, collision-checked code generation — an email-derived prefix plus random hex. */
function makeCode(seedEmail: string): string {
  const prefix = (seedEmail.split('@')[0] || 'REF').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'REF';
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars
  return `${prefix}${rand}`;
}

/**
 * Finds the referral row for this user, creating one with a fresh unique code
 * if this is their first visit to the referral dashboard. Mirrors the
 * find-or-create-on-read pattern already used by getSiteSettings().
 */
export async function getOrCreateReferral(email: string) {
  await connectDB();
  const referrerEmail = email.toLowerCase();
  const existing = await Referral.findOne({ referrerEmail });
  if (existing) return existing;

  // Retry on the rare code collision (unique index on `code`).
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await Referral.create({ referrerEmail, code: makeCode(referrerEmail) });
    } catch (e: any) {
      if (e?.code === 11000) {
        // Someone else created this referrerEmail concurrently — return it.
        const raced = await Referral.findOne({ referrerEmail });
        if (raced) return raced;
        continue; // otherwise it was a `code` collision — try a new random code
      }
      throw e;
    }
  }
  throw new Error('Could not generate a unique referral code after 5 attempts');
}

/**
 * Computes real conversion counts per referral code by cross-referencing Leads
 * attributed to that code (Lead.referralCode, set in app/api/lead/route.ts)
 * with the Deal each such Lead turned into (Lead.dealId, set by the existing
 * lead-to-deal automation in app/api/admin/leads/[id]/route.ts). A conversion
 * is counted when that Deal's stage is 'won'.
 *
 * This is deliberately computed on-read rather than via a write-time hook on
 * Deal updates, so it never needs to touch app/api/crm/deals/[id]/route.ts.
 */
export async function computeConversions(codes: string[]): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  if (codes.length === 0) return result;
  await connectDB();

  const leads = await Lead.find(
    { referralCode: { $in: codes }, dealId: { $ne: null } },
    { referralCode: 1, dealId: 1 }
  ).lean();
  if (leads.length === 0) return result;

  const dealIds = leads.map((l: any) => l.dealId).filter(Boolean);
  const wonDeals = await Deal.find({ _id: { $in: dealIds }, stage: 'won' }, { _id: 1 }).lean();
  const wonSet = new Set(wonDeals.map((d: any) => d._id.toString()));

  for (const l of leads as any[]) {
    if (l.dealId && wonSet.has(l.dealId.toString())) {
      result[l.referralCode] = (result[l.referralCode] || 0) + 1;
    }
  }
  return result;
}

/** Recomputes conversionsCount for a batch of referral docs and persists any change. */
export async function syncConversionCounts<T extends { _id: any; code: string; conversionsCount?: number }>(
  referrals: T[]
): Promise<Array<T & { conversionsCount: number }>> {
  const conv = await computeConversions(referrals.map(r => r.code));
  await connectDB();
  await Promise.all(
    referrals.map(r => {
      const count = conv[r.code] || 0;
      if (r.conversionsCount === count) return null;
      return Referral.updateOne({ _id: r._id }, { $set: { conversionsCount: count } });
    })
  );
  return referrals.map(r => ({ ...r, conversionsCount: conv[r.code] || 0 }));
}
