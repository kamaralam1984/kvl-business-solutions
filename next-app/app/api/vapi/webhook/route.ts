import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';

export async function POST(req: Request) {
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
        callRecordingUrl: message.recordingUrl || '',
        ...(status === 'completed' ? { status: 'contacted' } : {}),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[vapi webhook]', e);
    return NextResponse.json({ ok: true }); // always 200 to Vapi
  }
}
