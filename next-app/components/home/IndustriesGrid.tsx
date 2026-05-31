'use client';
import { motion } from 'framer-motion';

const industries = [
  {
    icon: '🏭',
    title: 'Manufacturing',
    desc: 'ERP, inventory, production tracking',
    featured: true,
    img: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '🏫',
    title: 'Education',
    desc: 'School/college management systems',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '🚛',
    title: 'Logistics',
    desc: 'Fleet GPS, delivery tracking',
    img: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '🏥',
    title: 'Healthcare',
    desc: 'Hospital management, billing',
    img: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '🏗️',
    title: 'Construction',
    desc: 'Project management, civil works',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '🛒',
    title: 'Retail',
    desc: 'POS, inventory, e-commerce',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '🌾',
    title: 'Agriculture',
    desc: 'Farm management, GPS mapping',
    featured: true,
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80&auto=format&fit=crop',
  },
  {
    icon: '⚡',
    title: 'Energy',
    desc: 'Power monitoring, automation',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80&auto=format&fit=crop',
  },
];

export function IndustriesGrid() {
  return (
    <section className="py-24" style={{ background: 'rgb(var(--bg))' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="eyebrow block mb-3">WHAT WE COVER</span>
          <h2
            className="font-display font-black tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'rgb(var(--text))' }}
          >
            Industries We Serve
          </h2>
          <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'rgba(var(--text-2))' }}>
            Purpose-built software for 8+ verticals — from factory floors to farm fields.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((ind, i) => {
            if (ind.featured) {
              return (
                <motion.div
                  key={ind.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="md:col-span-2 md:row-span-2 group cursor-default"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{ height: '100%', minHeight: 200 }}
                  >
                    <img
                      src={ind.img}
                      alt={ind.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                        minHeight: 200,
                      }}
                      className="group-hover:scale-105"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 20%, rgba(8,8,10,0.9) 100%)',
                      }}
                    />
                    {/* Gold border accent */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: '1px solid rgba(200,168,112,0.25)',
                        borderRadius: '1rem',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '24px',
                      }}
                    >
                      <div className="text-4xl mb-3">{ind.icon}</div>
                      <div
                        className="font-display font-bold text-[22px] mb-2"
                        style={{ color: '#f0ede6' }}
                      >
                        {ind.title}
                      </div>
                      <div
                        className="text-[14px] leading-relaxed mb-4"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {ind.desc}
                      </div>
                      <div className="text-[13px] font-semibold" style={{ color: '#c8a870' }}>
                        Explore solutions →
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
            return (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group cursor-default"
              >
                <div className="relative rounded-2xl overflow-hidden" style={{ height: 180 }}>
                  <img
                    src={ind.img}
                    alt={ind.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease',
                    }}
                    className="group-hover:scale-105"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 30%, rgba(8,8,10,0.85) 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '16px',
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f0ede6' }}>{ind.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{ind.desc}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
