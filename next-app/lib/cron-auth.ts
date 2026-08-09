import { NextResponse } from 'next/server';

// Require the CRON_SECRET bearer token — no fallback. The old "Vercel Cron
// user-agent" bypass trusted the User-Agent/x-vercel-cron headers, both of
// which are ordinary attacker-controlled request headers with no
// cryptographic proof behind them (and this app doesn't even run on Vercel
// in production — see project memory), so it was a standing unauthenticated
// bypass for every cron route. Fails closed if CRON_SECRET isn't set.
export function requireCronAuth(req: Request) {
  const authHeader = req.headers.get('authorization') || '';
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader === `Bearer ${secret}`) return null;

  return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}
