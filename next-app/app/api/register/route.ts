import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { generateToken, hashToken, expiresIn } from '@/lib/token';
import { sendNotification, verifyEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`register:${clientIp(req)}`, 5, 15 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many signups from this IP' }, { status: 429 });

  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const exists = await User.findOne({ email: data.email.toLowerCase() });
    if (exists) return NextResponse.json({ ok: false, error: 'Email already registered' }, { status: 400 });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const token = generateToken();
    const u = await User.create({
      ...data,
      email: data.email.toLowerCase(),
      passwordHash,
      verifyToken: hashToken(token),
      verifyTokenExpires: expiresIn(24),
    });

    const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    await sendNotification('Verify your KVL email', verifyEmail(u.name, `${site}/verify-email?token=${token}`), u.email);

    return NextResponse.json({ ok: true, id: u._id, message: 'Check your email to verify your account.' });
  } catch (e) {
    return apiError(e);
  }
}
