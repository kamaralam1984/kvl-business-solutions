import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { BlogPost } from '@/lib/models/BlogPost';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { submitToIndexNow } from '@/lib/indexnow';

const schema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  publishedAt: z.string().min(4),
  updatedAt: z.string().optional(),
  author: z.string().optional(),
  category: z.string().min(2),
  readingTimeMinutes: z.number().int().positive().default(5),
  body: z.array(z.object({ heading: z.string(), content: z.string() })).default([]),
  relatedServiceSlugs: z.array(z.string()).default([]),
  relatedIndustrySlugs: z.array(z.string()).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  seo: z.object({ title: z.string(), description: z.string() }),
});

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    await connectDB();
    const posts = await BlogPost.find({}).sort({ publishedAt: -1 }).lean();
    return NextResponse.json({ ok: true, posts });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const post = await BlogPost.create(data);
    logActivity({ action: 'blog.create', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'BlogPost', targetId: post._id.toString(), details: { title: data.title }, req });
    submitToIndexNow([`/blog/${post.slug}`]);
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return apiError(e);
  }
}
