'use client';
import { motion } from 'framer-motion';

const features = [
  'Real-time KPIs and live dashboards for every module',
  'Custom reports — revenue, inventory, attendance & more',
  'Predictive alerts before problems escalate',
  'Export-ready data in PDF, Excel, or API format',
];

export function AnalyticsDashboard() {
  return (
    <section className="py-24" style={{ background: 'rgb(var(--bg-2))' }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT: text + features */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="eyebrow block mb-5">BUILT-IN ANALYTICS</span>
            <h2
              className="font-display font-black tracking-tight text-white mb-5"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.08 }}
            >
              Data-Driven Decisions
              <br />
              for Your Business.
            </h2>
            <p className="text-[16px] leading-[1.75] mb-8" style={{ color: '#888' }}>
              Every KVL platform ships with powerful, built-in analytics — no third-party BI tools
              needed. Understand your business at a glance.
            </p>

            <ul className="space-y-4">
              {features.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full grid place-items-center text-[11px] font-black"
                    style={{ background: 'rgba(200,168,112,0.15)', color: '#c8a870' }}
                  >
                    ✓
                  </span>
                  <span className="text-[15px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {f}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT: mock dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <div
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div
                    className="text-[11px] tracking-wider uppercase font-semibold mb-1"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Business Overview
                  </div>
                  <div className="text-[18px] font-bold text-white">May 2026</div>
                </div>
                <div className="flex gap-1.5">
                  {['1D', '1W', '1M', '1Y'].map((t) => (
                    <button
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors"
                      style={
                        t === '1M'
                          ? { background: 'rgba(200,168,112,0.15)', color: '#c8a870' }
                          : { color: 'rgba(255,255,255,0.3)' }
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric cards 2x2 grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Total Revenue', value: '₹2.4Cr', trend: '+18%', up: true },
                  { label: 'Active Users', value: '1,247', trend: '+24%', up: true },
                  { label: 'Projects Live', value: '89', trend: '+6', up: true },
                  { label: 'Tickets Open', value: '12', trend: '-3', up: false },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {m.label}
                    </div>
                    <div className="text-[20px] font-black font-display text-white">{m.value}</div>
                    <div
                      className="text-[11px] font-semibold mt-1"
                      style={{ color: m.up ? '#22c55e' : '#ef4444' }}
                    >
                      {m.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* Simple bar chart */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Weekly Performance
                </div>
                <div className="flex items-end gap-2 h-[50px]">
                  {[55, 70, 45, 85, 65, 90, 75].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: '3px 3px 0 0',
                        background: i === 5 ? '#c8a870' : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <div
                      key={d}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: '9px',
                        color: 'rgba(255,255,255,0.2)',
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
