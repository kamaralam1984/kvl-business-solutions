import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { sendNotification } from '@/lib/email';
import { sendFollowUpWhatsApp } from '@/lib/whatsapp';
import { requireCronAuth } from '@/lib/cron-auth';

const GOOGLE_REVIEW_URL = process.env.GOOGLE_REVIEW_URL || 'https://g.page/r/kvlbusinesssolutions/review';

export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  await connectDB();

  // Find leads won 7 days ago that haven't received a review request
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60_000);
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60_000);

  const leads = await Lead.find({
    status: 'won',
    reviewRequestSent: { $ne: true },
    updatedAt: { $gte: eightDaysAgo, $lte: sevenDaysAgo },
    email: { $not: /^(chat_|callback_)/ },
  }).limit(20).lean();

  let sent = 0;
  for (const lead of leads) {
    const l = lead as any;
    try {
      // Email review request
      const html = `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:20px">
          <h2 style="color:#3b82f6">Shukriya ${l.name} ji! 🙏</h2>
          <p>Aapne KVL Business Solutions ko choose kiya — yeh hamare liye bahut khushi ki baat hai!</p>
          <p>Agar aapka experience accha raha ho, to kya aap <strong>1 minute</strong> mein hamare liye Google Review de sakte hain?</p>
          <p style="background:#fef3c7;padding:12px;border-radius:8px;color:#92400e">
            ⭐ Aapka ek review hazaron logon ko sahi decision lene mein madad karta hai!
          </p>
          <a href="${GOOGLE_REVIEW_URL}"
             style="display:inline-block;background:#f59e0b;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;font-size:16px">
            ⭐ Google Review Dein →
          </a>
          <p style="color:#64748b;font-size:12px;margin-top:24px">
            Koi problem ho to hamare se contact karein: +91 99420 00413<br>
            KVL Business Solutions
          </p>
        </div>`;
      await sendNotification(`${l.name} ji — Aapka feedback bahut important hai! ⭐`, html, l.email);

      // WhatsApp review request
      await sendFollowUpWhatsApp({
        name: l.name, phone: l.phone,
        service: `[Google Review Request] Kya aap 1 min mein review de sakte hain? ${GOOGLE_REVIEW_URL}`,
      });

      await Lead.findByIdAndUpdate(l._id, { reviewRequestSent: true });
      sent++;
    } catch (e) {
      console.error(`[review-request] Error for ${l._id}:`, e);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
