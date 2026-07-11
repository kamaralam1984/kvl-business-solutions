import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';
import { JsonLd } from './JsonLd';

const SITE_ROOT = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

type BreadcrumbPathItem = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  breadcrumb,
  breadcrumbPath,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  breadcrumb: string;
  breadcrumbPath?: BreadcrumbPathItem[];
}) {
  const path: BreadcrumbPathItem[] = breadcrumbPath ?? [{ label: breadcrumb }];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ROOT },
      ...path.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE_ROOT}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <section className="relative pt-20 pb-16 text-center bg-app2 border-b border-tint overflow-hidden">
      <JsonLd data={breadcrumbJsonLd} id="breadcrumb-jsonld" />
      <ParticleBackground />
      <div className="absolute inset-0 blueprint pointer-events-none opacity-60" />
      <div className="container relative z-10">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="text-4xl md:text-6xl font-black mt-4 mb-4">
          {title} {accent && <span className="gradient-text">{accent}</span>}
        </h1>
        <p className="text-text2 max-w-2xl mx-auto">{description}</p>
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-text2">
          <Link href="/" className="text-primary">Home</Link>
          {path.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <ChevronRight className="w-3 h-3 self-center" />
              {item.href ? (
                <Link href={item.href} className="text-primary">{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
