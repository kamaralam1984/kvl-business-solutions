'use client';
import { useEffect, useState } from 'react';
import { Box, Sparkles, CalendarDays, Users } from 'lucide-react';
import { softwareProducts } from '@/lib/data/software';
import { caseStudies } from '@/lib/data/case-studies';

const FOUNDED_YEAR = 2019;

export function StatsBar() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visitor-count').then(r => r.json()).then(d => { if (d.ok) setVisitors(d.count); }).catch(() => {});
  }, []);

  const years = new Date().getFullYear() - FOUNDED_YEAR;

  // Every number here is real (catalog counts, founding year, live visitor
  // counter) — no invented client counts or ratings, matching the rest of
  // the site's "nothing here is inflated" stance.
  const stats = [
    { Icon: Box, value: `${softwareProducts.length}`, label: 'Software Products' },
    { Icon: Sparkles, value: `${caseStudies.length}`, label: 'Live Products Built' },
    { Icon: CalendarDays, value: `${years}+`, label: 'Years in Business' },
    { Icon: Users, value: visitors != null ? visitors.toLocaleString('en-IN') : '—', label: 'Website Visitors' },
  ];

  return (
    <section
      className="py-9"
      style={{ background: 'rgb(var(--bg-2))', borderTop: '1px solid rgba(var(--border) / 0.06)', borderBottom: '1px solid rgba(var(--border) / 0.06)' }}
    >
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <s.Icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#c8a870' }} />
              <div className="font-display font-black" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'rgb(var(--text))' }}>{s.value}</div>
              <div className="text-[11.5px] mt-1" style={{ color: 'rgb(var(--text-2))' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
