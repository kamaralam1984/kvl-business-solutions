import Link from 'next/link';
import {
  ArrowUpRight, ArrowRight, ShieldCheck, MessageCircle, Check,
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video,
  Network, Cloud, Brain, Megaphone, Palette, Users, Contact2, Webhook, Tag,
  Workflow, Box,
  type LucideIcon,
} from 'lucide-react';
import { IndustryLandingPage } from '@/lib/data/industry-landing-pages';
import { services } from '@/lib/data/services';
import { caseStudies } from '@/lib/data/case-studies';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Accordion, Button, Card, Section, SectionHeading, buttonStyles } from '@/components/ui';

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
      <section className="border-y border-line bg-bg2 py-6">
        <div className="container flex flex-wrap items-center justify-center gap-2.5 text-center text-sm text-text2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-gold-text" aria-hidden />
          India-based software development company delivering custom {data.industryName.toLowerCase()} for clients worldwide — no local office, direct access to the engineers building your system.
        </div>
      </section>

      {/* Industry Challenges */}
      <Section containerClassName="container max-w-3xl">
        <SectionHeading eyebrow="The Industry Challenge" title={`What Makes ${data.industryName} Different`} />
        <div className="mt-8 space-y-5">
          {data.industryChallenges.map((p, i) => (
            <p key={i} className="text-body-lg text-text2">{p}</p>
          ))}
        </div>
      </Section>

      {/* Business Problems */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="Business Problems" title="Problems We Hear Most Often" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {data.businessProblems.map(p => (
            <Card key={p} className="flex items-start gap-3 p-6">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gold-text" aria-hidden />
              <span className="text-text">{p}</span>
            </Card>
          ))}
        </div>
      </Section>

      {/* Our Solutions */}
      <Section>
        <SectionHeading align="center" eyebrow="Our Solutions" title={`What We Build for ${data.industryName}`} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {data.ourSolutions.map(s => (
            <Card key={s.title} className="p-7">
              <h3 className="mb-2 font-display text-card-title text-text">{s.title}</h3>
              <p className="text-text2">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Core Features */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="Core Features" title="What's Included" />
        <ul className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
          {data.coreFeatures.map(f => (
            <li key={f} className="flex items-start gap-2.5 text-text">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-text" aria-hidden /> {f}
            </li>
          ))}
        </ul>
      </Section>

      {/* Benefits */}
      <Section>
        <SectionHeading align="center" eyebrow="Benefits" title="What Changes For Your Business" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {data.benefits.map(b => (
            <Card key={b.title} className="p-7">
              <h3 className="mb-2 font-display text-card-title text-text">{b.title}</h3>
              <p className="text-text2">{b.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Services */}
      {relatedServices.length > 0 && (
        <Section tone="alt">
          <SectionHeading align="center" eyebrow="Services" title="Software Development Services" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map(s => (
              <Card key={s.slug} interactive className="relative p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-btn" style={{ background: `${s.color}18`, color: s.color }}>
                  <Icon name={s.icon} className="h-5 w-5" />
                </div>
                <h3 className="font-display text-card-title text-text">
                  <Link href={`/services/${s.slug}`} className="rounded-btn after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">{s.name}</Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-text2">{s.description}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Tech stack */}
      <Section containerClassName="container text-center">
        <SectionHeading align="center" eyebrow="Technology" title="Built With" />
        <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2.5">
          {TECH_STACK.map(t => (
            <li key={t} className="rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-gold-text">{t}</li>
          ))}
        </ul>
      </Section>

      {/* Process */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="Development Process" title="Our Standard Delivery Process" />
        <ol className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map(s => (
            <li key={s.num}>
              <Card className="h-full p-5">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-full border border-gold bg-card font-display text-sm font-semibold text-gold-text">
                  {s.num}
                </span>
                <h3 className="font-display text-card-title text-text">{s.title}</h3>
                <p className="mt-1.5 text-text2">{s.desc}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* Case study */}
      {caseStudy && (
        <Section>
          <SectionHeading align="center" eyebrow="Proven Work" title="A Real System We've Built" />
          <Card interactive className="group relative mx-auto mt-12 max-w-3xl p-8">
            <p className="eyebrow mb-2">{caseStudy.businessCategory}</p>
            <h3 className="mb-3 font-display text-card-title text-text">{caseStudy.name}</h3>
            <p className="mb-4 text-text2">{caseStudy.overview}</p>
            <Link href={`/projects/${caseStudy.slug}`} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-btn font-semibold text-gold-text after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
              Read the case study <ArrowUpRight className="h-4 w-4 transition-transform duration-base group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </Link>
          </Card>
        </Section>
      )}

      {/* FAQ */}
      <Section tone={caseStudy ? 'alt' : 'base'} containerClassName="container max-w-3xl">
        <SectionHeading align="center" eyebrow="FAQ" title="Common Questions" />
        <Accordion
          className="mt-12"
          items={data.faq.map((f, i) => ({ id: `faq-${i}`, question: f.q, answer: f.a }))}
        />
      </Section>

      {/* Direct CTA row */}
      <Section containerClassName="container text-center">
        <SectionHeading align="center" eyebrow="Get Started" title={`Ready to Build Your ${data.industryName} System?`} />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/book-demo" size="lg">
            Get Free Project Consultation <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Talk to a Software Expert
          </Button>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi KVL, I'm reaching out about a ${data.industryName} project.`)}`}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles('secondary', 'lg')}
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp Us
          </a>
        </div>
      </Section>

      <CtaBanner
        title={`Need Software Built for ${data.industryName}?`}
        desc="No local office, no middlemen — direct access to the India-based team that will actually build your system."
      />
    </>
  );
}
