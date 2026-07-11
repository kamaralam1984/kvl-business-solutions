import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/lib/models/Job';
import { requireAdmin } from '@/lib/admin-guard';

const schema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  department: z.string().default('Engineering'),
  location: z.string().default('Patna, India'),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']).default('Full-time'),
  remote: z.boolean().default(false),
  experience: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const jobs = await Job.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, jobs });
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const j = await Job.create(data);
    return NextResponse.json({ ok: true, job: j });
  } catch (e) {
    return apiError(e);
  }
}
