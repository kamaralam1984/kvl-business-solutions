import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  price: z.number().int().positive().optional(),
  unit: z.string().optional(),
  active: z.boolean().optional(),
  tag: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  imagePublicId: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = updateSchema.parse(await req.json());
    await connectDB();
    const p = await Product.findByIdAndUpdate(params.id, { $set: data }, { new: true });
    if (!p) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'product.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Product', targetId: p.slug, details: data, req });
    return NextResponse.json({ ok: true, product: p });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const p = await Product.findByIdAndDelete(params.id);
  logActivity({ action: 'product.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Product', targetId: p?.slug, req });
  return NextResponse.json({ ok: true });
}
