'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const SESSION_FLAG = 'kvl_visit_counted';
const MIN_DIGITS = 6;

function OdometerDigit({ digit }: { digit: number }) {
  return (
    <div className="relative overflow-hidden" style={{ width: '0.72em', height: '1em' }}>
      <motion.div
        animate={{ y: `-${digit}em` }}
        transition={{ type: 'spring', stiffness: 190, damping: 20 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ height: '1em', lineHeight: '1em', textAlign: 'center' }}>{i}</div>
        ))}
      </motion.div>
    </div>
  );
}

function Odometer({ value }: { value: number }) {
  const digits = String(value).padStart(MIN_DIGITS, '0').split('').map(Number);
  return (
    <div
      className="inline-flex gap-[2px]"
      style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: '15px', fontWeight: 700 }}
    >
      {digits.map((d, i) => (
        <div
          key={i}
          className="rounded-[3px] flex items-center justify-center"
          style={{
            width: '1.15em',
            height: '1.55em',
            background: '#0a0a0a',
            color: '#39e05c',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.04), 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <OdometerDigit digit={d} />
        </div>
      ))}
    </div>
  );
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem(SESSION_FLAG);
    if (alreadyCounted) {
      fetch('/api/visitor-count').then(r => r.json()).then(d => { if (d.ok) setCount(d.count); }).catch(() => {});
    } else {
      sessionStorage.setItem(SESSION_FLAG, '1');
      fetch('/api/visitor-count', { method: 'POST' }).then(r => r.json()).then(d => { if (d.ok) setCount(d.count); }).catch(() => {});
    }
  }, []);

  if (count == null) return null;

  return (
    <div
      className="inline-flex items-center gap-3 pl-3 pr-4 py-2 rounded-full"
      style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.09)' }}
    >
      <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping" style={{ opacity: 0.5 }} />
        <span className="relative w-2 h-2 rounded-full bg-green-500" />
      </span>
      <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: '#c8a870' }} />
      <Odometer value={count} />
      <span className="text-[12.5px] font-semibold" style={{ color: 'rgb(var(--text-2))' }}>Total Visits</span>
    </div>
  );
}
