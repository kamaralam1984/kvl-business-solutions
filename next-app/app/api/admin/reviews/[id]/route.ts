import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const r = await Review.findByIdAndUpdate(params.id, { $set: data }, { new: true });
    if (!r) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'review.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Review', targetId: r._id.toString(), details: data, req });
    return NextResponse.json({ ok: true, review: r });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await Review.findByIdAndDelete(params.id);
  logActivity({ action: 'review.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Review', targetId: params.id, req });
  return NextResponse.json({ ok: true });
}
