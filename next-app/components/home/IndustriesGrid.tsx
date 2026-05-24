'use client';
import { motion } from 'framer-motion';
import { industries } from '@/lib/data/industries';

export function IndustriesGrid() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="text-center mb-12">
          <span className="eyebrow">INDUSTRIES WE SERVE</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Solutions for Every Industry</h2>
          <p className="text-text2 max-w-xl mx-auto">Industry-specific software and services to boost efficiency and productivity.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {industries.map((ind, i) => (
            <motion.div key={ind.slug}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .05 }}
              className="card-base overflow-hidden cursor-pointer"
            >
              <div className="h-28 bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, ${ind.c1}, ${ind.c2})` }} />
              <h5 className="p-2.5 text-[12px] font-semibold text-center">{ind.name}</h5>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
