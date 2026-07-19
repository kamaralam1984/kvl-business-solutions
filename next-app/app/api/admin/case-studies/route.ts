import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { CaseStudy } from '@/lib/models/CaseStudy';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { submitToIndexNow } from '@/lib/indexnow';

const schema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  name: z.string().min(2),
  url: z.string().url(),
  tagline: z.string().min(3),
  industry: z.string().min(2),
  industrySlug: z.string().optional(),
  businessCategory: z.string().min(2),
  overview: z.string().min(10),
  heroImage: z.string().url(),
  challenge: z.object({ headline: z.string(), body: z.string() }),
  goals: z.array(z.string()).default([]),
  solution: z.object({
    headline: z.string(),
    body: z.string(),
    pillars: z.array(z.object({ title: z.string(), desc: z.string() })).default([]),
  }),
  keyFeatures: z.array(z.object({ icon: z.string(), title: z.string(), desc: z.string() })).default([]),
  tech: z.array(z.string()).default([]),
  benefits: z.array(z.object({ title: z.string(), desc: z.string() })).default([]),
  relatedServiceSlugs: z.array(z.string()).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  seo: z.object({ title: z.string(), description: z.string() }),
});

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const studies = await CaseStudy.find({}).sort({ _id: -1 }).lean();
  return NextResponse.json({ ok: true, studies });
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const study = await CaseStudy.create(data);
    logActivity({ action: 'case-study.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'CaseStudy', targetId: study._id.toString(), details: { name: data.name }, req });
    submitToIndexNow([`/projects/${study.slug}`]);
    return NextResponse.json({ ok: true, study });
  } catch (e) {
    return apiError(e);
  }
}
