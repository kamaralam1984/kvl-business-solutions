import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from './JsonLd';
import { SplitText } from '@/components/studio/SplitText';

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
    <section className="sx-hero relative overflow-hidden bg-hero pb-[var(--section-y)] pt-28 lg:pt-36">
      <JsonLd data={breadcrumbJsonLd} id="breadcrumb-jsonld" />
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(200,168,112,0.14) 0%, transparent 70%)' }} />
      <div className="container relative z-10">
        <div className="sx-hero-in max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-text2">
              <li><Link href="/" className="inline-flex min-h-[44px] items-center rounded-btn hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">Home</Link></li>
              {path.map((item, i) => (
                <li key={i} className="inline-flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  {item.href ? (
                    <Link href={item.href} className="inline-flex min-h-[44px] items-center rounded-btn hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">{item.label}</Link>
                  ) : (
                    <span aria-current="page" className="text-text">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="sx-split font-display text-hero text-text">
            <SplitText>{title} {accent && <span className="text-gold-text">{accent}</span>}</SplitText>
          </h1>
          <p className="mt-5 text-body-lg text-text2">{description}</p>
        </div>
      </div>
    </section>
  );
}
