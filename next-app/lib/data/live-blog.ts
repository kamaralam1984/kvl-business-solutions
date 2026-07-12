import { blogPosts, type BlogPost as BlogPostType } from './blog';
import { connectDB } from '@/lib/mongodb';
import { BlogPost } from '@/lib/models/BlogPost';

function toPlain(doc: any): BlogPostType {
  const { _id, __v, ...rest } = doc;
  return rest as BlogPostType;
}

// Admin-created posts (DB) alongside the existing hand-written posts (static
// file) — DB wins on a slug collision, so admin can also override an existing
// post by reusing its slug.
export async function getLiveBlogPosts(): Promise<BlogPostType[]> {
  await connectDB();
  const dbPosts = await BlogPost.find({}).lean();
  const dbBySlug = new Map(dbPosts.map((d: any) => [d.slug, toPlain(d)]));

  const merged = blogPosts.map(p => dbBySlug.get(p.slug) || p);
  for (const [slug, post] of dbBySlug) {
    if (!blogPosts.some(p => p.slug === slug)) merged.push(post);
  }
  return merged;
}

export async function getLiveBlogPost(slug: string): Promise<BlogPostType | null> {
  await connectDB();
  const db = await BlogPost.findOne({ slug }).lean();
  if (db) return toPlain(db);
  return blogPosts.find(p => p.slug === slug) || null;
}
