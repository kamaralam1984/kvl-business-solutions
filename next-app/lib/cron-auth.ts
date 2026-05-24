import { NextResponse } from 'next/server';

// Verify either Vercel Cron header OR CRON_SECRET bearer token
export function requireCronAuth(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const userAgent = req.headers.get('user-agent') || '';
  const secret = process.env.CRON_SECRET;

  // Vercel Cron sends a specific user agent and the deployment owner header
  const isVercelCron = userAgent === 'vercel-cron/1.0' || req.headers.get('x-vercel-cron') === '1';

  if (secret && authHeader === `Bearer ${secret}`) return null;
  if (isVercelCron) return null;

  return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}
