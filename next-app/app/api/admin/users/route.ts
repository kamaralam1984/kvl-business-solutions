import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q');
    const filter = q ? { $or: [{ email: { $regex: q, $options: 'i' } }, { name: { $regex: q, $options: 'i' } }] } : {};
    await connectDB();
    const users = await User.find(filter).select('-passwordHash -verifyToken -resetToken').sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ ok: true, users });
  } catch (e) {
    return apiError(e);
  }
}

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).default('user'),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = createSchema.parse(await req.json());
    await connectDB();
    const exists = await User.findOne({ email: data.email.toLowerCase() });
    if (exists) return NextResponse.json({ ok: false, error: 'Email already registered' }, { status: 409 });
    const passwordHash = await bcrypt.hash(data.password, 10);
    const u = await User.create({ name: data.name, email: data.email.toLowerCase(), passwordHash, role: data.role, phone: data.phone || '', emailVerified: true, provider: 'credentials' });
    logActivity({ action: 'user.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'User', targetId: u.email, req });
    return NextResponse.json({ ok: true, user: { _id: u._id, name: u.name, email: u.email, role: u.role } }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
