import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { sendNotification } from '@/lib/email';
import { requireCronAuth } from '@/lib/cron-auth';
import { logCronRun } from '@/lib/cron-log';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Email customers whose 1-year license expires in 7 days
export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  try {
    await connectDB();

    const now = new Date();
    const start = new Date(now); start.setDate(start.getDate() - 358); // ~358 days ago
    const end = new Date(now); end.setDate(end.getDate() - 357);       // ~357 days ago (7 days before 1-year mark)

    const expiring = await Order.find({
      status: 'paid',
      createdAt: { $gte: start, $lt: end },
    }).lean();

    let sent = 0;
    for (const o of expiring as any[]) {
      const renewLink = `${SITE}/checkout?product=${o.productSlug}&host=${o.hosting}`;
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h2>Hi ${o.billing?.name || 'there'} 👋</h2>
          <p>Your <b>${o.productName}</b> license expires in 7 days (${new Date(new Date(o.createdAt).getTime() + 365 * 86400000).toLocaleDateString('en-IN')}).</p>
          <p><a href="${renewLink}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Renew Now</a></p>
          <p style="font-size:12px;color:#64748b">Renew before expiry to avoid service interruption. Reply to this email if you have questions.</p>
        </div>`;
      await sendNotification(`Your KVL ${o.productName} license expires in 7 days`, html, o.email);
      sent++;
    }

    await logCronRun('renewal-reminders', 'success', `Emailed ${sent} of ${expiring.length} candidate(s)`);
    return NextResponse.json({ ok: true, candidates: expiring.length, sent });
  } catch (e: any) {
    await logCronRun('renewal-reminders', 'error', 'Run failed', e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
