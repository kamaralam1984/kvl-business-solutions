import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Banner, invalidateBannerCache } from '@/lib/models/Banner';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  text: z.string().min(2),
  link: z.string().optional(),
  linkText: z.string().optional(),
  active: z.boolean().default(true),
  variant: z.enum(['info', 'success', 'warning', 'promo']).default('promo'),
  dismissible: z.boolean().default(true),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const banners = await Banner.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, banners });
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const b = await Banner.create(data);
    invalidateBannerCache();
    logActivity({ action: 'banner.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Banner', targetId: b._id.toString(), details: { text: data.text }, req });
    return NextResponse.json({ ok: true, banner: b });
  } catch (e) {
    return apiError(e);
  }
}
