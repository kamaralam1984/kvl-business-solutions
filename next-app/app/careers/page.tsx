import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/lib/models/Job';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { MapPin, Briefcase, Clock, ArrowRight, Sparkles } from 'lucide-react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Careers — Join KVL Business Solutions';
const description = 'Join a fast-growing enterprise technology company building real software used by hospitals, schools, and businesses across India. Explore open roles in engineering, design, and sales.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/careers` },
  openGraph: { title, description, url: `${SITE}/careers`, type: 'website' },
};
export default async function CareersPage() {
  let jobs: any[] = [];
  try {
    await connectDB();
    jobs = await Job.find({ active: true })
      .select('title department location remote type experience salary slug createdAt')
      .sort({ createdAt: -1 })
      .lean();
  } catch {}

  const depts = [...new Set(jobs.map(j => j.department))];

  return (
    <>
      <PageHero
        eyebrow="JOIN US"
        title="Build the future of"
        accent="Indian business tech"
        description="We're growing fast. Join engineers, designers and business strategists building enterprise software used by hospitals, schools and businesses across India."
        breadcrumb="Careers"
      />

      <section className="section">
        <div className="container max-w-4xl">
          {/* Perks */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: '🚀', title: 'Fast-growing', desc: 'Be part of something big' },
              { icon: '🏆', title: 'Top pay', desc: 'Above-market salaries' },
              { icon: '💪', title: 'Real impact', desc: 'Your code runs in production, not a demo' },
              { icon: '🌍', title: 'Hybrid work', desc: 'Patna HQ + remote' },
              { icon: '📚', title: 'Learning budget', desc: '₹50k/yr for courses' },
              { icon: '❤️', title: 'Health insurance', desc: 'Family coverage' },
            ].map(p => (
              <div key={p.title} className="card-base p-4">
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="font-bold">{p.title}</div>
                <div className="text-xs text-text2 mt-1">{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Open positions */}
          <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary" /> Open positions ({jobs.length})</h2>
          <p className="text-text2 text-sm mb-6">All roles offer competitive salary, equity, hybrid work, and a real chance to shape India&apos;s business technology landscape.</p>

          {jobs.length === 0 ? (
            <div className="card-base p-10 text-center">
              <p className="text-text2 mb-3">No open positions right now — but we&apos;re always looking for great talent.</p>
              <Link href="/contact" className="btn btn-primary">Send us your resume</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(j => (
                <Link key={j._id.toString()} href={`/careers/${j.slug}`} className="card-base p-5 block hover:bg-primary/5 hover:shadow-card-hover transition-all group">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base group-hover:text-primary">{j.title}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">{j.department}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-text2 mt-2">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {j.location}{j.remote && ' · Remote OK'}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {j.type}</span>
                        {j.experience && <span>{j.experience}</span>}
                        {j.salary && <span>💰 {j.salary}</span>}
                      </div>
                    </div>
                    <span className="text-primary font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Apply <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="card-base p-5 mt-8 surface-tint">
            <h3 className="font-bold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Practice for your interview</h3>
            <p className="text-text2 text-sm mb-3">Use our AI Mock Interview tool to prepare. Free for everyone.</p>
            <Link href="/mock-interview" className="btn btn-primary">Try AI Mock Interview</Link>
          </div>
        </div>
      </section>

      <CtaBanner title="Don't see your dream role?" desc="We're always hiring exceptional people. Send your CV and we'll find a fit." />
    </>
  );
}
