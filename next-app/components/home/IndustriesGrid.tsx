import Image from 'next/image';
import { ArrowRight, Hospital, School, Banknote, UtensilsCrossed, Building2, HardHat, Factory, Landmark } from 'lucide-react';
import { SectionHeading, Tabs, Panel, Button } from '@/components/ui';

const industries = [
  { Icon: Hospital,        title: 'Healthcare',    desc: 'One patient record across OPD, IPD, pharmacy and billing.', href: '/industries/hospitals', image: '/industries/healthcare.webp' },
  { Icon: School,          title: 'Education',     desc: 'Admissions, fees, attendance and exams on one platform.', href: '/industries/schools', image: '/industries/education.webp' },
  { Icon: Banknote,        title: 'Finance',       desc: 'Books and compliance kept audit-ready by design.', href: '/industries', image: '/industries/finance.webp' },
  { Icon: UtensilsCrossed, title: 'Restaurant',    desc: 'Billing, tables and delivery synced in real time.', href: '/industries/restaurant-hospitality', image: '/industries/restaurant.webp' },
  { Icon: Building2,       title: 'Real Estate',   desc: 'Leads, site visits and bookings in one pipeline.', href: '/industries/realestate', image: '/industries/real-estate.webp' },
  { Icon: HardHat,         title: 'Construction',  desc: 'Materials, labor and site progress tracked live.', href: '/industries/construction', image: '/industries/construction.webp' },
  { Icon: Factory,         title: 'Manufacturing', desc: 'PLC, SCADA and IoT data unified on one dashboard.', href: '/industries/manufacturing', image: '/industries/manufacturing.webp' },
  { Icon: Landmark,        title: 'Government',    desc: 'e-Tenders, GEM listings and compliance tracked end-to-end.', href: '/industries/government', image: '/industries/government.webp' },
];

// Server component: only <Tabs> (the WAI-ARIA tab list) is a client island.
export function IndustriesGrid() {
  const items = industries.map(ind => ({
    id: ind.title.toLowerCase().replace(/\s+/g, '-'),
    label: ind.title,
    content: (
      <Panel className="grid overflow-hidden md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center p-7 md:p-10">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-btn bg-gold/15 text-gold-text">
            <ind.Icon className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="font-display text-card-title text-text">{ind.title}</h3>
          <p className="mt-3 text-text2">{ind.desc}</p>
          <Button href={ind.href} className="mt-7 self-start">
            Explore {ind.title} <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="relative aspect-[5/4] bg-bg3">
          <Image
            src={ind.image}
            alt={`${ind.title} software overview`}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            quality={80}
            className="object-contain"
          />
        </div>
      </Panel>
    ),
  }));

  return (
    <section className="bg-bg py-[var(--section-y)]">
      <div className="container">
        <SectionHeading
          eyebrow="Industries"
          title={<>Different sectors, different rules. <span className="text-gold-text">We already know the difference.</span></>}
        />
        <Tabs items={items} className="mt-10" />
      </div>
    </section>
  );
}
