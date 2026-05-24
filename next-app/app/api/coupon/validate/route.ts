import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Coupon, evaluateCoupon } from '@/lib/models/Coupon';
import { softwareProducts } from '@/lib/data/software';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const schema = z.object({
  code: z.string().min(2),
  productSlug: z.string(),
  hosting: z.enum(['cloud', 'on-premise']).default('cloud'),
});

export async function POST(req: Request) {
  const limit = rateLimit(`coupon:${clientIp(req)}`, 20, 5 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many attempts' }, { status: 429 });

  try {
    const { code, productSlug, hosting } = schema.parse(await req.json());
    const product = softwareProducts.find(p => p.slug === productSlug);
    if (!product) return NextResponse.json({ ok: false, error: 'Invalid product' }, { status: 400 });

    await connectDB();
    const coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();
    if (!coupon) return NextResponse.json({ ok: false, error: 'Invalid coupon code' }, { status: 404 });

    const subtotal = Math.round(product.price * (hosting === 'on-premise' ? 1.5 : 1));
    const result = evaluateCoupon(coupon, { amount: subtotal, productSlug });
    if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });

    return NextResponse.json({
      ok: true,
      code: (coupon as any).code,
      discount: result.discount,
      type: (coupon as any).type,
      value: (coupon as any).value,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
