import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

const schema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const { currentPassword, newPassword } = schema.parse(await req.json());
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ ok: false, error: 'Current password is incorrect' }, { status: 400 });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
