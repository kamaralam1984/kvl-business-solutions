import Link from 'next/link';
import { ChevronRight, ShieldCheck, Award, Sparkles, ArrowUpRight } from 'lucide-react';
import { buttonStyles } from '@/components/ui/Button';
import { HeroShowcaseSlider } from '@/components/home/HeroShowcaseSlider';
import { LiveRatingBadge } from '@/components/home/LiveRatingBadge';
import { JsonLd } from '@/components/shared/JsonLd';
import type { Software } from '@/lib/data/software';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

const trustBadges = [
  { Icon: ShieldCheck, label: 'NDA on Request' },
  { Icon: Award,       label: 'MSME Registered' },
  { Icon: Sparkles,    label: 'Razorpay Verified Partner' },
];

type BreadcrumbItem = { label: string; href?: string };

// Same two-column, product-slider hero as the homepage (components/home/Hero.tsx),
// reused here so /india and every /india/{state} page reads as one modern
// system with the homepage rather than falling back to the plainer internal
// PageHero used by service/industry/blog pages.
export function LocationHero({
  eyebrow, title, description, breadcrumbPath, products,
  ctaPrimary, ctaSecondary,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbPath: BreadcrumbItem[];
  products: Software[];
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
}) {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      ...breadcrumbPath.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <section className="relative overflow-hidden bg-hero pb-[var(--section-y)] pt-28 lg:pt-32">
      <JsonLd data={breadcrumbJsonLd} id="location-hero-breadcrumb-jsonld" />

      {/* Static brand glow, no animation */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 78% 30%, rgba(200,168,112,0.16) 0%, transparent 65%)' }} />

      <div className="container relative z-10">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-text2">
          <Link href="/" className="inline-flex min-h-[44px] items-center rounded-btn text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">Home</Link>
          {breadcrumbPath.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5 self-center" aria-hidden />
              {item.href
                ? <Link href={item.href} className="inline-flex min-h-[44px] items-center rounded-btn text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">{item.label}</Link>
                : <span>{item.label}</span>}
            </span>
          ))}
        </nav>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-5">{eyebrow}</p>

            <h1 className="font-display text-hero text-text">{title}</h1>

            <p className="mt-6 max-w-[560px] text-body-lg text-text2">{description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={ctaPrimary.href} className={buttonStyles('primary', 'lg', 'group')}>
                {ctaPrimary.text}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link href={ctaSecondary.href} className={buttonStyles('secondary', 'lg')}>
                {ctaSecondary.text}
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
              {trustBadges.map(b => (
                <li key={b.label} className="flex items-center gap-2 text-sm font-medium text-text2">
                  <b.Icon className="h-4 w-4 shrink-0 text-gold-text" aria-hidden />
                  {b.label}
                </li>
              ))}
              <li><LiveRatingBadge /></li>
            </ul>
          </div>

          {/* Product showcase slider (desktop only) */}
          <div className="relative hidden lg:block">
            <HeroShowcaseSlider products={products} />
          </div>
        </div>
      </div>
    </section>
  );
}
