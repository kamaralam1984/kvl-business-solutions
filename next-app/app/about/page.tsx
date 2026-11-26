'use client';
import { useEffect, useState } from 'react';
import { hostedProductCount } from '@/lib/data/hosted-products';
import Image from 'next/image';
import { StatsBar } from '@/components/home/StatsBar';
import { caseStudies } from '@/lib/data/case-studies';
import { Target, Eye, Heart, Trophy } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Badge, Button, Card, Section, SectionHeading } from '@/components/ui';

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

export default function AboutPage() {
  const [productCount, setProductCount] = useState(0);
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => setProductCount(d.products?.length || 0)).catch(() => {});
  }, []);

  return (
    <div className="bg-bg">
      <PageHero
        eyebrow="ABOUT KVL"
        title="KVL Business"
        accent="Solutions"
        description="We're a digital transformation and business automation partner — built to give Indian businesses the enterprise-grade software, infrastructure and engineering that used to be out of reach."
        breadcrumb="About"
      />

      {/* Story + Mission/Vision */}
      <Section containerClassName="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <Badge className="mb-4">Since 2015 · Patna, India</Badge>
          <SectionHeading eyebrow="OUR STORY" title={<>Built for<br />Indian Businesses</>} />
          <p className="mt-6 leading-relaxed text-text2">
            KVL Business Solutions started in 2015 as a software-services team. Today, we&apos;re a full-stack technology and automation partner — enterprise software, infrastructure, GPS and industrial systems, civil engineering and digital marketing, delivered by one accountable team instead of five disconnected vendors.
          </p>
          <p className="mt-4 leading-relaxed text-text2">
            Our mission is simple: combine world-class engineering with deep understanding of how Indian businesses actually operate, so the systems we build fit the way you work — not the other way around.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { Icon: Target, title: 'Our Mission', desc: 'Give 100,000 Indian businesses access to enterprise-grade technology by 2030 — the systems large companies use, built for businesses of any size.' },
            { Icon: Eye, title: 'Our Vision', desc: "To be the technology and automation partner businesses call first — not a vendor they hire once and forget." },
            { Icon: Heart, title: 'Our Values', desc: 'Honesty in scoping, ownership of outcomes, and a refusal to ship anything less than production-grade.' },
            { Icon: Trophy, title: 'Our Promise', desc: 'A 1-hour response, transparent fixed pricing, an NDA on request before we discuss your project, and support that doesn\'t end when the invoice is paid.' },
          ].map(it => (
            <Card key={it.title} className="h-full p-6">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-btn border border-line bg-bg2">
                <it.Icon className="h-5 w-5 text-gold-text" aria-hidden />
              </div>
              <h3 className="mb-2 font-display text-card-title text-text">{it.title}</h3>
              <p className="leading-relaxed text-text2">{it.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Stats — 4 numbers */}
      <Section tone="alt">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { num: '14+', label: 'Services Offered' },
            { num: '2015', label: 'Founded' },
            { num: 'MSME', label: 'Registered' },
            { num: 'NDA', label: 'On Request' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="mb-2 font-display text-4xl font-extrabold text-text md:text-5xl">{s.num}</div>
              <div className="text-xs uppercase tracking-widest text-text2">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Journey Timeline */}
      <Section>
        <SectionHeading align="center" eyebrow="OUR JOURNEY" title="Built Since 2015" description="From a software-services team to a full-stack technology and automation partner." />
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2 md:-translate-x-px" />
          {timeline.map((t, i) => (
            <div key={t.year} className={`relative mb-12 flex pl-14 md:pl-0 ${i % 2 === 0 ? 'md:justify-start md:pr-[52%]' : 'md:justify-end md:pl-[52%]'}`}>
              <div aria-hidden className="absolute left-4 top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-bg bg-gold ring-4 ring-bg2 md:left-1/2" />
              <Card className="max-w-sm p-5">
                <div className="mb-1 text-sm font-extrabold text-gold-text">{t.year}</div>
                <h3 className="mb-1 font-display text-base font-bold text-text">{t.title}</h3>
                <p className="text-sm leading-relaxed text-text2">{t.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="OUR TEAM" title="The Teams Behind KVL" description="Engineers, GPS and infrastructure specialists, designers, civil experts and business strategists — every discipline your project needs, under one roof." />
        <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3">
          {teamAreas.map(t => (
            <Card key={t.role} className="p-6 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-line bg-bg2 text-lg font-extrabold text-text">
                {t.initials}
              </div>
              <div className="text-sm font-bold uppercase tracking-wide text-gold-text">{t.role}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Gallery */}
      <Section>
        <SectionHeading align="center" eyebrow="INSIDE KVL" title="Our Office & Culture" description="Where innovation meets execution every day." />
        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4">
          {gallery.map((g, i) => (
            <div
              key={i}
              className={`relative h-full w-full overflow-hidden rounded-card border border-line bg-bg2 ${g.wide ? 'col-span-2' : ''} ${g.tall ? 'row-span-2' : ''}`}
            >
              <Image
                src={g.img}
                alt={g.label}
                fill
                sizes={g.wide ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs font-semibold text-white">{g.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <StatsBar productCount={productCount} caseStudyCount={hostedProductCount} />

      {/* CTA */}
      <Section tone="alt" containerClassName="text-center">
        <SectionHeading align="center" title="Let's build what's next for your business." description="Free consultation, no commitment — tell us what you're building and we'll tell you exactly how we'd approach it." />
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/contact" size="lg">Talk to a Solution Architect</Button>
          <Button href="/services" variant="secondary" size="lg">Explore Our Services</Button>
        </div>
      </Section>
    </div>
  );
}
