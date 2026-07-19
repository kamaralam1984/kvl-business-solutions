import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { AnalyticsEvent } from '@/lib/models/AnalyticsEvent';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// First-party event sink for components/analytics/track.ts. Public and
// unauthenticated by design (it's called from anonymous visitors' browsers),
// so it's kept deliberately narrow: a capped event-name length, a small
// params payload limit, and a per-IP rate limit generous enough for normal
// browsing (dozens of CTA/scroll events per session) but too tight to be
// useful as a DB-filling vector.
const schema = z.object({
  name: z.string().min(1).max(60).regex(/^[a-z0-9_]+$/i, 'Event name must be alphanumeric/underscore'),
  path: z.string().max(300).optional().default(''),
  params: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`event:${clientIp(req)}`, 60, 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false }, { status: 429 });

  try {
    const data = schema.parse(await req.json());
    await connectDB();
    await AnalyticsEvent.create({
      name: data.name,
      path: data.path.slice(0, 300),
      params: data.params,
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Never let a malformed beacon surface an error to the visitor's browser.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
