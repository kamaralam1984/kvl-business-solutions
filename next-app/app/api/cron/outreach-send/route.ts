import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { OutreachCampaign } from '@/lib/models/OutreachCampaign';
import { OutreachProspect } from '@/lib/models/OutreachProspect';
import { getSiteSettings } from '@/lib/models/SiteSettings';
import { PortfolioPDF } from '@/lib/pdf/portfolio';
import { renderPdfBuffer } from '@/lib/pdf/render';
import { draftOutreachEmail, OUTREACH_FOOTER } from '@/lib/ai/outreach-agent';
import { sendCustomEmail } from '@/lib/email';
import { requireCronAuth } from '@/lib/cron-auth';
import { logCronRun } from '@/lib/cron-log';

// Auto-sends the first AI-personalized pitch (portfolio PDF attached) to
// pending prospects on any campaign that has opted into autoSend. This is
// real unsolicited cold email — dailySendLimit per campaign per run caps
// blast size, and a 2s gap between sends avoids looking like a mail blast.
export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  try {
    await connectDB();

    const campaigns = await OutreachCampaign.find({ autoSend: true, status: 'active', channel: 'email' }).lean();
    if (campaigns.length === 0) {
      await logCronRun('outreach-send', 'success', 'No active auto-send campaigns');
      return NextResponse.json({ ok: true, sent: 0 });
    }

    const settings = await getSiteSettings();
    const pdfBuffer = await renderPdfBuffer(await PortfolioPDF({ settings }));
    const replyTo = process.env.OUTREACH_REPLY_TO_EMAIL || undefined;

    let sent = 0;
    let failed = 0;

    for (const campaign of campaigns) {
      const limit = (campaign as any).dailySendLimit || 15;
      const prospects = await OutreachProspect.find({
        campaignId: (campaign as any)._id,
        status: { $in: ['pending', 'drafted'] },
        email: { $exists: true, $ne: '' },
      }).limit(limit).lean();

      for (const prospect of prospects) {
        try {
          const { subject, body } = await draftOutreachEmail(
            { name: (prospect as any).name, company: (prospect as any).company },
            (campaign as any).bodyTemplate
          );
          const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;white-space:pre-wrap">${body}</div>${OUTREACH_FOOTER}`;

          const result = await sendCustomEmail({
            to: (prospect as any).email,
            subject,
            html,
            replyTo,
            attachments: [{ filename: 'KVL-Portfolio.pdf', content: pdfBuffer }],
          });

          if (result.ok) {
            await OutreachProspect.findByIdAndUpdate((prospect as any)._id, {
              $set: { status: 'sent', lastContactedAt: new Date(), pitchSubject: subject },
              $push: { conversation: { role: 'assistant', body, at: new Date() } },
            });
            sent++;
          } else {
            failed++;
          }
        } catch (e) {
          console.error(`[outreach-send] Error for prospect ${(prospect as any)._id}:`, e);
          failed++;
        }
        // Small delay between sends — same pattern as cron/lead-nurture.
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    await logCronRun('outreach-send', 'success', `Sent ${sent}, failed ${failed}`);
    return NextResponse.json({ ok: true, sent, failed });
  } catch (e: any) {
    await logCronRun('outreach-send', 'error', 'Run failed', e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
