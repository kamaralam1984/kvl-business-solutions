import { blogPosts, type BlogPost as BlogPostType } from './blog';
import { connectDB } from '@/lib/mongodb';
import { BlogPost } from '@/lib/models/BlogPost';

function toPlain(doc: any): BlogPostType {
  const { _id, __v, ...rest } = doc;
  return rest as BlogPostType;
}

// Admin-created posts (DB) alongside the existing hand-written posts (static
// file) — DB wins on a slug collision, so admin can also override an existing
// post by reusing its slug. Cached with the same 30s TTL as getSiteSettings()
// to avoid a fresh DB round-trip on every request.
let cache: { data: BlogPostType[]; ts: number } | null = null;
const TTL = 30_000;

export async function getLiveBlogPosts(): Promise<BlogPostType[]> {
  if (cache && Date.now() - cache.ts < TTL) return cache.data;

  await connectDB();
  const dbPosts = await BlogPost.find({}).lean();
  const dbBySlug = new Map(dbPosts.map((d: any) => [d.slug, toPlain(d)]));

  const merged = blogPosts.map(p => dbBySlug.get(p.slug) || p);
  for (const [slug, post] of dbBySlug) {
    if (!blogPosts.some(p => p.slug === slug)) merged.push(post);
  }
  cache = { data: merged, ts: Date.now() };
  return merged;
}

export async function getLiveBlogPost(slug: string): Promise<BlogPostType | null> {
  await connectDB();
  const db = await BlogPost.findOne({ slug }).lean();
  if (db) return toPlain(db);
  return blogPosts.find(p => p.slug === slug) || null;
}
