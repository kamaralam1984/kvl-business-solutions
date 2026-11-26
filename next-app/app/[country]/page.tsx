import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, MapPin, Landmark, ShieldCheck } from 'lucide-react';
import { Card, Section, SectionHeading, StateMessage } from '@/components/ui';
import { StripNote, iconTile } from '@/components/location-landing/shared';
import { CtaBanner } from '@/components/home/CtaBanner';
import { JsonLd } from '@/components/shared/JsonLd';
import { LocationHero } from '@/components/location-landing/LocationHero';
import { CountryPageTemplate, buildCountryMetadata } from '@/components/location-landing/CountryPageTemplate';
import { getLiveCountries, getLiveCountry, getLiveLocationPages } from '@/lib/data/live-locations';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

export const revalidate = 300;

export async function generateStaticParams() {
  const countries = await getLiveCountries();
  return countries.map(c => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const country = await getLiveCountry(params.country);
  if (!country) return {};
  if (country.pageType === 'standalone') return buildCountryMetadata(country);
  const url = `${SITE}/${country.slug}`;
  return {
    title: country.seo.title,
    description: country.seo.description,
    alternates: { canonical: url },
    openGraph: { title: country.seo.title, description: country.seo.description, url, type: 'website' },
  };
}

export default async function CountryHubPage({ params }: { params: { country: string } }) {
  const country = await getLiveCountry(params.country);
  if (!country) notFound();

  if (country.pageType === 'standalone') {
    const [products, allCountries, reviews] = await Promise.all([
      getLiveSoftwareProducts().catch(() => []),
      getLiveCountries().catch(() => []),
      (async () => {
        try {
          await connectDB();
          const docs = await Review.find({ approved: true }).sort({ featured: -1, rating: -1, createdAt: -1 }).limit(9).lean();
          return docs.map((r: any) => ({ name: r.name, company: r.company || '', rating: r.rating, title: r.title || '', message: r.message }));
        } catch { return []; }
      })(),
    ]);
    const otherCountries = allCountries.filter(c => c.slug !== country.slug && c.pageType === 'standalone').slice(0, 10);
    return <CountryPageTemplate country={country} products={products} reviews={reviews} otherCountries={otherCountries} />;
  }

  const [locations, products] = await Promise.all([
    getLiveLocationPages(country.slug),
    getLiveSoftwareProducts().catch(() => []),
  ]);
  const states = locations.filter(l => l.regionType === 'state');
  const uts = locations.filter(l => l.regionType === 'union_territory');
  const others = locations.filter(l => l.regionType !== 'state' && l.regionType !== 'union_territory');

  const url = `${SITE}/${country.slug}`;
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: locations.map((l, i) => ({
      '@type': 'ListItem', position: i + 1, name: l.name, url: `${url}/${l.slug}`,
    })),
  };
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: country.seo.title,
    description: country.seo.description,
    url,
    isPartOf: { '@id': `${SITE}/#website` },
  };

  const Group = ({ title, items }: { title: string; items: typeof locations }) => items.length === 0 ? null : (
    <div className="mb-12">
      <h3 className="mb-5 flex items-center gap-2 font-display text-card-title text-text">
        <Landmark className="h-5 w-5 text-gold-text" aria-hidden /> {title}
      </h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(l => (
          <Link key={l.slug} href={`/${country.slug}/${l.slug}`} className="group rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
            <Card interactive className="h-full p-6">
              <div className={iconTile}>
                <MapPin className="h-5 w-5" aria-hidden />
              </div>
              <h4 className="mb-1.5 font-display text-lg font-semibold text-text">{l.name}</h4>
              <p className="line-clamp-2 text-sm leading-relaxed text-text2">{l.heroTagline}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-text">
                Explore <ArrowUpRight className="h-4 w-4 transition-transform duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={webPageJsonLd} id={`country-${country.slug}-webpage-jsonld`} />
      <JsonLd data={itemListJsonLd} id={`country-${country.slug}-itemlist-jsonld`} />

      <LocationHero
        eyebrow="LOCATIONS"
        title={country.heroTitle}
        description={country.heroDescription}
        breadcrumbPath={[{ label: country.name }]}
        products={products}
        ctaPrimary={{ text: 'Get Free Project Consultation', href: '/book-demo' }}
        ctaSecondary={{ text: 'Talk to a Software Expert', href: '/contact' }}
      />

      <StripNote icon={<ShieldCheck className="h-4 w-4" aria-hidden />}>{country.intro}</StripNote>

      <Section>
        <SectionHeading align="center" eyebrow="Coverage" title={`Software Development Services Across ${country.name}`} className="mb-10" />
        <Group title="States" items={states} />
        <Group title="Union Territories" items={uts} />
        <Group title="Locations" items={others} />
        {locations.length === 0 && (
          <StateMessage title="Coming soon" description={`Location pages for ${country.name} are being added — check back soon.`} />
        )}
      </Section>

      <CtaBanner
        title={`Need a Software Partner in ${country.name}?`}
        desc={`Tell us where your business is based — we'll scope the right ERP, CRM, or custom software build for it.`}
      />
    </>
  );
}
