import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { VisitCounter } from '@/lib/models/VisitCounter';
import { VisitDailyLog } from '@/lib/models/VisitDailyLog';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// Displayed count starts from this base so the meter doesn't launch at zero.
const BASE = 100010;

// Read-only — used by pages that just need to display the current total
// without counting themselves as a new visit (e.g. a repeat call in the
// same tab session).
export async function GET(req: Request) {
  const limit = rateLimit(`visitor-count:${clientIp(req)}`, 30, 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  await connectDB();
  const doc = await VisitCounter.findOne({ key: 'total' }).lean<{ count: number }>();
  return NextResponse.json({ ok: true, count: BASE + (doc?.count || 0) });
}

// Increments the total — called once per new tab session (see VisitorCounter.tsx),
// so a page refresh within the same session doesn't inflate the count.
export async function POST(req: Request) {
  const limit = rateLimit(`visitor-count-inc:${clientIp(req)}`, 10, 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });

  await connectDB();
  const doc = await VisitCounter.findOneAndUpdate(
    { key: 'total' },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );

  const today = new Date().toISOString().slice(0, 10);
  VisitDailyLog.findOneAndUpdate({ date: today }, { $inc: { count: 1 } }, { upsert: true }).catch(() => {});

  return NextResponse.json({ ok: true, count: BASE + doc.count });
}
