import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { CountryPage } from '@/lib/data/country-pages';
import { services } from '@/lib/data/services';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';
import { caseStudies } from '@/lib/data/case-studies';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';
import {
  Icon, StripNote, WhyGrid, MarketSection, LinkCardGrid, TechChips, TimezoneSection,
  ProcessSection, CaseGrid, FaqSection, CtaRow,
} from '@/components/location-landing/shared';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

export function buildCountryMetadata(country: CountryPage) {
  const url = `${SITE}/software-development-company-${country.slug}`;
  return {
    title: country.seo.title,
    description: country.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: country.seo.title,
      description: country.seo.description,
      url,
      type: 'website' as const,
    },
  };
}

export function CountryLandingTemplate({ country }: { country: CountryPage }) {
  const url = `${SITE}/software-development-company-${country.slug}`;

  const relatedServices = country.relatedServiceSlugs
    .map(slug => services.find(s => s.slug === slug))
    .filter(Boolean) as typeof services;

  const relatedIndustries = country.relatedIndustryLandingSlugs
    .map(slug => industryLandingPages.find(i => i.slug === slug))
    .filter(Boolean) as typeof industryLandingPages;

  const relatedCaseStudies = country.relatedCaseStudySlugs
    .map(slug => caseStudies.find(c => c.slug === slug))
    .filter(Boolean) as typeof caseStudies;

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: country.seo.title,
    description: country.seo.description,
    url,
    about: `Software development services for businesses in ${country.countryName}`,
    isPartOf: { '@id': `${SITE}/#website` },
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Custom Software Development',
    name: `Software Development Services for ${country.countryName}`,
    description: country.heroTagline,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: country.countryName,
    url,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: country.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={webPageJsonLd} id={`country-${country.slug}-webpage-jsonld`} />
      <JsonLd data={serviceJsonLd} id={`country-${country.slug}-service-jsonld`} />
      <JsonLd data={faqJsonLd} id={`country-${country.slug}-faq-jsonld`} />

      <PageHero
        eyebrow="SOFTWARE DEVELOPMENT COMPANY"
        title="Software Development Company in"
        accent={country.countryName}
        description={country.heroTagline}
        breadcrumb={country.countryName}
        breadcrumbPath={[{ label: 'Global', href: '/global' }, { label: country.countryName }]}
      />

      <StripNote icon={<ShieldCheck className="h-4 w-4" aria-hidden />}>
        India-based software development company serving {country.countryName} clients remotely — no local office, direct access to the engineers building your system.
      </StripNote>

      <WhyGrid reasons={country.whyChooseReasons} title={`Why Businesses in ${country.countryName} Choose KVL`} />

      <MarketSection eyebrow={`The ${country.countryName} Market`} title={`Building Software for ${country.countryName} Businesses`} paragraphs={country.businessContext} />

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
          title={`Industries We Serve in ${country.countryName}`}
          items={relatedIndustries.map(ind => ({
            key: ind.slug, href: `/${ind.slug}`, title: ind.industryName, desc: ind.heroTagline,
            icon: <ArrowUpRight className="h-5 w-5" aria-hidden />,
          }))}
        />
      )}

      <TechChips />

      <TimezoneSection tone="alt" title={`Remote Delivery for ${country.countryName} Clients`} text={country.timezoneOverlap} />

      <ProcessSection intro={country.processIntro} />

      {relatedCaseStudies.length > 0 && (
        <CaseGrid tone="alt" items={relatedCaseStudies} title="Real Products We've Built" />
      )}

      <FaqSection faq={country.faq} title={`Common Questions from ${country.countryName} Clients`} />

      <CtaRow
        tone="alt"
        heading={`Ready to Build Something for ${country.countryName}?`}
        waText={`Hi KVL, I'm reaching out from ${country.countryName} about a software project.`}
      />

      <CtaBanner
        title={`Need a Software Partner in ${country.countryName}?`}
        desc={country.ctaBannerDesc}
      />
    </>
  );
}
