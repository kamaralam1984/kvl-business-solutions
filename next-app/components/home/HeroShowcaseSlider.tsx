'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronLeft, ChevronRight,
  Box, CheckCircle2, Globe, TrendingUp, Building2, Code2, Handshake, Receipt, Network, Boxes,
  Satellite, GraduationCap, Stethoscope, HardHat, Wrench, BadgeIndianRupee, Fingerprint, Brain,
  UtensilsCrossed, Hotel, Radar, BarChart3, Map, ShieldCheck, Locate, MapPin, ShieldAlert, Users,
  CalendarCheck, Truck,
} from 'lucide-react';
import type { Software } from '@/lib/data/software';
import { caseStudies } from '@/lib/data/case-studies';

// Icons reachable via the slide's `icon` field (case-study icon or a software
// product's icon) or a case study's `keyFeatures[].icon` — every value that
// currently appears across lib/data/case-studies.ts and lib/data/software.ts.
const ICON_MAP: Record<string, LucideIcon> = {
  Box, CheckCircle2, Globe, TrendingUp, Building2, Code2, Handshake, Receipt, Network, Boxes,
  Satellite, GraduationCap, Stethoscope, HardHat, Wrench, BadgeIndianRupee, Fingerprint, Brain,
  UtensilsCrossed, Hotel, Radar, BarChart3, Map, ShieldCheck, Locate, MapPin, ShieldAlert, Users,
  CalendarCheck, Truck,
};

const shortLabel = (name: string) =>
  name.replace(/ Software$/, '').replace(/ Management$/, '').replace(/ System$/, '');

// Rotating VFX accent per slide — picked deterministically from the slide
// index (not Math.random()) so the first-render color matches on the server
// and client and doesn't cause a hydration mismatch.
const GLOW_COLORS = ['#c8a870', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6', '#f59e0b'];

const liveSlides = caseStudies.map(c => ({
  kind: 'live' as const,
  key: c.slug,
  name: c.name,
  image: c.images.hero,
  category: c.industry,
  addressBar: c.url.replace(/^https?:\/\//, ''),
  icon: 'Globe',
  features: c.keyFeatures.slice(0, 3).map(f => ({ title: f.title, icon: f.icon as string | null })),
  detailHref: `/projects/${c.slug}`,
  demoHref: c.url,
  demoExternal: true,
}));

// Software slides come from the live, admin-editable catalog (fetched below) —
// not the static file — so a price/name/image edit in Admin → Products shows
// up here too.
function buildSoftwareSlides(products: Software[]) {
  return products.map(p => ({
    kind: 'software' as const,
    key: p.slug,
    name: shortLabel(p.name),
    image: p.image,
    category: p.category,
    addressBar: `kvlbusinesssolutions.com/software/${p.slug}`,
    icon: p.icon,
    features: p.features.slice(0, 3).map(title => ({ title, icon: null as string | null })),
    detailHref: `/software/${p.slug}`,
    demoHref: `/software/${p.slug}/demo`,
    demoExternal: false,
  }));
}

export function HeroShowcaseSlider() {
  const [products, setProducts] = useState<Software[] | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => setProducts([]));
  }, []);

  const slides = products == null ? null : [...liveSlides, ...buildSoftwareSlides(products)];
  const total = slides?.length || 0;

  const go = useCallback((dir: 1 | -1) => { setDirection(dir); setIndex(i => (i + dir + total) % total); }, [total]);

  useEffect(() => {
    if (!total || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => { setDirection(1); setIndex(i => (i + 1) % total); }, 4500);
    return () => clearInterval(t);
  }, [paused, total]);

  if (!slides || slides.length === 0) return null;
  const slide = slides[index];
  const FooterIcon = ICON_MAP[slide.icon] || Box;
  const glowA = GLOW_COLORS[index % GLOW_COLORS.length];
  const glowB = GLOW_COLORS[(index + 3) % GLOW_COLORS.length];

  return (
    <div
      className="relative w-full max-w-[440px] mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* VFX glow — two blurred blobs drifting behind the card, recolored per
          slide and transitioning smoothly (CSS-only, no animation library —
          keeps this section's JS payload small). */}
      <div className="absolute -inset-10 pointer-events-none" aria-hidden>
        <div
          key={`glowA-${index}`}
          className="absolute top-0 left-1/4 w-56 h-56 rounded-full"
          style={{
            background: glowA,
            filter: 'blur(60px)',
            opacity: 0.55,
            transition: 'background 0.7s ease',
            animation: 'vfxGlowDrift 7s ease-in-out infinite',
          }}
        />
        <div
          key={`glowB-${index}`}
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full"
          style={{
            background: glowB,
            filter: 'blur(70px)',
            opacity: 0.45,
            transition: 'background 0.7s ease',
            animation: 'vfxGlowDriftAlt 9s ease-in-out infinite',
          }}
        />
      </div>

      <div
        key={`card-${slide.key}`}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'rgb(var(--bg-2))',
          border: '1px solid rgba(var(--border) / 0.08)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.10)',
          animation: `${direction === 1 ? 'slideInRight' : 'slideInLeft'} 0.5s cubic-bezier(0.22,1,0.36,1) both`,
        }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(var(--border) / 0.08)' }}>
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#f04f4f' }} />
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#f0b429' }} />
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#27c93f' }} />
          <span className="ml-2 flex-1 truncate text-[11px]" style={{ color: 'rgba(var(--text) / 0.4)' }}>{slide.addressBar}</span>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0 whitespace-nowrap" style={{ background: 'rgba(var(--text) / 0.06)', color: 'rgba(var(--text) / 0.55)' }}>
            {slide.kind === 'live' ? 'Live Product' : '7-Day Free Trial'}
          </span>
        </div>

        {/* Screenshot */}
        <div className="relative aspect-[16/10]">
          <Image src={slide.image} alt={slide.name} fill sizes="440px" className="object-cover" />
          <span
            className="absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}
          >
            {slide.category}
          </span>
        </div>

        <div className="p-5">
          {/* CTA buttons */}
          <div className="flex gap-2.5 mb-5">
            <Link
              href={slide.detailHref}
              className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-bold"
              style={{ background: '#0a0a0a', color: '#fff' }}
            >
              Get Started
            </Link>
            {slide.demoExternal ? (
              <a
                href={slide.demoHref}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-semibold border"
                style={{ borderColor: 'rgba(var(--border) / 0.15)', color: 'rgb(var(--text))' }}
              >
                View Demo
              </a>
            ) : (
              <Link
                href={slide.demoHref}
                className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-semibold border"
                style={{ borderColor: 'rgba(var(--border) / 0.15)', color: 'rgb(var(--text))' }}
              >
                View Demo
              </Link>
            )}
          </div>

          {/* Feature row */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {slide.features.map((f, i) => {
              const FeatureIcon = f.icon ? (ICON_MAP[f.icon] || CheckCircle2) : CheckCircle2;
              return (
                <div key={i} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(var(--text) / 0.03)' }}>
                  <FeatureIcon className="w-4 h-4 mx-auto mb-1.5" style={{ color: '#c8a870' }} />
                  <div className="text-[10.5px] font-medium leading-tight truncate" style={{ color: 'rgb(var(--text-2))' }}>{f.title}</div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(var(--border) / 0.08)' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-lg grid place-items-center shrink-0" style={{ background: 'rgba(200,168,112,0.10)' }}>
                <FooterIcon className="w-3.5 h-3.5" style={{ color: '#c8a870' }} />
              </span>
              <span className="text-[13px] font-bold truncate" style={{ color: 'rgb(var(--text))' }}>{slide.name}</span>
            </div>
            {slide.kind === 'live' && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold shrink-0" style={{ color: '#16a34a' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} /> Live website
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        aria-label="Previous product"
        onClick={() => go(-1)}
        className="absolute left-0 top-[38%] -translate-y-1/2 -translate-x-4 w-9 h-9 rounded-full grid place-items-center"
        style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}
      >
        <ChevronLeft className="w-4 h-4" style={{ color: 'rgb(var(--text))' }} />
      </button>
      <button
        aria-label="Next product"
        onClick={() => go(1)}
        className="absolute right-0 top-[38%] -translate-y-1/2 translate-x-4 w-9 h-9 rounded-full grid place-items-center"
        style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}
      >
        <ChevronRight className="w-4 h-4" style={{ color: 'rgb(var(--text))' }} />
      </button>

      {/* Dots */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-5">
        {slides.map((s, i) => (
          <button
            key={s.key}
            aria-label={`Go to ${s.name}`}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className="rounded-full transition-all duration-300"
            style={{ width: i === index ? 16 : 6, height: 6, background: i === index ? '#c8a870' : 'rgba(var(--text) / 0.15)' }}
          />
        ))}
      </div>
    </div>
  );
}
