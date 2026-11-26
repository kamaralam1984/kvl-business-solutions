import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2, ArrowRight, ExternalLink, Box,
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video, Network, Cloud, Brain,
  Megaphone, Palette, Users, Contact2, Webhook, Tag, Workflow,
  Factory, Truck, School, Hospital, Store, Building2, Landmark, UtensilsCrossed, Wallet,
} from 'lucide-react';
import { services } from '@/lib/data/services';
import { getServiceDetail } from '@/lib/data/service-details';
import { industries } from '@/lib/data/industries';
import { softwareProducts } from '@/lib/data/software';
import { caseStudies } from '@/lib/data/case-studies';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Button, Card, Panel, Section, SectionHeading } from '@/components/ui';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

const processSteps = [
  { num: '01', title: 'Discover',    desc: 'We learn the business, the goals and what the system actually needs to do.' },
  { num: '02', title: 'Planning',    desc: 'Scope, timeline and pricing get fixed in writing before any work begins.' },
  { num: '03', title: 'Design',      desc: 'We map the structure and interface before a single line of code is written.' },
  { num: '04', title: 'Development', desc: 'Engineers build the system, with weekly progress updates so nothing is a surprise.' },
  { num: '05', title: 'Testing',     desc: 'The system is reviewed and checked against the original requirements before it goes live.' },
  { num: '06', title: 'Deployment',  desc: 'We move the system into production and confirm it runs as intended.' },
  { num: '07', title: 'Support',     desc: 'Training and documentation come standard, plus a year of free updates and support.' },
];

// Every distinct `icon` value used across lib/data/services.ts and
// lib/data/industries.ts — the only two data sources whose icon strings can
// reach this component (service.icon, ind.icon, s.icon).
const ICON_MAP: Record<string, LucideIcon> = {
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video, Network, Cloud, Brain,
  Megaphone, Palette, Users, Contact2, Webhook, Tag, Workflow,
  Factory, Truck, School, Hospital, Store, Building2, Landmark, UtensilsCrossed, Wallet,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICON_MAP[name] || Box;
  return <Cmp className={className} />;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = services.find(s => s.slug === params.slug);
  const detail = getServiceDetail(params.slug);
  if (!service || !detail) return { title: 'Service not found' };
  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
    alternates: { canonical: `${SITE}/services/${service.slug}` },
    openGraph: {
      title: detail.metaTitle,
      description: detail.metaDescription,
      url: `${SITE}/services/${service.slug}`,
      type: 'website',
      images: [{ url: `/og?title=${encodeURIComponent(service.name)}`, width: 1200, height: 630, alt: service.name }],
    },
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find(s => s.slug === params.slug);
  const detail = getServiceDetail(params.slug);
  if (!service || !detail) notFound();

  const relatedSoftware = (detail.relatedSoftwareSlugs || [])
    .map(slug => softwareProducts.find(p => p.slug === slug))
    .filter(Boolean) as typeof softwareProducts;

  const relatedIndustries = detail.relatedIndustrySlugs
    .map(slug => industries.find(i => i.slug === slug))
    .filter(Boolean) as typeof industries[number][];

  const relatedCaseStudies = caseStudies.filter(c => c.relatedServiceSlugs.includes(service.slug));

  const otherServices = services.filter(s => s.slug !== service.slug).slice(0, 3);

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: detail.metaDescription,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: 'IN',
    url: `${SITE}/services/${service.slug}`,
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} id={`service-${service.slug}-jsonld`} />

      <PageHero
        eyebrow="SERVICES"
        title={service.name}
        description={detail.extendedDescription}
        breadcrumb={service.name}
        breadcrumbPath={[{ label: 'Services', href: '/services' }, { label: service.name }]}
      />

      {/* What This Includes */}
      <Section containerClassName="container grid gap-8 lg:grid-cols-[2fr_1fr]">
        <Panel className="p-7 sm:p-9">
          <SectionHeading eyebrow="Scope" title="What This Includes" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {detail.includes.map(item => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-text" aria-hidden />
                <span className="text-text2">{item}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Card className="self-start p-6">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-btn" style={{ background: `${service.color}18`, color: service.color }}>
            <Icon name={service.icon} className="h-6 w-6" />
          </div>
          <h2 className="font-display text-card-title text-text">{service.name}</h2>
          <p className="mb-5 mt-2 text-text2">{service.description}</p>
          {relatedSoftware.length > 0 && (
            <div className="mb-5">
              <h3 className="eyebrow mb-2">Related Software</h3>
              {relatedSoftware.map(p => (
                <Link key={p.slug} href={`/software/${p.slug}`} className="flex min-h-[44px] items-center justify-between rounded-btn font-semibold text-text transition-colors duration-base hover:text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                  {p.name} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ))}
            </div>
          )}
          <Button href="/contact" className="w-full">Talk to a Solution Architect</Button>
        </Card>
      </Section>

      {/* Industries We've Built This For */}
      {relatedIndustries.length > 0 && (
        <Section tone="alt">
          <SectionHeading align="center" eyebrow="Where This Fits" title="Industries We've Built This For" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedIndustries.map(ind => (
              <Card key={ind.slug} interactive className="relative p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-btn text-white" style={{ background: `linear-gradient(135deg, ${ind.c1}, ${ind.c2})` }}>
                  <Icon name={ind.icon} className="h-5 w-5" />
                </div>
                <h3 className="font-display text-card-title text-text">
                  <Link href={`/industries/${ind.slug}`} className="rounded-btn after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">{ind.name}</Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-text2">{ind.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* See It In Action */}
      {relatedCaseStudies.length > 0 && (
        <Section>
          <SectionHeading align="center" eyebrow="Real Work" title="See It In Action" />
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCaseStudies.map(c => (
              <Card key={c.slug} interactive className="group relative p-6">
                <span className="eyebrow mb-2 block">{c.industry}</span>
                <h3 className="flex items-center gap-1.5 font-display text-card-title text-text">
                  <Link href={`/projects/${c.slug}`} className="inline-flex min-h-[44px] items-center rounded-btn after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">{c.name}</Link>
                  <ExternalLink className="h-4 w-4 shrink-0 text-text3 transition-colors duration-base group-hover:text-gold-text" aria-hidden />
                </h3>
                <p className="mt-2 line-clamp-3 text-text2">{c.tagline}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Our Process */}
      <Section tone="alt">
        <SectionHeading
          align="center"
          eyebrow="How We Work"
          title="Our Standard Delivery Process"
          description={`The same process we run on every engagement — including ${service.name.toLowerCase()}.`}
        />
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

      {/* Other Services */}
      {otherServices.length > 0 && (
        <Section>
          <SectionHeading align="center" eyebrow="More Services" title="Other Ways We Can Help" />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {otherServices.map(s => (
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

      <CtaBanner
        title={`Ready to Talk About ${service.name}?`}
        desc="Book a free strategy call or request a proposal — talk directly with the engineer who'd build it."
      />
    </>
  );
}
