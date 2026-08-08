import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { Deal } from '@/lib/models/Deal';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { parseBudgetToValue } from '@/lib/deal-utils';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const data = await req.json();
  await connectDB();
  const before = await Lead.findById(params.id);
  if (!before) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  const lead = await Lead.findByIdAndUpdate(params.id, { $set: data }, { new: true });
  if (!lead) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  logActivity({ action: 'lead.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Lead', targetId: lead.email, details: data, req });

  // --- Lead-to-Deal automation ---
  // Every lead gets a Deal the moment it's created (see app/api/lead/route.ts)
  // — so marking one 'qualified' just advances that existing deal's stage
  // rather than creating a second, disconnected one. The create-a-deal path
  // below only exists for leads that predate that change and never got one.
  if (data.status === 'qualified' && before.status !== 'qualified') {
    if (before.dealId) {
      await Deal.updateOne({ _id: before.dealId, stage: { $ne: 'won' } }, { $set: { stage: 'qualified', probability: 40 } });
      logActivity({ action: 'lead.auto_deal', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Deal', targetId: before.dealId.toString(), details: { leadId: lead._id.toString(), leadEmail: lead.email, advanced: true }, req });
    } else {
      const ownerEmail = (g.session?.user?.email || process.env.EMAIL_TO_SALES || 'kvlbusinesssolution@gmail.com').toLowerCase();
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
