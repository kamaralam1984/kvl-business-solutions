import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CronLog } from '@/lib/models/CronLog';
import { requireAdmin } from '@/lib/admin-guard';

const JOBS = [
  { job: 'lead-followup', schedule: 'Every 30 minutes' },
  { job: 'lead-nurture', schedule: 'Weekly — Sunday 10am' },
  { job: 'review-request', schedule: 'Daily 9am' },
  { job: 'abandoned-orders', schedule: 'Hourly' },
  { job: 'renewal-reminders', schedule: 'Daily 9:30am' },
  { job: 'workflow-triggers', schedule: 'Daily 8am' },
  { job: 'expire-coupons', schedule: 'Daily midnight' },
];

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();

  const jobs = await Promise.all(JOBS.map(async ({ job, schedule }) => {
    const recent = await CronLog.find({ job }).sort({ ranAt: -1 }).limit(5).lean();
    return {
      job,
      schedule,
      lastRun: recent[0] || null,
      history: recent,
    };
  }));

  return NextResponse.json({ ok: true, jobs });
}
