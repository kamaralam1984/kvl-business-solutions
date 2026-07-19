import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { OutreachCampaign } from '@/lib/models/OutreachCampaign';
import { OutreachProspect } from '@/lib/models/OutreachProspect';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  channel: z.enum(['email', 'linkedin']).optional(),
  subjectTemplate: z.string().optional(),
  bodyTemplate: z.string().min(10).optional(),
  status: z.enum(['draft', 'active', 'paused']).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const campaign = await OutreachCampaign.findById(params.id).lean();
  if (!campaign) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  const prospects = await OutreachProspect.find({ campaignId: params.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, campaign, prospects });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = updateSchema.parse(await req.json());
    await connectDB();
    const campaign = await OutreachCampaign.findByIdAndUpdate(params.id, data, { new: true });
    if (!campaign) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'outreach.campaign.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'OutreachCampaign', targetId: params.id, req });
    return NextResponse.json({ ok: true, campaign });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await OutreachCampaign.findByIdAndDelete(params.id);
  await OutreachProspect.deleteMany({ campaignId: params.id });
  logActivity({ action: 'outreach.campaign.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'OutreachCampaign', targetId: params.id, req });
  return NextResponse.json({ ok: true });
}
