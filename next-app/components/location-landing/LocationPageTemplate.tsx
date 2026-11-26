import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import type { LocationPageType } from '@/lib/data/live-locations';
import type { CountryType } from '@/lib/data/live-locations';
import type { Software } from '@/lib/data/software';
import { services } from '@/lib/data/services';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';
import { caseStudies } from '@/lib/data/case-studies';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Section, SectionHeading } from '@/components/ui';
import { LocationHero } from './LocationHero';
import {
  Icon, StripNote, WhyGrid, MarketSection, LinkCardGrid, TechChips, TimezoneSection,
  ProcessSection, CaseGrid, FaqSection, PillLink, CtaRow,
} from './shared';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

export function buildLocationMetadata(country: CountryType, loc: LocationPageType): Metadata {
  const url = loc.seo.canonicalUrl || `${SITE}/${country.slug}/${loc.slug}`;
  return {
    title: loc.seo.title,
    description: loc.seo.metaDescription,
    alternates: { canonical: url },
    robots: { index: loc.seo.robotsIndex, follow: loc.seo.robotsFollow },
    openGraph: {
      title: loc.seo.ogTitle || loc.seo.title,
      description: loc.seo.ogDescription || loc.seo.metaDescription,
      url,
      type: 'website',
      ...(loc.seo.ogImage ? { images: [{ url: loc.seo.ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: loc.seo.twitterTitle || loc.seo.title,
      description: loc.seo.twitterDescription || loc.seo.metaDescription,
    },
  };
}

export function LocationPageTemplate({
  country, loc, nearby, products,
}: {
  country: CountryType;
  loc: LocationPageType;
  nearby: LocationPageType[];
  products: Software[];
}) {
  const url = `${SITE}/${country.slug}/${loc.slug}`;
  const breadcrumbLabel = loc.seo.breadcrumbTitle || loc.name;

  const relatedServices = loc.relatedServiceSlugs
    .map(slug => services.find(s => s.slug === slug))
    .filter(Boolean) as typeof services;

  const relatedIndustries = loc.relatedIndustryLandingSlugs
    .map(slug => industryLandingPages.find(i => i.slug === slug))
    .filter(Boolean) as typeof industryLandingPages;

  const relatedCaseStudies = loc.relatedCaseStudySlugs
    .map(slug => caseStudies.find(c => c.slug === slug))
    .filter(Boolean) as typeof caseStudies;

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: loc.seo.title,
    description: loc.seo.metaDescription,
    url,
    about: `Software development services for businesses in ${loc.name}`,
    isPartOf: { '@id': `${SITE}/#website` },
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': loc.seo.schemaType || 'Service',
    serviceType: 'Custom Software Development',
    name: `Software Development Services for ${loc.name}`,
    description: loc.heroTagline,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: loc.name,
    url,
  };

  // Breadcrumb schema is already emitted by <LocationHero> from breadcrumbPath below —
  // no separate BreadcrumbList block here, to avoid two competing breadcrumb
  // schemas on the same page.
  const faqJsonLd = loc.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: loc.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  return (
    <>
      <JsonLd data={webPageJsonLd} id={`loc-${loc.slug}-webpage-jsonld`} />
      <JsonLd data={serviceJsonLd} id={`loc-${loc.slug}-service-jsonld`} />
      {faqJsonLd && <JsonLd data={faqJsonLd} id={`loc-${loc.slug}-faq-jsonld`} />}

      <LocationHero
        eyebrow="SOFTWARE DEVELOPMENT COMPANY"
        title={loc.h1}
        description={loc.heroTagline}
        breadcrumbPath={[{ label: country.name, href: `/${country.slug}` }, { label: breadcrumbLabel }]}
        products={products}
        ctaPrimary={{ text: 'Get Free Project Consultation', href: '/book-demo' }}
        ctaSecondary={{ text: 'Talk to a Software Expert', href: '/contact' }}
      />

      <StripNote icon={<ShieldCheck className="h-4 w-4" aria-hidden />}>{loc.introContent}</StripNote>

      {loc.whyChooseReasons.length > 0 && (
        <WhyGrid reasons={loc.whyChooseReasons} title={`Why Businesses in ${loc.name} Choose KVL`} />
      )}

      {loc.businessContext.length > 0 && (
        <MarketSection eyebrow={`The ${loc.name} Market`} title={`Building Software for ${loc.name} Businesses`} paragraphs={loc.businessContext} />
      )}

      {relatedServices.length > 0 && (
        <LinkCardGrid
          eyebrow="Services"
          title="Software Development Services"
          items={relatedServices.map(s => ({
            key: s.slug, href: `/services/${s.slug}`, title: s.name, desc: s.description,
            icon: <Icon name={s.icon} className="h-5 w-5" />,
          }))}
        />
      )}

      {relatedIndustries.length > 0 && (
        <LinkCardGrid
          tone="alt"
          eyebrow="Industries"
          title={`Industries We Serve in ${loc.name}`}
          description={loc.industriesIntro || undefined}
          items={relatedIndustries.map(ind => ({
            key: ind.slug, href: `/${ind.slug}`, title: ind.industryName, desc: ind.heroTagline,
            icon: <ArrowUpRight className="h-5 w-5" aria-hidden />,
          }))}
        />
      )}

      <TechChips />

      <TimezoneSection tone="alt" title={`How We Deliver for ${loc.name} Clients`} text={loc.timezoneOverlap} />

      {loc.processIntro && <ProcessSection intro={loc.processIntro} />}

      {relatedCaseStudies.length > 0 && (
        <CaseGrid tone="alt" items={relatedCaseStudies} title="Real Products We've Built" />
      )}

      {loc.faq.length > 0 && <FaqSection faq={loc.faq} title={`Common Questions from ${loc.name} Clients`} />}

      {nearby.length > 0 && (
        <Section tone="alt" containerClassName="max-w-3xl text-center">
          <SectionHeading align="center" eyebrow="Explore Nearby" title={`We Also Serve These ${country.name} Locations`} />
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {nearby.map(n => (
              <PillLink key={n.slug} href={`/${country.slug}/${n.slug}`} icon={<MapPin className="h-3.5 w-3.5" aria-hidden />}>{n.name}</PillLink>
            ))}
          </div>
          <Link href={`/${country.slug}`} className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-btn text-sm font-semibold text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
            View all {country.name} locations <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </Section>
      )}

      <CtaRow
        heading={`Ready to Build Something for ${loc.name}?`}
        waText={`Hi KVL, I'm reaching out from ${loc.name} about a software project.`}
      />

      <CtaBanner
        title={`Need a Software Partner in ${loc.name}?`}
        desc={loc.ctaBannerDesc}
      />
    </>
  );
}
