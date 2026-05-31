'use client';
import { motion } from 'framer-motion';

const cases = [
  {
    client: 'Sharma Enterprises',
    industry: 'Manufacturing',
    result: '340% ROI in 6 months',
    metric: '₹12Cr saved annually',
    service: 'Custom ERP',
    color: '#c8a870',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80&auto=format&fit=crop',
  },
  {
    client: 'Metro GPS Fleet',
    industry: 'Logistics',
    result: '247 vehicles tracked live',
    metric: '28% fuel savings',
    service: 'GPS Tracking',
    color: '#22c55e',
    image: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=800&q=80&auto=format&fit=crop',
  },
  {
    client: 'Green Valley School',
    industry: 'Education',
    result: '5000+ students enrolled',
    metric: '2x admin efficiency',
    service: 'School ERP',
    color: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80&auto=format&fit=crop',
  },
];

export function CaseStudies() {
  return (
    <section className="py-24" style={{ background: 'rgb(var(--bg))' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="eyebrow block mb-4">CASE STUDIES</span>
          <h2
            className="font-display font-black tracking-tight text-white mb-4"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.08 }}
          >
            Real Results. Real Businesses.
          </h2>
          <p className="text-[16px] max-w-xl mx-auto" style={{ color: '#888' }}>
            See how KVL solutions have transformed businesses across India with measurable impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={c.client}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="h-full"
            >
              <div className="card-premium group cursor-pointer h-full flex flex-col overflow-hidden">
                {/* Project photography */}
                <div className="relative overflow-hidden" style={{ height: 180 }}>
                  <img
                    src={c.image}
                    alt={`${c.client} project`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay so text below reads cleanly */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
                    }}
                  />
                  {/* Service tag overlaid on image */}
                  <span
                    className="absolute bottom-3 left-4 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: `${c.color}22`,
                      color: c.color,
                      border: `1px solid ${c.color}40`,
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {c.service}
                  </span>
                  <span
                    className="absolute bottom-3 right-4 text-[12px]"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {c.industry}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-7 flex flex-col flex-1">
                  {/* Client name */}
                  <h3 className="font-display font-bold text-[20px] text-white mb-2">{c.client}</h3>

                  {/* Result highlight */}
                  <div
                    className="text-[28px] font-black font-display mb-1"
                    style={{ color: c.color }}
                  >
                    {c.result}
                  </div>
                  <div className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {c.metric}
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-auto pt-6">
                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        View case study
                      </span>
                      <span
                        className="group-hover:translate-x-1 transition-transform text-[18px]"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
