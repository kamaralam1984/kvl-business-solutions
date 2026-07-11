import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { connectDB } from '@/lib/mongodb';
import { Workflow } from '@/lib/models/Workflow';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const workflows = await Workflow.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, workflows });
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = await req.json();
    await connectDB();
    const w = await Workflow.create(data);
    return NextResponse.json({ ok: true, workflow: w });
  } catch (e) {
    return apiError(e);
  }
}
