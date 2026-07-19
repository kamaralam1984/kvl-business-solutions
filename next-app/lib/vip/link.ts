import { cookies } from 'next/headers';
import { VipVisitor } from '@/lib/models/VipVisitor';

// Module 1 (Visitor Intelligence → "Known Lead") — links a VipVisitor to a
// real Lead/Deal/User record the moment that record is created, by reading
// the same `vip_vid` cookie the browser already sent with this request. No
// frontend changes needed: same-origin fetch() calls already include cookies
// by default, so every lead-creation route just needs this one call added.
// Silently no-ops if the visitor never had a vip_vid cookie (e.g. tracking
// consent wasn't granted) — never fabricates a link.
export async function linkVisitorToLead(opts: { leadId?: string; dealId?: string; userId?: string; name?: string; email?: string }) {
  const vid = cookies().get('vip_vid')?.value;
  if (!vid) return;

  const set: Record<string, any> = {};
  if (opts.leadId) set.knownLeadId = opts.leadId;
  if (opts.dealId) set.knownDealId = opts.dealId;
  if (opts.userId) set.knownUserId = opts.userId;
  if (opts.name) set.knownName = opts.name;
  if (opts.email) set.knownEmail = opts.email;
  if (Object.keys(set).length === 0) return;

  await VipVisitor.updateOne({ vid }, { $set: set }, { upsert: true }).catch(() => {});
}
