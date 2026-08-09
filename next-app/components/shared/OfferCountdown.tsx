'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

// Independence Day offer deadline — end of day IST.
const DEADLINE = new Date('2026-08-15T23:59:59+05:30').getTime();

function remaining() {
  const diff = Math.max(0, DEADLINE - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds, expired: diff <= 0 };
}

function Digit({ value, dark }: { value: number; dark: boolean }) {
  return (
    <span className="relative inline-block w-[1.15em] text-center overflow-hidden align-top" style={{ height: '1.1em' }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0"
          style={{ color: dark ? '#e8c890' : '#FF9933' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TwoDigits({ value, dark }: { value: number; dark: boolean }) {
  const s = String(Math.min(99, value)).padStart(2, '0');
  return <>{s.split('').map((d, i) => <Digit key={i} value={Number(d)} dark={dark} />)}</>;
}

// Real countdown to the Independence Day offer deadline — used on the ad
// landing pages (get-quote, website-offer) to create urgency. `dark` picks
// gold-on-navy styling (get-quote) vs orange-on-white (website-offer).
export function OfferCountdown({ dark = false }: { dark?: boolean }) {
  const [t, setT] = useState(remaining());
  useEffect(() => {
    const id = setInterval(() => setT(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  if (t.expired) return null;

  const units = [
    { label: 'Days', value: t.days },
    { label: 'Hours', value: t.hours },
    { label: 'Min', value: t.minutes },
    { label: 'Sec', value: t.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2"
      style={dark
        ? { background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.3)' }
        : { background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.3)' }}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: dark ? '#e8c890' : '#FF9933' }} />
      <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: dark ? 'rgba(255,255,255,0.55)' : '#6b7280' }}>
        Offer ends in
      </span>
      <div className="flex items-center gap-1.5 font-mono font-extrabold text-sm tabular-nums">
        {units.map((u, i) => (
          <span key={u.label} className="flex items-center gap-1.5">
            {i > 0 && <span style={{ color: dark ? 'rgba(255,255,255,0.3)' : '#d1d5db' }}>:</span>}
            <span className="flex flex-col items-center leading-none">
              <TwoDigits value={u.value} dark={dark} />
              <span className="text-[8px] font-semibold normal-case mt-0.5" style={{ color: dark ? 'rgba(255,255,255,0.35)' : '#9ca3af' }}>{u.label}</span>
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
