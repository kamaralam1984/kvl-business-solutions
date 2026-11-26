import Link from 'next/link';
import { ArrowUpRight, MapPin, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { JsonLd } from '@/components/shared/JsonLd';
import { Card, Section, SectionHeading, buttonStyles } from '@/components/ui';
import { StripNote, iconTile } from '@/components/location-landing/shared';
import { indiaStatePages } from '@/lib/data/india-states';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Software Development Company in India — States We Serve | KVL Business Solutions';
const description = 'KVL Business Solutions is a Patna, Bihar-based software development company serving businesses across India — Maharashtra, Karnataka, Delhi NCR, Tamil Nadu, and more — with ERP, CRM, and custom software.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/software-development-company-india` },
  openGraph: { title, description, url: `${SITE}/software-development-company-india`, type: 'website' },
};

export default function IndiaStatesPage() {
  // A directory hub for the state pages, matching the structure of
  // /global (which lists the international country pages) — gives every
  // state page at least one real internal link into it instead of relying
  // solely on the sitemap, and captures the broad "software development
  // company India" query in its own right.
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE}/software-development-company-india`,
    isPartOf: { '@id': `${SITE}/#website` },
  };

  return (
    <>
      <JsonLd data={webPageJsonLd} id="india-states-webpage-jsonld" />
      <PageHero
        eyebrow="SERVING INDIA"
        title="One Patna-Based Team,"
        accent="Clients Across India"
        description="KVL is headquartered in Patna, Bihar — no branch offices elsewhere in the country. Every state below is served remotely by the same engineering team, same business hours, same national GST framework."
        breadcrumb="India"
      />

      <StripNote icon={<ShieldCheck className="h-4 w-4" aria-hidden />}>
        We don&apos;t operate branch offices outside Patna — every state below is served remotely by the same team, with direct engineer access throughout.
      </StripNote>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {indiaStatePages.map(s => (
            <Link key={s.slug} href={`/software-development-company-${s.slug}`} className="group rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
              <Card interactive className="h-full p-7">
                <div className={iconTile}>
                  <MapPin className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="mb-2 font-display text-card-title text-text">{s.countryName}</h2>
                <p className="mb-5 line-clamp-2 text-base text-text2">{s.heroTagline}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-text">
                  Explore <ArrowUpRight className="h-4 w-4 transition-transform duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="alt" containerClassName="max-w-2xl text-center">
        <SectionHeading align="center" eyebrow="Our Headquarters" title="Based in Patna, Bihar" />
        <p className="mb-8 mt-4 text-base text-text2">Our only physical office is in Patna, Bihar — MSME registered, with an NDA signed before any technical discussion begins. See what makes our home city&apos;s page different — it&apos;s the one page here written about where we actually are, not where we deliver to remotely.</p>
        <Link href="/software-development-company-patna" className={buttonStyles('secondary', 'lg')}>
          Visit the Patna page <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </Section>

      <CtaBanner title="Don't see your state listed?" desc="We serve clients across India remotely from Patna — tell us where you're based and what you're building." />
    </>
  );
}
