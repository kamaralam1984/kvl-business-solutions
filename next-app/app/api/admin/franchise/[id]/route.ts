import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Franchise } from '@/lib/models/Franchise';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  startDate: z.string().optional(),
  status: z.enum(['active', 'paused', 'closed']).optional(),
  monthlyTarget: z.number().int().nonnegative().optional(),
  commissionRate: z.number().min(0).max(100).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const f = await Franchise.findByIdAndUpdate(params.id, { $set: data }, { new: true });
    if (!f) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'franchise.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Franchise', targetId: f._id.toString(), details: data, req });
    return NextResponse.json({ ok: true, franchise: f });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const f = await Franchise.findByIdAndDelete(params.id);
  logActivity({ action: 'franchise.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Franchise', targetId: f?._id?.toString(), req });
  return NextResponse.json({ ok: true });
}
