import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Course } from '@/lib/models/Course';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

const schema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  title: z.string().min(3),
  description: z.string().min(10),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  category: z.string().min(2),
  duration: z.string().min(1),
  icon: z.string().default('BookOpen'),
  c1: z.string().default('#3b82f6'),
  c2: z.string().default('#1d4ed8'),
  lessons: z.array(z.object({ id: z.string(), title: z.string(), duration: z.string(), content: z.string() })).default([]),
});

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const courses = await Course.find({}).sort({ _id: -1 }).lean();
    return NextResponse.json({ ok: true, courses });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const course = await Course.create(data);
    logActivity({ action: 'course.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'Course', targetId: course._id.toString(), details: { title: data.title }, req });
    return NextResponse.json({ ok: true, course });
  } catch (e) {
    return apiError(e);
  }
}
