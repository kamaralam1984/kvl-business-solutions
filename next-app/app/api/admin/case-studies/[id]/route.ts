import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { CaseStudy } from '@/lib/models/CaseStudy';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { submitToIndexNow } from '@/lib/indexnow';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  url: z.string().url().optional(),
  tagline: z.string().min(3).optional(),
  industry: z.string().min(2).optional(),
  industrySlug: z.string().optional(),
  businessCategory: z.string().min(2).optional(),
  overview: z.string().min(10).optional(),
  heroImage: z.string().url().optional(),
  challenge: z.object({ headline: z.string(), body: z.string() }).optional(),
  goals: z.array(z.string()).optional(),
  solution: z.object({
    headline: z.string(),
    body: z.string(),
    pillars: z.array(z.object({ title: z.string(), desc: z.string() })),
  }).optional(),
  keyFeatures: z.array(z.object({ icon: z.string(), title: z.string(), desc: z.string() })).optional(),
  tech: z.array(z.string()).optional(),
  benefits: z.array(z.object({ title: z.string(), desc: z.string() })).optional(),
  relatedServiceSlugs: z.array(z.string()).optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  seo: z.object({ title: z.string(), description: z.string() }).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = updateSchema.parse(await req.json());
    await connectDB();
    const study = await CaseStudy.findByIdAndUpdate(params.id, data, { new: true });
    if (!study) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'case-study.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'CaseStudy', targetId: params.id, details: { name: study.name }, req });
    submitToIndexNow([`/projects/${study.slug}`]);
    return NextResponse.json({ ok: true, study });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await CaseStudy.findByIdAndDelete(params.id);
  logActivity({ action: 'case-study.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'CaseStudy', targetId: params.id, req });
  return NextResponse.json({ ok: true });
}
