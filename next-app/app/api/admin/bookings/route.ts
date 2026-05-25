import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const status = url.searchParams.get('status') || '';
  const filter: any = {};
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { phone: { $regex: q, $options: 'i' } }];
  if (status) filter.status = status;
  await connectDB();
  const bookings = await Booking.find(filter).sort({ createdAt: -1 }).limit(300).lean();
  const stats = {
    total: await Booking.countDocuments(),
    pending: await Booking.countDocuments({ status: 'pending' }),
    confirmed: await Booking.countDocuments({ status: 'confirmed' }),
    completed: await Booking.countDocuments({ status: 'completed' }),
    cancelled: await Booking.countDocuments({ status: 'cancelled' }),
  };
  return NextResponse.json({ ok: true, bookings, stats });
}
