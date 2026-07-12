import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Course } from '@/lib/models/Course';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  category: z.string().min(2).optional(),
  duration: z.string().min(1).optional(),
  icon: z.string().optional(),
  c1: z.string().optional(),
  c2: z.string().optional(),
  lessons: z.array(z.object({ id: z.string(), title: z.string(), duration: z.string(), content: z.string() })).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = updateSchema.parse(await req.json());
    await connectDB();
    const course = await Course.findByIdAndUpdate(params.id, data, { new: true });
    if (!course) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'course.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Course', targetId: params.id, details: { title: course.title }, req });
    return NextResponse.json({ ok: true, course });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await Course.findByIdAndDelete(params.id);
  logActivity({ action: 'course.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Course', targetId: params.id, req });
  return NextResponse.json({ ok: true });
}
