import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { hashToken } from '@/lib/token';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const schema = z.object({
  token: z.string().min(20),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const limit = rateLimit(`reset:${clientIp(req)}`, 10, 15 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  try {
    const { token, password } = schema.parse(await req.json());
    await connectDB();
    const user = await User.findOne({
      resetToken: hashToken(token),
      resetTokenExpires: { $gt: new Date() },
    });
    if (!user) return NextResponse.json({ ok: false, error: 'Invalid or expired link' }, { status: 400 });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
