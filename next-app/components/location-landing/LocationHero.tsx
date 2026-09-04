import Link from 'next/link';
import { ChevronRight, ShieldCheck, Award, Sparkles, ArrowUpRight } from 'lucide-react';
import { HeroShowcaseSlider } from '@/components/home/HeroShowcaseSlider';
import { LiveRatingBadge } from '@/components/home/LiveRatingBadge';
import { JsonLd } from '@/components/shared/JsonLd';
import type { Software } from '@/lib/data/software';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

const trustBadges = [
  { Icon: ShieldCheck, label: 'NDA on Request',            color: '#10b981' },
  { Icon: Award,       label: 'MSME Registered',           color: '#c8a870' },
  { Icon: Sparkles,    label: 'Razorpay Verified Partner', color: '#c8a870' },
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
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: '48px', paddingBottom: '60px', background: 'rgb(var(--bg))' }}
    >
      <JsonLd data={breadcrumbJsonLd} id="location-hero-breadcrumb-jsonld" />

      {/* Layered background — matches the homepage hero */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 55% at 75% 35%, rgba(200,168,112,0.07) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(var(--surface) / 0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute bottom-0 inset-x-0 h-32" style={{
          background: 'linear-gradient(to top, rgb(var(--bg)) 0%, transparent 100%)',
        }} />
      </div>

      <div className="container relative z-10">

        {/* Breadcrumb */}
        <div className="inline-flex flex-wrap items-center gap-2 mb-5 text-xs" style={{ color: 'rgb(var(--text-2))' }}>
          <Link href="/" className="text-primary">Home</Link>
          {breadcrumbPath.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <ChevronRight className="w-3 h-3 self-center" />
              {item.href ? <Link href={item.href} className="text-primary">{item.label}</Link> : <span>{item.label}</span>}
            </span>
          ))}
        </div>

        {/* Eyebrow */}
        <div className="mb-6 animate-fade-up">
          <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] font-semibold uppercase" style={{ color: 'rgb(var(--gold-text))' }}>
            <span className="animate-line-draw" style={{ width: 24, height: 1, background: 'linear-gradient(90deg, #c8a870, transparent)', display: 'inline-block' }} />
            {eyebrow}
          </span>
        </div>

        <div className="grid lg:grid-cols-[56%_44%] gap-12 lg:gap-10 items-center">

          {/* Left column */}
          <div>
            <h1 className="font-sans font-black leading-[1.05] tracking-[-0.03em] mb-5" style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.6rem)', color: 'rgb(var(--text))' }}>
              {title}
            </h1>

            <p className="text-[17px] leading-[1.75] mb-9" style={{ color: 'rgb(var(--text-2))', maxWidth: '560px' }}>
              {description}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href={ctaPrimary.href}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[14px] transition-shadow duration-200 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
                style={{ background: '#0a0a0a', color: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.16)' }}
              >
                {ctaPrimary.text}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
              <Link
                href={ctaSecondary.href}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[14px] transition-colors duration-200 border hover:border-[#c8a870] hover:bg-[rgba(200,168,112,0.06)]"
                style={{ borderColor: 'rgba(var(--border) / 0.15)', color: 'rgb(var(--text))', background: 'transparent' }}
              >
                {ctaSecondary.text}
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-8" style={{ borderTop: '1px solid rgba(var(--border) / 0.08)' }}>
              {trustBadges.map(b => (
                <div key={b.label} className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'rgb(var(--text-2))' }}>
                  <b.Icon className="w-4 h-4 shrink-0" style={{ color: b.color }} />
                  {b.label}
                </div>
              ))}
              <LiveRatingBadge />
            </div>
          </div>

          {/* Right column — product showcase slider (desktop only) */}
          <div className="relative hidden lg:block hero-diagram-in">
            <HeroShowcaseSlider products={products} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-diagram-fade-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .hero-diagram-in { animation: hero-diagram-fade-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
      `}</style>
    </section>
  );
}
