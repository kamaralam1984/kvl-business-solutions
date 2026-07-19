import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { OutreachProspect, PROSPECT_STATUSES } from '@/lib/models/OutreachProspect';
import { requireAdmin } from '@/lib/admin-guard';

const updateSchema = z.object({
  status: z.enum(PROSPECT_STATUSES).optional(),
  notes: z.string().optional(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  company: z.string().optional(),
  markContacted: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const { markContacted, ...data } = updateSchema.parse(await req.json());
    await connectDB();
    const update: any = { ...data };
    if (markContacted) update.lastContactedAt = new Date();
    const prospect = await OutreachProspect.findByIdAndUpdate(params.id, update, { new: true });
    if (!prospect) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, prospect });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await OutreachProspect.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
