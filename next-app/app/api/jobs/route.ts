import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/lib/models/Job';

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find({ active: true }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, jobs });
  } catch (e) {
    return apiError(e);
  }
}
