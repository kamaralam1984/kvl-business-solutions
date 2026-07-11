'use client';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { caseStudies } from '@/lib/data/case-studies';

const projects = caseStudies.map(c => ({
  name: c.name,
  slug: c.slug,
  url: c.url,
  problem: c.challenge.body,
  solution: c.solution.body,
  tech: c.tech,
  impact: c.benefits[0]?.desc || c.overview,
  image: c.images.hero,
}));

export function CaseStudies() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-28" style={{ background: 'rgb(var(--bg))' }}>
      <div className="container">

        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="eyebrow mb-4 block">Live Products, Not Mockups</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
            Real products. Real users.<br />
            <span style={{ color: '#c8a870' }}>Verifiable today, not case studies we wrote ourselves.</span>
          </h2>
        </div>

        {/* Project cards */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {projects.map((p) => (
            <motion.div
              key={p.name}
              variants={{
                hidden:  { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <div className="card-premium h-full flex flex-col overflow-hidden group">
                <Link href={`/projects/${p.slug}`} className="relative block overflow-hidden" style={{ height: 180 }}>
                  <Image
                    src={p.image}
                    alt={`${p.name} — live project built by KVL Business Solutions`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-3 left-4 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(34,197,94,0.12)',
                      color: '#16a34a',
                      border: '1px solid rgba(34,197,94,0.3)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    Live
                  </span>
                </Link>

                <div className="p-7 flex flex-col flex-1">
                  <Link href={`/projects/${p.slug}`}>
                    <h3 className="font-display font-bold text-[1.1rem] mb-4 hover:underline" style={{ color: 'rgb(var(--text))' }}>
                      {p.name}
                    </h3>
                  </Link>

                  <div className="mb-3">
                    <div className="text-[10px] font-bold tracking-[0.12em] uppercase mb-1" style={{ color: 'rgb(var(--text-3))' }}>Problem</div>
                    <p className="text-[13px] leading-[1.6]" style={{ color: 'rgb(var(--text-2))' }}>{p.problem}</p>
                  </div>

                  <div className="mb-3">
                    <div className="text-[10px] font-bold tracking-[0.12em] uppercase mb-1" style={{ color: 'rgb(var(--text-3))' }}>Solution</div>
                    <p className="text-[13px] leading-[1.6]" style={{ color: 'rgb(var(--text-2))' }}>{p.solution}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tech.map(t => (
                      <span key={t} className="text-[10.5px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(200,168,112,0.08)', color: '#a3814f', border: '1px solid rgba(200,168,112,0.2)' }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <p className="text-[13px] leading-[1.6] font-medium mb-6" style={{ color: 'rgb(var(--text))' }}>
                    {p.impact}
                  </p>

                  <div className="mt-auto pt-5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(var(--border) / 0.07)' }}>
                    <Link href={`/projects/${p.slug}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold group/link" style={{ color: '#c8a870' }}>
                      View Case Study
                      <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                    </Link>
                    <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11.5px] font-medium" style={{ color: 'rgb(var(--text-3))' }}>
                      Live site <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
