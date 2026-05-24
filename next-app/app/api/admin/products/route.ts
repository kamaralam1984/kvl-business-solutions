import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  price: z.number().int().positive(),
  unit: z.string().default('/year'),
  active: z.boolean().default(true),
  tag: z.string().optional(),
  image: z.string().url().optional(),
  imagePublicId: z.string().optional(),
});

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, products });
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const p = await Product.create(data);
    logActivity({ action: 'product.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Product', targetId: p.slug, details: { name: p.name, price: p.price }, req });
    return NextResponse.json({ ok: true, product: p });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
