import { ShieldCheck, Award, Sparkles, ArrowUpRight } from 'lucide-react';
import { SplitText } from '@/components/studio/SplitText';
import { HeroShowcaseSlider } from './HeroShowcaseSlider';
import { LiveRatingBadge } from './LiveRatingBadge';
import { StatsBar } from './StatsBar';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { buttonStyles } from '@/components/ui/Button';
import type { Software } from '@/lib/data/software';

const trustBadges = [
  { Icon: ShieldCheck, label: 'NDA on Request' },
  { Icon: Award,       label: 'MSME Registered' },
  { Icon: Sparkles,    label: 'Razorpay Verified Partner' },
];

/* Server component. The H1 is the LCP element and renders with no entrance
   animation (animating the LCP candidate delays its paint until after JS
   hydration). Hover/focus states are CSS only. The product slider on the
   right is the one client island here, along with the stats counters. */
type HeroSettings = {
  heroEyebrow?: string; heroTitle?: string; heroAccent?: string; heroDescription?: string;
  heroCtaText?: string; heroCtaLink?: string; heroSecondaryCtaText?: string; heroSecondaryCtaLink?: string;
};

export function Hero({
  settings, products, caseStudyCount,
}: { settings?: HeroSettings | null; products: Software[]; caseStudyCount: number }) {
  const eyebrow = settings?.heroEyebrow || 'Enterprise Software, Engineered in India';
  const title = settings?.heroTitle || 'Custom Software Development';
  const accent = settings?.heroAccent || 'Purpose-Built Software. Precision Engineered for Your Business.';
  const description = settings?.heroDescription || 'Custom ERP, CRM, and AI automation built around how your business actually runs — so operations move faster, decisions are backed by real data, and nothing breaks when it matters most. Trusted by hospital networks, government bodies, and enterprises that cannot afford downtime.';
  const ctaText = settings?.heroCtaText || 'Talk to a Solution Architect';
  const ctaLink = settings?.heroCtaLink || '/book-demo';
  const secondaryCtaText = settings?.heroSecondaryCtaText || 'See Live Case Studies';
  const secondaryCtaLink = settings?.heroSecondaryCtaLink || '/projects';

  return (
    <section className="relative overflow-hidden bg-hero pt-28 pb-[var(--section-y)] lg:pt-36">
      {/* Constant brand glow — static, no animation */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 78% 30%, rgba(200,168,112,0.16) 0%, transparent 65%)' }} />

      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-5">{eyebrow}</p>

            <h1 className="sx-split font-display text-hero text-text"><SplitText>{title}</SplitText></h1>

            <p className="mt-4 font-display text-xl font-semibold text-gold-text">{accent}</p>

            <p className="mt-6 max-w-[540px] text-body-lg text-text2">{description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <TrackedLink href={ctaLink} label={ctaText} placement="hero-primary" className={buttonStyles('primary', 'lg', 'group')}>
                {ctaText}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </TrackedLink>
              <TrackedLink href={secondaryCtaLink} label={secondaryCtaText} placement="hero-secondary" className={buttonStyles('secondary', 'lg')}>
                {secondaryCtaText}
              </TrackedLink>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {trustBadges.map(b => (
                <li key={b.label} className="flex items-center gap-2 text-sm font-medium text-text2">
                  <b.Icon className="h-4 w-4 shrink-0 text-gold-text" aria-hidden />
                  {b.label}
                </li>
              ))}
              <li><LiveRatingBadge /></li>
            </ul>
          </div>

          {/* Browser-frame product slider (desktop only) */}
          <div className="hidden lg:block">
            <HeroShowcaseSlider products={products} />
          </div>
        </div>

        <div className="mt-14 lg:mt-16">
          <StatsBar productCount={products.length} caseStudyCount={caseStudyCount} />
        </div>
      </div>
    </section>
  );
}
