import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/lib/models/Job';

export async function GET() {
  await connectDB();
  const jobs = await Job.find({ active: true }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, jobs });
}
