import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/lib/models/Job';
import { requireAdmin } from '@/lib/admin-guard';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const data = await req.json();
  await connectDB();
  const j = await Job.findByIdAndUpdate(params.id, { $set: data }, { new: true });
  return NextResponse.json({ ok: true, job: j });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await Job.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
