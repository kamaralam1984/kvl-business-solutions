import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Banner } from '@/lib/models/Banner';
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
    logActivity({ action: 'banner.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Banner', targetId: b._id.toString(), details: { text: data.text }, req });
    return NextResponse.json({ ok: true, banner: b });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
