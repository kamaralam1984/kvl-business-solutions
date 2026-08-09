import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
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

// Refuses to demote/delete the last remaining admin (including via an admin
// acting on their own account) — without this, an admin panel with one
// admin user could accidentally lock itself out with no recovery path
// short of a direct database edit.
async function wouldRemoveLastAdmin(targetId: string, targetIsCurrentlyAdmin: boolean, demotingOrDeleting: boolean) {
  if (!targetIsCurrentlyAdmin || !demotingOrDeleting) return false;
  const otherAdmins = await User.countDocuments({ role: 'admin', _id: { $ne: targetId } });
  return otherAdmins === 0;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const { password, ...rest } = schema.parse(await req.json());
    await connectDB();

    if (rest.role === 'user') {
      const target = await User.findById(params.id).select('role').lean<{ role: string }>();
      if (target && await wouldRemoveLastAdmin(params.id, target.role === 'admin', true)) {
        return NextResponse.json({ ok: false, error: 'Cannot demote the last remaining admin.' }, { status: 400 });
      }
    }

    const update: Record<string, any> = { ...rest };
    if (password) {
      const bcrypt = await import('bcryptjs');
      update.passwordHash = await bcrypt.hash(password, 10);
    }
    const u = await User.findByIdAndUpdate(params.id, { $set: update }, { new: true }).select('-passwordHash');
    if (!u) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'user.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'User', targetId: u.email, details: rest, req });
    return NextResponse.json({ ok: true, user: u });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const target = await User.findById(params.id).select('role').lean<{ role: string }>();
    if (!target) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    if (await wouldRemoveLastAdmin(params.id, target.role === 'admin', true)) {
      return NextResponse.json({ ok: false, error: 'Cannot delete the last remaining admin.' }, { status: 400 });
    }
    const u = await User.findByIdAndDelete(params.id);
    logActivity({ action: 'user.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'User', targetId: u?.email, req });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
