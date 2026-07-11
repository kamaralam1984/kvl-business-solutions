'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Smartphone, Network, Handshake, Brain, LaptopMinimal, ArrowUpRight } from 'lucide-react';

const services = [
  {
    Icon: Globe,
    title: 'High-Performance Web Platforms',
    desc: 'Digital platforms built on Next.js and React — engineered for speed, search visibility, and conversions from the day they go live.',
    benefit: 'Better search rankings and more customers, day one.',
    href: '/services/website',
  },
  {
    Icon: Smartphone,
    title: 'Mobile Applications',
    desc: 'Cross-platform iOS and Android applications engineered for performance and scalability, with offline sync and secure API layers built in.',
    benefit: 'Higher retention, fewer drop-offs at checkout.',
    href: '/services',
  },
  {
    Icon: Network,
    title: 'Enterprise ERP',
    desc: 'Enterprise ERP that unifies finance, inventory, and operations on one centralized platform — replacing five disconnected spreadsheets with real-time visibility.',
    benefit: 'Fewer stockouts, faster month-end closing.',
    href: '/software/erp',
  },
  {
    Icon: Handshake,
    title: 'AI-Powered CRM',
    desc: 'AI-powered CRM that helps sales teams capture more leads, manage pipelines, and close deals faster — every follow-up on time, no deal lost to a full inbox.',
    benefit: 'Shorter sales cycles, higher pipeline visibility.',
    href: '/software/crm',
  },
  {
    Icon: Brain,
    title: 'AI Automation',
    desc: 'Intelligent automation that takes repetitive work off your team’s plate, reduces manual error, and frees people to focus on decisions instead of data entry.',
    benefit: 'Hours saved weekly, fewer manual errors.',
    href: '/services/ai',
  },
  {
    Icon: LaptopMinimal,
    title: 'Custom Enterprise Software',
    desc: 'Purpose-built systems architected around your exact workflows and business rules — not a generic template stretched to fit.',
    benefit: 'No workarounds, no wasted spend.',
    href: '/services/custom-software',
  },
];

export function ServicesPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="dot-grid absolute inset-0 opacity-30" />
      </div>

      <div className="container relative z-10">

        {/* Section header — centered */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="eyebrow mb-4 block">The Six Systems We Engineer</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
            Six systems. One engineering standard.<br />
            <span style={{ color: '#c8a870' }}>Built to move your business forward.</span>
          </h2>
        </div>

        {/* Service cards */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <Link href={s.href} className="block h-full group">
                <div className="card-premium h-full p-7 flex flex-col">
                  <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
                    style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)' }}>
                    <s.Icon className="w-5 h-5" style={{ color: '#c8a870' }} />
                  </div>

                  <h3 className="font-display font-bold text-[1.05rem] mb-2.5 leading-snug" style={{ color: 'rgb(var(--text))' }}>
                    {s.title}
                  </h3>

                  <p className="text-[13.5px] leading-[1.7] mb-3" style={{ color: 'rgb(var(--text-2))' }}>
                    {s.desc}
                  </p>

                  <p className="text-[12.5px] font-medium leading-snug mb-6" style={{ color: 'rgb(var(--text-3))' }}>
                    {s.benefit}
                  </p>

                  <div className="flex items-center gap-1.5 text-[12.5px] font-semibold mt-auto"
                    style={{ color: '#c8a870' }}>
                    Learn more
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
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
