import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLiveCourse, getLiveCourses } from '@/lib/data/live-courses';
import { ArrowLeft, Clock, GraduationCap, CheckCircle2, BookOpen } from 'lucide-react';

export const revalidate = 300;

export async function generateStaticParams() {
  const courses = await getLiveCourses();
  return courses.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = await getLiveCourse(params.slug);
  return { title: c ? `${c.title} — KVL Learn` : 'Course not found' };
}

function renderMd(content: string) {
  const blocks = content.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    const t = block.trim();
    if (t.startsWith('## ')) return <h3 key={i} className="text-lg font-bold mt-5 mb-2">{t.slice(3)}</h3>;
    if (t.startsWith('- ')) {
      const items = t.split('\n').map(l => l.replace(/^- /, ''));
      return <ul key={i} className="list-disc pl-5 space-y-1 my-2">{items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />)}</ul>;
    }
    if (/^\d+\.\s/.test(t)) {
      const items = t.split('\n').map(l => l.replace(/^\d+\.\s/, ''));
      return <ol key={i} className="list-decimal pl-5 space-y-1 my-2">{items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />)}</ol>;
    }
    return <p key={i} className="my-3 leading-7" dangerouslySetInnerHTML={{ __html: inline(t) }} />;
  });
}

function inline(s: string) {
  return s
    .replace(/`([^`]+)`/g, '<code class="surface-tint px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
}

export default async function CoursePage({ params, searchParams }: { params: { slug: string }; searchParams: { lesson?: string } }) {
  const course = await getLiveCourse(params.slug);
  if (!course) notFound();

  const activeId = searchParams.lesson || course.lessons[0].id;
  const lesson = course.lessons.find(l => l.id === activeId) || course.lessons[0];
  const idx = course.lessons.findIndex(l => l.id === activeId);

  return (
    <div className="container py-10 max-w-6xl">
      <Link href="/learn" className="text-sm text-text2 hover:text-primary inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" /> All courses
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="card-base p-5 h-fit lg:sticky lg:top-24">
          <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{course.category}</div>
          <h1 className="text-lg font-extrabold mb-2">{course.title}</h1>
          <div className="flex gap-3 text-xs text-text2 mb-4">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
            <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {course.level}</span>
          </div>

          <div className="text-xs uppercase tracking-wider text-text2 font-bold mb-2">Lessons ({course.lessons.length})</div>
          <ol className="space-y-1">
            {course.lessons.map((l, i) => (
              <li key={l.id}>
                <Link
                  href={`/learn/${course.slug}?lesson=${l.id}`}
                  className={`block px-3 py-2 rounded-lg text-sm hover:bg-primary/10 ${l.id === activeId ? 'bg-primary/15 text-primary font-semibold' : 'text-text2'}`}
                >
                  <span className="font-mono text-[10px] mr-2">{i + 1}.</span>
                  {l.title}
                  <div className="text-[10px] text-text2 mt-0.5 ml-5">{l.duration}</div>
                </Link>
              </li>
            ))}
          </ol>
        </aside>

        {/* Lesson content */}
        <article>
          <div className="text-xs text-text2 mb-1">Lesson {idx + 1} of {course.lessons.length}</div>
          <h2 className="text-3xl font-extrabold mb-1">{lesson.title}</h2>
          <div className="text-xs text-text2 mb-6 flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration}</div>

          <div className="text-sm">{renderMd(lesson.content)}</div>

          <div className="card-base p-5 mt-8 surface-tint">
            <CheckCircle2 className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-bold mb-1">Lesson complete?</h3>
            <p className="text-xs text-text2 mb-3">Mark this lesson as done and continue to the next one.</p>
            <div className="flex gap-2 flex-wrap">
              {idx > 0 && (
                <Link href={`/learn/${course.slug}?lesson=${course.lessons[idx - 1].id}`} className="btn btn-ghost text-xs">
                  ← Previous
                </Link>
              )}
              {idx < course.lessons.length - 1 ? (
                <Link href={`/learn/${course.slug}?lesson=${course.lessons[idx + 1].id}`} className="btn btn-primary">
                  Next lesson →
                </Link>
              ) : (
                <Link href="/learn" className="btn btn-primary">
                  Course complete! 🎉
                </Link>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
