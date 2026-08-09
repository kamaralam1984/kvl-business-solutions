import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Demo } from '@/lib/models/Demo';

// Public — only active demos
export async function GET() {
  try {
    await connectDB();
    const demos = await Demo.find({ active: true }).sort({ live: -1, order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, demos });
  } catch (e) {
    return apiError(e);
  }
}
