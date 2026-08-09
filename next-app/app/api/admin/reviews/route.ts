import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ ok: true, reviews });
  } catch (e) {
    return apiError(e);
  }
}
