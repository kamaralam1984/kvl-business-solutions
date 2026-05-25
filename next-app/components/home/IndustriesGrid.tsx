'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { industries } from '@/lib/data/industries';

// Mock client counts per industry — placeholder credibility stats (edit later in admin)
const stats: Record<string, { clients: string; satisfaction: string }> = {
  construction:  { clients: '180+', satisfaction: '98%' },
  mechanical:    { clients: '220+', satisfaction: '97%' },
  manufacturing: { clients: '95+',  satisfaction: '99%' },
  transport:     { clients: '350+', satisfaction: '96%' },
  schools:       { clients: '140+', satisfaction: '98%' },
  hospitals:     { clients: '60+',  satisfaction: '99%' },
  retail:        { clients: '420+', satisfaction: '97%' },
  realestate:    { clients: '110+', satisfaction: '98%' },
  government:    { clients: '40+',  satisfaction: '100%' },
};

export function IndustriesGrid() {
  return (
    <section className="section section-alt overflow-hidden">
      <div className="container">
        <div className="text-center mb-14">
          <span className="eyebrow">INDUSTRIES WE SERVE</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Solutions for Every Industry</h2>
          <p className="text-text2 max-w-xl mx-auto">Industry-specific software and services to boost efficiency and productivity. 1000+ businesses across 9 verticals trust KVL.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((ind, i) => {
            const Icon = (Icons as any)[ind.icon] || Icons.Briefcase;
            const stat = stats[ind.slug] || { clients: '50+', satisfaction: '95%' };
            return (
              <motion.div
                key={ind.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={`/industries#${ind.slug}`}
                  className="card-base overflow-hidden group block h-full hover:shadow-card-hover transition-all hover:-translate-y-1 duration-300"
                >
                  {/* Header — gradient banner with big icon */}
                  <div
                    className="h-32 relative overflow-hidden grid place-items-center"
                    style={{ background: `linear-gradient(135deg, ${ind.c1}, ${ind.c2})` }}
                  >
                    {/* Decorative radial pattern */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,.25) 0%, transparent 50%)',
                    }} />
                    {/* Big industry icon */}
                    <Icon className="w-16 h-16 text-white opacity-95 relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                    {/* Client count badge */}
                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold text-white border border-white/30">
                      {stat.clients} clients
                    </div>
                    {/* Satisfaction badge */}
                    <div className="absolute bottom-2 left-2 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {stat.satisfaction}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors">
                      {ind.name}
                    </h3>
                    <p className="text-xs text-text2 line-clamp-2 mb-3 leading-relaxed">
                      {ind.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {ind.tags.slice(0, 4).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full surface2-tint border border-tint text-text2">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Footer link */}
                    <div className="pt-3 border-t border-dashed border-tint flex justify-between items-center">
                      <span className="text-[11px] text-text2">Industry solutions</span>
                      <span className="text-primary text-xs font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-text2 text-sm mb-4">Your industry not listed? We build custom solutions for any business vertical.</p>
          <Link href="/contact" className="btn btn-primary">
            Discuss your industry needs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
