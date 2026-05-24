import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Coupon } from '@/lib/models/Coupon';
import { requireCronAuth } from '@/lib/cron-auth';

// Deactivate coupons past their validUntil
export async function GET(req: Request) {
  const unauth = requireCronAuth(req); if (unauth) return unauth;
  await connectDB();
  const result = await Coupon.updateMany(
    { validUntil: { $lt: new Date() }, active: true },
    { $set: { active: false } }
  );
  return NextResponse.json({ ok: true, deactivated: result.modifiedCount });
}
