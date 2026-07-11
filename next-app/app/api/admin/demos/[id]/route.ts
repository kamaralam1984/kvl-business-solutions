import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Demo } from '@/lib/models/Demo';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  live: z.boolean().optional(),
  image: z.string().optional(),
  imagePublicId: z.string().optional(),
  iconName: z.string().optional(),
  c1: z.string().optional(),
  c2: z.string().optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
  startingPrice: z.number().int().nonnegative().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const d = await Demo.findByIdAndUpdate(params.id, { $set: data }, { new: true });
    if (!d) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'demo.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Demo', targetId: d._id.toString(), details: data, req });
    return NextResponse.json({ ok: true, demo: d });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const d = await Demo.findByIdAndDelete(params.id);
  logActivity({ action: 'demo.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Demo', targetId: d?._id?.toString(), details: { name: d?.name }, req });
  return NextResponse.json({ ok: true });
}
