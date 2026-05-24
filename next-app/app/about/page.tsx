import { PageHero } from '@/components/shared/PageHero';
import { Stats } from '@/components/home/Stats';
import { TiltCard } from '@/components/shared/TiltCard';
import { Target, Eye, Heart, Trophy, Building2, LaptopMinimal, Palette, Users, Coffee, Mountain, Satellite, HardHat } from 'lucide-react';

export const metadata = { title: 'About — KVL Business Solutions' };

const timeline = [
  { year: '2015', title: 'Company Founded', desc: 'Started in a small Pune office with 2 engineers and a dream.' },
  { year: '2017', title: 'First 100 Clients', desc: 'Crossed 100 paying clients across software + websites.' },
  { year: '2019', title: 'GPS Division Launched', desc: 'Added GPS tracking hardware + dashboards for fleet customers.' },
  { year: '2021', title: 'Industrial & Civil', desc: 'Expanded into civil engineering, mechanical work and automation.' },
  { year: '2023', title: 'ISO & MSME Certified', desc: 'Achieved ISO 9001, ISO 27001 and Startup India recognition.' },
  { year: '2026', title: '1000+ Clients', desc: 'Serving 1000+ businesses with 500+ projects and 250+ live systems.' },
];

const team = [
  { name: 'Krishna Verma', role: 'Founder & CEO', initials: 'KV', c1: '#3b82f6', c2: '#1d4ed8' },
  { name: 'Anjali Sharma', role: 'CTO', initials: 'AS', c1: '#22c55e', c2: '#16a34a' },
  { name: 'Rohit Gupta', role: 'Head of GPS Systems', initials: 'RG', c1: '#f97316', c2: '#ea580c' },
  { name: 'Priya Singh', role: 'Head of Design', initials: 'PS', c1: '#ef4444', c2: '#b91c1c' },
  { name: 'Vikram Mehta', role: 'VP Civil & Industrial', initials: 'VM', c1: '#8b5cf6', c2: '#6d28d9' },
  { name: 'Neha Bhatia', role: 'Head of Customer Success', initials: 'NB', c1: '#06b6d4', c2: '#0891b2' },
  { name: 'Sandeep Malhotra', role: 'Head of Sales', initials: 'SM', c1: '#eab308', c2: '#a16207' },
  { name: 'Ritu Kapoor', role: 'Head of Marketing', initials: 'RK', c1: '#14b8a6', c2: '#0f766e' },
];

const gallery = [
  { Icon: Building2, label: 'Pune HQ — Workspace', c1: '#3b82f6', c2: '#1d4ed8', wide: true },
  { Icon: LaptopMinimal, label: 'Engineering Floor', c1: '#06b6d4', c2: '#0891b2' },
  { Icon: Palette, label: 'Design Studio', c1: '#f97316', c2: '#ea580c', tall: true },
  { Icon: Users, label: 'Meeting Room', c1: '#22c55e', c2: '#16a34a' },
  { Icon: Coffee, label: 'Cafeteria', c1: '#8b5cf6', c2: '#6d28d9' },
  { Icon: Mountain, label: 'Team Offsite 2025', c1: '#ef4444', c2: '#b91c1c', wide: true },
  { Icon: Satellite, label: 'GPS Lab', c1: '#eab308', c2: '#a16207' },
  { Icon: HardHat, label: 'Industrial Workshop', c1: '#14b8a6', c2: '#0f766e' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT KVL" title="India's Next-Generation" accent="Business Solutions Company" description="Founded with a single mission — bring world-class enterprise technology to every Indian business." breadcrumb="About Us" />

      <section className="section">
        <div className="container grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <span className="eyebrow">OUR STORY</span>
            <h2 className="text-3xl font-extrabold my-4">Built for <span className="gradient-text">Indian Businesses</span></h2>
            <p className="text-text2">KVL Business Solutions started in 2015 as a software-services boutique. Today, we are a full-stack enterprise partner — software, websites, GPS systems, civil construction, mechanical work, automation and digital marketing — all under one roof.</p>
            <p className="text-text2 mt-3">Our mission: combine premium global technology with deep Indian market understanding to help businesses scale 10x faster.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { Icon: Target, title: 'Our Mission', desc: 'Empower 100,000 Indian businesses with world-class technology by 2030.', c: '#3b82f6' },
              { Icon: Eye, title: 'Our Vision', desc: 'Become India\'s most trusted enterprise solutions partner.', c: '#22c55e' },
              { Icon: Heart, title: 'Our Values', desc: 'Honesty, ownership, customer obsession, premium quality.', c: '#f97316' },
              { Icon: Trophy, title: 'Our Promise', desc: '1-hour response, lifetime support, transparent pricing.', c: '#ef4444' },
            ].map(it => (
              <TiltCard key={it.title} className="card-base p-5">
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-3 border" style={{ background: `${it.c}25`, color: it.c, borderColor: `${it.c}50` }}>
                  <it.Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold mb-1">{it.title}</h4>
                <p className="text-[13px] text-text2">{it.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow">OUR JOURNEY</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">A Decade of Innovation</h2>
            <p className="text-text2 max-w-xl mx-auto">From a 2-person studio to India&apos;s full-stack enterprise partner.</p>
          </div>
          <div className="relative max-w-3xl mx-auto py-6">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent md:-translate-x-1/2" />
            {timeline.map((t, i) => (
              <div key={t.year} className={`flex mb-10 relative ${i % 2 === 0 ? 'md:justify-start md:pr-1/2' : 'md:justify-end md:pl-1/2'} pl-12 md:pl-0`}>
                <div className="absolute left-4 md:left-1/2 top-5 w-4 h-4 rounded-full bg-primary border-4 border-app2 md:-translate-x-1/2 shadow-[0_0_16px_rgba(37,99,235,0.6)]" />
                <div className={`card-base p-5 max-w-md ${i % 2 === 0 ? 'md:mr-8 md:text-right' : 'md:ml-8'}`}>
                  <div className="text-xs text-primary font-bold tracking-widest">{t.year}</div>
                  <h4 className="font-bold my-1">{t.title}</h4>
                  <p className="text-[13px] text-text2">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow">OUR TEAM</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">The People Behind KVL</h2>
            <p className="text-text2 max-w-xl mx-auto">A diverse team of engineers, designers, civil experts and business strategists.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map(m => (
              <TiltCard key={m.name} className="card-base p-5 text-center">
                <div className="w-24 h-24 mx-auto mb-3 rounded-full grid place-items-center text-white font-extrabold text-2xl" style={{ background: `linear-gradient(135deg, ${m.c1}, ${m.c2})` }}>{m.initials}</div>
                <h4 className="font-bold">{m.name}</h4>
                <div className="text-xs text-primary font-semibold mt-1 uppercase tracking-wide">{m.role}</div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10">
            <span className="eyebrow">INSIDE KVL</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Our Office &amp; Culture</h2>
            <p className="text-text2">Where innovation meets execution every day.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-3">
            {gallery.map((g, i) => (
              <div key={i} className={`relative rounded-xl overflow-hidden grid place-items-center text-white text-3xl ${g.wide ? 'col-span-2' : ''} ${g.tall ? 'row-span-2' : ''}`} style={{ background: `linear-gradient(135deg, ${g.c1}, ${g.c2})` }}>
                <g.Icon className="w-9 h-9" />
                <span className="absolute bottom-0 left-0 right-0 p-2.5 text-xs font-semibold bg-gradient-to-t from-black/70 to-transparent text-left">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Stats />
    </>
  );
}
