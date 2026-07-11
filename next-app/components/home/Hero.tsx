import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck, Award, Star, Sparkles,
  ArrowUpRight, Boxes, Users, Truck, Factory,
} from 'lucide-react';

/* ── Static data ─────────────────────────────────────── */
const trustBadges = [
  { Icon: ShieldCheck, label: 'ISO 27001 Certified',      color: '#10b981' },
  { Icon: Award,       label: 'MSME Registered',          color: '#c8a870' },
  { Icon: Sparkles,    label: 'Razorpay Verified Partner', color: '#c8a870' },
  { Icon: Star,        label: '4.8/5 Client Rating',       color: '#f59e0b' },
];

/* Systems diagram — real capability categories, positioned on a pentagon
   converging to a single gold point. Coordinates are percentages on a
   100x100 viewBox so the layout scales fluidly. */
const systemNodes = [
  { Icon: Boxes,   label: 'ERP',                x: 50, y: 12 },
  { Icon: Users,   label: 'CRM',                x: 86, y: 38 },
  { Icon: Sparkles,label: 'AI Automation',      x: 72, y: 80 },
  { Icon: Truck,   label: 'Fleet & GPS',        x: 28, y: 80 },
  { Icon: Factory, label: 'Industrial Systems', x: 14, y: 38 },
];

/* ── Component ──────────────────────────────────────── */
/* Pure server component — no client JS. The H1 below is the page's LCP
   element; it (and the rest of the left column) renders immediately with
   no entrance animation, since animating in the LCP candidate delays its
   final paint until after JS hydration — a large Core Web Vitals regression
   on throttled mobile CPUs. The decorative right-column diagram is
   desktop-only and animates via plain CSS keyframes (no framer-motion),
   so the whole section ships zero JavaScript to the client. Button hover
   states use Tailwind's `hover:` classes instead of JS event handlers. */
export function Hero() {
  return (
    <section
      className="relative min-h-[92svh] flex items-center overflow-hidden"
      style={{ paddingTop: '80px', paddingBottom: '60px', background: 'rgb(var(--bg))' }}
    >
      {/* ── Layered Background (CSS only) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 55% at 75% 35%, rgba(200,168,112,0.07) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(var(--surface) / 0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute bottom-0 inset-x-0 h-32" style={{
          background: 'linear-gradient(to top, rgb(var(--bg)) 0%, transparent 100%)',
        }} />
      </div>

      {/* ── Main Container ────────────────────────── */}
      <div className="container relative z-10">

        {/* Eyebrow */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] font-semibold uppercase"
            style={{ color: '#c8a870' }}
          >
            <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, #c8a870, transparent)', display: 'inline-block' }} />
            Enterprise Software, Engineered in India
          </span>
        </div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-[56%_44%] gap-12 lg:gap-10 items-center">

          {/* ══ LEFT COLUMN ════════════════════════ */}
          <div>

            {/* Headline — the LCP element */}
            <h1
              className="font-black leading-[1.05] tracking-[-0.03em] mb-7"
              style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.3rem)', color: 'rgb(var(--text))' }}
            >
              Software built for your business —{' '}
              <span style={{ color: '#c8a870' }}>not the other way around.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-[17px] leading-[1.75] mb-9"
              style={{ color: 'rgb(var(--text-2))', maxWidth: '540px' }}
            >
              Custom ERP, CRM, and AI automation built around how your business
              actually runs — so operations move faster, decisions are backed by
              real data, and nothing breaks when it matters most. Trusted by
              hospital networks, government bodies, and enterprises that cannot
              afford downtime.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/book-demo"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[14px] transition-shadow duration-200 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
                style={{ background: '#0a0a0a', color: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.16)' }}
              >
                Talk to a Solution Architect
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>

              <Link
                href="/software"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[14px] transition-colors duration-200 border hover:border-[#c8a870] hover:bg-[rgba(200,168,112,0.06)]"
                style={{ borderColor: 'rgba(var(--border) / 0.15)', color: 'rgb(var(--text))', background: 'transparent' }}
              >
                See Live Case Studies
              </Link>
            </div>

            {/* Trust strip */}
            <div
              className="flex flex-wrap gap-x-6 gap-y-3 pt-8"
              style={{ borderTop: '1px solid rgba(var(--border) / 0.08)' }}
            >
              {trustBadges.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'rgb(var(--text-2))' }}>
                  <b.Icon className="w-4 h-4 shrink-0" style={{ color: b.color }} />
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* ══ RIGHT COLUMN — Systems diagram (desktop only, CSS-animated) ══ */}
          <div className="relative hidden lg:block hero-diagram-in">
            <div
              className="relative w-full max-w-[440px] mx-auto aspect-square rounded-3xl overflow-hidden"
              style={{
                border: '1px solid rgba(var(--border) / 0.08)',
                boxShadow: '0 30px 70px rgba(0,0,0,0.08)',
              }}
            >
              {/* Background photo — tech/office theme, washed out so the
                  diagram nodes on top stay legible */}
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=75&auto=format&fit=crop"
                alt=""
                fill
                sizes="440px"
                className="object-cover"
                aria-hidden
              />
              <div className="absolute inset-0" style={{ background: 'rgba(var(--bg-2) / 0.86)' }} />

              {/* Connecting lines */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
                {systemNodes.map((n, i) => (
                  <line
                    key={n.label}
                    className="hero-diagram-line"
                    x1={50} y1={50} x2={n.x} y2={n.y}
                    stroke="rgba(var(--surface) / 0.14)"
                    strokeWidth={0.35}
                    vectorEffect="non-scaling-stroke"
                    style={{ animationDelay: `${0.5 + i * 0.12}s, ${1.5 + i * 0.12}s` }}
                  />
                ))}
              </svg>

              {/* Center convergence point */}
              <div
                className="hero-diagram-center absolute rounded-full"
                style={{
                  left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
                  width: 14, height: 14, background: '#c8a870',
                }}
              />

              {/* Nodes */}
              {systemNodes.map((n, i) => (
                <div
                  key={n.label}
                  className={`hero-diagram-node hero-diagram-node-${i} absolute`}
                  style={{
                    left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)',
                    animationDelay: `${0.9 + i * 0.1}s`,
                  }}
                >
                  <div
                    className="hero-diagram-node-float flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap"
                    style={{
                      background: 'rgb(var(--bg-2))',
                      border: '1px solid rgba(var(--border) / 0.09)',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.07)',
                      color: 'rgb(var(--text-2))',
                    }}
                  >
                    <n.Icon className="w-3.5 h-3.5 shrink-0" style={{ color: '#c8a870' }} />
                    {n.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-diagram-fade-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes hero-line-draw { from { stroke-dasharray: 100; stroke-dashoffset: 100; opacity: 0; } to { stroke-dasharray: 100; stroke-dashoffset: 0; opacity: 1; } }
        @keyframes hero-node-in { from { opacity: 0; transform: translate(-50%,-50%) scale(0.8); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .hero-diagram-in { animation: hero-diagram-fade-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .hero-diagram-line { animation: hero-line-draw 1s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-diagram-node { animation: hero-node-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-diagram-center { transform: translate(-50%,-50%); box-shadow: 0 0 0 6px rgba(200,168,112,0.14), 0 0 24px rgba(200,168,112,0.35); }

        /* ── Continuous alive motion — each node drifts on its own distinct
           path/duration/delay so the diagram never looks synced/robotic.
           Disabled entirely for users who prefer reduced motion. ── */
        @media (prefers-reduced-motion: no-preference) {
          @keyframes hero-line-breathe { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }
          @keyframes hero-center-pulse {
            0%,100% { transform: translate(-50%,-50%) scale(1); box-shadow: 0 0 0 6px rgba(200,168,112,0.14), 0 0 24px rgba(200,168,112,0.35); }
            50%     { transform: translate(-50%,-50%) scale(1.18); box-shadow: 0 0 0 9px rgba(200,168,112,0.10), 0 0 36px rgba(200,168,112,0.55); }
          }
          @keyframes hero-float-0 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(1px,-8px) rotate(-1deg); } }
          @keyframes hero-float-1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 33% { transform: translate(6px,-3px) rotate(2deg); } 66% { transform: translate(2px,4px) rotate(1deg); } }
          @keyframes hero-float-2 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(4px,7px) rotate(-2deg); } }
          @keyframes hero-float-3 { 0%,100% { transform: translate(0,0) rotate(0deg); } 40% { transform: translate(-6px,5px) rotate(1.5deg); } 70% { transform: translate(-2px,-3px) rotate(-1deg); } }
          @keyframes hero-float-4 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(-7px,-4px) rotate(2deg); } }

          .hero-diagram-line { animation-name: hero-line-draw, hero-line-breathe; animation-duration: 1s, 3.2s; animation-timing-function: cubic-bezier(0.22,1,0.36,1), ease-in-out; animation-iteration-count: 1, infinite; animation-fill-mode: both, none; }
          .hero-diagram-center { animation: hero-center-pulse 2.8s ease-in-out 1.3s infinite; }
          .hero-diagram-node-0 .hero-diagram-node-float { animation: hero-float-0 3.4s ease-in-out 0.1s infinite; }
          .hero-diagram-node-1 .hero-diagram-node-float { animation: hero-float-1 4.3s ease-in-out 0.35s infinite; }
          .hero-diagram-node-2 .hero-diagram-node-float { animation: hero-float-2 3.8s ease-in-out 0.6s infinite; }
          .hero-diagram-node-3 .hero-diagram-node-float { animation: hero-float-3 4.6s ease-in-out 0.2s infinite; }
          .hero-diagram-node-4 .hero-diagram-node-float { animation: hero-float-4 3.6s ease-in-out 0.5s infinite; }
        }
      `}</style>
    </section>
  );
}
