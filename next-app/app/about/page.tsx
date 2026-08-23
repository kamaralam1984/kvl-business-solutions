'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { StatsBar } from '@/components/home/StatsBar';
import { caseStudies } from '@/lib/data/case-studies';
import { Target, Eye, Heart, Trophy } from 'lucide-react';
import Link from 'next/link';

const timeline = [
  { year: '2015', title: 'Company Founded', desc: 'Started in Patna with a focus on custom enterprise software — purpose-built systems, not off-the-shelf templates.' },
  { year: '2021', title: 'Infrastructure & Industrial Systems', desc: 'Expanded into GPS fleet visibility, civil engineering, and industrial automation — bringing physical operations onto digital systems.' },
  { year: '2023', title: 'MSME Registered', desc: 'Formalized our quality practices with MSME (Govt. of India) registration — an NDA is available on request before any project discussion.' },
  { year: '2025', title: 'AI Automation Platform Launched', desc: 'Built a multi-provider AI failover platform that keeps lead scoring, chat, and voice outreach running without interruption for clients.' },
];

const teamAreas = [
  { role: 'Engineering', initials: 'EN' },
  { role: 'GPS Systems', initials: 'GP' },
  { role: 'Design', initials: 'DS' },
  { role: 'Civil & Industrial', initials: 'CI' },
  { role: 'Customer Success', initials: 'CS' },
  { role: 'Sales', initials: 'SL' },
];

const gallery = [
  { img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=75&auto=format&fit=crop', label: 'Patna HQ — Workspace', wide: true, tall: false },
  { img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=75&auto=format&fit=crop', label: 'Engineering Floor', wide: false, tall: false },
  { img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=75&auto=format&fit=crop', label: 'Design Studio', wide: false, tall: true },
  { img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=75&auto=format&fit=crop', label: 'Meeting Room', wide: false, tall: false },
  { img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=75&auto=format&fit=crop', label: 'Cafeteria', wide: false, tall: false },
  { img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=75&auto=format&fit=crop', label: 'Team Offsite 2025', wide: true, tall: false },
  { img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=75&auto=format&fit=crop', label: 'GPS Lab', wide: false, tall: false },
  { img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&q=75&auto=format&fit=crop', label: 'Industrial Workshop', wide: false, tall: false },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const [productCount, setProductCount] = useState(0);
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => setProductCount(d.products?.length || 0)).catch(() => {});
  }, []);

  return (
    <div style={{ background: 'rgb(var(--bg))' }}>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.06) 0%, transparent 70%)' }} />
        <div className="relative z-10 container text-center py-32">
          <motion.span
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            ABOUT KVL
          </motion.span>
          {/* Since 2018 badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mt-4 mb-5 px-4 py-1.5 rounded-full border"
            style={{ borderColor: 'rgba(200,169,110,0.3)', background: 'rgba(200,169,110,0.06)' }}
          >
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#c8a96e' }}>Since 2015</span>
            <span className="w-1 h-1 rounded-full" style={{ background: '#c8a96e' }} />
            <span className="text-xs tracking-wide" style={{ color: 'rgba(var(--text) / 0.4)' }}>Patna, India</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight text-text"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            KVL Business<br />Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 text-xl max-w-2xl mx-auto text-text2"
          >
            We&apos;re a digital transformation and business automation partner — built to give Indian businesses the enterprise-grade software, infrastructure and engineering that used to be out of reach.
          </motion.p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Story + Mission/Vision */}
      <section className="section" style={{ background: 'rgb(var(--bg))' }}>
        <div className="container grid lg:grid-cols-[1fr_2fr] gap-12">
          <FadeIn>
            <span className="eyebrow">OUR STORY</span>
            <h2 className="text-4xl font-extrabold my-4 leading-tight text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Built for<br />Indian Businesses
            </h2>
            <p className="leading-relaxed text-sm text-text2">
              KVL Business Solutions started in 2015 as a software-services team. Today, we&apos;re a full-stack technology and automation partner — enterprise software, infrastructure, GPS and industrial systems, civil engineering and digital marketing, delivered by one accountable team instead of five disconnected vendors.
            </p>
            <p className="mt-4 leading-relaxed text-sm text-text2">
              Our mission is simple: combine world-class engineering with deep understanding of how Indian businesses actually operate, so the systems we build fit the way you work — not the other way around.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { Icon: Target, title: 'Our Mission', desc: 'Give 100,000 Indian businesses access to enterprise-grade technology by 2030 — the systems large companies use, built for businesses of any size.' },
              { Icon: Eye, title: 'Our Vision', desc: "To be the technology and automation partner businesses call first — not a vendor they hire once and forget." },
              { Icon: Heart, title: 'Our Values', desc: 'Honesty in scoping, ownership of outcomes, and a refusal to ship anything less than production-grade.' },
              { Icon: Trophy, title: 'Our Promise', desc: 'A 1-hour response, transparent fixed pricing, an NDA on request before we discuss your project, and support that doesn\'t end when the invoice is paid.' },
            ].map((it, i) => (
              <FadeIn key={it.title} delay={i * 0.1}>
                <div className="card-premium p-6 h-full">
                  <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)' }}>
                    <it.Icon className="w-5 h-5" style={{ color: '#c8a96e' }} />
                  </div>
                  <h4 className="font-bold text-base mb-2 text-text">{it.title}</h4>
                  <p className="text-sm leading-relaxed text-text2">{it.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — 4 numbers */}
      <section className="py-16" style={{ background: 'rgb(var(--bg-3))' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { num: '14+', label: 'Services Offered' },
              { num: '2015', label: 'Founded' },
              { num: 'MSME', label: 'Registered' },
              { num: 'NDA', label: 'On Request' },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-extrabold mb-2 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>{s.num}</div>
                  <div className="text-xs uppercase tracking-widest text-text2">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="section" style={{ background: 'rgb(var(--bg))' }}>
        <div className="container">
          <FadeIn className="text-center mb-16">
            <span className="eyebrow">OUR JOURNEY</span>
            <h2 className="text-4xl md:text-5xl font-extrabold my-4 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Built Since 2015
            </h2>
            <p className="max-w-xl mx-auto text-sm text-text2">From a software-services team to a full-stack technology and automation partner.</p>
          </FadeIn>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px" style={{ background: 'rgba(var(--border) / 0.1)' }} />
            {timeline.map((t, i) => (
              <FadeIn key={t.year} delay={i * 0.08}>
                <div className={`flex mb-12 relative ${i % 2 === 0 ? 'md:justify-start md:pr-[52%]' : 'md:justify-end md:pl-[52%]'} pl-14 md:pl-0`}>
                  {/* Gold circle marker */}
                  <div className="absolute left-4 md:left-1/2 top-4 w-4 h-4 rounded-full md:-translate-x-1/2 z-10 ring-2" style={{ background: '#c8a96e', ['--tw-ring-color' as any]: 'rgba(200,169,110,0.3)', boxShadow: '0 0 12px rgba(200,169,110,0.4)', border: '2px solid rgb(var(--bg))', outline: '2px solid rgba(200,169,110,0.35)' }} />
                  <div className="card-premium p-5 max-w-xs">
                    <div className="text-sm font-extrabold mb-1" style={{ color: '#c8a96e' }}>{t.year}</div>
                    <h4 className="font-bold mb-1 text-sm text-text">{t.title}</h4>
                    <p className="text-xs leading-relaxed text-text2">{t.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'rgb(var(--bg-3))' }}>
        <div className="container">
          <FadeIn className="text-center mb-14">
            <span className="eyebrow">OUR TEAM</span>
            <h2 className="text-4xl md:text-5xl font-extrabold my-4 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              The Teams Behind KVL
            </h2>
            <p className="max-w-xl mx-auto text-sm text-text2">Engineers, GPS and infrastructure specialists, designers, civil experts and business strategists — every discipline your project needs, under one roof.</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {teamAreas.map((t, i) => (
              <FadeIn key={t.role} delay={i * 0.06}>
                <div className="card-premium p-6 text-center group cursor-default">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full grid place-items-center font-extrabold text-lg transition-all duration-300 text-text"
                    style={{
                      background: 'rgba(var(--text) / 0.05)',
                      border: '1px solid rgba(var(--border) / 0.1)',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wide" style={{ color: '#c8a96e' }}>{t.role}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section" style={{ background: 'rgb(var(--bg))' }}>
        <div className="container">
          <FadeIn className="text-center mb-12">
            <span className="eyebrow">INSIDE KVL</span>
            <h2 className="text-4xl md:text-5xl font-extrabold my-4 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Our Office &amp; Culture
            </h2>
            <p className="text-sm text-text2">Where innovation meets execution every day.</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-3">
            {gallery.map((g, i) => (
              <FadeIn key={i} delay={i * 0.05} className={`${g.wide ? 'col-span-2' : ''} ${g.tall ? 'row-span-2' : ''}`}>
                <div
                  className="relative rounded-2xl overflow-hidden h-full w-full"
                  style={{ background: 'rgb(var(--bg-3))', border: '1px solid rgba(var(--border) / 0.07)' }}
                >
                  <Image
                    src={g.img}
                    alt={g.label}
                    fill
                    sizes={g.wide ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                    className="object-cover"
                  />
                  <span className="absolute bottom-0 left-0 right-0 p-3 text-xs font-semibold text-left" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', color: '#f5f5f0' }}>{g.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <StatsBar productCount={productCount} caseStudyCount={caseStudies.length} />

      {/* CTA */}
      <section className="section" style={{ background: 'rgb(var(--bg-3))' }}>
        <div className="container text-center">
          <FadeIn>
            <h2 className="text-4xl font-extrabold mb-4 text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Let&apos;s build what&apos;s next for your business.
            </h2>
            <p className="mb-8 max-w-lg mx-auto text-sm text-text2">Free consultation, no commitment — tell us what you&apos;re building and we&apos;ll tell you exactly how we&apos;d approach it.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact" className="btn-primary px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">Talk to a Solution Architect</Link>
              <Link href="/services" className="btn-gold px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">Explore Our Services</Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
