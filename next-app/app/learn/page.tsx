import Link from 'next/link';
import { getLiveCourses } from '@/lib/data/live-courses';
import { PageHero } from '@/components/shared/PageHero';
import * as Icons from 'lucide-react';
import { BookOpen, Clock, GraduationCap, ArrowRight } from 'lucide-react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Smart Learning Engine — Free Business & Software Courses';
const description = 'Free video and text courses on business software, GST, sales and practical business skills from KVL Business Solutions — learn at your own pace, earn a certificate.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/learn` },
  openGraph: { title, description, url: `${SITE}/learn`, type: 'website' },
};

export default async function LearnPage() {
  const courses = await getLiveCourses();
  const cats = [...new Set(courses.map(c => c.category))];

  return (
    <>
      <PageHero
        eyebrow="LEARN"
        title="Smart Learning"
        accent="Engine"
        description="Free video + text courses on KVL software, business skills, GST, and sales. Earn certificates."
        breadcrumb="Learn"
      />

      <section className="section">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            {[
              { icon: GraduationCap, label: `${courses.length} courses`, color: '#3b82f6' },
              { icon: Clock, label: `${courses.reduce((s, c) => s + c.lessons.length, 0)} lessons`, color: '#22c55e' },
              { icon: BookOpen, label: 'Free forever', color: '#f97316' },
            ].map(s => (
              <div key={s.label} className="card-base p-5 text-center">
                <s.icon className="w-6 h-6 mx-auto mb-2" style={{ color: s.color }} />
                <div className="font-bold">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(c => {
              const Icon = (Icons as any)[c.icon] || BookOpen;
              return (
                <Link key={c.slug} href={`/learn/${c.slug}`} className="card-base overflow-hidden block group hover:shadow-card-hover transition-all">
                  <div className="h-32 relative grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }}>
                    <Icon className="w-14 h-14 opacity-90 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white">{c.level}</span>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-text2 mb-1">{c.category}</div>
                    <h3 className="font-bold text-base mb-1.5 group-hover:text-primary">{c.title}</h3>
                    <p className="text-xs text-text2 line-clamp-2 mb-3">{c.description}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-dashed border-tint text-xs">
                      <span className="text-text2">{c.lessons.length} lessons · {c.duration}</span>
                      <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Start <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
