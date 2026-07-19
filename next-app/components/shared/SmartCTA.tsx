'use client';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Gauge, Bot } from 'lucide-react';
import { openLeadMagnet } from '@/components/widgets/LeadMagnetModal';
import { trackEvent } from '@/components/analytics/track';

// One CTA band, shown above the footer on every public page, whose copy
// changes based on section — so a visitor reading an AI-automation page
// sees an AI-consultation offer, not a generic "contact us." Not full
// per-page personalization (that would mean a config entry per URL, which
// doesn't scale) — just per-section, which covers the real intent signal
// a URL path already gives us for free.
function pickVariant(pathname: string | null) {
  const p = pathname || '';
  if (p.includes('/services/ai') || p.includes('automation') || p.includes('/software')) {
    return {
      type: 'ai-consultation' as const,
      Icon: Bot,
      eyebrow: 'FREE 30-MINUTE CALL',
      title: 'Wondering what AI/automation could save your team?',
      cta: 'Book Free AI Consultation',
    };
  }
  return {
    type: 'audit' as const,
    Icon: Gauge,
    eyebrow: 'FREE, NO OBLIGATION',
    title: 'Get a free audit of your current website or software setup',
    cta: 'Get My Free Audit',
  };
}

// Pages whose entire purpose is already a conversion flow — showing another
// CTA band on top of them competes with the page's own primary action
// instead of reinforcing it.
const EXCLUDED_PREFIXES = ['/contact', '/book-demo', '/register', '/login', '/dashboard', '/checkout', '/support'];

export function SmartCTA() {
  const pathname = usePathname();
  if (EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  const v = pickVariant(pathname);

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-tint bg-app2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 grid place-items-center shrink-0">
              <v.Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wide text-primary">{v.eyebrow}</span>
              <h3 className="text-lg md:text-xl font-bold mt-1">{v.title}</h3>
            </div>
          </div>
          <button
            onClick={() => {
              trackEvent('cta_click', { label: v.cta, placement: 'smart-cta-band', path: pathname });
              openLeadMagnet(v.type);
            }}
            className="btn btn-primary shrink-0 whitespace-nowrap"
          >
            {v.cta} <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
