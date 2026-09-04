import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, MapPin, Landmark, ShieldCheck } from 'lucide-react';
import { CtaBanner } from '@/components/home/CtaBanner';
import { JsonLd } from '@/components/shared/JsonLd';
import { LocationHero } from '@/components/location-landing/LocationHero';
import { getLiveCountries, getLiveCountry, getLiveLocationPages } from '@/lib/data/live-locations';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

export const revalidate = 300;

export async function generateStaticParams() {
  const countries = await getLiveCountries();
  return countries.map(c => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const country = await getLiveCountry(params.country);
  if (!country) return {};
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
      <h3 className="text-xl font-extrabold mb-5 flex items-center gap-2">
        <Landmark className="w-5 h-5" style={{ color: '#a3814f' }} /> {title}
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(l => (
          <Link key={l.slug} href={`/${country.slug}/${l.slug}`} className="card-premium p-6 block hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.22)' }}>
              <MapPin className="w-4.5 h-4.5" style={{ color: '#a3814f' }} />
            </div>
            <h3 className="font-bold text-base mb-1.5">{l.name}</h3>
            <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{l.heroTagline}</p>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary mt-3">
              Explore <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
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

      <section className="py-6 border-b border-tint bg-app2">
        <div className="container flex items-center justify-center gap-2.5 text-center text-[13px] text-text2 flex-wrap">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#c8a870' }} />
          {country.intro}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Coverage</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Software Development Services Across {country.name}</h2>
          </div>
          <Group title="States" items={states} />
          <Group title="Union Territories" items={uts} />
          <Group title="Locations" items={others} />
          {locations.length === 0 && (
            <p className="text-center text-text2 text-sm">Location pages for {country.name} are being added — check back soon.</p>
          )}
        </div>
      </section>

      <CtaBanner
        title={`Need a Software Partner in ${country.name}?`}
        desc={`Tell us where your business is based — we'll scope the right ERP, CRM, or custom software build for it.`}
      />
    </>
  );
}
