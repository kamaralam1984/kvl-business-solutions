import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
  emailVerified: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const { password, ...rest } = schema.parse(await req.json());
    await connectDB();
    const update: Record<string, any> = { ...rest };
    if (password) {
      const bcrypt = await import('bcryptjs');
      update.passwordHash = await bcrypt.hash(password, 10);
    }
    const u = await User.findByIdAndUpdate(params.id, { $set: update }, { new: true }).select('-passwordHash');
    if (!u) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'user.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'User', targetId: u.email, details: rest, req });
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
