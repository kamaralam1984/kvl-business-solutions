import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Coupon } from '@/lib/models/Coupon';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  active: z.boolean().optional(),
  description: z.string().optional(),
  value: z.number().positive().optional(),
  maxUses: z.number().int().nonnegative().optional(),
  validUntil: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const c = await Coupon.findByIdAndUpdate(params.id, { $set: data }, { new: true });
    if (!c) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'coupon.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Coupon', targetId: c.code, details: data, req });
    return NextResponse.json({ ok: true, coupon: c });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const c = await Coupon.findByIdAndDelete(params.id);
  logActivity({ action: 'coupon.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Coupon', targetId: c?.code, req });
  return NextResponse.json({ ok: true });
}
