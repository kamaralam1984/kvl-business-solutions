import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { OutreachCampaign } from '@/lib/models/OutreachCampaign';
import { OutreachProspect } from '@/lib/models/OutreachProspect';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  name: z.string().min(2),
  channel: z.enum(['email', 'linkedin']).default('email'),
  subjectTemplate: z.string().optional().default(''),
  bodyTemplate: z.string().min(10),
  status: z.enum(['draft', 'active', 'paused']).optional().default('draft'),
});

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const campaigns = await OutreachCampaign.find({}).sort({ createdAt: -1 }).lean();

    // Per-campaign prospect counts by status, computed in one aggregation so the
    // list view can show real sent/replied/meeting numbers without N+1 queries.
    const counts = await OutreachProspect.aggregate([
      { $group: { _id: { campaignId: '$campaignId', status: '$status' }, n: { $sum: 1 } } },
    ]);
    const byCampaign = new Map<string, Record<string, number>>();
    for (const c of counts) {
      const id = c._id.campaignId.toString();
      if (!byCampaign.has(id)) byCampaign.set(id, {});
      byCampaign.get(id)![c._id.status] = c.n;
    }

    const withCounts = campaigns.map((c: any) => ({ ...c, statusCounts: byCampaign.get(c._id.toString()) || {} }));
    return NextResponse.json({ ok: true, campaigns: withCounts });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const campaign = await OutreachCampaign.create({ ...data, createdByEmail: g.session?.user?.email });
    logActivity({ action: 'outreach.campaign.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'OutreachCampaign', targetId: campaign._id.toString(), details: { name: data.name }, req });
    return NextResponse.json({ ok: true, campaign });
  } catch (e) {
    return apiError(e);
  }
}
