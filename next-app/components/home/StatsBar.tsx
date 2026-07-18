'use client';
import { useEffect, useState } from 'react';
import { Box, Sparkles, CalendarDays, Users } from 'lucide-react';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';

const FOUNDED_YEAR = 2015;

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const step = (ts: number, t0: number) => {
      const p = Math.min((ts - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(t => step(t, t0));
    };
    requestAnimationFrame(t => step(t, t));
  }, [active, target]);
  return val;
}

function StatTile({ Icon, value, label, inView, index }: { Icon: any; value: number; label: string; inView: boolean; index: number }) {
  const count = useCounter(value, inView);
  return (
    <div style={revealStyle(inView, index, { staggerMs: 90, durationMs: 500, distance: 16 })}>
      <div className="relative h-full rounded-2xl p-5 sm:p-6 text-center transition-all duration-300 group"
        style={{ background: 'rgb(var(--bg-3))', border: '1px solid rgba(var(--border) / 0.07)' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,168,112,0.3)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--border) / 0.07)';
          (e.currentTarget as HTMLElement).style.transform = '';
        }}
      >
        <div className="w-10 h-10 rounded-xl grid place-items-center mx-auto mb-3"
          style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)' }}>
          <Icon className="w-4.5 h-4.5" style={{ color: '#c8a870' }} />
        </div>
        <div className="font-display font-black leading-none" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'rgb(var(--text))' }}>
          {count.toLocaleString('en-IN')}
        </div>
        <div className="text-[11.5px] mt-1.5" style={{ color: 'rgb(var(--text-2))' }}>{label}</div>

        <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,168,112,0.10) 0%, transparent 70%)' }} />
      </div>
    </div>
  );
}

// productCount/caseStudyCount come from the server (page.tsx) instead of
// importing the catalog data files directly here — those files are large
// enough that pulling them into a client component ships their full content
// to the browser just to read `.length`.
export function StatsBar({ productCount, caseStudyCount }: { productCount: number; caseStudyCount: number }) {
  const [visitors, setVisitors] = useState<number | null>(null);
  const { ref, inView } = useReveal();

  useEffect(() => {
    fetch('/api/visitor-count').then(r => r.json()).then(d => { if (d.ok) setVisitors(d.count); }).catch(() => {});
  }, []);

  const years = new Date().getFullYear() - FOUNDED_YEAR;

  // Every number here is real (catalog counts, founding year, live visitor
  // counter) — no invented client counts or ratings, matching the rest of
  // the site's "nothing here is inflated" stance. The visitor count animates
  // in only once it's actually loaded (starts its count-up from 0 -> real value).
  const stats = [
    { Icon: Box, value: productCount, label: 'Software Products' },
    { Icon: Sparkles, value: caseStudyCount, label: 'Live Products Built' },
    { Icon: CalendarDays, value: years, label: 'Years in Business' },
    { Icon: Users, value: visitors ?? 0, label: 'Website Visitors' },
  ];

  return (
    <section
      className="py-9"
      style={{ background: 'rgb(var(--bg-2))', borderTop: '1px solid rgba(var(--border) / 0.06)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}
    >
      <div className="container">
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <StatTile key={s.label} {...s} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
