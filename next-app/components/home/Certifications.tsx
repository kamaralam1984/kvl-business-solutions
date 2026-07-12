'use client';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';
import { ShieldCheck, Sparkles, Layers, LayoutDashboard, FileCheck, Headset } from 'lucide-react';

const reasons = [
  { Icon: ShieldCheck,      title: 'Verified Credentials',     desc: 'ISO 27001 certified, MSME-registered, rated 4.8/5.' },
  { Icon: Sparkles,         title: 'AI Failover, Built In',    desc: 'Multi-provider AI chain — no downtime on lead scoring or outreach.' },
  { Icon: Layers,           title: 'Modern Engineering Stack', desc: 'Next.js, React, TypeScript, and MongoDB.' },
  { Icon: LayoutDashboard,  title: 'Working Software Suite',   desc: 'Real production software — not a prototype.' },
  { Icon: FileCheck,        title: 'Straightforward Terms',    desc: 'Fixed pricing, 30-day money-back guarantee.' },
  { Icon: Headset,          title: 'Fast, Human Support',      desc: 'Free onboarding, response typically within 20-25 minutes.' },
];

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
            <span style={{ color: '#c8a870' }}>Every claim is verifiable.</span>
          </h2>
        </div>

        {/* Reason cards */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <div key={r.title} style={revealStyle(inView, i, { staggerMs: 80, durationMs: 550 })}>
              <div className="card-premium h-full p-7">
                <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
                  style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)' }}>
                  <r.Icon className="w-5 h-5" style={{ color: '#c8a870' }} />
                </div>

                <h3 className="font-display font-bold text-[1.02rem] mb-2.5 leading-snug" style={{ color: 'rgb(var(--text))' }}>
                  {r.title}
                </h3>

                <p className="text-[13.5px] leading-[1.7]" style={{ color: 'rgb(var(--text-2))' }}>
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
