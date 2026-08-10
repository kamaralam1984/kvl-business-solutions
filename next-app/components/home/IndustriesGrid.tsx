'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';
import { Hospital, School, Banknote, UtensilsCrossed, Building2, HardHat, Factory, Landmark, ArrowRight } from 'lucide-react';

const industries = [
  { Icon: Hospital,        title: 'Healthcare',   desc: 'One patient record across OPD, IPD, pharmacy and billing.', href: '/industries/hospitals', image: '/industries/healthcare.webp' },
  { Icon: School,          title: 'Education',    desc: 'Admissions, fees, attendance and exams on one platform.', href: '/industries/schools', image: '/industries/education.webp' },
  { Icon: Banknote,        title: 'Finance',      desc: 'Books and compliance kept audit-ready by design.', href: '/industries', image: '/industries/finance.webp' },
  { Icon: UtensilsCrossed, title: 'Restaurant',   desc: 'Billing, tables and delivery synced in real time.', href: '/industries/restaurant-hospitality', image: '/industries/restaurant.webp' },
  { Icon: Building2,       title: 'Real Estate',  desc: 'Leads, site visits and bookings in one pipeline.', href: '/industries/realestate', image: '/industries/real-estate.webp' },
  { Icon: HardHat,         title: 'Construction', desc: 'Materials, labor and site progress tracked live.', href: '/industries/construction', image: '/industries/construction.webp' },
  { Icon: Factory,         title: 'Manufacturing',desc: 'PLC, SCADA and IoT data unified on one dashboard.', href: '/industries/manufacturing', image: '/industries/manufacturing.webp' },
  { Icon: Landmark,        title: 'Government',   desc: 'e-Tenders, GEM listings and compliance tracked end-to-end.', href: '/industries/government', image: '/industries/government.webp' },
];

const AUTO_MS = 4000;
const MAX_VISIBLE_OFFSET = 3;

export function IndustriesGrid() {
  const { ref, inView } = useReveal();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(900);

  // useLayoutEffect (not useEffect) so the real measured width is applied
  // before the browser paints the first frame — otherwise cards render once
  // at the 900px guess, then visibly snap to the correct size a moment later.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setTrackW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActive(a => (a + 1) % industries.length), AUTO_MS);
    return () => clearInterval(t);
  }, [paused]);

  const current = industries[active];
  const cardW = Math.min(trackW * 0.52, 460);
  const step = trackW * 0.235;

  return (
    <section className="py-16" style={{ background: 'rgb(var(--bg))' }}>
      <div className="container">
        <div className="max-w-full mx-auto text-center mb-10 px-2">
          <span className="eyebrow mb-4 block">Industries</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))', fontSize: 'clamp(0.95rem, 1.75vw, 1.5rem)' }}>
            Different sectors, different rules. <span style={{ color: 'rgb(var(--gold-text))' }}>We already know the difference.</span>
          </h2>
        </div>

        <div ref={ref} style={revealStyle(inView, 0)} className="flex flex-col lg:flex-row gap-3 lg:gap-6">

          {/* Left ~25% — industry buttons */}
          <div className="lg:w-[25%] w-full flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {industries.map((ind, i) => {
              const isActive = i === active;
              return (
                <button
                  key={ind.title}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  aria-current={isActive}
                  className="relative shrink-0 lg:shrink lg:w-full flex items-center gap-3 text-left pl-4 pr-4 py-3.5 rounded-xl transition-colors duration-300 overflow-hidden"
                  style={{
                    background: isActive ? 'rgba(200,168,112,0.10)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(200,168,112,0.35)' : 'rgba(var(--border) / 0.08)'}`,
                  }}
                >
                  {isActive && (
                    <motion.span layoutId="industry-bar" className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full" style={{ background: '#c8a870' }} />
                  )}
                  <span className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{
                    background: isActive ? 'rgba(200,168,112,0.18)' : 'rgba(var(--text) / 0.05)',
                  }}>
                    <ind.Icon className="w-4 h-4" style={{ color: isActive ? '#c8a870' : 'rgb(var(--text-2))' }} />
                  </span>
                  <span className="font-display font-bold text-[13.5px] whitespace-nowrap lg:whitespace-normal"
                    style={{ color: isActive ? 'rgb(var(--text))' : 'rgb(var(--text-2))' }}>
                    {ind.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right ~75% — 3D coverflow slider */}
          <div className="lg:w-[75%] w-full rounded-2xl relative overflow-hidden"
            style={{ background: '#000' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div ref={trackRef} className="relative w-full h-[300px] sm:h-[380px] lg:h-[460px]" style={{ perspective: 1600 }}>
              {industries.map((ind, i) => {
                const offset = i - active;
                const abs = Math.abs(offset);
                if (abs > MAX_VISIBLE_OFFSET) return null;
                const isActive = offset === 0;
                const sign = Math.sign(offset);
                return (
                  <motion.button
                    key={ind.title}
                    onClick={() => setActive(i)}
                    aria-label={`Show ${ind.title}`}
                    aria-current={isActive}
                    className="absolute top-1/2 left-1/2 rounded-xl overflow-hidden"
                    style={{
                      width: cardW,
                      aspectRatio: '1402 / 1122',
                      cursor: isActive ? 'default' : 'pointer',
                      boxShadow: isActive ? '0 30px 70px rgba(0,0,0,0.5)' : '0 14px 34px rgba(0,0,0,0.4)',
                    }}
                    animate={{
                      x: offset * step - cardW / 2,
                      y: '-50%',
                      rotateY: sign * -46,
                      scale: isActive ? 1 : 0.76,
                      opacity: 1 - abs * 0.22,
                      zIndex: 100 - abs,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                  >
                    <Image
                      src={ind.image}
                      alt={`${ind.title} software overview`}
                      fill
                      sizes="(max-width: 640px) 55vw, (max-width: 1024px) 60vw, 460px"
                      quality={65}
                      className="object-cover"
                    />
                    {!isActive && <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />}
                  </motion.button>
                );
              })}
            </div>

            {/* Caption bar — crossfades with the active slide */}
            <div className="relative px-6 sm:px-10 py-7 sm:py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
                >
                  <div>
                    <span className="eyebrow mb-2 block" style={{ color: '#e8c890' }}>{current.title}</span>
                    <p className="text-[14.5px] sm:text-[15.5px] font-medium text-white/85 max-w-lg">{current.desc}</p>
                  </div>
                  <Link
                    href={current.href}
                    className="inline-flex items-center gap-2 w-fit shrink-0 text-[13.5px] font-bold px-5 py-3 rounded-xl transition-transform hover:-translate-y-0.5"
                    style={{ background: '#f8f8f6', color: '#0a0a0a' }}
                  >
                    Explore {current.title} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots — the visual bar stays thin, but each button gets
                  extra invisible padding so the actual tap target clears the
                  ~40px minimum instead of being exactly 6px tall. */}
              <div className="flex gap-1.5 mt-6">
                {industries.map((ind, i) => (
                  <button key={ind.title} aria-label={`Show ${ind.title}`} onClick={() => setActive(i)}
                    className="py-3 grid place-items-center">
                    <span className="block h-1.5 rounded-full transition-all duration-300"
                      style={{ width: i === active ? 22 : 6, background: i === active ? '#c8a870' : 'rgba(255,255,255,0.25)' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
