import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Demo } from '@/lib/models/Demo';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { DEFAULT_DEMOS } from '@/lib/data/default-demos';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  category: z.string().default('business'),
  technologies: z.array(z.string()).default([]),
  live: z.boolean().default(false),
  image: z.string().optional(),
  imagePublicId: z.string().optional(),
  iconName: z.string().default('Globe'),
  c1: z.string().default('#3b82f6'),
  c2: z.string().default('#1d4ed8'),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
  startingPrice: z.number().int().nonnegative().default(14999),
});

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();

  // Auto-seed default demos on first admin access (when DB is empty)
  const count = await Demo.countDocuments();
  if (count === 0) {
    await Demo.insertMany(DEFAULT_DEMOS);
    logActivity({
      action: 'demo.seed',
      actorEmail: g.session?.user?.email || undefined,
      actorRole: 'admin',
      target: 'Demo',
      details: { count: DEFAULT_DEMOS.length, reason: 'auto-seed on first admin access' },
      req,
    });
  }

  const demos = await Demo.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, demos, seeded: count === 0 });
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const d = await Demo.create(data);
    logActivity({ action: 'demo.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Demo', targetId: d._id.toString(), details: { name: d.name, url: d.url }, req });
    return NextResponse.json({ ok: true, demo: d });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
