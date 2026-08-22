import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { OutreachProspect } from '@/lib/models/OutreachProspect';
import { OutreachCampaign } from '@/lib/models/OutreachCampaign';
import { Deal } from '@/lib/models/Deal';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

// Converts a replied/interested outreach prospect into a real CRM deal —
// the one point where outreach and the sales pipeline (app/dashboard/crm)
// share data, so a prospect that turns into a client shows up in the same
// pipeline as inbound leads instead of living in a separate silo.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();

    const prospect: any = await OutreachProspect.findById(params.id);
    if (!prospect) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    if (prospect.convertedDealId) return NextResponse.json({ ok: false, error: 'Already converted' }, { status: 400 });

    const campaign: any = await OutreachCampaign.findById(prospect.campaignId).lean();

    const deal = await Deal.create({
      ownerEmail: g.session?.user?.email,
      title: `Outreach: ${prospect.name}${prospect.company ? ` (${prospect.company})` : ''}`,
      contactName: prospect.name,
      contactEmail: prospect.email || '',
      stage: 'qualified',
      probability: 30,
      source: `outreach:${campaign?.name || 'unknown campaign'}`,
      notes: prospect.notes || '',
    });

    prospect.convertedDealId = deal._id;
    prospect.status = 'meeting_booked';
    await prospect.save();

    logActivity({ action: 'outreach.prospect.convert', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'OutreachProspect', targetId: params.id, details: { dealId: deal._id.toString() }, req });
    return NextResponse.json({ ok: true, deal });
  } catch (e) {
    return apiError(e);
  }
}
