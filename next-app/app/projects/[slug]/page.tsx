import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { ChevronRight, ArrowUpRight, CheckCircle2, ExternalLink, Compass } from 'lucide-react';
import { caseStudies, type CaseStudy } from '@/lib/data/case-studies';
import { services } from '@/lib/data/services';
import { industries } from '@/lib/data/industries';
import { JsonLd } from '@/components/shared/JsonLd';
import { ParticleBackground } from '@/components/shared/ParticleBackground';
import { CtaBanner } from '@/components/home/CtaBanner';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

export const dynamic = 'force-static';
export const dynamicParams = false;

const processSteps = [
  { num: '01', title: 'Discover',    desc: 'We learn the business, the goals and what the system actually needs to do.' },
  { num: '02', title: 'Planning',    desc: 'Scope, timeline and pricing get fixed in writing before any work begins.' },
  { num: '03', title: 'Design',      desc: 'We map the structure and interface before a single line of code is written.' },
  { num: '04', title: 'Development', desc: 'Engineers build the system, with weekly progress updates so nothing is a surprise.' },
  { num: '05', title: 'Testing',     desc: 'The system is reviewed and checked against the original requirements before it goes live.' },
  { num: '06', title: 'Deployment',  desc: 'We move the system into production and confirm it runs as intended.' },
  { num: '07', title: 'Support',     desc: 'Training and documentation come standard, plus a year of free updates and support.' },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as any)[name] || Icons.Box;
  return <Cmp className={className} />;
}

/**
 * Ranks other case studies against the current one so "Related Projects" shows the most
 * relevant work first: exact businessCategory match scores highest, same industry scores
 * next, everything else falls back to catalog order to fill any remaining slots.
 */
function rankRelatedCaseStudies(current: CaseStudy, all: CaseStudy[], limit = 3): CaseStudy[] {
  const others = all.filter(c => c.slug !== current.slug);
  return others
    .map((c, index) => {
      let score = 0;
      if (c.businessCategory === current.businessCategory) score += 2;
      if (c.industry === current.industry) score += 1;
      return { c, score, index };
    })
    .sort((a, b) => (b.score - a.score) || (a.index - b.index))
    .slice(0, limit)
    .map(entry => entry.c);
}

export function generateStaticParams() {
  return caseStudies.map(c => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = caseStudies.find(x => x.slug === params.slug);
  if (!c) return { title: 'Case study not found' };
  return {
    title: c.seo.title,
    description: c.seo.description,
    alternates: { canonical: `${SITE}/projects/${c.slug}` },
    openGraph: {
      title: c.seo.title,
      description: c.seo.description,
      url: `${SITE}/projects/${c.slug}`,
      images: [{ url: `${SITE}${c.images.hero}` }],
      type: 'article',
    },
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = caseStudies.find(c => c.slug === params.slug);
  if (!study) notFound();

  const related = rankRelatedCaseStudies(study, caseStudies, 3);
  const relatedServices = study.relatedServiceSlugs
    .map(slug => services.find(s => s.slug === slug))
    .filter(Boolean) as typeof services;
  const relatedIndustry = study.industrySlug
    ? industries.find(i => i.slug === study.industrySlug)
    : undefined;

  const creativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: study.name,
    description: study.overview,
    url: `${SITE}/projects/${study.slug}`,
    image: `${SITE}${study.images.hero}`,
    creator: { '@id': `${SITE}/#organization` },
    about: study.businessCategory,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE}/projects` },
      { '@type': 'ListItem', position: 3, name: study.name, item: `${SITE}/projects/${study.slug}` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: study.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={creativeWorkJsonLd} id={`case-study-${study.slug}-jsonld`} />
      <JsonLd data={breadcrumbJsonLd} id={`case-study-${study.slug}-breadcrumb-jsonld`} />
      <JsonLd data={faqJsonLd} id={`case-study-${study.slug}-faq-jsonld`} />

      {/* SECTION 1 — Hero */}
      <section className="relative pt-20 pb-16 bg-app2 border-b border-tint overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 blueprint pointer-events-none opacity-60" />
        <div className="container relative z-10">
          <div className="inline-flex gap-2 mb-6 text-xs text-text2">
            <Link href="/" className="text-primary">Home</Link>
            <ChevronRight className="w-3 h-3 self-center" />
            <Link href="/projects" className="text-primary">Projects</Link>
            <ChevronRight className="w-3 h-3 self-center" />
            <span>{study.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: 'rgba(200,168,112,0.1)', color: '#a3814f', border: '1px solid rgba(200,168,112,0.25)' }}>
                  {study.industry}
                </span>
                <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-tint text-text2">
                  {study.businessCategory}
                </span>
                {relatedIndustry && (
                  <Link
                    href={`/industries/${relatedIndustry.slug}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Compass className="w-3 h-3" /> {relatedIndustry.name}
                  </Link>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{study.name}</h1>
              <p className="text-lg text-text2 mb-3">{study.tagline}</p>
              <p className="text-text2 max-w-xl mb-8">{study.overview}</p>
              <div className="flex flex-wrap gap-3">
                <a href={study.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Visit Live Site <ExternalLink className="w-4 h-4" />
                </a>
                <Link href="/contact" className="btn btn-ghost">
                  Need Something Similar? <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-tint">
              <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.3)', backdropFilter: 'blur(6px)' }}>
                Live Product
              </span>
              <Image
                src={study.images.hero}
                alt={`${study.name} dashboard on desktop`}
                width={1440}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Business Challenge */}
      <section className="section">
        <div className="container max-w-3xl">
          <span className="eyebrow">The Business Challenge</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">{study.challenge.headline}</h2>
          <p className="text-text2 text-[15px] leading-[1.8]">{study.challenge.body}</p>
        </div>
      </section>

      {/* SECTION 3 — Business Goals */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">Business Goals</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">What the Project Needed to Achieve</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {study.goals.map(g => (
              <div key={g} className="flex gap-3 items-start card-base p-5">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#c8a870' }} />
                <span className="text-sm">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Our Solution */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mb-10">
            <span className="eyebrow">Our Solution</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">{study.solution.headline}</h2>
            <p className="text-text2 text-[15px] leading-[1.8]">{study.solution.body}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {study.solution.pillars.map(p => (
              <div key={p.title} className="card-premium p-6">
                <h3 className="font-bold text-sm mb-2">{p.title}</h3>
                <p className="text-text2 text-[13px] leading-[1.6]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Key Features */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">Key Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">What {study.name} Does</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {study.keyFeatures.map(f => (
              <div key={f.title} className="card-base p-6">
                <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: 'rgba(200,168,112,0.1)', color: '#a3814f' }}>
                  <Icon name={f.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-2">{f.title}</h3>
                <p className="text-text2 text-[13px] leading-[1.6]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Technology */}
      <section className="section">
        <div className="container text-center">
          <span className="eyebrow">Technology</span>
          <h2 className="text-2xl md:text-3xl font-extrabold my-4">Built With</h2>
          <div className="flex flex-wrap gap-2.5 justify-center max-w-lg mx-auto">
            {study.tech.map(t => (
              <span key={t} className="text-[13px] font-medium px-3.5 py-1.5 rounded-full" style={{ background: 'rgba(200,168,112,0.08)', color: '#a3814f', border: '1px solid rgba(200,168,112,0.2)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Development Process */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">How We Built It</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Our Standard Delivery Process</h2>
            <p className="text-text2 max-w-xl mx-auto">The same process we run on every engagement — including this one.</p>
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

      {/* SECTION 8 — Business Benefits */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">Business Benefits</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">What This Changes</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {study.benefits.map(b => (
              <div key={b.title} className="card-base p-6">
                <h3 className="font-bold text-sm mb-2">{b.title}</h3>
                <p className="text-text2 text-[13px] leading-[1.6]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — Gallery */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">Gallery</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">See It In Action</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {study.images.gallery.map(g => (
              <div key={g.device} className="card-base overflow-hidden">
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={g.device === 'desktop' ? 1440 : g.device === 'tablet' ? 834 : 390}
                  height={g.device === 'desktop' ? 900 : g.device === 'tablet' ? 1112 : 844}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="p-3 text-center text-[11px] font-bold tracking-widest uppercase text-text2">{g.device}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — Related Services */}
      {relatedServices.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10">
              <span className="eyebrow">Related Services</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Need Something Like This?</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {relatedServices.map(s => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="card-base p-6 hover:shadow-card-hover transition-all">
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

      {/* SECTION 11 — Related Projects */}
      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="text-center mb-10">
              <span className="eyebrow">More Real Projects</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Other Live Products We've Built</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.slug} href={`/projects/${r.slug}`} className="card-premium overflow-hidden group block">
                  <div className="relative overflow-hidden" style={{ height: 160 }}>
                    <Image
                      src={r.images.hero}
                      alt={`${r.name} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#a3814f' }}>{r.industry}</div>
                    <h3 className="font-bold text-sm mb-1.5">{r.name}</h3>
                    <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{r.overview}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ (feeds FAQPage schema above) */}
      <section className="section">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Common Questions</h2>
          </div>
          <div className="space-y-5">
            {study.faq.map(f => (
              <div key={f.q} className="card-base p-6">
                <div className="font-bold text-sm mb-2">{f.q}</div>
                <div className="text-text2 text-[13.5px] leading-[1.7]">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 — Final CTA */}
      <CtaBanner
        title={`Need Software Like ${study.name}?`}
        desc="Book a free strategy call or request a proposal — talk directly with the engineer who'd build it."
      />
    </>
  );
}
