import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MessageSquarePlus } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Testimonials } from '@/components/home/Testimonials';
import { getLiveCaseStudies } from '@/lib/data/live-case-studies';
import { JsonLd } from '@/components/shared/JsonLd';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { Badge, Button, Card, Panel, Section, SectionHeading } from '@/components/ui';

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

  // Reviews are optional: if the DB is unreachable, render the page with none instead of crashing.
  let approvedReviews: any[] = [];
  try {
    await connectDB();
    approvedReviews = await Review.find({ approved: true }).select('name rating message').lean();
  } catch (e) {
    console.error('ClientsPage: reviews unavailable', (e as Error)?.message);
  }
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
        <Section>
          <SectionHeading
            align="center"
            eyebrow="The proof"
            title={<>Real products, live right now —<br /><span className="text-gold-text">not screenshots, not mockups.</span></>}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {caseStudies.map(s => (
              <Link key={s.slug} href={`/projects/${s.slug}`} className="group block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                <Card interactive className="h-full overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg2">
                    <Image
                      src={s.images.hero}
                      alt={`${s.name} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain transition-transform duration-slow ease-brand motion-safe:group-hover:scale-105"
                    />
                    <Badge className="absolute left-3 top-3">Live</Badge>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold-text">{s.industry}</span>
                    <h3 className="mb-4 mt-1.5 font-display text-base font-bold text-text">{s.name}</h3>
                    <div className="flex items-center justify-between border-t border-line pt-3">
                      <span className="text-sm font-semibold text-gold-text">View Case Study</span>
                      <ArrowUpRight className="h-4 w-4 text-gold-text transition-transform duration-base motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/projects" className="inline-flex min-h-[44px] items-center rounded-btn text-sm font-semibold text-gold-text hover:underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
              See the full project portfolio →
            </Link>
          </div>
        </Section>
      )}

      <Section tone="alt">
        <Panel className="mx-auto max-w-xl p-8 text-center">
          <MessageSquarePlus className="mx-auto mb-3 h-7 w-7 text-gold-text" aria-hidden />
          <h3 className="mb-2 font-display text-card-title text-text">Already a KVL client?</h3>
          <p className="mb-5 text-text2">Your review goes through manual approval before it appears here — no exceptions, including for good ones.</p>
          <Button href="/reviews">
            Share your experience
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Button>
        </Panel>
      </Section>
    </>
  );
}
