import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { OutreachProspect } from '@/lib/models/OutreachProspect';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const prospectSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  company: z.string().optional(),
});

// Accepts either one prospect or a bulk-pasted list — the admin UI's "paste a
// list" box (one `Name, email, company` per line) sends the array form.
const schema = z.object({
  campaignId: z.string().min(1),
  prospects: z.array(prospectSchema).min(1),
});

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const url = new URL(req.url);
  const campaignId = url.searchParams.get('campaignId');
  if (!campaignId) return NextResponse.json({ ok: false, error: 'campaignId required' }, { status: 400 });
  await connectDB();
  const prospects = await OutreachProspect.find({ campaignId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, prospects });
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const docs = await OutreachProspect.insertMany(
      data.prospects.map((p) => ({ ...p, campaignId: data.campaignId }))
    );
    logActivity({ action: 'outreach.prospects.add', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'OutreachCampaign', targetId: data.campaignId, details: { count: docs.length }, req });
    return NextResponse.json({ ok: true, prospects: docs });
  } catch (e) {
    return apiError(e);
  }
}
