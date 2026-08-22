'use client';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CtaBanner } from '@/components/home/CtaBanner';
import type { LucideIcon } from 'lucide-react';
import {
  Monitor, Smartphone, ExternalLink, Globe, Sparkles,
  Briefcase, Building2, GraduationCap, Hospital, HardHat, Satellite, ShoppingCart, Cog, Landmark,
  UserSquare, Video, Home, Code, UtensilsCrossed, BedDouble, Dumbbell, Truck, Plane, Scale, Pill,
  BookOpen, Leaf, Car, Wrench, Calculator, Sofa, Rocket,
} from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/data/demo-categories';

// Every `iconName` an admin can pick from the Admin > Demos icon dropdown
// (app/admin/demos/page.tsx ICON_OPTIONS) plus every value used by the
// hardcoded fallback demo list (app/website-demos/page.tsx / lib/data/default-demos.ts)
// shown when the DB has no entries yet — the two sources this field can come from.
const ICON_MAP: Record<string, LucideIcon> = {
  Globe, Briefcase, Building2, GraduationCap, Hospital, HardHat, Satellite, ShoppingCart, Cog,
  Landmark, UserSquare, Video, Home, Smartphone, Code, UtensilsCrossed, BedDouble, Dumbbell, Truck,
  Plane, Scale, Sparkles, Pill, BookOpen, Leaf, Car, Wrench, Calculator, Sofa, Rocket,
};

type Demo = {
  _id: string;
  name: string;
  description?: string;
  url?: string;
  category: string;
  technologies: string[];
  live: boolean;
  image?: string;
  iconName: string;
  c1: string;
  c2: string;
  startingPrice: number;
};

export function DemosClient({ demos }: { demos: Demo[] }) {
  const [cat, setCat] = useState('all');
  const [view, setView] = useState<Record<string, 'desktop' | 'mobile'>>({});

  const usedCats = useMemo(() => {
    const set = new Set(demos.map(d => d.category));
    return [{ id: 'all', label: 'All Demos' }, ...DEMO_CATEGORIES.filter(c => set.has(c.id))];
  }, [demos]);

  const filtered = cat === 'all' ? demos : demos.filter(d => d.category === cat);

  return (
    <div style={{ background: 'rgb(var(--bg))' }}>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.05) 0%, transparent 70%)' }} />
        <div className="relative z-10 container text-center py-28">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            OUR WORK · DEMOS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mt-4 mb-6 leading-tight"
            style={{ color: 'rgb(var(--text))', fontFamily: 'Poppins, sans-serif' }}
          >
            Live Websites &amp;<br />Design Demos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'rgba(var(--text) / 0.55)' }}
          >
            Real production sites we&apos;ve launched (look for the LIVE badge) + design templates ready to customize.
          </motion.p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Filter + Grid */}
      <section className="section" style={{ background: 'rgb(var(--bg))' }}>
        <div className="container">

          {/* Category filter — underline style, gold active */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-0 justify-center mb-12 border-b"
            style={{ borderColor: 'rgba(var(--border) / 0.1)' }}
          >
            {usedCats.map(c => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className="relative px-5 py-3 text-sm font-medium transition-colors duration-200"
                style={{ color: cat === c.id ? 'rgb(var(--text))' : 'rgba(var(--text) / 0.55)' }}
              >
                {c.label}
                {cat === c.id && (
                  <motion.div
                    layoutId="demo-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: '#c8a96e' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d, i) => {
                const v = view[d._id] || 'desktop';
                const Icon = ICON_MAP[d.iconName] || Globe;
                const catLabel = usedCats.find(c => c.id === d.category)?.label || d.category;
                return (
                  <motion.div
                    key={d._id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                  >
                    <div
                      className="card-premium overflow-hidden group cursor-pointer"
                      style={d.live ? { borderColor: 'rgba(34,197,94,0.25)' } : {}}
                    >
                      {/* Image / Preview */}
                      <div className="h-48 relative overflow-hidden">
                        {d.image ? (
                          <Image
                            src={d.image}
                            alt={d.name}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full grid place-items-center"
                            style={{ background: `linear-gradient(135deg, ${d.c1}, ${d.c2})` }}
                          >
                            <Icon className="w-12 h-12 text-white/40" />
                          </div>
                        )}

                        {/* View toggle + link overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3" style={{ background: 'rgba(0,0,0,0.75)' }}>
                          <button
                            onClick={e => { e.stopPropagation(); setView({ ...view, [d._id]: 'desktop' }); }}
                            className="p-2 rounded-lg transition-colors"
                            style={{ background: v === 'desktop' ? '#c8a96e' : 'rgba(255,255,255,0.15)', color: '#fff' }}
                          >
                            <Monitor className="w-4 h-4" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setView({ ...view, [d._id]: 'mobile' }); }}
                            className="p-2 rounded-lg transition-colors"
                            style={{ background: v === 'mobile' ? '#c8a96e' : 'rgba(255,255,255,0.15)', color: '#fff' }}
                          >
                            <Smartphone className="w-4 h-4" />
                          </button>
                          {d.url && d.live && (
                            <a
                              href={d.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg transition-colors"
                              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                              onClick={e => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        {/* Status badge */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {d.live ? (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
                              style={{ background: 'rgba(34,197,94,0.85)' }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />LIVE
                            </span>
                          ) : (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-text2"
                              style={{ background: 'rgba(var(--text) / 0.08)', border: '1px solid rgba(var(--border) / 0.15)' }}
                            >SAMPLE</span>
                          )}
                        </div>

                        {/* Category badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                          >
                            {catLabel}
                          </span>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-5">
                        <h3 className="font-bold text-base leading-tight mb-1 text-text">{d.name}</h3>
                        {d.description && (
                          <p className="text-sm mb-3 leading-relaxed text-text2">{d.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {d.technologies.map(t => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded text-[10px] font-medium text-text2"
                              style={{ background: 'rgba(var(--text) / 0.05)', border: '1px solid rgba(var(--border) / 0.08)' }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-end">
                          {d.live && d.url ? (
                            <a
                              href={d.url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> View Live
                            </a>
                          ) : (
                            <span className="text-[11px] italic text-text2">Sample design</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="card-premium p-12 text-center mt-6">
              <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: '#c8a96e' }} />
              <p className="text-text2">No demos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner title="Like a demo? We'll launch yours in 48 hours." desc="Pick a design, share content & logo — your site goes live this week." />
    </div>
  );
}
