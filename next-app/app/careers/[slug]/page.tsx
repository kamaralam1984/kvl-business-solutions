import { notFound } from 'next/navigation';
import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/lib/models/Job';
import { ApplicationForm } from './ApplicationForm';
import { ArrowLeft, MapPin, Briefcase, Clock, IndianRupee, Sparkles } from 'lucide-react';

export default async function JobPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const job: any = await Job.findOne({ slug: params.slug, active: true }).lean();
  if (!job) notFound();

  return (
    <div className="container py-10 max-w-4xl">
      <Link href="/careers" className="text-sm text-text2 hover:text-primary inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" /> All positions
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{job.department}</div>
          <h1 className="text-3xl font-extrabold mb-4">{job.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-text2 mb-6 pb-6 border-b border-tint">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}{job.remote && ' · Remote OK'}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
            {job.experience && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.experience}</span>}
            {job.salary && <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {job.salary}</span>}
          </div>

          {job.description && (
            <div className="mb-6">
              <h2 className="font-bold mb-2">About the role</h2>
              <p className="text-sm text-text2 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {job.responsibilities?.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold mb-2">What you&apos;ll do</h2>
              <ul className="space-y-1.5 text-sm">
                {job.responsibilities.map((r: string, i: number) => (
                  <li key={i} className="flex gap-2"><span className="text-primary">•</span> {r}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold mb-2">Requirements</h2>
              <ul className="space-y-1.5 text-sm">
                {job.requirements.map((r: string, i: number) => (
                  <li key={i} className="flex gap-2"><span className="text-primary">✓</span> {r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card-base p-5 surface-tint">
            <h3 className="font-bold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Want to practice for this interview?</h3>
            <p className="text-text2 text-sm mb-3">Use our AI mock interview tool — set the role to &quot;{job.title}&quot; and get realistic practice + feedback.</p>
            <Link href="/mock-interview" className="btn btn-ghost text-sm">Try AI Mock Interview →</Link>
          </div>
        </div>

        <aside>
          <div className="card-base p-5 sticky top-24">
            <h2 className="font-bold mb-4">Apply now</h2>
            <ApplicationForm jobSlug={job.slug} jobTitle={job.title} />
          </div>
        </aside>
      </div>
    </div>
  );
}
