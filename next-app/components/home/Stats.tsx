'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, Zap, Star } from 'lucide-react';

const stats = [
  {
    value: 1200, suffix: '+', label: 'Happy Clients',
    sub: 'Across India', Icon: Users, color: '#c8a870',
    barColor: '#c8a870', barPct: 92,
  },
  {
    value: 500, suffix: '+', label: 'Projects Delivered',
    sub: 'On time & on budget', Icon: TrendingUp, color: '#10b981',
    barColor: '#10b981', barPct: 78,
  },
  {
    value: 99.5, suffix: '%', label: 'Uptime Guarantee', decimal: 1,
    sub: 'SLA commitment', Icon: Zap, color: '#3b82f6',
    barColor: '#3b82f6', barPct: 99,
  },
  {
    value: 4.8, suffix: '/5', label: 'Average Rating', decimal: 1,
    sub: 'Google & G2 verified', Icon: Star, color: '#f59e0b',
    barColor: '#f59e0b', barPct: 96,
  },
];

function useCounter(target: number, decimal = 0, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const step = (ts: number, t0: number) => {
      const p = Math.min((ts - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setVal(parseFloat((e * target).toFixed(decimal)));
      if (p < 1) requestAnimationFrame(t => step(t, t0));
    };
    requestAnimationFrame(t => step(t, t));
  }, [active, target, decimal]);
  return val;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function StatCard({
  value, suffix, label, sub, decimal = 0, Icon, color, barColor, barPct, inView, index,
}: {
  value: number; suffix: string; label: string; sub: string;
  decimal?: number; Icon: any; color: string; barColor: string; barPct: number;
  inView: boolean; index: number;
}) {
  const count = useCounter(value, decimal, inView);
  const display = decimal > 0 ? count.toFixed(decimal) : Math.floor(count).toLocaleString('en-IN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div
        className="relative rounded-2xl p-7 overflow-hidden transition-all duration-300 h-full"
        style={{
          background: 'rgb(var(--bg-3))',
          border: '1px solid rgba(var(--border) / 0.07)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(200,168,112,0.3)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)';
          (e.currentTarget as HTMLElement).style.transform = '';
        }}
      >
        {/* Top row — icon + label */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(var(--text) / 0.4)' }}>
              {label}
            </div>
            <div className="text-[11px]" style={{ color: 'rgba(var(--text) / 0.3)' }}>{sub}</div>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `rgba(${hexToRgb(color)},0.08)`, border: `1px solid rgba(${hexToRgb(color)},0.15)` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        </div>

        {/* Big number */}
        <div className="font-display font-black leading-none tracking-tight mb-5"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'rgb(var(--text))' }}>
          {display}
          <span style={{ color: '#c8a870', fontSize: '0.5em', letterSpacing: '-0.01em' }}>{suffix}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(var(--text) / 0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${barPct}%` } : { width: 0 }}
            transition={{ duration: 1.4, delay: index * 0.1 + 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${barColor}80, ${barColor})` }}
          />
        </div>

        {/* Subtle corner glow */}
        <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, rgba(${hexToRgb(color)},0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      </div>
    </motion.div>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-24" style={{ background: 'rgb(var(--bg-2))' }}>
      <div className="divider-premium" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,168,112,0.04) 0%, transparent 70%)',
        }} />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="eyebrow mb-3">By the numbers</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
            Proven results across<br />
            <span style={{ color: '#c8a870' }}>India&apos;s enterprises</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} inView={inView} index={i} />
          ))}
        </div>
      </div>

      <div className="divider-premium mt-24" />
    </section>
  );
}
