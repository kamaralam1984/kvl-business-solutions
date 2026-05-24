import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { sendNotification } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  productSlug: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const limit = rateLimit(`review:${clientIp(req)}`, 3, 60 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many reviews — try later' }, { status: 429 });

  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const r = await Review.create(data);
    sendNotification(`⭐ New ${data.rating}-star review from ${data.name}`,
      `<p><b>${data.name}</b> (${data.email}) reviewed <b>${data.productSlug || 'KVL'}</b></p>
       <p><b>Rating:</b> ${'⭐'.repeat(data.rating)}</p>
       <p><b>${data.title || ''}</b></p><p>${data.message}</p>
       <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/reviews">Moderate in admin</a></p>`);
    return NextResponse.json({ ok: true, id: r._id, message: 'Review submitted — pending approval' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

// Public — only return approved reviews
export async function GET(req: Request) {
  const url = new URL(req.url);
  const productSlug = url.searchParams.get('product');
  await connectDB();
  const filter: any = { approved: true };
  if (productSlug) filter.productSlug = productSlug;
  const reviews = await Review.find(filter).sort({ featured: -1, createdAt: -1 }).limit(20).lean();
  const all = productSlug ? await Review.find({ approved: true, productSlug }).lean() : await Review.find({ approved: true }).lean();
  const avg = all.length ? all.reduce((s: number, r: any) => s + r.rating, 0) / all.length : 0;
  return NextResponse.json({ ok: true, reviews, count: all.length, avgRating: Math.round(avg * 10) / 10 });
}
