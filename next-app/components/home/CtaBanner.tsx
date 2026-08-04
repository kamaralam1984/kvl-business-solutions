'use client';
import Link from 'next/link';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';
import { ArrowUpRight, MessageCircle, CalendarClock, CheckCircle2 } from 'lucide-react';

const WHATSAPP_NUMBER = '919942000413';
const WHATSAPP_MESSAGE = "Hi KVL, I'd like to talk about a software project.";

export function CtaBanner({ title, desc }: { title?: string; desc?: string }) {
  const { ref, inView } = useReveal();

  return (
    <>
      <div className="divider-premium" />

      <section className="relative py-32 overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>

        {/* Layered background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(var(--surface) / 0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.4,
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{
              width: 700, height: 400,
              background: 'radial-gradient(ellipse, rgba(200,168,112,0.05) 0%, transparent 65%)',
              filter: 'blur(60px)',
            }} />
          </div>
          <div className="absolute -left-32 top-1/2 -translate-y-1/2" style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }} />
          <div className="absolute -right-32 top-1/2 -translate-y-1/2" style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(200,168,112,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }} />
        </div>

        <div className="container relative z-10">
          <div ref={ref} style={revealStyle(inView, 0, { durationMs: 800, distance: 36 })} className="text-center max-w-3xl mx-auto">
            <span className="eyebrow mb-8 block">Let&apos;s Talk</span>

            {/* Headline */}
            <h2 className="heading-xl mb-6" style={{ color: 'rgb(var(--text))' }}>
              {title || (
                <>
                  Your next system.<br />
                  <span style={{ color: '#c8a870' }}>Ready to build.</span>
                </>
              )}
            </h2>

            {/* Subtext */}
            <p className="text-[16px] leading-[1.8] mb-10 mx-auto"
              style={{ color: 'rgb(var(--text-2))', maxWidth: 500 }}>
              {desc || 'No sales pitch — just a straightforward conversation with a solution architect about what you\'re building.'}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link
                href="/book-demo"
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
                Book a Strategy Call
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-[15px] transition-all duration-200"
                style={{
                  background: 'rgba(var(--text) / 0.05)',
                  border: '1px solid rgba(var(--text) / 0.12)',
                  color: 'rgba(var(--text) / 0.7)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(var(--text) / 0.09)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--text) / 0.2)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(var(--text) / 0.05)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--text) / 0.12)';
                  (e.currentTarget as HTMLElement).style.transform = '';
                }}
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>

              <Link
                href="/book-demo"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-[15px] transition-all duration-200"
                style={{ color: 'rgba(var(--text) / 0.55)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(var(--text) / 0.55)'; }}
              >
                <CalendarClock className="w-4 h-4" /> Request Enterprise Demo
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex items-center justify-center gap-2 text-[12.5px]" style={{ color: 'rgba(var(--text) / 0.45)' }}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#c8a870' }} />
              30-day money-back guarantee. Free training and onboarding on every project.
            </div>
          </div>
        </div>
      </section>

      <div className="divider-premium" />
    </>
  );
}
