import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { sendNotification } from '@/lib/email';
import { requireCronAuth } from '@/lib/cron-auth';
import { logCronRun } from '@/lib/cron-log';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Email customers who started checkout but didn't pay 24h ago
export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  try {
    await connectDB();

    const now = new Date();
    const start = new Date(now.getTime() - 25 * 60 * 60 * 1000); // 25h ago
    const end = new Date(now.getTime() - 24 * 60 * 60 * 1000);   // 24h ago

    const abandoned = await Order.find({
      status: 'created',
      createdAt: { $gte: start, $lt: end },
    }).lean();

    let sent = 0;
    for (const o of abandoned as any[]) {
      const link = `${SITE}/checkout?product=${o.productSlug}&host=${o.hosting}`;
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h2>Forgot something? 🛒</h2>
          <p>Hi ${o.billing?.name || 'there'}, you started checking out <b>${o.productName}</b> yesterday but didn't complete the payment.</p>
          <p>Use code <b>COMEBACK10</b> for 10% off — valid for next 48 hours.</p>
          <p><a href="${link}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Complete Purchase</a></p>
          <p style="font-size:12px;color:#64748b">Need help? Reply to this email or WhatsApp +91 99420 00413.</p>
        </div>`;
      await sendNotification(`Complete your KVL ${o.productName} purchase`, html, o.email);
      sent++;
    }

    await logCronRun('abandoned-orders', 'success', `Emailed ${sent} of ${abandoned.length} candidate(s)`);
    return NextResponse.json({ ok: true, candidates: abandoned.length, sent });
  } catch (e: any) {
    await logCronRun('abandoned-orders', 'error', 'Run failed', e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
