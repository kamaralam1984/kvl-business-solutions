import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { OutreachCampaign } from '@/lib/models/OutreachCampaign';
import { OutreachProspect } from '@/lib/models/OutreachProspect';
import { OutreachInboxState } from '@/lib/models/OutreachInboxState';
import { fetchNewReplies } from '@/lib/outreach-imap';
import { draftNegotiationReply, OUTREACH_FOOTER } from '@/lib/ai/outreach-agent';
import { sendCustomEmail, sendNotification, outreachReadyEmail } from '@/lib/email';
import { requireCronAuth } from '@/lib/cron-auth';
import { logCronRun } from '@/lib/cron-log';

const TERMINAL_STATUSES = ['unsubscribed', 'bounced', 'meeting_booked'];

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Polls the shared reply inbox, matches each inbound message to a prospect
// on an autoSend campaign by sender email, and lets the AI negotiate: reply
// and keep the conversation going, or — if it looks ready to buy — email
// the owner with the full transcript instead of just replying.
export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  try {
    await connectDB();

    const state = (await OutreachInboxState.findById('main')) || new OutreachInboxState({ _id: 'main' });
    const { messages, newLastUid } = await fetchNewReplies(state.lastUid);
    state.lastUid = newLastUid;
    await state.save();

    if (messages.length === 0) {
      await logCronRun('outreach-check-replies', 'success', 'No new replies');
      return NextResponse.json({ ok: true, processed: 0 });
    }

    const autoCampaigns = await OutreachCampaign.find({ autoSend: true }).select('_id').lean();
    const campaignIds = autoCampaigns.map((c: any) => c._id);
    const replyTo = process.env.OUTREACH_REPLY_TO_EMAIL || undefined;

    let processed = 0;
    let unmatched = 0;

    for (const msg of messages) {
      if (!msg.from || !msg.text) { unmatched++; continue; }

      const prospectDoc: any = await OutreachProspect.findOne({
        campaignId: { $in: campaignIds },
        email: { $regex: `^${escapeRegex(msg.from)}$`, $options: 'i' },
      });
      if (!prospectDoc || TERMINAL_STATUSES.includes(prospectDoc.status)) { unmatched++; continue; }

      prospectDoc.conversation.push({ role: 'prospect', body: msg.text, at: new Date() });

      const negotiation = await draftNegotiationReply(
        prospectDoc.conversation.map((c: any) => ({ role: c.role, body: c.body })),
        { name: prospectDoc.name, company: prospectDoc.company }
      );

      if (negotiation.unsubscribe) {
        prospectDoc.status = 'unsubscribed';
        await sendCustomEmail({
          to: prospectDoc.email,
          subject: `Re: ${prospectDoc.pitchSubject || 'Following up'}`,
          html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">You've been removed from our list and won't hear from us again. Sorry for the interruption.</div>`,
          replyTo,
        });
        await prospectDoc.save();
        processed++;
        continue;
      }

      const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;white-space:pre-wrap">${negotiation.reply}</div>${OUTREACH_FOOTER}`;
      await sendCustomEmail({
        to: prospectDoc.email,
        subject: `Re: ${prospectDoc.pitchSubject || 'Following up'}`,
        html,
        replyTo,
      });
      prospectDoc.conversation.push({ role: 'assistant', body: negotiation.reply, at: new Date() });
      prospectDoc.status = negotiation.ready ? 'ready' : 'negotiating';

      if (negotiation.ready && !prospectDoc.readyNotifiedAt) {
        await sendNotification(
          `🔥 Ready to close: ${prospectDoc.name}${prospectDoc.company ? ` (${prospectDoc.company})` : ''}`,
          outreachReadyEmail({
            name: prospectDoc.name,
            company: prospectDoc.company,
            email: prospectDoc.email,
            readySummary: negotiation.readySummary || 'Prospect signaled buying intent.',
            conversation: prospectDoc.conversation,
            campaignId: prospectDoc.campaignId.toString(),
          })
        );
        prospectDoc.readyNotifiedAt = new Date();
      }

      await prospectDoc.save();
      processed++;
      await new Promise(r => setTimeout(r, 1500));
    }

    await logCronRun('outreach-check-replies', 'success', `Processed ${processed}, unmatched ${unmatched}`);
    return NextResponse.json({ ok: true, processed, unmatched });
  } catch (e: any) {
    await logCronRun('outreach-check-replies', 'error', 'Run failed', e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
