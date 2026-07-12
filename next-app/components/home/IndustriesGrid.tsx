'use client';
import Link from 'next/link';
import { useReveal, revealStyle } from '@/lib/hooks/useReveal';
import { Hospital, School, Banknote, UtensilsCrossed, Building2, HardHat, Factory, Landmark } from 'lucide-react';

const industries = [
  { Icon: Hospital,        title: 'Healthcare',   desc: 'One patient record across OPD, IPD, pharmacy and billing.', href: '/industries/hospitals' },
  { Icon: School,          title: 'Education',    desc: 'Admissions, fees, attendance and exams on one platform.', href: '/industries/schools' },
  { Icon: Banknote,        title: 'Finance',      desc: 'Books and compliance kept audit-ready by design.', href: '/industries' },
  { Icon: UtensilsCrossed, title: 'Restaurant',   desc: 'Billing, tables and delivery synced in real time.', href: '/industries/restaurant-hospitality' },
  { Icon: Building2,       title: 'Real Estate',  desc: 'Leads, site visits and bookings in one pipeline.', href: '/industries/realestate' },
  { Icon: HardHat,         title: 'Construction', desc: 'Materials, labor and site progress tracked live.', href: '/industries/construction' },
  { Icon: Factory,         title: 'Manufacturing',desc: 'PLC, SCADA and IoT data unified on one dashboard.', href: '/industries/manufacturing' },
  { Icon: Landmark,        title: 'Government',   desc: 'e-Tenders, GEM listings and compliance tracked end-to-end.', href: '/industries/government' },
];

export function IndustriesGrid() {
  const { ref, inView } = useReveal();

  return (
    <section className="py-28" style={{ background: 'rgb(var(--bg))' }}>
      <div className="container">

        {/* Section header — centered */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="eyebrow mb-4 block">Industries</span>
          <h2 className="heading-lg" style={{ color: 'rgb(var(--text))' }}>
            Different sectors, different rules.<br />
            <span style={{ color: '#c8a870' }}>We already know the difference.</span>
          </h2>
        </div>

        {/* Industry cards */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind, i) => (
            <div key={ind.title} style={revealStyle(inView, i, { staggerMs: 60 })}>
              <Link href={ind.href} className="block h-full group">
                <div className="card-premium h-full p-6 flex flex-col">
                  <div className="w-11 h-11 rounded-xl grid place-items-center mb-5"
                    style={{ background: 'rgba(200,168,112,0.10)', border: '1px solid rgba(200,168,112,0.22)' }}>
                    <ind.Icon className="w-5 h-5" style={{ color: '#c8a870' }} />
                  </div>

                  <h3 className="font-display font-bold text-[1rem] mb-2 leading-snug" style={{ color: 'rgb(var(--text))' }}>
                    {ind.title}
                  </h3>

                  <p className="text-[13px] leading-[1.6]" style={{ color: 'rgb(var(--text-2))' }}>
                    {ind.desc}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
