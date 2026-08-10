'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';
import { Sparkles, Layers, LayoutDashboard, FileCheck, Headset, RotateCw } from 'lucide-react';

const reasons = [
  { Icon: Sparkles,         title: 'AI Failover, Built In',    desc: 'Multi-provider AI chain — no downtime on lead scoring or outreach.', image: '/certifications/ai-failover.png' },
  { Icon: Layers,           title: 'Modern Engineering Stack', desc: 'Next.js, React, TypeScript, and MongoDB.', image: '/certifications/modern-engineering-stack.png' },
  { Icon: LayoutDashboard,  title: 'Working Software Suite',   desc: 'Real production software — not a prototype.', image: '/certifications/working-software-suite.png' },
  { Icon: FileCheck,        title: 'Straightforward Terms',    desc: 'Fixed pricing, 30-day money-back guarantee.', image: '/certifications/straightforward-terms.png' },
  { Icon: Headset,          title: 'Fast, Human Support',      desc: 'Free onboarding, and a 1-hour response time.', image: '/certifications/fast-human-support.png' },
];

function ReasonCard({ r, index, inView }: { r: (typeof reasons)[number]; index: number; inView: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();

  const toggle = () => setFlipped(f => !f);

  return (
    <div style={revealStyle(inView, index, { staggerMs: 80, durationMs: 550 })}>
      {/* Perspective wrapper — the 3D depth the flip rotates within. */}
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${r.title} — click to flip and read more`}
        onClick={toggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        className="relative h-full cursor-pointer outline-none group"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="relative h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Front — image (or icon, for the one card without a custom
              graphic) plus title. ── */}
          <div
            className="card-premium h-full overflow-hidden flex flex-col focus-visible:ring-2"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            {r.image ? (
              // The source files are pre-cropped to exactly their title/subtitle
              // region (941×620) — matching that same ratio here means object-cover
              // has nothing left to trim, so the full heading is always visible
              // instead of getting cut off mid-word at an arbitrary fixed height.
              <div className="relative w-full shrink-0" style={{ aspectRatio: '941 / 620' }}>
                <Image
                  src={r.image}
                  alt={`${r.title} — ${r.desc}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={75}
                  className="object-cover"
                  style={{ objectPosition: 'top' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 78%, rgba(0,0,0,0.25) 100%)' }} />
              </div>
            ) : (
              <div className="pt-7 px-7">
                <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
                  style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)' }}>
                  <r.Icon className="w-5 h-5" style={{ color: '#c8a870' }} />
                </div>
              </div>
            )}
            <div className="p-7 pt-5 flex-1 flex flex-col">
              <h3 className="font-display font-bold text-[1.02rem] mb-1.5 leading-snug" style={{ color: 'rgb(var(--text))' }}>
                {r.title}
              </h3>
              <p className="text-[13.5px] leading-[1.7]" style={{ color: 'rgb(var(--text-2))' }}>
                {r.desc}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-1.5 text-[11px] font-semibold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
                style={{ color: 'rgb(var(--gold-text))' }}>
                <RotateCw className="w-3 h-3" /> Flip for details
              </div>
            </div>
          </div>

          {/* ── Back — full description, mirrored so it reads correctly
              once the card has rotated 180°. ── */}
          <div
            className="card-premium h-full p-7 flex flex-col justify-center absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'rgb(var(--bg-3))',
            }}
          >
            <div className="w-9 h-9 rounded-lg grid place-items-center mb-4"
              style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)' }}>
              <r.Icon className="w-4 h-4" style={{ color: '#c8a870' }} />
            </div>
            <h3 className="font-display font-bold text-[1.05rem] mb-3 leading-snug" style={{ color: 'rgb(var(--gold-text))' }}>
              {r.title}
            </h3>
            <p className="text-[14px] leading-[1.75]" style={{ color: 'rgb(var(--text-2))' }}>
              {r.desc}
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'rgb(var(--text-3))' }}>
              <RotateCw className="w-3 h-3" /> Click to flip back
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Certifications() {
  const { ref, inView } = useReveal();

  return (
    <section className="py-28" style={{ background: 'rgb(var(--bg-2))' }}>
      <div className="container">

        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="eyebrow mb-4 block">Why Businesses Trust KVL</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
            Nothing here is inflated.<br />
            <span style={{ color: 'rgb(var(--gold-text))' }}>Every claim is verifiable.</span>
          </h2>
        </div>

        {/* Reason cards — click (or Enter/Space) flips each one independently
            to reveal its full description on the back. */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ gridAutoRows: '1fr' }}>
          {reasons.map((r, i) => (
            <ReasonCard key={r.title} r={r} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
