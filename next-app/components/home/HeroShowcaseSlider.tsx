'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Software } from '@/lib/data/software';
import { caseStudies } from '@/lib/data/case-studies';
import { Button } from '@/components/ui/Button';

const shortLabel = (name: string) =>
  name.replace(/ Software$/, '').replace(/ Management$/, '').replace(/ System$/, '');

type Slide = {
  key: string; name: string; image: string; category: string; addressBar: string;
  kind: 'live' | 'software'; detailHref: string; demoHref: string; demoExternal: boolean;
};

const liveSlides: Slide[] = caseStudies.map(c => ({
  kind: 'live',
  key: c.slug,
  name: c.name,
  image: c.images.hero,
  category: c.industry,
  addressBar: c.url.replace(/^https?:\/\//, ''),
  detailHref: `/projects/${c.slug}`,
  demoHref: c.url,
  demoExternal: true,
}));

// Software slides come from the live, admin-editable catalog, not the static file.
const buildSoftwareSlides = (products: Software[]): Slide[] =>
  products.map(p => ({
    kind: 'software',
    key: p.slug,
    name: shortLabel(p.name),
    image: p.image,
    category: p.category,
    addressBar: `kvlbusinesssolutions.com/software/${p.slug}`,
    detailHref: `/software/${p.slug}`,
    demoHref: `/software/${p.slug}/demo`,
    demoExternal: false,
  }));

export function HeroShowcaseSlider({ products }: { products: Software[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  const slides = [...liveSlides, ...buildSoftwareSlides(products)];
  const total = slides.length;

  const goTo = useCallback((i: number, dir?: 1 | -1) => {
    setDirection(dir ?? (i >= index ? 1 : -1));
    setIndex(((i % total) + total) % total);
  }, [index, total]);
  const step = (d: 1 | -1) => goTo(index + d, d);

  // Keep the active thumbnail in view by scrolling the strip itself (never the page).
  useEffect(() => {
    const el = thumbs.current[index], box = strip.current;
    if (!el || !box) return;
    box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.clientWidth) / 2, behavior: 'smooth' });
  }, [index]);

  if (total === 0) return null;
  const slide = slides[index];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative mx-auto w-full max-w-[520px] rounded-panel focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      <div
        key={`card-${slide.key}`}
        aria-live="polite"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={e => { startX.current = e.clientX; }}
        onPointerUp={e => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
        className={`overflow-hidden rounded-panel border border-line bg-card shadow-soft-3 ${direction === 1 ? 'hero-slider-slide-in-right' : 'hero-slider-slide-in-left'}`}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#f04f4f]" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#f0b429]" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#27c93f]" />
          <span className="ml-2 flex-1 truncate text-xs text-text2">{slide.addressBar}</span>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-text/5 px-2.5 py-1 text-[11px] font-semibold text-text2">
            {slide.kind === 'live' ? 'Live Product' : '7-Day Free Trial'}
          </span>
        </div>

        {/* Real product screenshot */}
        <div className="relative aspect-[16/10] bg-[#0a0a0a]">
          <Image src={slide.image} alt={`${slide.name} — screenshot of the live product interface`} fill sizes="520px" className="object-contain" priority={index === 0} />
        </div>

        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <div className="truncate font-display text-base font-semibold text-text">{slide.name}</div>
            <div className="truncate text-xs text-text2">{slide.category}</div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button href={slide.detailHref} size="md" className="!min-h-[44px] !px-4 !text-sm">Get Started</Button>
            <Button
              href={slide.demoHref}
              variant="secondary"
              className="!min-h-[44px] !px-4 !text-sm"
              {...(slide.demoExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Progress bar — its animationend advances the slide. */}
        <div className="h-1 bg-text/10">
          <div
            key={`bar-${index}`}
            className="kvl-progress-bar h-full bg-gold"
            style={{ animationPlayState: paused ? 'paused' : 'running' }}
            onAnimationEnd={() => step(1)}
          />
        </div>
      </div>

      {/* Arrows */}
      <button aria-label="Previous product" onClick={() => step(-1)}
        className="absolute left-0 top-[38%] grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-card shadow-soft-2 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
        <ChevronLeft className="h-4 w-4 text-text" aria-hidden />
      </button>
      <button aria-label="Next product" onClick={() => step(1)}
        className="absolute right-0 top-[38%] grid h-11 w-11 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-line bg-card shadow-soft-2 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
        <ChevronRight className="h-4 w-4 text-text" aria-hidden />
      </button>

      {/* Thumbnails */}
      <div ref={strip} className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {slides.map((s, i) => (
          <button
            key={s.key}
            ref={el => { thumbs.current[i] = el; }}
            aria-label={`Show ${s.name}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`relative h-11 w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-[#0a0a0a] transition-[opacity,border-color] duration-base focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] ${i === index ? 'border-gold opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <Image src={s.image} alt="" fill sizes="72px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
