import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Subscriber } from '@/lib/models/Subscriber';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({ ok: true, subscribers });
  } catch (e) {
    return apiError(e);
  }
}
