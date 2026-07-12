'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { softwareProducts } from '@/lib/data/software';
import { caseStudies } from '@/lib/data/case-studies';

const shortLabel = (name: string) =>
  name.replace(/ Software$/, '').replace(/ Management$/, '').replace(/ System$/, '');

const slides = [
  ...caseStudies.map(c => ({
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
  })),
  ...softwareProducts.map(p => ({
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
  })),
];

export function HeroShowcaseSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const go = useCallback((dir: 1 | -1) => setIndex(i => (i + dir + total) % total), [total]);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIndex(i => (i + 1) % total), 4500);
    return () => clearInterval(t);
  }, [paused, total]);

  const slide = slides[index];
  const FooterIcon = (Icons as any)[slide.icon] || Icons.Box;

  return (
    <div
      className="relative w-full max-w-[440px] mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.08)', boxShadow: '0 30px 70px rgba(0,0,0,0.10)' }}
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
              const FeatureIcon = f.icon ? ((Icons as any)[f.icon] || Icons.CheckCircle2) : Icons.CheckCircle2;
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
            onClick={() => setIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === index ? 16 : 6, height: 6, background: i === index ? '#c8a870' : 'rgba(var(--text) / 0.15)' }}
          />
        ))}
      </div>
    </div>
  );
}
