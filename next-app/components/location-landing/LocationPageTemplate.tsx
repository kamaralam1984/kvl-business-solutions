import Link from 'next/link';
import {
  ArrowUpRight, ArrowRight, ShieldCheck, Clock, MessageCircle, MapPin,
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video,
  Network, Cloud, Brain, Megaphone, Palette, Users, Contact2, Webhook, Tag,
  Workflow, Box,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { LocationPageType, CountryType } from '@/lib/data/live-locations';
import type { Software } from '@/lib/data/software';
import { services } from '@/lib/data/services';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';
import { caseStudies } from '@/lib/data/case-studies';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';
import { LocationHero } from './LocationHero';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const WA_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');

const processSteps = [
  { num: '01', title: 'Discover',    desc: 'We learn the business, the goals and what the system actually needs to do.' },
  { num: '02', title: 'Planning',    desc: 'Scope, timeline and pricing get fixed in writing before any work begins.' },
  { num: '03', title: 'Design',      desc: 'We map the structure and interface before a single line of code is written.' },
  { num: '04', title: 'Development', desc: 'Engineers build the system, with weekly progress updates so nothing is a surprise.' },
  { num: '05', title: 'Testing',     desc: 'The system is reviewed and checked against the original requirements before it goes live.' },
  { num: '06', title: 'Deployment',  desc: 'We move the system into production and confirm it runs as intended.' },
  { num: '07', title: 'Support',     desc: 'Training and documentation come standard, plus a year of free updates and support.' },
];

const TECH_STACK = ['Next.js', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AI / LLM Integration', 'GPS & Mapping APIs', 'Cloud Hosting (AWS / Azure / GCP)'];

const ICON_MAP: Record<string, LucideIcon> = {
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video,
  Network, Cloud, Brain, Megaphone, Palette, Users, Contact2, Webhook, Tag,
  Workflow, Box,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICON_MAP[name] || Box;
  return <Cmp className={className} />;
}

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

      <section className="py-6 border-b border-tint bg-app2">
        <div className="container flex items-center justify-center gap-2.5 text-center text-[13px] text-text2 flex-wrap">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#c8a870' }} />
          {loc.introContent}
        </div>
      </section>

      {loc.whyChooseReasons.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Why KVL</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Why Businesses in {loc.name} Choose KVL</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {loc.whyChooseReasons.map(r => (
                <div key={r} className="card-base p-6 flex gap-3 items-start">
                  <ArrowRight className="w-4 h-4 shrink-0 mt-1" style={{ color: '#c8a870' }} />
                  <span className="text-[14px] leading-[1.7]">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {loc.businessContext.length > 0 && (
        <section className="section section-alt">
          <div className="container max-w-3xl">
            <span className="eyebrow">The {loc.name} Market</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Building Software for {loc.name} Businesses</h2>
            <div className="space-y-5">
              {loc.businessContext.map((p, i) => (
                <p key={i} className="text-text2 text-[15px] leading-[1.8]">{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Services</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Software Development Services</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedServices.map(s => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="card-base p-6 block hover:shadow-card-hover transition-all">
                  <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: `${s.color}18`, color: s.color }}>
                    <Icon name={s.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{s.name}</h3>
                  <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{s.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedIndustries.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Industries</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Industries We Serve in {loc.name}</h2>
              {loc.industriesIntro && <p className="text-text2 text-[14.5px] leading-[1.7] mt-3">{loc.industriesIntro}</p>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedIndustries.map(ind => (
                <Link key={ind.slug} href={`/${ind.slug}`} className="card-base p-6 block hover:shadow-card-hover transition-all">
                  <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.22)' }}>
                    <ArrowRight className="w-4 h-4" style={{ color: '#a3814f' }} />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{ind.industryName}</h3>
                  <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{ind.heroTagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container text-center">
          <span className="eyebrow">Technology</span>
          <h2 className="text-2xl md:text-3xl font-extrabold my-4">Built With</h2>
          <div className="flex flex-wrap gap-2.5 justify-center max-w-2xl mx-auto">
            {TECH_STACK.map(t => (
              <span key={t} className="text-[13px] font-medium px-3.5 py-1.5 rounded-full" style={{ background: 'rgba(200,168,112,0.08)', color: '#a3814f', border: '1px solid rgba(200,168,112,0.2)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">How We Work Together</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">How We Deliver for {loc.name} Clients</h2>
          </div>
          <div className="card-premium p-8 flex gap-4 items-start">
            <Clock className="w-6 h-6 shrink-0 mt-1" style={{ color: '#c8a870' }} />
            <p className="text-text2 text-[15px] leading-[1.8]">{loc.timezoneOverlap}</p>
          </div>
        </div>
      </section>

      {loc.processIntro && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">How We Build It</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Our Standard Delivery Process</h2>
              <p className="text-text2 text-[14.5px] leading-[1.7]">{loc.processIntro}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {processSteps.map(s => (
                <div key={s.num} className="card-premium p-5">
                  <div className="w-9 h-9 rounded-full grid place-items-center mb-4 font-bold text-[12px]" style={{ background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.22)', color: '#a3814f' }}>
                    {s.num}
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{s.title}</h3>
                  <p className="text-text2 text-[12.5px] leading-[1.6]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedCaseStudies.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Proven Work</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Real Products We&apos;ve Built</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {relatedCaseStudies.map(cs => (
                <Link key={cs.slug} href={`/projects/${cs.slug}`} className="card-premium p-7 block hover:shadow-card-hover transition-all group">
                  <div className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: '#a3814f' }}>{cs.businessCategory}</div>
                  <h3 className="text-xl font-black mb-3">{cs.name}</h3>
                  <p className="text-text2 text-sm mb-4">{cs.overview}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Read the case study <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {loc.faq.length > 0 && (
        <section className="section">
          <div className="container max-w-3xl">
            <div className="text-center mb-10">
              <span className="eyebrow">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Common Questions from {loc.name} Clients</h2>
            </div>
            <div className="space-y-5">
              {loc.faq.map(f => (
                <div key={f.q} className="card-base p-6">
                  <div className="font-bold text-sm mb-2">{f.q}</div>
                  <div className="text-text2 text-[13.5px] leading-[1.7]">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="section section-alt">
          <div className="container max-w-3xl text-center">
            <span className="eyebrow">Explore Nearby</span>
            <h2 className="text-2xl md:text-3xl font-extrabold my-4">We Also Serve These {country.name} Locations</h2>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {nearby.map(n => (
                <Link
                  key={n.slug}
                  href={`/${country.slug}/${n.slug}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-all hover:scale-[1.03]"
                  style={{ background: 'rgba(200,168,112,0.08)', color: '#a3814f', border: '1px solid rgba(200,168,112,0.2)' }}
                >
                  <MapPin className="w-3 h-3" /> {n.name}
                </Link>
              ))}
            </div>
            <Link href={`/${country.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-5">
              View all {country.name} locations <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container text-center">
          <span className="eyebrow">Get Started</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Ready to Build Something for {loc.name}?</h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link href="/book-demo" className="btn btn-primary">
              Get Free Project Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Talk to a Software Expert
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi KVL, I'm reaching out from ${loc.name} about a software project.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <CtaBanner
        title={`Need a Software Partner in ${loc.name}?`}
        desc={loc.ctaBannerDesc}
      />
    </>
  );
}
