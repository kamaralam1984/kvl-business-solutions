import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Coupon } from '@/lib/models/Coupon';
import { requireCronAuth } from '@/lib/cron-auth';
import { logCronRun } from '@/lib/cron-log';

// Deactivate coupons past their validUntil
export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;

  try {
    await connectDB();
    // validUntil is a bare date (midnight UTC of the chosen day) — a coupon
    // should stay active through the whole of that day, so compare against
    // today's midnight rather than the current instant (see evaluateCoupon
    // in lib/models/Coupon.ts for the same fix on the request-time check).
    const todayMidnightUTC = new Date();
    todayMidnightUTC.setUTCHours(0, 0, 0, 0);
    const result = await Coupon.updateMany(
      { validUntil: { $lt: todayMidnightUTC }, active: true },
      { $set: { active: false } }
    );
    await logCronRun('expire-coupons', 'success', `Deactivated ${result.modifiedCount} coupon(s)`);
    return NextResponse.json({ ok: true, deactivated: result.modifiedCount });
  } catch (e: any) {
    await logCronRun('expire-coupons', 'error', 'Run failed', e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
