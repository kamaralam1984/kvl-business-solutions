import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { ChatLog } from '@/lib/models/ChatLog';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();

    const logs = await ChatLog.find({}).sort({ lastMessageAt: -1 }).limit(100).lean();
    const total = await ChatLog.countDocuments({});
    const leadCapturedCount = await ChatLog.countDocuments({ leadCaptured: true });

    return NextResponse.json({ ok: true, logs, total, leadCapturedCount });
  } catch (e) {
    return apiError(e);
  }
}
