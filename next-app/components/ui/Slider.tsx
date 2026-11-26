'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './cn';

// Generic slider: arrow keys, swipe, pause on hover/focus, progress bar, thumbnail dots slot.
export function Slider({
  slides, interval = 6000, className, renderThumb, label = 'Slider',
}: {
  slides: React.ReactNode[]; interval?: number; className?: string;
  renderThumb?: (index: number, active: boolean) => React.ReactNode; label?: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const startX = useRef<number | null>(null);
  const n = slides.length;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);
  useEffect(() => {
    if (paused || reduced || n < 2) return;
    const t = setTimeout(() => go(i + 1), interval);
    return () => clearTimeout(t);
  }, [i, paused, reduced, n, interval, go]);

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0}
      className={cn('relative focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] rounded-panel', className)}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={e => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }}
      onTouchStart={e => { startX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        startX.current = null;
      }}
    >
      <div className="overflow-hidden rounded-panel" aria-live={paused ? 'polite' : 'off'}>
        <div className="flex transition-transform duration-slow ease-brand" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s, k) => (
            <div key={k} className="w-full shrink-0" role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== i}>
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button aria-label="Previous slide" onClick={() => go(i - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"><ChevronLeft className="h-5 w-5" /></button>
        <div className="flex flex-1 gap-2 overflow-x-auto">
          {slides.map((_, k) => (
            <button key={k} aria-label={`Go to slide ${k + 1}`} aria-current={k === i} onClick={() => go(k)} className={cn('shrink-0 rounded-btn transition-opacity duration-base focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]', k === i ? 'opacity-100' : 'opacity-55 hover:opacity-90')}>
              {renderThumb ? renderThumb(k, k === i) : <span className={cn('block h-2.5 w-2.5 rounded-full', k === i ? 'bg-gold' : 'bg-line')} />}
            </button>
          ))}
        </div>
        <button aria-label="Next slide" onClick={() => go(i + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-line" aria-hidden>
        <div key={`${i}-${paused}`} className="h-full origin-left bg-gold" style={{ transform: 'scaleX(0)', animation: paused || reduced ? 'none' : `sliderProgress ${interval}ms linear forwards` }} />
      </div>
    </div>
  );
}
