'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { TiltCard } from '@/components/shared/TiltCard';
import { Eye, Monitor, Smartphone, GraduationCap, Hospital, HardHat, Satellite, ShoppingCart, Briefcase, Building2, Cog, Landmark, UserSquare } from 'lucide-react';

const demos = [
  { id: 1, cat: 'school', name: 'Bright Future Academy', desc: 'Modern school website with admission flow', Icon: GraduationCap, c1: '#8b5cf6', c2: '#6d28d9', tech: ['React', 'Tailwind'] },
  { id: 2, cat: 'hospital', name: 'City Care Multi-Speciality', desc: 'Hospital site with online appointments', Icon: Hospital, c1: '#ef4444', c2: '#b91c1c', tech: ['Next.js', 'API'] },
  { id: 3, cat: 'construction', name: 'Pillar Constructions', desc: 'Premium construction company site', Icon: HardHat, c1: '#eab308', c2: '#a16207', tech: ['WordPress', 'SEO'] },
  { id: 4, cat: 'gps', name: 'FleetMaster Dashboard', desc: 'Live GPS tracking SaaS dashboard', Icon: Satellite, c1: '#3b82f6', c2: '#1d4ed8', tech: ['React', 'Mapbox'] },
  { id: 5, cat: 'ecommerce', name: 'SmartShop India', desc: 'Multi-vendor e-commerce store', Icon: ShoppingCart, c1: '#22c55e', c2: '#16a34a', tech: ['Shopify', 'UPI'] },
  { id: 6, cat: 'business', name: 'Corporate Pro', desc: 'SaaS / B2B corporate landing', Icon: Briefcase, c1: '#06b6d4', c2: '#0891b2', tech: ['Next.js', 'Framer'] },
  { id: 7, cat: 'realestate', name: 'Skyline Realty', desc: 'Property listing + virtual tours', Icon: Building2, c1: '#8b5cf6', c2: '#4c1d95', tech: ['React', '360°'] },
  { id: 8, cat: 'mechanical', name: 'SteelForge Industries', desc: 'Mechanical workshop & fabrication', Icon: Cog, c1: '#0d9488', c2: '#115e59', tech: ['HTML5', 'Animations'] },
  { id: 9, cat: 'government', name: 'Municipal Portal', desc: 'Govt project & citizen services', Icon: Landmark, c1: '#64748b', c2: '#1e293b', tech: ['Accessibility', 'Hindi'] },
  { id: 10, cat: 'portfolio', name: 'Creative Portfolio', desc: 'Personal portfolio with animations', Icon: UserSquare, c1: '#ec4899', c2: '#be185d', tech: ['GSAP', 'Three.js'] },
];

const cats = [
  { id: 'all', label: 'All Demos' },
  { id: 'school', label: 'Schools' },
  { id: 'hospital', label: 'Hospitals' },
  { id: 'construction', label: 'Construction' },
  { id: 'gps', label: 'GPS Dashboards' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'business', label: 'Business' },
  { id: 'realestate', label: 'Real Estate' },
  { id: 'mechanical', label: 'Mechanical' },
  { id: 'government', label: 'Government' },
  { id: 'portfolio', label: 'Portfolio' },
];

export default function DemosPage() {
  const [cat, setCat] = useState('all');
  const [view, setView] = useState<Record<number, 'desktop' | 'mobile'>>({});
  const filtered = cat === 'all' ? demos : demos.filter(d => d.cat === cat);

  return (
    <>
      <PageHero eyebrow="WEBSITE DEMO GALLERY" title="50+ Ready Website" accent="Demos" description="Pick a design, customize it, and go live in 48 hours. Mobile + Desktop preview included." breadcrumb="Website Demos" />

      <section className="section">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {cats.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${cat === c.id ? 'bg-primary text-white border-primary' : 'border-tint surface-tint text-text hover:bg-primary hover:text-white'}`}>
                {c.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(d => {
                const v = view[d.id] || 'desktop';
                return (
                  <motion.div key={d.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TiltCard className="card-base overflow-hidden cursor-pointer group">
                      <div className="h-48 relative grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${d.c1}, ${d.c2})` }}>
                        {v === 'desktop' ? <d.Icon className="w-14 h-14 opacity-90" /> : <Smartphone className="w-16 h-16 opacity-90" />}
                        <div className="absolute top-2 right-2 z-10 flex gap-1 bg-black/50 rounded-xl p-0.5 backdrop-blur">
                          <button onClick={(e) => { e.stopPropagation(); setView(p => ({ ...p, [d.id]: 'desktop' })); }} className={`p-1.5 rounded-lg ${v === 'desktop' ? 'bg-primary' : ''}`}><Monitor className="w-3 h-3 text-white" /></button>
                          <button onClick={(e) => { e.stopPropagation(); setView(p => ({ ...p, [d.id]: 'mobile' })); }} className={`p-1.5 rounded-lg ${v === 'mobile' ? 'bg-primary' : ''}`}><Smartphone className="w-3 h-3 text-white" /></button>
                        </div>
                        <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-all grid place-items-center">
                          <button className="btn btn-primary"><Eye className="w-4 h-4" /> Live Preview</button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-[15px] font-bold">{d.name}</h4>
                        <p className="text-xs text-text2 mt-1">{d.desc}</p>
                        <div className="flex gap-1.5 mt-2.5 flex-wrap">
                          {d.tech.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full surface2-tint border border-tint text-text2">{t}</span>)}
                        </div>
                        <div className="mt-3 pt-3 border-t border-dashed border-tint flex justify-between items-center">
                          <span className="text-[11px] text-text2">✨ Fully customizable</span>
                          <b className="text-[13px] text-primary">from ₹14,999</b>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </div>
      </section>

      <CtaBanner title="Like a demo? We'll launch yours in 48 hours." desc="Pick a design, share content & logo — your site goes live this week." />
    </>
  );
}
