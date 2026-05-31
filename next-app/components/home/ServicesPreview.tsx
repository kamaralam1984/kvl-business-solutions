'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Monitor, Globe, Crosshair, Factory, ArrowUpRight, Sparkles } from 'lucide-react';

const services = [
  {
    Icon: Monitor,
    num: '01',
    title: 'Custom Software',
    desc: 'ERP, CRM, inventory & billing systems — enterprise-grade, built for your exact workflow. Scalable and cloud-ready.',
    href: '/software',
    tag: 'Most Popular',
    accent: '#c8a870',
    features: ['ERP & CRM', 'Inventory Systems', 'Billing & Invoicing'],
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&q=80&auto=format&fit=crop',
  },
  {
    Icon: Globe,
    num: '02',
    title: 'Website Development',
    desc: 'Modern, lightning-fast, SEO-optimized websites and web applications that turn visitors into clients.',
    href: '/website-demos',
    tag: null,
    accent: '#60a5fa',
    features: ['Next.js & React', 'SEO Optimized', 'CMS Integration'],
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80&auto=format&fit=crop',
  },
  {
    Icon: Crosshair,
    num: '03',
    title: 'GPS Fleet Tracking',
    desc: 'Real-time vehicle tracking with live maps, route playback, driver alerts, and fleet analytics.',
    href: '/services',
    tag: null,
    accent: '#10b981',
    features: ['Live Tracking', 'Route Analytics', 'Driver Alerts'],
    img: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=700&q=80&auto=format&fit=crop',
  },
  {
    Icon: Factory,
    num: '04',
    title: 'Industrial Solutions',
    desc: 'Civil work, CCTV surveillance, automation systems, and industrial IoT for manufacturing facilities.',
    href: '/services',
    tag: null,
    accent: '#f59e0b',
    features: ['Civil & CCTV', 'IoT Automation', 'Smart Controls'],
    img: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=700&q=80&auto=format&fit=crop',
  },
];

export function ServicesPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(200,168,112,0.04) 0%, transparent 70%)',
        }} />
      </div>

      <div className="container relative z-10">

        {/* Section header — two-column */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <span className="eyebrow mb-4 block">What We Build</span>
            <h2 className="heading-xl" style={{ color: '#0a0a0a' }}>
              End-to-end solutions<br />
              <span style={{ color: '#c8a870' }}>for every business.</span>
            </h2>
          </div>
          <div>
            <p className="text-[15px] leading-[1.8] mb-6" style={{ color: 'rgba(0,0,0,0.5)', maxWidth: 380 }}>
              From custom software to GPS tracking, we build and deploy technology that keeps Indian enterprises running at peak performance.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[13px] font-semibold transition-all duration-200 group mb-6"
              style={{ color: '#c8a870' }}
            >
              Explore all services
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>

            {/* Team photo strip */}
            <div className="relative rounded-2xl overflow-hidden" style={{ height: 120 }}>
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop"
                alt="KVL team meeting"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,8,10,0.6) 0%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 16, color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>
                50+ Engineers · Pune, India
              </div>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {services.map((s) => (
            <motion.div
              key={s.num}
              variants={{
                hidden:   { opacity: 0, y: 28 },
                visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <Link href={s.href} className="block h-full group">
                <div
                  className="relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-end transition-all duration-350"
                  style={{
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    const img = el.querySelector('.card-photo') as HTMLElement | null;
                    el.style.borderColor = `rgba(${hexToRgb(s.accent)},0.3)`;
                    el.style.transform = 'translateY(-6px)';
                    el.style.boxShadow = `0 30px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(${hexToRgb(s.accent)},0.08)`;
                    if (img) img.style.filter = 'brightness(1.15)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    const img = el.querySelector('.card-photo') as HTMLElement | null;
                    el.style.borderColor = 'rgba(255,255,255,0.07)';
                    el.style.transform = '';
                    el.style.boxShadow = '';
                    if (img) img.style.filter = 'brightness(1)';
                  }}
                >
                  {/* Background photo */}
                  <img
                    className="card-photo absolute inset-0 w-full h-full object-cover transition-all duration-500"
                    src={s.img}
                    alt={s.title}
                    style={{ filter: 'brightness(1)' }}
                  />

                  {/* Gradient overlay — lighter for light mode */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.92) 100%)',
                    }}
                  />

                  {/* Top glow line on hover */}
                  <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    style={{ background: `linear-gradient(90deg, transparent 10%, ${s.accent}50 50%, transparent 90%)` }} />

                  {/* Card content — sits at bottom */}
                  <div className="relative z-10 p-7 flex flex-col">
                    {/* Number + icon row */}
                    <div className="flex items-start justify-between mb-6">
                      <span className="font-display font-black text-[2.5rem] leading-none tracking-tight"
                        style={{ color: 'rgba(255,255,255,0.06)' }}>
                        {s.num}
                      </span>
                      <div className="w-11 h-11 rounded-xl grid place-items-center"
                        style={{
                          background: `rgba(${hexToRgb(s.accent)},0.15)`,
                          border: `1px solid rgba(${hexToRgb(s.accent)},0.3)`,
                          backdropFilter: 'blur(8px)',
                        }}>
                        <s.Icon className="w-5 h-5" style={{ color: s.accent }} />
                      </div>
                    </div>

                    {/* Tag */}
                    {s.tag && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full mb-3 self-start"
                        style={{
                          background: 'rgba(200,168,112,0.15)',
                          color: '#c8a870',
                          border: '1px solid rgba(200,168,112,0.3)',
                          backdropFilter: 'blur(8px)',
                        }}>
                        <Sparkles className="w-2.5 h-2.5" /> {s.tag}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-bold text-[1.15rem] mb-3 leading-snug text-white">
                      {s.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-[13px] leading-[1.75] mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {s.desc}
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {s.features.map(f => (
                        <span key={f} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(255,255,255,0.12)',
                            color: 'rgba(255,255,255,0.6)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(4px)',
                          }}>
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Arrow CTA */}
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold"
                      style={{ color: s.accent }}>
                      <span className="group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: s.accent }}>
                        Learn more
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
