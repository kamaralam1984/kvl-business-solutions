import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { VipVisitor } from '@/lib/models/VipVisitor';
import { VipSession } from '@/lib/models/VipSession';
import { VipPageView } from '@/lib/models/VipPageView';
import { VipEvent, VIP_EVENT_TYPES } from '@/lib/models/VipEvent';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { classifyChannel } from '@/lib/vip/traffic-source';
import { parseDevice } from '@/lib/vip/device';
import { resolveGeo } from '@/lib/vip/geo';

const eventSchema = z.object({
  type: z.enum(VIP_EVENT_TYPES),
  path: z.string().max(300).optional(),
  ts: z.number(),
  payload: z.record(z.any()).optional(),
});

const schema = z.object({
  vid: z.string().min(8).max(100),
  sessionId: z.string().min(8).max(100),
  isNewSession: z.boolean().optional().default(false),
  referrer: z.string().max(500).optional(),
  utm: z.object({
    source: z.string().max(100).optional(),
    medium: z.string().max(100).optional(),
    campaign: z.string().max(100).optional(),
    term: z.string().max(100).optional(),
    content: z.string().max(100).optional(),
  }).optional(),
  events: z.array(eventSchema).min(1).max(50), // client SDK flushes at 20; 50 gives headroom
});

export async function POST(req: Request) {
  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 }); // never surface a beacon error to the visitor
  }

  const limit = rateLimit(`vip-events:${data.vid}`, 120, 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false }, { status: 429 });

  await connectDB();

  const now = new Date();
  const pageViewEvents = data.events.filter(e => e.type === 'page_view');
  const enteringPageViews = pageViewEvents.filter(e => !e.payload?.exiting);

  await VipVisitor.findOneAndUpdate(
    { vid: data.vid },
    {
      $setOnInsert: { firstSeenAt: now },
      $set: { lastSeenAt: now },
      $inc: { sessionCount: data.isNewSession ? 1 : 0, pageViewCount: enteringPageViews.length },
    },
    { upsert: true }
  );

  if (data.isNewSession) {
    const ua = req.headers.get('user-agent') || '';
    await VipSession.create({
      sessionId: data.sessionId,
      vid: data.vid,
      referrer: data.referrer,
      landingPage: enteringPageViews[0]?.path,
      pageViewCount: enteringPageViews.length,
      device: parseDevice(ua),
      utm: data.utm,
      channel: classifyChannel({ utm: data.utm, referrer: data.referrer }),
      geo: await resolveGeo(req.headers, clientIp(req)),
    });
  } else {
    await VipSession.findOneAndUpdate(
      { sessionId: data.sessionId },
      { $set: { lastActivityAt: now }, $inc: { pageViewCount: enteringPageViews.length } }
    );
  }

  // Entering page_view → open a new VipPageView. Exiting page_view (fired on
  // SPA route change or pagehide) → close the most recent still-open one for
  // this session+path.
  for (const e of pageViewEvents) {
    if (e.payload?.exiting) {
      const open = await VipPageView.findOne({ sessionId: data.sessionId, path: e.path, exitedAt: { $exists: false } }).sort({ enteredAt: -1 });
      if (open) {
        await VipPageView.updateOne({ _id: open._id }, {
          $set: {
            exitedAt: new Date(e.ts),
            timeOnPageSeconds: e.payload.timeOnPageSeconds || 0,
            scrollDepthPct: e.payload.scrollDepthPct || 0,
          },
        });
        await VipSession.updateOne({ sessionId: data.sessionId }, {
          $inc: { durationSeconds: e.payload.timeOnPageSeconds || 0 },
          $set: { exitPage: e.path },
        });
      }
    } else {
      await VipPageView.create({ sessionId: data.sessionId, vid: data.vid, path: e.path, enteredAt: new Date(e.ts) });
    }
  }

  if (data.events.length > 0) {
    await VipEvent.insertMany(
      data.events.map(e => ({ sessionId: data.sessionId, vid: data.vid, ts: new Date(e.ts), type: e.type, path: e.path, payload: e.payload })),
      { ordered: false }
    );
  }

  return NextResponse.json({ ok: true });
}
