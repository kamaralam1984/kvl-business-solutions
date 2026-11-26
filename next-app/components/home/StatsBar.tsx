'use client';
import { useEffect, useState } from 'react';
import { useReveal } from '@/lib/hooks/useReveal';

const FOUNDED_YEAR = 2015;

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return; }
    const duration = 1200;
    let raf = 0;
    const t0 = performance.now();
    const step = (ts: number) => {
      const p = Math.min((ts - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return val;
}

function Stat({ value, label, active, loading }: { value: number; label: string; active: boolean; loading?: boolean }) {
  const count = useCounter(value, active && !loading);
  return (
    <div>
      <div className="font-display text-[1.75rem] sm:text-[2rem] font-semibold leading-none tabular-nums text-text">
        {loading || !active ? <span className="opacity-30">—</span> : count.toLocaleString('en-IN')}
      </div>
      <div className="mt-2 text-sm text-text2">{label}</div>
    </div>
  );
}

// Four clean numbers, shown inside the hero. Every value is real (catalog
// counts, founding year, live visitor counter). Counts come from the server
// so the client doesn't ship the whole catalog just to read `.length`.
export function StatsBar({ productCount, caseStudyCount }: { productCount: number; caseStudyCount: number }) {
  const [visitors, setVisitors] = useState<number | null>(null);
  const { ref, inView } = useReveal('0px');

  useEffect(() => {
    fetch('/api/visitor-count').then(r => r.json()).then(d => { if (d.ok) setVisitors(d.count); }).catch(() => {});
  }, []);

  const years = new Date().getFullYear() - FOUNDED_YEAR;

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 border-t border-line pt-8">
      <Stat value={productCount} label="Software Products" active={inView} />
      <Stat value={caseStudyCount} label="Live Products Built" active={inView} />
      <Stat value={years} label="Years in Business" active={inView} />
      <Stat value={visitors ?? 0} label="Website Visitors" active={inView} loading={visitors === null} />
    </div>
  );
}
