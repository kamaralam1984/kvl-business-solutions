import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Workflow } from '@/lib/models/Workflow';
import { requireAdmin } from '@/lib/admin-guard';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const data = await req.json();
  await connectDB();
  const w = await Workflow.findByIdAndUpdate(params.id, { $set: data }, { new: true });
  return NextResponse.json({ ok: true, workflow: w });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await Workflow.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
