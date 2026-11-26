import { ShieldCheck, Globe, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import type { CountryType } from '@/lib/data/live-locations';
import type { Software } from '@/lib/data/software';
import { services } from '@/lib/data/services';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';
import { caseStudies } from '@/lib/data/case-studies';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Section, SectionHeading } from '@/components/ui';
import { LocationHero } from './LocationHero';
import { CountryGallery } from './CountryGallery';
import { TestimonialsCarousel } from '@/components/website-offer/TestimonialsCarousel';
import {
  Icon, StripNote, WhyGrid, MarketSection, LinkCardGrid, TechChips, TimezoneSection,
  ProcessSection, CaseGrid, FaqSection, PillLink, CtaRow,
} from './shared';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

export function buildCountryMetadata(country: CountryType): Metadata {
  const url = country.seo.canonicalUrl || `${SITE}/${country.slug}`;
  return {
    title: country.seo.title,
    description: country.seo.description,
    alternates: { canonical: url },
    robots: { index: country.seo.robotsIndex, follow: country.seo.robotsFollow },
    openGraph: {
      title: country.seo.ogTitle || country.seo.title,
      description: country.seo.ogDescription || country.seo.description,
      url,
      type: 'website',
      ...(country.seo.ogImage ? { images: [{ url: country.seo.ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: country.seo.twitterTitle || country.seo.title,
      description: country.seo.twitterDescription || country.seo.description,
    },
  };
}

type Review = { name: string; company?: string; rating: number; title?: string; message: string };

export function CountryPageTemplate({
  country, products, reviews, otherCountries,
}: {
  country: CountryType;
  products: Software[];
  reviews: Review[];
  otherCountries: CountryType[];
}) {
  const url = `${SITE}/${country.slug}`;
  const breadcrumbLabel = country.seo.breadcrumbTitle || country.name;

  const relatedServices = country.relatedServiceSlugs
    .map(slug => services.find(s => s.slug === slug))
    .filter(Boolean) as typeof services;

  const relatedIndustries = country.relatedIndustryLandingSlugs
    .map(slug => industryLandingPages.find(i => i.slug === slug))
    .filter(Boolean) as typeof industryLandingPages;

  const relatedCaseStudies = country.relatedCaseStudySlugs
    .map(slug => caseStudies.find(c => c.slug === slug))
    .filter(Boolean) as typeof caseStudies;

  const galleryImages = country.gallery.length > 0
    ? country.gallery
    : relatedCaseStudies.slice(0, 8).map(cs => cs.images.hero);

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: country.seo.title,
    description: country.seo.description,
    url,
    about: `Software development services for businesses in ${country.name}`,
    isPartOf: { '@id': `${SITE}/#website` },
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': country.seo.schemaType || 'Service',
    serviceType: 'Custom Software Development',
    name: `Software Development Services for ${country.name}`,
    description: country.heroDescription,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: country.name,
    url,
  };

  const faqJsonLd = country.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: country.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  return (
    <>
      <JsonLd data={webPageJsonLd} id={`country-${country.slug}-webpage-jsonld`} />
      <JsonLd data={serviceJsonLd} id={`country-${country.slug}-service-jsonld`} />
      {faqJsonLd && <JsonLd data={faqJsonLd} id={`country-${country.slug}-faq-jsonld`} />}

      <LocationHero
        eyebrow="SOFTWARE DEVELOPMENT COMPANY"
        title={country.heroTitle}
        description={country.heroDescription}
        breadcrumbPath={[{ label: breadcrumbLabel }]}
        products={products}
        ctaPrimary={{ text: 'Get Free Project Consultation', href: '/book-demo' }}
        ctaSecondary={{ text: 'Talk to a Software Expert', href: '/contact' }}
      />

      <StripNote icon={<ShieldCheck className="h-4 w-4" aria-hidden />}>{country.intro}</StripNote>

      {country.whyChooseReasons.length > 0 && (
        <WhyGrid reasons={country.whyChooseReasons} title={`Why Businesses in ${country.name} Choose KVL`} />
      )}

      {country.businessContext.length > 0 && (
        <MarketSection eyebrow={`The ${country.name} Market`} title={`Building Software for ${country.name} Businesses`} paragraphs={country.businessContext} />
      )}

      {galleryImages.length > 0 && (
        <Section>
          <SectionHeading
            align="center"
            eyebrow="Proof of Work"
            title="Real Products Built by KVL"
            description={`Live software delivered for clients — the same engineering team that would build for ${country.name}.`}
          />
          <div className="mt-10">
            <CountryGallery images={galleryImages} countryName={country.name} />
          </div>
        </Section>
      )}

      {relatedServices.length > 0 && (
        <LinkCardGrid
          tone="alt"
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
          eyebrow="Industries"
          title={`Industries We Serve in ${country.name}`}
          description={country.industriesIntro || undefined}
          items={relatedIndustries.map(ind => ({
            key: ind.slug, href: `/${ind.slug}`, title: ind.industryName, desc: ind.heroTagline,
            icon: <ArrowUpRight className="h-5 w-5" aria-hidden />,
          }))}
        />
      )}

      <TechChips tone="alt" />

      {country.timezoneOverlap && (
        <TimezoneSection tone="base" title={`How We Deliver for ${country.name} Clients`} text={country.timezoneOverlap} />
      )}

      {country.processIntro && <ProcessSection tone="alt" intro={country.processIntro} />}

      {relatedCaseStudies.length > 0 && (
        <CaseGrid items={relatedCaseStudies} title="Real Products We've Built" />
      )}

      {reviews.length > 0 && <TestimonialsCarousel reviews={reviews} />}

      {country.faq.length > 0 && <FaqSection faq={country.faq} title={`Common Questions from ${country.name} Clients`} />}

      {otherCountries.length > 0 && (
        <Section tone="alt" containerClassName="max-w-3xl text-center">
          <SectionHeading align="center" eyebrow="Also Serving" title="We Also Build Software For These Countries" />
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {otherCountries.map(c => (
              <PillLink key={c.slug} href={`/${c.slug}`} icon={<Globe className="h-3.5 w-3.5" aria-hidden />}>{c.name}</PillLink>
            ))}
          </div>
        </Section>
      )}

      <CtaRow
        heading={`Ready to Build Something for ${country.name}?`}
        waText={`Hi KVL, I'm reaching out from ${country.name} about a software project.`}
      />

      <CtaBanner
        title={`Need a Software Partner in ${country.name}?`}
        desc={country.ctaBannerDesc || `Tell us what you're building — we'll scope the right ERP, CRM, or custom software build for your business in ${country.name}.`}
      />
    </>
  );
}
