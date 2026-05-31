'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, CreditCard, Star, Shield, Globe } from 'lucide-react';

const certs = [
  { Icon: ShieldCheck, label: 'ISO 27001', desc: 'Security Certified', color: '#22c55e' },
  { Icon: Award, label: 'MSME Registered', desc: 'Govt. of India', color: '#f97316' },
  { Icon: CreditCard, label: 'Razorpay Verified', desc: 'Payment Partner', color: '#3b82f6' },
  { Icon: Star, label: '4.8/5 Rating', desc: '1000+ reviews', color: '#c8a870' },
  { Icon: Shield, label: 'SSL Secured', desc: '256-bit encryption', color: '#6366f1' },
  { Icon: Globe, label: '99.5% Uptime', desc: 'SLA guaranteed', color: '#14b8a6' },
];

export function Certifications() {
  return (
    <section className="py-16" style={{ background: 'rgb(var(--bg-2))' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <span className="eyebrow block mb-4">TRUSTED &amp; CERTIFIED</span>
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
          >
            Your security is our priority
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {certs.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <div className="card-premium p-5 text-center group">
                <div
                  className="w-11 h-11 mx-auto mb-3 rounded-xl grid place-items-center"
                  style={{ background: `${c.color}15` }}
                >
                  <c.Icon
                    className="w-5 h-5"
                    style={{ color: c.color }}
                  />
                </div>
                <div className="font-bold text-[13px] text-white mb-0.5">{c.label}</div>
                <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {c.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
