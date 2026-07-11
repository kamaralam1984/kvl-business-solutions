import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowUpRight, ArrowRight, ShieldCheck, MessageCircle, Check } from 'lucide-react';
import { IndustryLandingPage } from '@/lib/data/industry-landing-pages';
import { services } from '@/lib/data/services';
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

export function buildIndustryMetadata(data: IndustryLandingPage) {
  const url = `${SITE}/${data.slug}`;
  return {
    title: data.seo.title,
    description: data.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url,
      type: 'website' as const,
    },
  };
}

export function IndustryLandingTemplate({ data }: { data: IndustryLandingPage }) {
  const url = `${SITE}/${data.slug}`;

  const relatedServices = data.relatedServiceSlugs
    .map(slug => services.find(s => s.slug === slug))
    .filter(Boolean) as typeof services;

  const caseStudy = data.caseStudySlug
    ? caseStudies.find(c => c.slug === data.caseStudySlug)
    : undefined;

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.seo.title,
    description: data.seo.description,
    url,
    about: `Custom software development for ${data.industryName}`,
    isPartOf: { '@id': `${SITE}/#website` },
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: data.industryName,
    name: `${data.industryName} Services`,
    description: data.heroTagline,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: 'Worldwide',
    url,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Global', item: `${SITE}/global` },
      { '@type': 'ListItem', position: 2, name: data.industryName, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={webPageJsonLd} id={`industry-landing-${data.slug}-webpage-jsonld`} />
      <JsonLd data={serviceJsonLd} id={`industry-landing-${data.slug}-service-jsonld`} />
      <JsonLd data={faqJsonLd} id={`industry-landing-${data.slug}-faq-jsonld`} />
      <JsonLd data={breadcrumbJsonLd} id={`industry-landing-${data.slug}-breadcrumb-jsonld`} />

      <PageHero
        eyebrow="INDUSTRY SOLUTION"
        title={data.industryName}
        description={data.heroTagline}
        breadcrumb={data.industryName}
        breadcrumbPath={[{ label: 'Global', href: '/global' }, { label: data.industryName }]}
      />

      {/* Honest positioning strip */}
      <section className="py-6 border-b border-tint bg-app2">
        <div className="container flex items-center justify-center gap-2.5 text-center text-[13px] text-text2 flex-wrap">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#c8a870' }} />
          India-based software development company delivering custom {data.industryName.toLowerCase()} for clients worldwide — no local office, direct access to the engineers building your system.
        </div>
      </section>

      {/* Industry Challenges */}
      <section className="section">
        <div className="container max-w-3xl">
          <span className="eyebrow">The Industry Challenge</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">What Makes {data.industryName} Different</h2>
          <div className="space-y-5">
            {data.industryChallenges.map((p, i) => (
              <p key={i} className="text-text2 text-[15px] leading-[1.8]">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Business Problems */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Business Problems</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Problems We Hear Most Often</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {data.businessProblems.map(p => (
              <div key={p} className="card-base p-6 flex gap-3 items-start">
                <ArrowRight className="w-4 h-4 shrink-0 mt-1" style={{ color: '#c8a870' }} />
                <span className="text-[14px] leading-[1.7]">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solutions */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Our Solutions</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">What We Build for {data.industryName}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {data.ourSolutions.map(s => (
              <div key={s.title} className="card-premium p-7">
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-text2 text-sm leading-[1.7]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Core Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">What's Included</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {data.coreFeatures.map(f => (
              <div key={f} className="flex gap-2.5 items-start text-[14px]">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">What Changes For Your Business</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {data.benefits.map(b => (
              <div key={b.title} className="card-premium p-7">
                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-text2 text-sm leading-[1.7]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {relatedServices.length > 0 && (
        <section className="section section-alt">
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

      {/* Process */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">Development Process</span>
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

      {/* Case study */}
      {caseStudy && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Proven Work</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">A Real System We've Built</h2>
            </div>
            <Link href={`/projects/${caseStudy.slug}`} className="card-premium p-8 block hover:shadow-card-hover transition-all group max-w-3xl mx-auto">
              <div className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: '#a3814f' }}>{caseStudy.businessCategory}</div>
              <h3 className="text-2xl font-black mb-3">{caseStudy.name}</h3>
              <p className="text-text2 text-sm mb-4">{caseStudy.overview}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read the case study <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className={`section ${caseStudy ? 'section-alt' : ''}`}>
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Common Questions</h2>
          </div>
          <div className="space-y-5">
            {data.faq.map(f => (
              <div key={f.q} className="card-base p-6">
                <div className="font-bold text-sm mb-2">{f.q}</div>
                <div className="text-text2 text-[13.5px] leading-[1.7]">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct CTA row */}
      <section className="section">
        <div className="container text-center">
          <span className="eyebrow">Get Started</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Ready to Build Your {data.industryName} System?</h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link href="/book-demo" className="btn btn-primary">
              Get Free Project Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Talk to a Software Expert
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi KVL, I'm reaching out about a ${data.industryName} project.`)}`}
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
        title={`Need Software Built for ${data.industryName}?`}
        desc="No local office, no middlemen — direct access to the India-based team that will actually build your system."
      />
    </>
  );
}
