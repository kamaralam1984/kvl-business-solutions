'use client';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const kpis = [
  { label: 'Production', val: '12,480', trend: '+18% vs yesterday', up: true, c: '#3b82f6' },
  { label: 'OEE', val: '87.4%', trend: '+4.2 pts', up: true, c: '#22c55e' },
  { label: 'Active Vehicles', val: '2,184', trend: '+112 today', up: true, c: '#f97316' },
  { label: 'Downtime', val: '1.2 hr', trend: '-32% MoM', up: false, c: '#ef4444' },
];
const bars = [60, 80, 45, 90, 70, 95, 85];

export function AnalyticsDashboard() {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <span className="eyebrow">REAL-TIME INTELLIGENCE</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Industrial Analytics Dashboard</h2>
          <p className="text-text2 max-w-xl mx-auto">Live KPIs, monitoring widgets and intelligent insights — built into every KVL platform.</p>
        </div>

        <div className="card-base p-7 shadow-card">
          <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
            <div>
              <h3 className="text-xl font-bold">Plant Operations Overview</h3>
              <p className="text-[13px] text-text2">Last updated: just now</p>
            </div>
            <span className="live-dot">LIVE</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((k, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }}
                className="p-4 rounded-xl border border-tint surface-tint relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${k.c}, transparent)` }} />
                <div className="text-[11px] uppercase tracking-widest text-text2">{k.label}</div>
                <div className="text-2xl font-extrabold my-1">{k.val}</div>
                <div className={`text-[11px] flex items-center gap-1 ${k.up ? 'text-green-500' : 'text-red-500'}`}>
                  {k.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />} {k.trend}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
            <div className="surface-tint p-5 rounded-xl border border-tint">
              <h5 className="text-sm font-bold mb-4 flex justify-between">Weekly Output <span className="text-[11px] text-text2 font-normal">Units per day</span></h5>
              <div className="flex items-end gap-2 h-36">
                {bars.map((h, i) => (
                  <motion.div key={i}
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: .8, delay: i * .1, ease: [.4,0,.2,1] }}
                    className="flex-1 rounded-t-md origin-bottom"
                    style={{ height: `${h}%`, background: i % 3 === 0 ? 'linear-gradient(180deg,#3b82f6,#1e40af)' : i % 3 === 1 ? 'linear-gradient(180deg,#06b6d4,#0891b2)' : 'linear-gradient(180deg,#f97316,#ea580c)' }}
                  />
                ))}
              </div>
            </div>
            <div className="surface-tint p-5 rounded-xl border border-tint">
              <h5 className="text-sm font-bold mb-4 flex justify-between">System Health <span className="text-[11px] text-text2 font-normal">By module</span></h5>
              <div className="relative w-32 h-32 mx-auto rounded-full grid place-items-center" style={{ background: 'conic-gradient(#3b82f6 0deg 130deg,#06b6d4 130deg 230deg,#f97316 230deg 310deg,#22c55e 310deg 360deg)' }}>
                <div className="absolute inset-5 rounded-full surface-tint" />
                <span className="relative text-2xl font-extrabold">92%</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center text-[11px] text-text2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500" /> ERP</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan-500" /> GPS</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-500" /> IoT</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" /> HR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
