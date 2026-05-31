'use client';
import React from 'react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Monitor, Play, FileText, Phone,
  TrendingUp, Zap, Users, ChevronDown,
  ShieldCheck, Award, Star, Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { openQuoteModal } from '@/components/widgets/QuoteModal';

/* ── Static data ─────────────────────────────────────── */
const recentActivity = [
  'Mr. Sharma from Pune just bought ERP Software',
  'Rajesh Industries booked a free demo today',
  'Vishal from Mumbai upgraded to AI Business plan',
  'GPS deployed for 12 vehicles in Bangalore',
  'New school management system live in Nashik',
];

const trustBadges = [
  { Icon: ShieldCheck, label: 'ISO 27001',         color: '#10b981' },
  { Icon: Award,       label: 'MSME Registered',   color: '#c8a870' },
  { Icon: Sparkles,    label: 'Razorpay Verified',  color: '#c8a870' },
  { Icon: Star,        label: '4.8 / 5 Rated',     color: '#f59e0b' },
];

const liveStats = [
  { label: 'Happy Clients',  value: '1,200+', suffix: '' },
  { label: 'Projects Done',  value: '500+',   suffix: '' },
  { label: 'Uptime SLA',     value: '99.5',   suffix: '%' },
  { label: 'Avg Rating',     value: '4.8',    suffix: '/5' },
];

const chartBars = [32, 48, 41, 65, 58, 78, 65, 88, 74, 100];

const quickMetrics = [
  { label: 'Active Projects', value: '84' },
  { label: 'Tickets Closed',  value: '99%' },
  { label: 'Avg Response',    value: '<2h' },
];

/* ── Framer variants ─────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const wordVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Magnetic Button wrapper ────────────────────────── */
function MagneticBtn({ children, className, style, strength = 0.35 }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.5 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * strength);
    rawY.set((e.clientY - cy) * strength);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-flex', ...style }}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}

/* ── Component ──────────────────────────────────────── */
export function Hero() {
  const [activityIdx, setActivityIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef   = useRef<HTMLElement>(null);
  const mouseX    = useMotionValue(0);
  const mouseY    = useMotionValue(0);
  const orbX      = useTransform(mouseX, [0, 1], [-30, 30]);
  const orbY      = useTransform(mouseY, [0, 1], [-20, 20]);

  /* Activity ticker */
  useEffect(() => {
    const t = setInterval(() => setActivityIdx(i => (i + 1) % recentActivity.length), 4500);
    return () => clearInterval(t);
  }, []);

  /* Parallax mouse tracking */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      mouseX.set((e.clientX - r.left) / r.width);
      mouseY.set((e.clientY - r.top) / r.height);
    };
    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  /* Particle canvas — lighter gold particles on white */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.35 + 0.05,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,168,112,${p.o * 0.4})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const headline = ['India\'s Most', 'Trusted Business', 'Solutions.'];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      style={{ paddingTop: '80px', paddingBottom: '60px', background: '#faf9f7' }}
    >
      {/* ── Layered Background ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>

        {/* Subtle radial gold glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(200,168,112,0.06) 0%, transparent 60%)',
        }} />

        {/* Fine dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

        {/* Animated gold orb — top right, parallax */}
        <motion.div
          style={{ x: orbX, y: orbY }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div style={{
            width: '100%', height: '100%',
            background: 'radial-gradient(circle, rgba(200,168,112,0.10) 0%, rgba(200,168,112,0.02) 50%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }} />
        </motion.div>

        {/* Animated gold orb — top right floating */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '10%', right: '8%',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,168,112,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Small gold spinning ring */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '20%', right: '15%',
            width: 120, height: 120, borderRadius: '50%',
            border: '1px solid rgba(200,168,112,0.2)',
          }}
        />

        {/* Bottom left accent */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute', bottom: '15%', left: '5%',
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,168,112,0.08) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Bottom gradient fade to white */}
        <div className="absolute bottom-0 inset-x-0 h-32" style={{
          background: 'linear-gradient(to top, #faf9f7 0%, transparent 100%)',
        }} />
      </div>

      {/* ── Main Container ────────────────────────── */}
      <div className="container relative z-10">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] font-semibold uppercase"
            style={{ color: '#c8a870' }}
          >
            <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, #c8a870, transparent)', display: 'inline-block' }} />
            KVL Business Solutions — Since 2019
            <span style={{ width: 24, height: 1, background: 'linear-gradient(270deg, #c8a870, transparent)', display: 'inline-block' }} />
          </span>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-[58%_42%] gap-12 lg:gap-6 items-center">

          {/* ══ LEFT COLUMN ════════════════════════ */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* Live activity ticker */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-[12px] mb-10"
                style={{
                  borderColor: 'rgba(0,0,0,0.1)',
                  background: 'rgba(0,0,0,0.04)',
                }}
              >
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}
                  />
                  <span className="font-bold tracking-[0.12em]" style={{ color: 'rgba(0,0,0,0.4)' }}>LIVE</span>
                </span>
                <span style={{ width: 1, height: 12, background: 'rgba(0,0,0,0.12)', display: 'inline-block' }} />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activityIdx}
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: 'rgba(0,0,0,0.55)' }}
                  >
                    {recentActivity[activityIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Cinematic headline — word-by-word reveal */}
            <motion.h1
              className="font-black leading-[0.93] tracking-[-0.04em] mb-7"
              style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
            >
              {headline.map((line, lineIdx) => (
                <div key={lineIdx} style={{ overflow: 'hidden', display: 'block', lineHeight: '1.0' }}>
                  {line.split(' ').map((word, wordIdx) => {
                    const isGold = lineIdx === 2;
                    const globalIdx = headline.slice(0, lineIdx).join(' ').split(' ').filter(Boolean).length + wordIdx;
                    return (
                      <span key={wordIdx} style={{ overflow: 'hidden', display: 'inline-block', marginRight: '0.25em' }}>
                        <motion.span
                          style={{ display: 'inline-block', color: isGold ? '#c8a870' : '#0a0a0a' }}
                          custom={globalIdx}
                          variants={wordVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {word}
                        </motion.span>
                      </span>
                    );
                  })}
                </div>
              ))}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-[16px] leading-[1.8] mb-8"
              style={{ color: 'rgba(0,0,0,0.5)', maxWidth: '500px' }}
            >
              Powering 1,200+ enterprises across India with custom software, GPS fleet tracking, and industrial automation — delivered by a team of 50+ engineers.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-9">
              {trustBadges.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200"
                  style={{
                    borderColor: 'rgba(0,0,0,0.1)',
                    background: 'rgba(0,0,0,0.05)',
                    color: 'rgba(0,0,0,0.65)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.18)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                >
                  <b.Icon className="w-3.5 h-3.5 shrink-0" style={{ color: b.color }} />
                  {b.label}
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-12">
              {/* Explore Software — black bg, white text */}
              <MagneticBtn>
                <Link
                  href="/software"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[14px] transition-all duration-200 group"
                  style={{ background: '#0a0a0a', color: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(0,0,0,0.28)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.18)'; }}
                >
                  <Monitor className="w-4 h-4" /> Explore Software
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              </MagneticBtn>

              {/* Book Free Demo — gold gradient, black text */}
              <MagneticBtn>
                <Link
                  href="/book-demo"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[14px] transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #c8a870 0%, #d8b880 100%)',
                    color: '#0a0a0a',
                    boxShadow: '0 4px 20px rgba(200,168,112,0.40)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(200,168,112,0.55)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(200,168,112,0.40)'; }}
                >
                  <Play className="w-4 h-4" fill="currentColor" /> Book Free Demo
                </Link>
              </MagneticBtn>

              {/* Get Quote — black border, dark text */}
              <button
                onClick={openQuoteModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all duration-200 border"
                style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'rgba(0,0,0,0.65)', background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.3)'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.65)'; }}
              >
                <FileText className="w-4 h-4" /> Get Quote
              </button>

              {/* Contact Team — plain dark gray */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all duration-200"
                style={{ color: 'rgba(0,0,0,0.38)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.7)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.38)'; }}
              >
                <Phone className="w-4 h-4" /> Contact Team
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-4 gap-4 pt-8"
              style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
            >
              {liveStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="font-black leading-none" style={{
                    fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
                    color: '#0a0a0a',
                    letterSpacing: '-0.03em',
                    fontFamily: 'var(--font-poppins, inherit)',
                  }}>
                    {s.value}<span style={{ color: '#c8a870', fontSize: '0.65em' }}>{s.suffix}</span>
                  </div>
                  <div className="text-[11px] mt-1.5 leading-tight" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ══ RIGHT COLUMN — Dashboard showcase ══ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Float CSS */}
            <style>{`
              @keyframes kvl-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
              @keyframes kvl-float-alt { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            `}</style>

            {/* Main dashboard card — light mode */}
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 24,
              padding: 28,
              boxShadow: '0 40px 80px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
              animation: 'kvl-float 8s ease-in-out infinite',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Subtle inner gold glow */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 220, height: 220,
                background: 'radial-gradient(circle, rgba(200,168,112,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Team photo strip */}
              <div style={{ position: 'relative', height: 60, borderRadius: '12px 12px 0 0', overflow: 'hidden', margin: '-28px -28px 20px -28px' }}>
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80&auto=format&fit=crop"
                  alt="KVL team"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.85) 100%)' }} />
              </div>

              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1.5"
                    style={{ color: 'rgba(0,0,0,0.35)' }}>Monthly Revenue</div>
                  <div className="font-black leading-none" style={{
                    fontSize: '2.2rem', color: '#c8a870', letterSpacing: '-0.03em',
                  }}>₹24.8L</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[12px] font-semibold" style={{ color: '#16a34a' }}>↑ 18.4%</span>
                    <span className="text-[11px]" style={{ color: 'rgba(0,0,0,0.35)' }}>vs last month</span>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(200,168,112,0.1)',
                  border: '1px solid rgba(200,168,112,0.2)',
                  borderRadius: '14px', padding: '12px',
                }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#c8a870' }} />
                </div>
              </div>

              {/* Animated chart bars — gold + light gray */}
              <div className="flex items-end gap-1.5 mb-6" style={{ height: 80 }}>
                {chartBars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${h}%`, opacity: 1 }}
                    transition={{ delay: 0.9 + i * 0.07, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      flex: 1,
                      background: i === chartBars.length - 1
                        ? 'linear-gradient(180deg, #d4b880 0%, #c8a870 100%)'
                        : i >= chartBars.length - 3
                        ? 'rgba(200,168,112,0.30)'
                        : 'rgba(0,0,0,0.08)',
                      borderRadius: '4px 4px 0 0',
                      minHeight: 4,
                      alignSelf: 'flex-end',
                    }}
                  />
                ))}
              </div>

              {/* Client avatars row */}
              <div className="flex items-center justify-between pt-5"
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex">
                    {(['#c8a870', '#22c55e', '#3b82f6', '#f97316'] as const).map((c, i) => (
                      <div
                        key={i}
                        className="grid place-items-center text-[10px] font-bold"
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: c, border: '2px solid #ffffff',
                          color: '#fff', marginLeft: i > 0 ? -8 : 0,
                        }}
                      >
                        {['A', 'R', 'V', 'S'][i]}
                      </div>
                    ))}
                  </div>
                  <span className="text-[12px]" style={{ color: 'rgba(0,0,0,0.45)' }}>+1,196 clients</span>
                </div>
                <span className="live-badge">Live</span>
              </div>

              {/* Quick metrics grid */}
              <div className="grid grid-cols-3 gap-2.5 mt-5">
                {quickMetrics.map(s => (
                  <div
                    key={s.label}
                    className="rounded-xl p-3 text-center"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <div className="text-[18px] font-black leading-none" style={{ color: '#0a0a0a' }}>{s.value}</div>
                    <div className="text-[9px] uppercase tracking-[0.1em] mt-1.5"
                      style={{ color: 'rgba(0,0,0,0.38)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating card — GPS fleet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute hidden xl:block"
              style={{
                top: -28, right: -28,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 18, padding: '14px 18px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.10)',
                animation: 'kvl-float-alt 6s ease-in-out infinite 1s',
              }}
            >
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
                style={{ color: 'rgba(0,0,0,0.4)' }}>GPS Fleet Active</div>
              <div className="flex items-center gap-2.5">
                <div className="text-[26px] font-black" style={{ letterSpacing: '-0.03em', color: '#0a0a0a' }}>247</div>
                <div className="text-[11px] font-semibold">
                  <span style={{
                    background: 'rgba(34,197,94,0.08)',
                    padding: '2px 8px', borderRadius: 6,
                    border: '1px solid rgba(34,197,94,0.2)',
                    color: '#16a34a',
                  }}>
                    ● Live tracking
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Floating card — projects live */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute hidden xl:block"
              style={{
                bottom: -24, left: -32,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 18, padding: '14px 18px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.10)',
                animation: 'kvl-float-alt 7s ease-in-out infinite 2s',
              }}
            >
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
                style={{ color: 'rgba(0,0,0,0.4)' }}>Projects Live</div>
              <div className="flex items-center gap-2">
                <div className="text-[26px] font-black" style={{ letterSpacing: '-0.03em', color: '#0a0a0a' }}>500+</div>
                <div className="w-6 h-6 rounded-full grid place-items-center"
                  style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)' }}>
                  <Zap className="w-3 h-3" style={{ color: '#c8a870' }} />
                </div>
              </div>
            </motion.div>

            {/* Floating notification — new client */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute hidden xl:block"
              style={{
                top: 48, left: -56,
                background: '#ffffff',
                border: '1px solid rgba(200,168,112,0.22)',
                borderRadius: 18, padding: '12px 16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.10)',
                animation: 'kvl-float-alt 5.5s ease-in-out infinite 0.5s',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full grid place-items-center shrink-0"
                  style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)' }}>
                  <Users className="w-4 h-4" style={{ color: '#c8a870' }} />
                </div>
                <div>
                  <div className="text-[10px] mb-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>New client onboarded</div>
                  <div className="text-[13px] font-bold" style={{ color: '#0a0a0a' }}>Rajesh Industries</div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="hidden lg:flex flex-col items-center gap-2 mt-16"
        >
          <span className="text-[10px] tracking-[0.14em] uppercase" style={{ color: 'rgba(0,0,0,0.3)' }}>
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: 'rgba(0,0,0,0.3)' }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
