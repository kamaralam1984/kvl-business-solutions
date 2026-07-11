import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { hashToken, generateToken, expiresIn } from '@/lib/token';
import { sendNotification, verifyEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { z } from 'zod';

// Read-only check: does this token exist and is it still valid?
// Deliberately does NOT consume the token — email-client link-scanners
// (Outlook Safe Links, Gmail image proxies, etc.) pre-fetch GET links,
// which would otherwise burn a single-use token before the real user
// ever clicks anything.
export async function GET(req: Request) {
  const limit = rateLimit(`verify-check:${clientIp(req)}`, 20, 15 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many attempts, try again later' }, { status: 429 });

  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!token) return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 400 });

  await connectDB();
  const user = await User.findOne({
    verifyToken: hashToken(token),
    verifyTokenExpires: { $gt: new Date() },
  });
  if (!user) return NextResponse.json({ ok: false, error: 'Invalid or expired token' }, { status: 400 });

  return NextResponse.json({ ok: true });
}

const confirmSchema = z.object({ token: z.string().min(10) });
const resendSchema = z.object({ email: z.string().email() });

// Two actions share this endpoint, distinguished by request body shape:
//  - { token } — a real user action (button click) that actually consumes
//    the token: marks emailVerified true and clears verifyToken /
//    verifyTokenExpires so a repeat POST with the same token fails cleanly.
//  - { email } — resend a fresh verification email.
export async function POST(req: Request) {
  const limit = rateLimit(`verify:${clientIp(req)}`, 10, 15 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many attempts, try again later' }, { status: 429 });

  try {
    const body = await req.json();

    if (typeof body?.token === 'string') {
      const { token } = confirmSchema.parse(body);
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

    const { email } = resendSchema.parse(body);
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
  } catch (e) {
    return apiError(e);
  }
}
