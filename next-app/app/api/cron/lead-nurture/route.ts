import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { chatRouted } from '@/lib/ai/router';
import { sendNotification } from '@/lib/email';
import { requireCronAuth } from '@/lib/cron-auth';
import { logCronRun } from '@/lib/cron-log';

// Weekly AI-generated nurture email for leads not yet converted
async function generateNurtureEmail(lead: any): Promise<string> {
  const service = lead.service || 'business software';
  const result = await chatRouted({
    messages: [{
      role: 'user',
      content: `Write a short nurture email in Hindi+English mix (Hinglish) for a business lead named "${lead.name}" who is interested in "${service}".
Company: KVL Business Solutions (Indian enterprise software).
Email should be warm, helpful, 3-4 short paragraphs. Include: one useful business tip related to their industry, soft CTA for free demo.
Return ONLY the HTML email body (no subject line).`,
    }],
    system: 'You are an expert Indian B2B email marketer. Write warm, helpful Hinglish emails that feel personal and provide value. No spam language.',
    maxTokens: 500,
    temperature: 0.8,
  });
  return result.reply;
}

export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  try {
    await connectDB();

    // Find leads: new/contacted, followUp done, not emailed in 7 days, not won/lost
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60_000);
    const leads = await Lead.find({
      status: { $in: ['new', 'contacted', 'qualified'] },
      email: { $not: /^(chat_|callback_)/ }, // skip auto-generated emails
      $or: [
        { lastNurtureAt: { $exists: false } },
        { lastNurtureAt: { $lte: sevenDaysAgo } },
      ],
      nurtureCount: { $lt: 8 }, // max 8 nurture emails (2 months)
    }).limit(10).lean();

    let sent = 0;
    for (const lead of leads) {
      try {
        const html = await generateNurtureEmail(lead);
        const subject = `${lead.name} ji — Aapke business ke liye ek helpful tip 💡`;
        await sendNotification(subject, html, (lead as any).email);
        await Lead.findByIdAndUpdate((lead as any)._id, {
          $set: { lastNurtureAt: new Date() },
          $inc: { nurtureCount: 1 },
        });
        sent++;
        // Small delay between emails
        await new Promise(r => setTimeout(r, 2000));
      } catch (e) {
        console.error(`[nurture] Error for ${(lead as any)._id}:`, e);
      }
    }

    await logCronRun('lead-nurture', 'success', `Sent ${sent} of ${leads.length} candidate(s)`);
    return NextResponse.json({ ok: true, sent });
  } catch (e: any) {
    await logCronRun('lead-nurture', 'error', 'Run failed', e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
