'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Play, FileText, Phone, Network, Globe, Crosshair, Factory, Star, ShieldCheck, Award, Sparkles, Users, TrendingUp, Zap, ChevronDown } from 'lucide-react';
import { ParticleBackground } from '@/components/shared/ParticleBackground';
import { openQuoteModal } from '@/components/widgets/QuoteModal';

const HeroScene = dynamic(() => import('@/components/three/HeroScene').then(m => m.HeroScene), { ssr: false });

const pills = [
  { Icon: Network, label: 'SOFTWARE', sub: 'Development', grad: 'from-blue-500 to-blue-700' },
  { Icon: Globe, label: 'WEBSITE', sub: 'Development', grad: 'from-cyan-500 to-cyan-700' },
  { Icon: Crosshair, label: 'GPS SYSTEMS', sub: 'Tracking Solutions', grad: 'from-teal-500 to-teal-700' },
  { Icon: Factory, label: 'INDUSTRIAL', sub: 'Work & Automation', grad: 'from-green-500 to-green-700' },
];

const rotatingPhrases = [
  'India\'s Next Generation',
  'Trusted by 1000+ Businesses',
  'GST Compliant. Production Ready.',
  'Cloud + On-Premise',
  'Made in India 🇮🇳',
];

const trustBadges = [
  { Icon: ShieldCheck, label: 'ISO 27001', color: 'text-green-500' },
  { Icon: Award, label: 'MSME Registered', color: 'text-orange-500' },
  { Icon: Sparkles, label: 'Razorpay Verified', color: 'text-blue-500' },
  { Icon: Star, label: '4.8/5 Rated', color: 'text-yellow-500' },
];

const liveStats = [
  { Icon: Users, label: 'Happy Clients', value: '1000+', color: '#3b82f6' },
  { Icon: TrendingUp, label: 'Projects Done', value: '500+', color: '#22c55e' },
  { Icon: Zap, label: 'Uptime', value: '99.5%', color: '#f97316' },
  { Icon: Star, label: 'Rating', value: '4.8/5', color: '#eab308' },
];

const recentActivity = [
  '🎉 Mr. Sharma from Pune just bought ERP Software',
  '✨ Rajesh Industries booked a free demo',
  '💼 Vishal from Mumbai upgraded to AI Business plan',
  '🚀 GPS deployed for 12 vehicles in Bangalore',
  '⚡ New school in Nashik just went live',
];

export function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [activityIdx, setActivityIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhraseIdx(i => (i + 1) % rotatingPhrases.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActivityIdx(i => (i + 1) % recentActivity.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full blur-[120px] bg-blue-500/30" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full blur-[120px] bg-cyan-500/20" />
        <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full blur-[100px] bg-purple-500/10" />
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 blueprint opacity-50" />
        <ParticleBackground />
      </div>

      <div className="container relative z-10">
        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="hidden sm:flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 backdrop-blur-sm text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 font-semibold">LIVE</span>
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activityIdx}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="text-text2"
              >
                {recentActivity[activityIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          {/* LEFT — Content */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Rotating eyebrow */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 text-text2 text-[11px] tracking-widest mb-6 min-h-[32px]">
              <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_12px_#f97316]" />
              <AnimatePresence mode="wait">
                <motion.b
                  key={phraseIdx}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-text"
                >
                  {rotatingPhrases[phraseIdx]}
                </motion.b>
              </AnimatePresence>
            </span>

            <h1 className="font-display font-black tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-5">
              KVL BUSINESS<br /><span className="gradient-text">SOLUTIONS</span>
            </h1>

            <p className="text-text2 text-base max-w-xl mb-6 leading-relaxed">
              Advanced Software, Industrial Solutions, GPS Systems &amp; Modern Business Technology
              <span className="text-text font-semibold"> Under One Powerful Platform.</span>
            </p>

            {/* Trust badges row */}
            <div className="flex flex-wrap gap-2 mb-7">
              {trustBadges.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full surface-tint border border-tint text-xs font-semibold"
                >
                  <b.Icon className={`w-3.5 h-3.5 ${b.color}`} />
                  <span>{b.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Service pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
              {pills.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border surface-tint border-tint hover:-translate-y-1 hover:border-primary hover:shadow-card-hover transition-all group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg grid place-items-center text-white bg-gradient-to-br ${p.grad} group-hover:scale-110 transition-transform`}>
                    <p.Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold leading-none">{p.label}</h4>
                    <p className="text-[11px] text-text2 mt-1">{p.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/software" className="btn btn-primary">
                <Monitor className="w-4 h-4" /> View Software
              </Link>
              <Link href="/book-demo" className="btn btn-orange">
                <Play className="w-4 h-4" /> Book Free Demo
              </Link>
              <button onClick={openQuoteModal} className="btn btn-ghost">
                <FileText className="w-4 h-4" /> Get Quote
              </button>
              <Link href="/contact" className="btn btn-ghost">
                <Phone className="w-4 h-4" /> Contact Team
              </Link>
            </div>

            {/* Live stats counter strip */}
            <div className="grid grid-cols-4 gap-3 pt-6 border-t border-tint">
              {liveStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                    <s.Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                    <span className="text-[10px] uppercase tracking-wider text-text2 font-semibold hidden sm:inline">{s.label}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] text-text2 sm:hidden">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — 3D scene + floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[450px] lg:h-[600px]"
          >
            <HeroScene />

            {/* KVL badge overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <div className="font-display font-black text-4xl text-white drop-shadow-[0_0_30px_#3b82f6] tracking-[4px]">KVL</div>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-56 h-10 rounded-full border-2 border-blue-400/70 shadow-[0_0_40px_rgba(59,130,246,0.5)]" />
            </div>

            {/* Floating mini-card 1 — Top right (Revenue) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-8 right-0 hidden md:block z-10"
            >
              <div className="card-base p-3 shadow-card-hover backdrop-blur-md max-w-[180px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 grid place-items-center">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-text2 uppercase">This month</div>
                    <div className="text-sm font-extrabold">₹2.4Cr</div>
                  </div>
                </div>
                <div className="text-[10px] text-green-500 font-bold">↑ 18% growth</div>
              </div>
            </motion.div>

            {/* Floating mini-card 2 — Mid left (Users online) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute top-1/2 left-0 hidden md:block z-10"
            >
              <div className="card-base p-3 shadow-card-hover backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['#3b82f6', '#22c55e', '#f97316', '#ec4899'].map((c, i) => (
                      <div key={c} className="w-7 h-7 rounded-full border-2 border-app2 grid place-items-center text-white text-[10px] font-bold" style={{ background: c }}>
                        {['A', 'R', 'V', 'S'][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold">1000+ users</div>
                    <div className="text-[10px] text-text2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> online now
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="hidden lg:flex justify-center mt-10"
        >
          <div className="flex flex-col items-center gap-1 text-text2 text-[10px] uppercase tracking-widest">
            <span>Scroll to explore</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
