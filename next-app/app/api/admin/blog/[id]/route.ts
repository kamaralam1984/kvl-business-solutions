import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { BlogPost } from '@/lib/models/BlogPost';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';
import { submitToIndexNow } from '@/lib/indexnow';

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().min(10).optional(),
  publishedAt: z.string().min(4).optional(),
  updatedAt: z.string().optional(),
  author: z.string().optional(),
  category: z.string().min(2).optional(),
  readingTimeMinutes: z.number().int().positive().optional(),
  body: z.array(z.object({ heading: z.string(), content: z.string() })).optional(),
  relatedServiceSlugs: z.array(z.string()).optional(),
  relatedIndustrySlugs: z.array(z.string()).optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  seo: z.object({ title: z.string(), description: z.string() }).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  try {
    const data = updateSchema.parse(await req.json());
    await connectDB();
    const post = await BlogPost.findByIdAndUpdate(params.id, data, { new: true });
    if (!post) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    logActivity({ action: 'blog.update', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'BlogPost', targetId: params.id, details: { title: post.title }, req });
    submitToIndexNow([`/blog/${post.slug}`]);
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  await BlogPost.findByIdAndDelete(params.id);
  logActivity({ action: 'blog.delete', actorEmail: g.session?.user?.email || undefined, actorRole: 'admin', target: 'BlogPost', targetId: params.id, req });
  return NextResponse.json({ ok: true });
}
