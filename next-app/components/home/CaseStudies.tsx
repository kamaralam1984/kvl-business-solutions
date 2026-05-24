import Link from 'next/link';
import { ArrowRight, Truck, Hospital } from 'lucide-react';
import { TiltCard } from '@/components/shared/TiltCard';

export function CaseStudies() {
  const cases = [
    { cat: 'Logistics', title: 'Pan-India Fleet Tracking for TransCorp', desc: 'Deployed GPS across 2,400 vehicles with real-time monitoring.', Icon: Truck, c1: '#1e40af', c2: '#0c1740', stats: [['38%','Fuel Saved'],['2,400','Vehicles'],['5x','ROI']] },
    { cat: 'Healthcare', title: 'Hospital Management for City Care Network', desc: 'HMS for 12-hospital chain with records, billing and OPD.', Icon: Hospital, c1: '#0891b2', c2: '#155e75', stats: [['12','Hospitals'],['60%','Faster OPD'],['99.9%','Uptime']] },
  ];

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="text-center mb-12">
          <span className="eyebrow">FEATURED PROJECTS</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Real Results, Real Impact</h2>
          <p className="text-text2 max-w-xl mx-auto">See how leading businesses across India transformed with our enterprise solutions.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <TiltCard key={i} className="card-base overflow-hidden">
              <div className="h-52 grid place-items-center text-white relative" style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }}>
                <c.Icon className="w-16 h-16 opacity-70" />
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '25px 25px' }} />
              </div>
              <div className="p-6">
                <span className="text-[11px] text-primary font-bold tracking-widest uppercase">{c.cat}</span>
                <h3 className="text-xl my-2 font-bold">{c.title}</h3>
                <p className="text-text2 text-sm mb-4">{c.desc}</p>
                <div className="flex gap-5 pt-4 border-t border-tint">
                  {c.stats.map(([n,l]) => (
                    <div key={l}>
                      <div className="text-xl font-extrabold text-primary">{n}</div>
                      <div className="text-[11px] text-text2">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/projects" className="btn btn-primary">View All Projects <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  );
}
