import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { Deal } from '@/lib/models/Deal';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

// Best-effort numeric estimate from a free-text budget string (e.g. "₹5,00,000 – ₹15,00,000").
// Uses the upper end of the range when one is present. Returns 0 if nothing parseable.
function parseBudgetToValue(budget?: string | null): number {
  if (!budget) return 0;
  const matches = budget.match(/[\d,]+/g);
  if (!matches) return 0;
  const nums = matches.map(m => parseInt(m.replace(/,/g, ''), 10)).filter(n => !isNaN(n) && n > 0);
  return nums.length ? Math.max(...nums) : 0;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const data = await req.json();
  await connectDB();
  const before = await Lead.findById(params.id);
  if (!before) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  const lead = await Lead.findByIdAndUpdate(params.id, { $set: data }, { new: true });
  if (!lead) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  logActivity({ action: 'lead.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Lead', targetId: lead.email, details: data, req });

  // --- Lead-to-Deal automation (task 12, additive) ---
  // When a lead is (re)marked 'qualified' and doesn't already have a linked deal, auto-create
  // one so sales never has to manually re-enter a qualified lead into the pipeline. Existing
  // manual deal creation/editing via /dashboard/crm is completely untouched by this.
  if (data.status === 'qualified' && before.status !== 'qualified' && !before.dealId) {
    const ownerEmail = (g.session?.user?.email || process.env.EMAIL_TO_SALES || 'sales@kvlbusinesssolutions.com').toLowerCase();
    const deal = await Deal.create({
      ownerEmail,
      title: `${lead.name}${lead.service ? ' — ' + lead.service : ''}`,
      contactName: lead.name,
      value: parseBudgetToValue(lead.aiInsights?.budget || lead.budget),
      stage: 'qualified',
      probability: 40,
      source: lead.source || 'lead',
      notes: `Auto-created from qualified lead ${lead.email}${lead.phone ? ' / ' + lead.phone : ''}.${lead.message ? ' Message: ' + String(lead.message).slice(0, 200) : ''}`,
    });
    await Lead.updateOne({ _id: lead._id }, { $set: { dealId: deal._id } });
    (lead as any).dealId = deal._id;
    logActivity({ action: 'lead.auto_deal', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Deal', targetId: deal._id.toString(), details: { leadId: lead._id.toString(), leadEmail: lead.email }, req });
  }
  // --- end additive block ---

  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const lead = await Lead.findByIdAndDelete(params.id);
  logActivity({ action: 'lead.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Lead', targetId: lead?.email, req });
  return NextResponse.json({ ok: true });
}
