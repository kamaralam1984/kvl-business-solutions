import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Coupon } from '@/lib/models/Coupon';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  code: z.string().min(2).regex(/^[A-Z0-9_-]+$/i),
  description: z.string().optional(),
  type: z.enum(['percent', 'fixed']),
  value: z.number().positive(),
  minOrderAmount: z.number().int().nonnegative().default(0),
  maxDiscount: z.number().int().positive().optional(),
  maxUses: z.number().int().nonnegative().default(0),
  productSlugs: z.array(z.string()).default([]),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  active: z.boolean().default(true),
});

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, coupons });
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const c = await Coupon.create({ ...data, code: data.code.toUpperCase() });
    logActivity({ action: 'coupon.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Coupon', targetId: c.code, details: { type: c.type, value: c.value }, req });
    return NextResponse.json({ ok: true, coupon: c });
  } catch (e) {
    return apiError(e);
  }
}
