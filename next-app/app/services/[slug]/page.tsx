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
      <section className="section">
        <div className="container grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="card-base p-7">
            <span className="eyebrow">Scope</span>
            <h2 className="text-2xl md:text-3xl font-extrabold my-3">What This Includes</h2>
            <ul className="grid sm:grid-cols-2 gap-3 mt-5">
              {detail.includes.map(item => (
                <li key={item} className="flex gap-2.5 items-start">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#c8a870' }} />
                  <span className="text-sm text-text2">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="card-premium p-6 self-start" style={{ borderColor: `${service.color}33` }}>
            <div className="w-12 h-12 rounded-xl grid place-items-center mb-4" style={{ background: `${service.color}18`, color: service.color }}>
              <Icon name={service.icon} className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">{service.name}</h3>
            <p className="text-text2 text-sm mb-5">{service.description}</p>
            {relatedSoftware.length > 0 && (
              <div className="space-y-2 mb-5">
                <div className="text-[11px] font-bold tracking-widest uppercase text-text2">Related Software</div>
                {relatedSoftware.map(p => (
                  <Link key={p.slug} href={`/software/${p.slug}`} className="flex items-center justify-between text-sm font-semibold hover:text-primary transition-colors">
                    {p.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            )}
            <Link href="/contact" className="btn btn-primary w-full justify-center">Talk to a Solution Architect</Link>
          </aside>
        </div>
      </section>

      {/* Industries We've Built This For */}
      {relatedIndustries.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="text-center mb-10">
              <span className="eyebrow">Where This Fits</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Industries We&apos;ve Built This For</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedIndustries.map(ind => (
                <Link key={ind.slug} href={`/industries/${ind.slug}`} className="card-base p-6 hover:shadow-card-hover transition-all">
                  <div className="w-11 h-11 rounded-xl grid place-items-center mb-4 text-white" style={{ background: `linear-gradient(135deg, ${ind.c1}, ${ind.c2})` }}>
                    <Icon name={ind.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{ind.name}</h3>
                  <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{ind.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* See It In Action */}
      {relatedCaseStudies.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10">
              <span className="eyebrow">Real Work</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">See It In Action</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {relatedCaseStudies.map(c => (
                <Link key={c.slug} href={`/projects/${c.slug}`} className="card-premium p-6 group block">
                  <span className="text-[10px] font-bold tracking-widest uppercase mb-2 block" style={{ color: '#a3814f' }}>{c.industry}</span>
                  <h3 className="font-bold text-sm mb-1.5 flex items-center gap-1.5">
                    {c.name} <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-3">{c.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Process */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">How We Work</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Our Standard Delivery Process</h2>
            <p className="text-text2 max-w-xl mx-auto">The same process we run on every engagement — including {service.name.toLowerCase()}.</p>
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

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10">
              <span className="eyebrow">More Services</span>
              <h2 className="text-2xl md:text-3xl font-extrabold my-4">Other Ways We Can Help</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {otherServices.map(s => (
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

      <CtaBanner
        title={`Ready to Talk About ${service.name}?`}
        desc="Book a free strategy call or request a proposal — talk directly with the engineer who'd build it."
      />
    </>
  );
}
