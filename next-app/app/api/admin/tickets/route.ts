import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/lib/models/Ticket';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const tickets = await Ticket.find({}).sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ ok: true, tickets });
  } catch (e) {
    return apiError(e);
  }
}
