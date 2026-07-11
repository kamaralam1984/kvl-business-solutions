import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { sendFollowUpWhatsApp } from '@/lib/whatsapp';
import { sendNotification } from '@/lib/email';
import { initiateCall } from '@/lib/vapi';
import { requireCronAuth } from '@/lib/cron-auth';

// Follow-up stages:
// 1 → call at 1hr
// 2 → email at 24hr
// 3 → final WhatsApp + call at 3 days
// 4 → done

async function runFollowUp(lead: any) {
  const stage = lead.followUpStage;

  // Skip if lead already won, lost, or done
  if (['won', 'lost'].includes(lead.status) || lead.followUpDone) return;

  try {
    if (stage === 1) {
      // Stage 1 → AI Call (Priya)
      if (process.env.VAPI_API_KEY && lead.callStatus === 'not_called') {
        const { callId } = await initiateCall({
          name: lead.name, phone: lead.phone,
          service: lead.service, leadId: lead._id.toString(),
        });
        await Lead.findByIdAndUpdate(lead._id, {
          callStatus: 'calling', callId, calledAt: new Date(),
          followUpStage: 2,
          followUpNextAt: new Date(Date.now() + 24 * 60 * 60_000), // 24hr
        });
        console.log(`[followup] Stage 1 call → ${lead.name} (${lead.phone})`);
      }

    } else if (stage === 2) {
      // Stage 2 → Email with brochure
      const html = `
        <div style="font-family:sans-serif;max-width:500px;margin:auto">
          <h2 style="color:#3b82f6">Namaste ${lead.name} ji! 🙏</h2>
          <p>KVL Business Solutions ki taraf se shukriya ki aapne humse contact kiya.</p>
          ${lead.service ? `<p>Aap <strong>${lead.service}</strong> mein interested hain — hamare paas perfect solution hai!</p>` : ''}
          <h3 style="color:#1d4ed8">Hamari Key Services:</h3>
          <ul>
            <li>📦 ERP Software — ₹49,999/yr (lifetime support)</li>
            <li>💰 Billing Software — ₹15,999</li>
            <li>📍 GPS Tracking — ₹2,999/vehicle</li>
            <li>🏫 School ERP — ₹29,999</li>
            <li>🤖 AI Business Suite — ₹89,999</li>
          </ul>
          <p style="background:#eff6ff;padding:12px;border-radius:8px;color:#1d4ed8">
            ✨ <strong>Free Demo + 7-Day Trial</strong> available — koi advance payment nahi!
          </p>
          <a href="https://kvlbusinesssolutions.com/book-demo"
             style="display:inline-block;background:#3b82f6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:12px">
            Free Demo Book Karein →
          </a>
          <p style="color:#64748b;font-size:12px;margin-top:20px">
            Call karein: +91 99420 00413<br>
            KVL Business Solutions | kvlbusinesssolutions.com
          </p>
        </div>`;
      await sendNotification(`KVL Solutions — ${lead.name} ji, aapke liye special offer! 🎁`, html, lead.email);
      await Lead.findByIdAndUpdate(lead._id, {
        followUpStage: 3,
        followUpNextAt: new Date(Date.now() + 2 * 24 * 60 * 60_000), // 2 more days = 3 days total
      });
      console.log(`[followup] Stage 2 email → ${lead.email}`);

    } else if (stage === 3) {
      // Stage 3 → Final WhatsApp + call
      await sendFollowUpWhatsApp({ name: lead.name, phone: lead.phone, service: lead.service });
      if (process.env.VAPI_API_KEY && lead.callStatus !== 'calling') {
        const { callId } = await initiateCall({
          name: lead.name, phone: lead.phone,
          service: lead.service, leadId: lead._id.toString(),
        });
        await Lead.findByIdAndUpdate(lead._id, {
          callStatus: 'calling', callId, calledAt: new Date(),
          followUpStage: 4, followUpDone: true,
        });
      } else {
        await Lead.findByIdAndUpdate(lead._id, { followUpStage: 4, followUpDone: true });
      }
      console.log(`[followup] Stage 3 final → ${lead.name}`);
    }
  } catch (e) {
    console.error(`[followup] Error for ${lead._id}:`, e);
  }
}

export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  await connectDB();
  const due = await Lead.find({
    followUpDone: { $ne: true },
    followUpNextAt: { $lte: new Date() },
    followUpStage: { $gte: 1, $lte: 3 },
    status: { $nin: ['won', 'lost'] },
  }).limit(20).lean();

  await Promise.allSettled(due.map(runFollowUp));
  return NextResponse.json({ ok: true, processed: due.length });
}
