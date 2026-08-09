import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { VisitCounter } from '@/lib/models/VisitCounter';
import { VisitDailyLog } from '@/lib/models/VisitDailyLog';
import { requireAdmin } from '@/lib/admin-guard';

const BASE = 100010;

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();

    const totalDoc = await VisitCounter.findOne({ key: 'total' }).lean<{ count: number }>();
    const total = BASE + (totalDoc?.count || 0);

    // Last 30 days, gaps filled with 0 so the chart has no missing dates.
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    const logs = await VisitDailyLog.find({ date: { $in: days } }).lean();
    const byDate = new Map(logs.map((l: any) => [l.date, l.count]));
    const daily = days.map(date => ({ date, count: byDate.get(date) || 0 }));

    const last7 = daily.slice(-7).reduce((s, d) => s + d.count, 0);
    const last30 = daily.reduce((s, d) => s + d.count, 0);

    return NextResponse.json({ ok: true, total, daily, last7, last30 });
  } catch (e) {
    return apiError(e);
  }
}
