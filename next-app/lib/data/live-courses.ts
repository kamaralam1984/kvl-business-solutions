import { courses, type Course } from './courses';
import { connectDB } from '@/lib/mongodb';
import { Course as CourseModel } from '@/lib/models/Course';

function toPlain(doc: any): Course {
  const { _id, __v, ...rest } = doc;
  return rest as Course;
}

// Admin-created courses (DB) alongside the existing hand-written ones
// (static file) — DB wins on a slug collision. Cached with the same 30s TTL
// as getSiteSettings() to avoid a fresh DB round-trip on every request.
let cache: { data: Course[]; ts: number } | null = null;
const TTL = 30_000;

export async function getLiveCourses(): Promise<Course[]> {
  if (cache && Date.now() - cache.ts < TTL) return cache.data;

  await connectDB();
  const dbCourses = await CourseModel.find({}).lean();
  const dbBySlug = new Map(dbCourses.map((d: any) => [d.slug, toPlain(d)]));

  const merged = courses.map(c => dbBySlug.get(c.slug) || c);
  for (const [slug, course] of dbBySlug) {
    if (!courses.some(c => c.slug === slug)) merged.push(course);
  }
  cache = { data: merged, ts: Date.now() };
  return merged;
}

export async function getLiveCourse(slug: string): Promise<Course | null> {
  await connectDB();
  const db = await CourseModel.findOne({ slug }).lean();
  if (db) return toPlain(db);
  return courses.find(c => c.slug === slug) || null;
}
