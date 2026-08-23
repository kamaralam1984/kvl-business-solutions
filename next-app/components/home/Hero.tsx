import Link from 'next/link';
import { ShieldCheck, Award, Sparkles, ArrowUpRight } from 'lucide-react';
import { HeroShowcaseSlider } from './HeroShowcaseSlider';
import { LiveRatingBadge } from './LiveRatingBadge';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import type { Software } from '@/lib/data/software';

/* ── Static data ─────────────────────────────────────── */
const trustBadges = [
  { Icon: ShieldCheck, label: 'NDA on Request',           color: '#10b981' },
  { Icon: Award,       label: 'MSME Registered',          color: '#c8a870' },
  { Icon: Sparkles,    label: 'Razorpay Verified Partner', color: '#c8a870' },
];

/* ── Component ──────────────────────────────────────── */
/* Server component. The H1 below is the page's LCP element; it (and the
   rest of the left column) renders immediately with no entrance animation,
   since animating in the LCP candidate delays its final paint until after
   JS hydration — a large Core Web Vitals regression on throttled mobile
   CPUs. Button hover states use Tailwind's `hover:` classes instead of JS
   event handlers. The right-column product slider is desktop-only and is
   the one client-hydrated island in this section. */
type HeroSettings = {
  heroEyebrow?: string; heroTitle?: string; heroAccent?: string; heroDescription?: string;
  heroCtaText?: string; heroCtaLink?: string; heroSecondaryCtaText?: string; heroSecondaryCtaLink?: string;
};

export function Hero({ settings, products }: { settings?: HeroSettings | null; products: Software[] }) {
  const eyebrow = settings?.heroEyebrow || 'Enterprise Software, Engineered in India';
  const title = settings?.heroTitle || 'Custom Software Development';
  const accent = settings?.heroAccent || 'Purpose-Built Software. Precision Engineered for Your Business.';
  const description = settings?.heroDescription || 'Custom ERP, CRM, and AI automation built around how your business actually runs — so operations move faster, decisions are backed by real data, and nothing breaks when it matters most. Trusted by hospital networks, government bodies, and enterprises that cannot afford downtime.';
  const ctaText = settings?.heroCtaText || 'Talk to a Solution Architect';
  const ctaLink = settings?.heroCtaLink || '/book-demo';
  const secondaryCtaText = settings?.heroSecondaryCtaText || 'See Live Case Studies';
  const secondaryCtaLink = settings?.heroSecondaryCtaLink || '/projects';

  return (
    <section
      className="relative min-h-[92svh] flex items-center overflow-hidden"
      style={{ paddingTop: '80px', paddingBottom: '60px', background: 'rgb(var(--bg))' }}
    >
      {/* ── Layered Background (CSS only) ── */}
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

      {/* ── Main Container ────────────────────────── */}
      <div className="container relative z-10">

        {/* Eyebrow */}
        <div className="mb-8 animate-fade-up">
          <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] font-semibold uppercase"
            style={{ color: 'rgb(var(--gold-text))' }}
          >
            <span className="animate-line-draw" style={{ width: 24, height: 1, background: 'linear-gradient(90deg, #c8a870, transparent)', display: 'inline-block' }} />
            {eyebrow}
          </span>
        </div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-[56%_44%] gap-12 lg:gap-10 items-center">

          {/* ══ LEFT COLUMN ════════════════════════ */}
          <div>

            {/* Headline — the LCP element */}
            <h1
              className="font-sans font-black leading-[1.05] tracking-[-0.03em] mb-3"
              style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.3rem)', color: 'rgb(var(--text))' }}
            >
              {title}
            </h1>

            {/* Tagline — sized above the description below so the intended
                emphasis (H1 > tagline > description) actually reads that way. */}
            <p
              className="font-semibold mb-7"
              style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)', color: 'rgb(var(--gold-text))' }}
            >
              {accent}
            </p>

            {/* Subheadline */}
            <p
              className="text-[17px] leading-[1.75] mb-9"
              style={{ color: 'rgb(var(--text-2))', maxWidth: '540px' }}
            >
              {description}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <TrackedLink
                href={ctaLink}
                label={ctaText}
                placement="hero-primary"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[14px] transition-shadow duration-200 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
                style={{ background: '#0a0a0a', color: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.16)' }}
              >
                {ctaText}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </TrackedLink>

              <TrackedLink
                href={secondaryCtaLink}
                label={secondaryCtaText}
                placement="hero-secondary"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[14px] transition-colors duration-200 border hover:border-[#c8a870] hover:bg-[rgba(200,168,112,0.06)]"
                style={{ borderColor: 'rgba(var(--border) / 0.15)', color: 'rgb(var(--text))', background: 'transparent' }}
              >
                {secondaryCtaText}
              </TrackedLink>
            </div>

            {/* Trust strip */}
            <div
              className="flex flex-wrap gap-x-6 gap-y-3 pt-8"
              style={{ borderTop: '1px solid rgba(var(--border) / 0.08)' }}
            >
              {trustBadges.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'rgb(var(--text-2))' }}>
                  <b.Icon className="w-4 h-4 shrink-0" style={{ color: b.color }} />
                  {b.label}
                </div>
              ))}
              <LiveRatingBadge />
            </div>
          </div>

          {/* ══ RIGHT COLUMN — Product showcase slider (desktop only, client island) ══ */}
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
