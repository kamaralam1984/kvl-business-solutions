import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Banner } from '@/lib/models/Banner';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  text: z.string().optional(),
  link: z.string().optional(),
  linkText: z.string().optional(),
  active: z.boolean().optional(),
  variant: z.enum(['info', 'success', 'warning', 'promo']).optional(),
  dismissible: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const b = await Banner.findByIdAndUpdate(params.id, { $set: data }, { new: true });
    if (!b) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'banner.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Banner', targetId: b._id.toString(), details: data, req });
    return NextResponse.json({ ok: true, banner: b });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await Banner.findByIdAndDelete(params.id);
  logActivity({ action: 'banner.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Banner', targetId: params.id, req });
  return NextResponse.json({ ok: true });
}
