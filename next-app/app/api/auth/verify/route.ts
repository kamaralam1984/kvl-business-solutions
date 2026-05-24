import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { hashToken, generateToken, expiresIn } from '@/lib/token';
import { sendNotification, verifyEmail } from '@/lib/email';
import { z } from 'zod';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!token) return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 400 });

  await connectDB();
  const user = await User.findOne({
    verifyToken: hashToken(token),
    verifyTokenExpires: { $gt: new Date() },
  });
  if (!user) return NextResponse.json({ ok: false, error: 'Invalid or expired token' }, { status: 400 });

  user.emailVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpires = undefined;
  await user.save();
  return NextResponse.json({ ok: true });
}

const resendSchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const { email } = resendSchema.parse(await req.json());
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && !user.emailVerified) {
      const token = generateToken();
      user.verifyToken = hashToken(token);
      user.verifyTokenExpires = expiresIn(24);
      await user.save();
      const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      await sendNotification('Verify your KVL email', verifyEmail(user.name, `${site}/verify-email?token=${token}`), user.email);
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
