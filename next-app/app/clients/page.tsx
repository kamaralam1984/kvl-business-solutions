import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MessageSquarePlus } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Testimonials } from '@/components/home/Testimonials';
import { getLiveCaseStudies } from '@/lib/data/live-case-studies';
import { JsonLd } from '@/components/shared/JsonLd';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Clients & Testimonials — KVL Business Solutions';
const description = 'See what businesses across healthcare, education, manufacturing, and retail say about working with KVL Business Solutions — verified reviews, not written by us.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/clients` },
  openGraph: { title, description, url: `${SITE}/clients`, type: 'website' },
};

export default async function ClientsPage() {
  const caseStudies = (await getLiveCaseStudies()).slice(0, 4);

  await connectDB();
  const approvedReviews = await Review.find({ approved: true }).select('name rating message').lean();
  const reviewCount = approvedReviews.length;
  const ratingValue = reviewCount > 0
    ? Math.round((approvedReviews.reduce((s: number, r: any) => s + r.rating, 0) / reviewCount) * 10) / 10
    : 0;

  // Attaches aggregateRating/review to the SAME Organization node the root
  // layout already declares (matching @id), instead of redeclaring name/url
  // with a second, partial Organization object — the redeclaration was
  // technically a second, conflicting definition of the same entity.
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    ...(reviewCount > 0 ? {
      aggregateRating: { '@type': 'AggregateRating', ratingValue, reviewCount },
      review: approvedReviews.slice(0, 10).map((r: any) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.name },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
        reviewBody: r.message,
      })),
    } : {}),
  };

  return (
    <>
      {reviewCount > 0 && <JsonLd data={orgJsonLd} id="clients-jsonld" />}
      <PageHero eyebrow="OUR CLIENTS" title="Client" accent="Reviews" description="Verified reviews from real customers — nothing here is written by us." breadcrumb="Clients" />
      <Testimonials />

      {caseStudies.length > 0 && (
        <section className="section pt-0">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="eyebrow mb-4 block">The proof</span>
              <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
                Real products, live right now —<br />
                <span style={{ color: '#c8a870' }}>not screenshots, not mockups.</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {caseStudies.map(s => (
                <Link key={s.slug} href={`/projects/${s.slug}`} className="card-premium overflow-hidden group block">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <Image
                      src={s.images.hero}
                      alt={`${s.name} preview`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.3)', backdropFilter: 'blur(6px)' }}>
                      Live
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#a3814f' }}>{s.industry}</span>
                    <h3 className="font-display font-bold text-base mt-1.5 mb-4">{s.name}</h3>
                    <div className="flex items-center justify-between pt-3 border-t border-tint">
                      <span className="text-[12.5px] font-semibold" style={{ color: '#c8a870' }}>View Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" style={{ color: '#c8a870' }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/projects" className="text-sm font-semibold" style={{ color: '#c8a870' }}>
                See the full project portfolio →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section pt-0">
        <div className="container">
          <div className="max-w-xl mx-auto text-center card-premium p-8">
            <MessageSquarePlus className="w-7 h-7 mx-auto mb-3" style={{ color: '#c8a870' }} />
            <h3 className="font-display font-bold text-lg mb-2">Already a KVL client?</h3>
            <p className="text-text2 text-sm mb-5">Your review goes through manual approval before it appears here — no exceptions, including for good ones.</p>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] transition-all duration-200"
              style={{ background: '#0a0a0a', color: '#ffffff' }}
            >
              Share your experience
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
