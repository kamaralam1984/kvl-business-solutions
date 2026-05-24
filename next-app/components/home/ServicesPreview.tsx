'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, LaptopMinimal, Globe, MapPin, HardHat, Cog, Bot, Cloud, Megaphone } from 'lucide-react';
import { TiltCard } from '@/components/shared/TiltCard';

const icons: Record<string, any> = { LaptopMinimal, Globe, MapPin, HardHat, Cog, Bot, Cloud, Megaphone };

const items = [
  { name: 'Custom Software Development', desc: 'Powerful, scalable and secure software for your business.', icon: 'LaptopMinimal', color: '#3b82f6' },
  { name: 'Website Development', desc: 'Modern, responsive and SEO friendly websites.', icon: 'Globe', color: '#06b6d4' },
  { name: 'GPS Tracking Solutions', desc: 'Real-time tracking, reports and advanced analytics.', icon: 'MapPin', color: '#22c55e' },
  { name: 'Civil Work Services', desc: 'Quality construction and engineering solutions.', icon: 'HardHat', color: '#eab308' },
  { name: 'Mechanical Work Services', desc: 'Industrial fabrication, machines & maintenance.', icon: 'Cog', color: '#06b6d4' },
  { name: 'Industrial Automation', desc: 'Smart automation solutions for modern industries.', icon: 'Bot', color: '#22c55e' },
  { name: 'Cloud & Hosting Solutions', desc: 'Secure, fast and reliable cloud hosting.', icon: 'Cloud', color: '#3b82f6' },
  { name: 'Digital Marketing', desc: 'Grow online with our expert marketing.', icon: 'Megaphone', color: '#ef4444' },
];

export function ServicesPreview() {
  return (
    <section className="section">
      <div className="container grid lg:grid-cols-[1fr_2fr] gap-10">
        <div>
          <span className="eyebrow">⚪ WHAT WE DO</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Complete Business Solutions for <span className="gradient-text">Every Need</span></h2>
          <p className="text-text2 mb-7 max-w-sm">We provide end-to-end solutions to automate, manage and grow your business with cutting-edge technology.</p>
          <Link href="/services" className="btn btn-primary">Explore All Services <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <TiltCard key={i} className="card-base p-5">
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-4 border" style={{ background: `${s.color}25`, color: s.color, borderColor: `${s.color}50` }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold mb-2">{s.name}</h4>
                <p className="text-[13px] text-text2">{s.desc}</p>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
