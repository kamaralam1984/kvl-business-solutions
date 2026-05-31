'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Stats } from '@/components/home/Stats';
import { Target, Eye, Heart, Trophy, Building2, LaptopMinimal, Palette, Users, Coffee, Mountain, Satellite, HardHat } from 'lucide-react';
import Link from 'next/link';

const timeline = [
  { year: '2015', title: 'Company Founded', desc: 'Started in a small Pune office with 2 engineers and a dream.' },
  { year: '2017', title: 'First 100 Clients', desc: 'Crossed 100 paying clients across software + websites.' },
  { year: '2019', title: 'GPS Division Launched', desc: 'Added GPS tracking hardware + dashboards for fleet customers.' },
  { year: '2021', title: 'Industrial & Civil', desc: 'Expanded into civil engineering, mechanical work and automation.' },
  { year: '2023', title: 'ISO & MSME Certified', desc: 'Achieved ISO 9001, ISO 27001 and Startup India recognition.' },
  { year: '2026', title: '1000+ Clients', desc: 'Serving 1000+ businesses with 500+ projects and 250+ live systems.' },
];

const team = [
  { name: 'Krishna Verma', role: 'Founder & CEO', initials: 'KV' },
  { name: 'Anjali Sharma', role: 'CTO', initials: 'AS' },
  { name: 'Rohit Gupta', role: 'Head of GPS Systems', initials: 'RG' },
  { name: 'Priya Singh', role: 'Head of Design', initials: 'PS' },
  { name: 'Vikram Mehta', role: 'VP Civil & Industrial', initials: 'VM' },
  { name: 'Neha Bhatia', role: 'Head of Customer Success', initials: 'NB' },
  { name: 'Sandeep Malhotra', role: 'Head of Sales', initials: 'SM' },
  { name: 'Ritu Kapoor', role: 'Head of Marketing', initials: 'RK' },
];

const gallery = [
  { Icon: Building2, label: 'Pune HQ — Workspace', wide: true, tall: false },
  { Icon: LaptopMinimal, label: 'Engineering Floor', wide: false, tall: false },
  { Icon: Palette, label: 'Design Studio', wide: false, tall: true },
  { Icon: Users, label: 'Meeting Room', wide: false, tall: false },
  { Icon: Coffee, label: 'Cafeteria', wide: false, tall: false },
  { Icon: Mountain, label: 'Team Offsite 2025', wide: true, tall: false },
  { Icon: Satellite, label: 'GPS Lab', wide: false, tall: false },
  { Icon: HardHat, label: 'Industrial Workshop', wide: false, tall: false },
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
  return (
    <div style={{ background: '#0a0a0a' }} className="text-white">

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: '#0a0a0a' }}>
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
            <span className="text-xs text-white/40 tracking-wide">Pune, India</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif', color: '#f5f5f0' }}
          >
            KVL Business<br />Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 text-xl max-w-2xl mx-auto"
            style={{ color: '#888' }}
          >
            Founded with a single mission — bring world-class enterprise technology to every Indian business.
          </motion.p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Story + Mission/Vision */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container grid lg:grid-cols-[1fr_2fr] gap-12">
          <FadeIn>
            <span className="eyebrow">OUR STORY</span>
            <h2 className="text-4xl font-extrabold my-4 leading-tight" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Built for<br />Indian Businesses
            </h2>
            <p className="leading-relaxed text-sm" style={{ color: '#888' }}>
              KVL Business Solutions started in 2015 as a software-services boutique. Today, we are a full-stack enterprise partner — software, websites, GPS systems, civil construction, mechanical work, automation and digital marketing — all under one roof.
            </p>
            <p className="mt-4 leading-relaxed text-sm" style={{ color: '#888' }}>
              Our mission: combine premium global technology with deep Indian market understanding to help businesses scale 10x faster.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { Icon: Target, title: 'Our Mission', desc: 'Empower 100,000 Indian businesses with world-class technology by 2030.' },
              { Icon: Eye, title: 'Our Vision', desc: "Become India's most trusted enterprise solutions partner." },
              { Icon: Heart, title: 'Our Values', desc: 'Honesty, ownership, customer obsession, premium quality.' },
              { Icon: Trophy, title: 'Our Promise', desc: '1-hour response, lifetime support, transparent pricing.' },
            ].map((it, i) => (
              <FadeIn key={it.title} delay={i * 0.1}>
                <div className="card-premium p-6 h-full">
                  <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)' }}>
                    <it.Icon className="w-5 h-5" style={{ color: '#c8a96e' }} />
                  </div>
                  <h4 className="font-bold text-base mb-2" style={{ color: '#f5f5f0' }}>{it.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{it.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — 4 numbers */}
      <section className="py-16" style={{ background: '#111111' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { num: '1000+', label: 'Businesses Served' },
              { num: '500+', label: 'Projects Delivered' },
              { num: '14+', label: 'Services Offered' },
              { num: '10+', label: 'Years Experience' },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>{s.num}</div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: '#888' }}>{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <FadeIn className="text-center mb-16">
            <span className="eyebrow">OUR JOURNEY</span>
            <h2 className="text-4xl md:text-5xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              A Decade of Innovation
            </h2>
            <p className="max-w-xl mx-auto text-sm" style={{ color: '#888' }}>From a 2-person studio to India&apos;s full-stack enterprise partner.</p>
          </FadeIn>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            {timeline.map((t, i) => (
              <FadeIn key={t.year} delay={i * 0.08}>
                <div className={`flex mb-12 relative ${i % 2 === 0 ? 'md:justify-start md:pr-[52%]' : 'md:justify-end md:pl-[52%]'} pl-14 md:pl-0`}>
                  {/* Gold circle marker */}
                  <div className="absolute left-4 md:left-1/2 top-4 w-4 h-4 rounded-full md:-translate-x-1/2 z-10 ring-2" style={{ background: '#c8a96e', ringColor: 'rgba(200,169,110,0.3)', boxShadow: '0 0 12px rgba(200,169,110,0.4)', border: '2px solid #0a0a0a', outline: '2px solid rgba(200,169,110,0.35)' }} />
                  <div className="card-premium p-5 max-w-xs">
                    <div className="text-sm font-extrabold mb-1" style={{ color: '#c8a96e' }}>{t.year}</div>
                    <h4 className="font-bold mb-1 text-sm" style={{ color: '#f5f5f0' }}>{t.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#888' }}>{t.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: '#111111' }}>
        <div className="container">
          <FadeIn className="text-center mb-14">
            <span className="eyebrow">OUR TEAM</span>
            <h2 className="text-4xl md:text-5xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              The People Behind KVL
            </h2>
            <p className="max-w-xl mx-auto text-sm" style={{ color: '#888' }}>A diverse team of engineers, designers, civil experts and business strategists.</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <FadeIn key={m.name} delay={i * 0.06}>
                <div className="card-premium p-6 text-center group cursor-default">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full grid place-items-center font-extrabold text-lg transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f5f5f0',
                    }}
                  >
                    {m.initials}
                  </div>
                  <h4 className="font-bold text-sm" style={{ color: '#f5f5f0' }}>{m.name}</h4>
                  <div className="text-xs mt-1 uppercase tracking-wide" style={{ color: '#c8a96e' }}>{m.role}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <FadeIn className="text-center mb-12">
            <span className="eyebrow">INSIDE KVL</span>
            <h2 className="text-4xl md:text-5xl font-extrabold my-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Our Office &amp; Culture
            </h2>
            <p className="text-sm" style={{ color: '#888' }}>Where innovation meets execution every day.</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-3">
            {gallery.map((g, i) => (
              <FadeIn key={i} delay={i * 0.05} className={`${g.wide ? 'col-span-2' : ''} ${g.tall ? 'row-span-2' : ''}`}>
                <div
                  className="relative rounded-2xl overflow-hidden grid place-items-center h-full w-full"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <g.Icon className="w-9 h-9" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <span className="absolute bottom-0 left-0 right-0 p-3 text-xs font-semibold text-left" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', color: '#f5f5f0' }}>{g.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      {/* CTA */}
      <section className="section" style={{ background: '#111111' }}>
        <div className="container text-center">
          <FadeIn>
            <h2 className="text-4xl font-extrabold mb-4" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
              Ready to work with us?
            </h2>
            <p className="mb-8 max-w-lg mx-auto text-sm" style={{ color: '#888' }}>Join 1000+ businesses already scaling with KVL. Free consultation, no commitment.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact" className="btn-primary px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">Get in Touch</Link>
              <Link href="/services" className="btn-gold px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">Our Services</Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
