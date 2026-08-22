import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = await req.json();
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(params.id, { $set: data }, { new: true });
    if (!booking) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'booking.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Booking', targetId: booking.email, details: data, req });
    return NextResponse.json({ ok: true, booking });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const booking = await Booking.findByIdAndDelete(params.id);
    logActivity({ action: 'booking.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Booking', targetId: booking?.email, req });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
