import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowUpRight, CheckCircle2, ExternalLink, Compass,
  TrendingUp, Radar, BarChart3, Clock, Eye, Wand2, Scissors, Layers, Map,
  ShieldCheck, Locate, SlidersHorizontal, Sparkles, MessageCircle, Building2,
  MapPin, ShieldAlert, Users, BatteryMedium, Globe, Receipt, CalendarCheck,
  Truck, ShoppingCart,
  LaptopMinimal, Smartphone, Satellite, HardHat, Cog, Bot, Video, Network,
  Cloud, Brain, Megaphone, Palette, Contact2, Webhook, Tag, Workflow, Box,
  GitBranch, Wallet, Target, FileText, Send, CalendarClock, RefreshCw,
  GraduationCap, Code2, Server, Newspaper, LogIn, Camera, Moon, Hand,
  type LucideIcon,
} from 'lucide-react';
import { type CaseStudy } from '@/lib/data/case-studies';
import { getLiveCaseStudy, getLiveCaseStudies } from '@/lib/data/live-case-studies';
import { services } from '@/lib/data/services';
import { industries } from '@/lib/data/industries';
import { JsonLd } from '@/components/shared/JsonLd';
import { Badge, Button, buttonStyles, Card, Section, SectionHeading } from '@/components/ui';
import { CtaBanner } from '@/components/home/CtaBanner';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const absoluteUrl = (src: string) => (src.startsWith('http') ? src : `${SITE}${src}`);

// Re-generated every 5 minutes (and on-demand for slugs not pre-rendered at
// build time) so Admin → Case Studies entries show up without a full redeploy.
export const revalidate = 300;

const processSteps = [
  { num: '01', title: 'Discover',    desc: 'We learn the business, the goals and what the system actually needs to do.' },
  { num: '02', title: 'Planning',    desc: 'Scope, timeline and pricing get fixed in writing before any work begins.' },
  { num: '03', title: 'Design',      desc: 'We map the structure and interface before a single line of code is written.' },
  { num: '04', title: 'Development', desc: 'Engineers build the system, with weekly progress updates so nothing is a surprise.' },
  { num: '05', title: 'Testing',     desc: 'The system is reviewed and checked against the original requirements before it goes live.' },
  { num: '06', title: 'Deployment',  desc: 'We move the system into production and confirm it runs as intended.' },
  { num: '07', title: 'Support',     desc: 'Training and documentation come standard, plus a year of free updates and support.' },
];

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp, Radar, BarChart3, Clock, Eye, Wand2, Scissors, Layers, Map,
  ShieldCheck, Locate, SlidersHorizontal, Sparkles, MessageCircle, Building2,
  MapPin, ShieldAlert, Users, BatteryMedium, Globe, Receipt, CalendarCheck,
  Truck, ShoppingCart,
  LaptopMinimal, Smartphone, Satellite, HardHat, Cog, Bot, Video, Network,
  Cloud, Brain, Megaphone, Palette, Contact2, Webhook, Tag, Workflow, Box,
  GitBranch, Wallet, Target, FileText, Send, CalendarClock, RefreshCw,
  GraduationCap, Code2, Server, Newspaper, LogIn, Camera, Moon, Hand,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICON_MAP[name] || Box;
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

export async function generateStaticParams() {
  const caseStudies = await getLiveCaseStudies();
  return caseStudies.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = await getLiveCaseStudy(params.slug);
  if (!c) return { title: 'Case study not found' };
  return {
    title: c.seo.title,
    description: c.seo.description,
    alternates: { canonical: `${SITE}/projects/${c.slug}` },
    openGraph: {
      title: c.seo.title,
      description: c.seo.description,
      url: `${SITE}/projects/${c.slug}`,
      images: [{ url: absoluteUrl(c.images.hero) }],
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const [study, allStudies] = await Promise.all([
    getLiveCaseStudy(params.slug),
    getLiveCaseStudies(),
  ]);
  if (!study) notFound();

  const related = rankRelatedCaseStudies(study, allStudies, 3);
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
    image: absoluteUrl(study.images.hero),
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
      <section className="border-b border-line bg-bg2 pb-[var(--section-y)] pt-16 sm:pt-20">
        <div className="container">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-text2">
            <Link href="/" className="inline-flex min-h-[44px] items-center rounded text-gold-text hover:underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link href="/projects" className="inline-flex min-h-[44px] items-center rounded text-gold-text hover:underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">Projects</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span aria-current="page">{study.name}</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <Badge className="uppercase tracking-wider">{study.industry}</Badge>
                <Badge className="uppercase tracking-wider !text-text2">{study.businessCategory}</Badge>
                {relatedIndustry && (
                  <Link
                    href={`/industries/${relatedIndustry.slug}`}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-text transition-shadow duration-base hover:shadow-soft-1 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                  >
                    <Compass className="h-3.5 w-3.5" aria-hidden /> {relatedIndustry.name}
                  </Link>
                )}
              </div>
              <h1 className="mb-4 font-display text-hero text-text">{study.name}</h1>
              <p className="mb-3 text-body-lg text-text">{study.tagline}</p>
              <p className="mb-8 max-w-xl text-body-lg text-text2">{study.overview}</p>
              <div className="flex flex-wrap gap-3">
                <a href={study.url} target="_blank" rel="noreferrer" className={buttonStyles('primary', 'lg')}>
                  Visit Live Site <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
                <Button href="/contact" variant="secondary" size="lg">
                  Need Something Similar? <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-card border border-line shadow-soft-3">
              <Badge className="absolute left-3 top-3 z-10 uppercase tracking-wider">Live Product</Badge>
              <Image
                src={study.images.hero}
                alt={`${study.name} dashboard on desktop`}
                width={1440}
                height={900}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Business Challenge */}
      <Section containerClassName="max-w-3xl">
        <SectionHeading eyebrow="The Business Challenge" title={study.challenge.headline} />
        <p className="mt-4 text-body-lg text-text2">{study.challenge.body}</p>
      </Section>

      {/* SECTION 3 — Business Goals */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="Business Goals" title="What the Project Needed to Achieve" className="mb-10" />
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {study.goals.map(g => (
            <Card key={g} className="flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-text" aria-hidden />
              <span className="text-text">{g}</span>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 4 — Our Solution */}
      <Section>
        <SectionHeading eyebrow="Our Solution" title={study.solution.headline} description={study.solution.body} className="mb-10" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {study.solution.pillars.map(p => (
            <Card key={p.title} className="p-6">
              <h3 className="mb-2 font-display text-card-title text-text">{p.title}</h3>
              <p className="text-text2">{p.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 5 — Key Features */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="Key Features" title={`What ${study.name} Does`} className="mb-10" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {study.keyFeatures.map(f => (
            <Card key={f.title} className="p-6">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-btn bg-gold/15 text-gold-text">
                <Icon name={f.icon} className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-text">{f.title}</h3>
              <p className="text-text2">{f.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 6 — Technology */}
      <Section>
        <SectionHeading align="center" eyebrow="Technology" title="Built With" className="mb-8" />
        <ul className="mx-auto flex max-w-lg flex-wrap justify-center gap-2.5">
          {study.tech.map(t => (
            <li key={t}><Badge className="px-3.5 py-1.5 text-sm font-medium">{t}</Badge></li>
          ))}
        </ul>
      </Section>

      {/* SECTION 7 — Development Process */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="How We Built It" title="Our Standard Delivery Process" description="The same process we run on every engagement — including this one." className="mb-10" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {processSteps.map(s => (
            <Card key={s.num} className="p-5">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-gold/15 text-sm font-bold text-gold-text">
                {s.num}
              </div>
              <h3 className="mb-1.5 font-display text-card-title text-text">{s.title}</h3>
              <p className="text-text2">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 8 — Business Benefits */}
      <Section>
        <SectionHeading align="center" eyebrow="Business Benefits" title="What This Changes" className="mb-10" />
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
          {study.benefits.map(b => (
            <Card key={b.title} className="p-6">
              <h3 className="mb-2 font-display text-card-title text-text">{b.title}</h3>
              <p className="text-text2">{b.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 9 — Gallery */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="Gallery" title="See It In Action" className="mb-10" />
        <div className="grid items-start gap-6 md:grid-cols-3">
          {study.images.gallery.map(g => (
            <Card key={g.device} className="overflow-hidden">
              <Image
                src={g.src}
                alt={g.alt}
                width={g.device === 'desktop' ? 1440 : g.device === 'tablet' ? 834 : 390}
                height={g.device === 'desktop' ? 900 : g.device === 'tablet' ? 1112 : 844}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="h-auto w-full"
                loading="lazy"
              />
              <div className="p-3 text-center text-xs font-bold uppercase tracking-wider text-text2">{g.device}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 10 — Related Services */}
      {relatedServices.length > 0 && (
        <Section>
          <SectionHeading align="center" eyebrow="Related Services" title="Need Something Like This?" className="mb-10" />
          <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
            {relatedServices.map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                <Card interactive className="h-full p-6">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-btn bg-gold/15 text-gold-text">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 font-display text-card-title text-text">{s.name}</h3>
                  <p className="line-clamp-2 text-text2">{s.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* SECTION 11 — Related Projects */}
      {related.length > 0 && (
        <Section tone="alt">
          <SectionHeading align="center" eyebrow="More Real Projects" title="Other Live Products We've Built" className="mb-10" />
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map(r => (
              <Link key={r.slug} href={`/projects/${r.slug}`} className="group block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                <Card interactive className="h-full overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={r.images.hero}
                      alt={`${r.name} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-slow ease-brand motion-reduce:transition-none group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gold-text">{r.industry}</div>
                    <h3 className="mb-1.5 font-display text-card-title text-text">{r.name}</h3>
                    <p className="line-clamp-2 text-text2">{r.overview}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ (feeds FAQPage schema above) */}
      <Section containerClassName="max-w-3xl">
        <SectionHeading align="center" eyebrow="FAQ" title="Common Questions" className="mb-10" />
        <div className="space-y-5">
          {study.faq.map(f => (
            <Card key={f.q} className="p-6">
              <div className="mb-2 font-bold text-text">{f.q}</div>
              <div className="leading-relaxed text-text2">{f.a}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 12 — Final CTA */}
      <CtaBanner
        title={`Need Software Like ${study.name}?`}
        desc="Book a free strategy call or request a proposal — talk directly with the engineer who'd build it."
      />
    </>
  );
}
