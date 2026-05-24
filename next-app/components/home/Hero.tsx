'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Monitor, Play, FileText, Phone, Network, Globe, Crosshair, Factory } from 'lucide-react';
import { ParticleBackground } from '@/components/shared/ParticleBackground';
import { openQuoteModal } from '@/components/widgets/QuoteModal';

const HeroScene = dynamic(() => import('@/components/three/HeroScene').then(m => m.HeroScene), { ssr: false });

const pills = [
  { Icon: Network, label: 'SOFTWARE', sub: 'Development', grad: 'from-blue-500 to-blue-700' },
  { Icon: Globe, label: 'WEBSITE', sub: 'Development', grad: 'from-cyan-500 to-cyan-700' },
  { Icon: Crosshair, label: 'GPS SYSTEMS', sub: 'Tracking Solutions', grad: 'from-teal-500 to-teal-700' },
  { Icon: Factory, label: 'INDUSTRIAL', sub: 'Work & Automation', grad: 'from-green-500 to-green-700' },
];

export function Hero() {
  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full blur-[120px] bg-blue-500/30" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full blur-[120px] bg-cyan-500/20" />
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 blueprint opacity-50" />
        <ParticleBackground />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 text-text2 text-[11px] tracking-widest mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_12px_#f97316]" />
            INDIA&apos;S NEXT <b className="text-text">GENERATION BUSINESS SOLUTIONS COMPANY</b>
          </span>
          <h1 className="font-display font-black tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-5">
            KVL BUSINESS<br /><span className="gradient-text">SOLUTIONS</span>
          </h1>
          <p className="text-text2 text-base max-w-xl mb-8">
            Advanced Software, Industrial Solutions, GPS Systems &amp; Modern Business Technology Under One Powerful Platform.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {pills.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + i * .1 }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border surface-tint border-tint hover:-translate-y-1 hover:border-primary transition-all"
              >
                <div className={`w-10 h-10 rounded-lg grid place-items-center text-white bg-gradient-to-br ${p.grad}`}>
                  <p.Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold leading-none">{p.label}</h4>
                  <p className="text-[11px] text-text2 mt-1">{p.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/software" className="btn btn-primary"><Monitor className="w-4 h-4" /> View Software</Link>
            <Link href="/website-demos" className="btn btn-orange"><Play className="w-4 h-4" /> Watch Demo</Link>
            <button onClick={openQuoteModal} className="btn btn-ghost"><FileText className="w-4 h-4" /> Get Quote</button>
            <Link href="/contact" className="btn btn-ghost"><Phone className="w-4 h-4" /> Contact Team</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .2 }} className="relative h-[450px] lg:h-[540px]">
          <HeroScene />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <div className="font-display font-black text-4xl text-white drop-shadow-[0_0_30px_#3b82f6] tracking-[4px]">KVL</div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-56 h-10 rounded-full border-2 border-blue-400/70 shadow-[0_0_40px_rgba(59,130,246,0.5)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
