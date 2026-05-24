import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  emailVerified: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const u = await User.findByIdAndUpdate(params.id, { $set: data }, { new: true }).select('-passwordHash');
    if (!u) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'user.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'User', targetId: u.email, details: data, req });
    return NextResponse.json({ ok: true, user: u });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const u = await User.findByIdAndDelete(params.id);
  logActivity({ action: 'user.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'User', targetId: u?.email, req });
  return NextResponse.json({ ok: true });
}
