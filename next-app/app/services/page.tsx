import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { TiltCard } from '@/components/shared/TiltCard';
import { services } from '@/lib/data/services';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = { title: 'Services — KVL Business Solutions' };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="OUR SERVICES" title="Everything Your Business Needs" accent="Under One Roof" description="14+ professional services — from custom software to industrial automation and civil engineering." breadcrumb="Services" />
      <section className="section">
        <div className="container grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(s => {
            const Icon = (Icons as any)[s.icon] || Icons.Box;
            return (
              <TiltCard key={s.slug} className="card-base p-5">
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-3 border" style={{ background: `${s.color}25`, color: s.color, borderColor: `${s.color}50` }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold mb-2">{s.name}</h4>
                <p className="text-[13px] text-text2 mb-3">{s.description}</p>
                <Link href="/contact" className="btn btn-ghost text-xs">Enquire <ArrowRight className="w-3 h-3" /></Link>
              </TiltCard>
            );
          })}
        </div>
      </section>
      <CtaBanner title="Need a custom service combo?" desc="Mix and match any of our services. We'll handle the rest." />
    </>
  );
}
