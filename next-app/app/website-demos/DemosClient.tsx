'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { TiltCard } from '@/components/shared/TiltCard';
import * as Icons from 'lucide-react';
import { Eye, Monitor, Smartphone, Sparkles, ExternalLink, Globe } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/models/Demo';
import { formatINR } from '@/lib/utils';

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

  // Only show categories that have at least 1 demo
  const usedCats = useMemo(() => {
    const set = new Set(demos.map(d => d.category));
    return [{ id: 'all', label: 'All Demos' }, ...DEMO_CATEGORIES.filter(c => set.has(c.id))];
  }, [demos]);

  const filtered = cat === 'all' ? demos : demos.filter(d => d.category === cat);

  return (
    <>
      <PageHero eyebrow="OUR WORK · DEMOS" title="Live websites &" accent="design demos" description="Real production sites we've launched (look for the LIVE badge) + design templates ready to customize." breadcrumb="Website Demos" />

      <section className="section">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {usedCats.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${cat === c.id ? 'bg-primary text-white border-primary' : 'border-tint surface-tint text-text hover:bg-primary hover:text-white'}`}>
                {c.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(d => {
                const v = view[d._id] || 'desktop';
                const Icon = (Icons as any)[d.iconName] || Globe;
                return (
                  <motion.div key={d._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TiltCard className={`card-base overflow-hidden cursor-pointer group ${d.live ? 'ring-2 ring-green-500/50' : ''}`}>
                      <div className="h-48 relative grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${d.c1}, ${d.c2})` }}>
                        {d.image && v === 'desktop' ? (
                          <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover" />
                        ) : v === 'desktop' ? <Icon className="w-14 h-14 opacity-90" /> : <Smartphone className="w-16 h-16 opacity-90" />}

                        {d.live && (
                          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-green-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-card">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            LIVE
                          </div>
                        )}

                        <div className="absolute top-2 right-2 z-10 flex gap-1 bg-black/50 rounded-xl p-0.5 backdrop-blur">
                          <button onClick={(e) => { e.stopPropagation(); setView(p => ({ ...p, [d._id]: 'desktop' })); }} className={`p-1.5 rounded-lg ${v === 'desktop' ? 'bg-primary' : ''}`}><Monitor className="w-3 h-3 text-white" /></button>
                          <button onClick={(e) => { e.stopPropagation(); setView(p => ({ ...p, [d._id]: 'mobile' })); }} className={`p-1.5 rounded-lg ${v === 'mobile' ? 'bg-primary' : ''}`}><Smartphone className="w-3 h-3 text-white" /></button>
                        </div>

                        <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-all grid place-items-center z-10">
                          {d.url ? (
                            <a href={d.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                              <ExternalLink className="w-4 h-4" /> Visit Live Site
                            </a>
                          ) : (
                            <button className="btn btn-primary"><Eye className="w-4 h-4" /> Live Preview</button>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[15px] font-bold flex items-center gap-1.5">
                              {d.name}
                              {d.live && <Sparkles className="w-3.5 h-3.5 text-green-500" />}
                            </h4>
                            <p className="text-xs text-text2 mt-1">{d.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 mt-2.5 flex-wrap">
                          {d.technologies.map(t => (
                            <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border ${t === 'Production' ? 'bg-green-500/15 border-green-500/40 text-green-500 font-semibold' : 'surface2-tint border-tint text-text2'}`}>{t}</span>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-dashed border-tint flex justify-between items-center">
                          {d.live && d.url ? (
                            <>
                              <span className="text-[11px] text-text2 truncate">{d.url.replace(/^https?:\/\//, '')}</span>
                              <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary font-semibold hover:underline whitespace-nowrap">Visit →</a>
                            </>
                          ) : d.startingPrice > 0 ? (
                            <>
                              <span className="text-[11px] text-text2">✨ Fully customizable</span>
                              <b className="text-[13px] text-primary">from {formatINR(d.startingPrice)}</b>
                            </>
                          ) : (
                            <span className="text-[11px] text-text2">Sample design</span>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="card-base p-10 text-center mt-4">
              <p className="text-text2">No demos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner title="Like a demo? We'll launch yours in 48 hours." desc="Pick a design, share content & logo — your site goes live this week." />
    </>
  );
}
