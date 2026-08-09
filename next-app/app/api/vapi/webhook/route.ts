import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { timingSafeEqual } from '@/lib/timing-safe-equal';

// Vapi sends this shared secret back in x-vapi-secret on every webhook call
// when the assistant was created with `serverUrlSecret` set (see
// lib/vapi.ts) — without it, this endpoint would accept an unauthenticated
// POST from anyone, letting them write arbitrary fields (including
// callRecordingUrl) onto any Lead by its (guessable/returned-to-caller) id.
// Fails closed: if the secret isn't configured at all, every request is
// rejected rather than trusted.
const VAPI_WEBHOOK_SECRET = process.env.VAPI_WEBHOOK_SECRET || '';

function safeRecordingUrl(url: unknown): string {
  if (typeof url !== 'string' || !url) return '';
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? url : '';
  } catch {
    return '';
  }
}

export async function POST(req: Request) {
  if (!VAPI_WEBHOOK_SECRET || !timingSafeEqual(VAPI_WEBHOOK_SECRET, req.headers.get('x-vapi-secret'))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { message } = body;
    if (!message) return NextResponse.json({ ok: true });

    const leadId = message.call?.metadata?.leadId;
    if (!leadId) return NextResponse.json({ ok: true });

    await connectDB();

    if (message.type === 'end-of-call-report') {
      const duration = Math.round((message.durationSeconds || 0));
      const status = message.endedReason === 'customer-ended-call' || message.endedReason === 'assistant-ended-call'
        ? 'completed'
        : message.endedReason === 'no-answer' || message.endedReason === 'voicemail'
          ? 'no_answer'
          : 'failed';

      await Lead.findByIdAndUpdate(leadId, {
        callStatus: status,
        callDuration: duration,
        // Rendered as a raw <a href> in Admin > Leads — only ever store a
        // real http(s) URL, never whatever scheme a caller sends.
        callRecordingUrl: safeRecordingUrl(message.recordingUrl),
        ...(status === 'completed' ? { status: 'contacted' } : {}),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[vapi webhook]', e);
    return NextResponse.json({ ok: true }); // always 200 to Vapi
  }
}
