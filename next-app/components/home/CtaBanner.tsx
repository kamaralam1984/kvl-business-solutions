'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Phone, Play } from 'lucide-react';
import { openQuoteModal } from '@/components/widgets/QuoteModal';

const trustPoints = [
  'No credit card required',
  'Free 30-min consultation',
  'Setup in 48 hours',
  'Dedicated account manager',
];

export function CtaBanner({ title, desc }: { title?: string; desc?: string }) {
  return (
    <>
      <div className="divider-premium" />

      <section className="relative py-32 overflow-hidden" style={{ background: '#faf9f7' }}>

        {/* Layered background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Dot grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.4,
          }} />

          {/* Large central glow — warm gold, very soft */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{
              width: 700, height: 400,
              background: 'radial-gradient(ellipse, rgba(200,168,112,0.05) 0%, transparent 65%)',
              filter: 'blur(60px)',
            }} />
          </div>

          {/* Left orb */}
          <div className="absolute -left-32 top-1/2 -translate-y-1/2" style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }} />

          {/* Right orb */}
          <div className="absolute -right-32 top-1/2 -translate-y-1/2" style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(200,168,112,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }} />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
              style={{ borderColor: 'rgba(200,168,112,0.3)', background: 'rgba(200,168,112,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: '#c8a870' }}>
                Start Today — Free Consultation
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-display font-black tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)', color: '#0a0a0a' }}>
              {title || (
                <>
                  Ready to transform<br />
                  <span style={{ color: '#c8a870' }}>your business?</span>
                </>
              )}
            </h2>

            {/* Subtext */}
            <p className="text-[16px] leading-[1.8] mb-10 mx-auto"
              style={{ color: 'rgba(0,0,0,0.5)', maxWidth: 500 }}>
              {desc || 'Join 1,200+ businesses that trust KVL for software, GPS fleet management, and industrial automation across India.'}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <button
                onClick={openQuoteModal}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-[15px] transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #c8a870 0%, #d4b880 100%)',
                  color: '#0a0a0a',
                  boxShadow: '0 6px 30px rgba(200,168,112,0.4)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 50px rgba(200,168,112,0.55)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 30px rgba(200,168,112,0.4)';
                }}
              >
                <Play className="w-4 h-4 fill-current" /> Book Free Demo
              </button>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-[15px] transition-all duration-200"
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.12)',
                  color: 'rgba(0,0,0,0.7)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.09)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.2)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.12)';
                  (e.currentTarget as HTMLElement).style.transform = '';
                }}
              >
                <Phone className="w-4 h-4" /> Talk to Us
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>

            {/* Trust points */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {trustPoints.map(p => (
                <div key={p} className="flex items-center gap-2 text-[12px]" style={{ color: 'rgba(0,0,0,0.4)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#c8a870' }} />
                  {p}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="divider-premium" />
    </>
  );
}
