'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Hospital, School, Banknote, UtensilsCrossed, Building2, HardHat, Factory, Landmark } from 'lucide-react';

const industries = [
  { Icon: Hospital,        title: 'Healthcare',  desc: 'One patient record across OPD, IPD, pharmacy, lab and billing — less paperwork, faster care.', href: '/industries/hospitals' },
  { Icon: School,          title: 'Education',   desc: 'Admissions, fees, attendance and exams on one platform — freeing staff from manual tracking.', href: '/industries/schools' },
  { Icon: Banknote,        title: 'Finance',     desc: 'Books, compliance and transactions kept audit-ready by design — reporting season, without the scramble.', href: '/industries' },
  { Icon: UtensilsCrossed, title: 'Restaurant',  desc: 'Billing, tables, inventory and delivery synced in real time — nothing lost between kitchen and till.', href: '/industries/restaurant-hospitality' },
  { Icon: Building2,       title: 'Real Estate', desc: 'Leads, site visits, bookings and channel partners in one pipeline — so no enquiry goes cold.', href: '/industries/realestate' },
  { Icon: HardHat,         title: 'Construction',desc: 'BOQ, materials, labor and site progress tracked live — catch cost overruns before they happen.', href: '/industries/construction' },
  { Icon: Factory,         title: 'Manufacturing',desc: 'PLC, SCADA, IoT and OEE data unified — the shop floor visible in real time, not at month-end.', href: '/industries/manufacturing' },
  { Icon: Landmark,        title: 'Government',  desc: 'e-Tenders, GEM listings and compliance tracked end-to-end — so nothing is ever missed.', href: '/industries/government' },
];

export function IndustriesGrid() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

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
        <motion.div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {industries.map((ind) => (
            <motion.div
              key={ind.title}
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
