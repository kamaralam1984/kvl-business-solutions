import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowUpRight, ArrowRight, ShieldCheck, Clock, MessageCircle } from 'lucide-react';
import { CountryPage } from '@/lib/data/country-pages';
import { services } from '@/lib/data/services';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';
import { caseStudies } from '@/lib/data/case-studies';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';

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

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as any)[name] || Icons.Box;
  return <Cmp className={className} />;
}

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

      {/* Honest positioning strip */}
      <section className="py-6 border-b border-tint bg-app2">
        <div className="container flex items-center justify-center gap-2.5 text-center text-[13px] text-text2 flex-wrap">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#c8a870' }} />
          India-based software development company serving {country.countryName} clients remotely — no local office, direct access to the engineers building your system.
        </div>
      </section>

      {/* Why choose */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Why KVL</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Why Businesses in {country.countryName} Choose KVL</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {country.whyChooseReasons.map(r => (
              <div key={r} className="card-base p-6 flex gap-3 items-start">
                <ArrowRight className="w-4 h-4 shrink-0 mt-1" style={{ color: '#c8a870' }} />
                <span className="text-[14px] leading-[1.7]">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business context */}
      <section className="section section-alt">
        <div className="container max-w-3xl">
          <span className="eyebrow">The {country.countryName} Market</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Building Software for {country.countryName} Businesses</h2>
          <div className="space-y-5">
            {country.businessContext.map((p, i) => (
              <p key={i} className="text-text2 text-[15px] leading-[1.8]">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
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

      {/* Industries */}
      {relatedIndustries.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Industries</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Industries We Serve in {country.countryName}</h2>
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

      {/* Tech stack */}
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

      {/* How we work / timezone */}
      <section className="section section-alt">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">How We Work Together</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Remote Delivery for {country.countryName} Clients</h2>
          </div>
          <div className="card-premium p-8 flex gap-4 items-start">
            <Clock className="w-6 h-6 shrink-0 mt-1" style={{ color: '#c8a870' }} />
            <p className="text-text2 text-[15px] leading-[1.8]">{country.timezoneOverlap}</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">How We Build It</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Our Standard Delivery Process</h2>
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

      {/* Case studies */}
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

      {/* FAQ */}
      <section className="section">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Common Questions from {country.countryName} Clients</h2>
          </div>
          <div className="space-y-5">
            {country.faq.map(f => (
              <div key={f.q} className="card-base p-6">
                <div className="font-bold text-sm mb-2">{f.q}</div>
                <div className="text-text2 text-[13.5px] leading-[1.7]">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct CTA row (exact wording per brief) */}
      <section className="section section-alt">
        <div className="container text-center">
          <span className="eyebrow">Get Started</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Ready to Build Something for {country.countryName}?</h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link href="/book-demo" className="btn btn-primary">
              Get Free Project Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Talk to a Software Expert
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi KVL, I'm reaching out from ${country.countryName} about a software project.`)}`}
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
        title={`Need a Software Partner in ${country.countryName}?`}
        desc="No local office, no middlemen — direct access to the India-based team that will actually build your system."
      />
    </>
  );
}
