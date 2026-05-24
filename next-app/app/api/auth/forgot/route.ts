import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { generateToken, hashToken, expiresIn } from '@/lib/token';
import { sendNotification, resetEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const limit = rateLimit(`forgot:${clientIp(req)}`, 5, 15 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  try {
    const { email } = schema.parse(await req.json());
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return ok to prevent email enumeration
    if (user) {
      const token = generateToken();
      user.resetToken = hashToken(token);
      user.resetTokenExpires = expiresIn(1);
      await user.save();
      const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const link = `${site}/reset-password?token=${token}`;
      await sendNotification('Reset your KVL password', resetEmail(user.name, link), user.email);
    }

    return NextResponse.json({ ok: true, message: 'If the email exists, a reset link has been sent.' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
