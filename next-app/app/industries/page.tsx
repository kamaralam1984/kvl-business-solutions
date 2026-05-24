import Link from 'next/link';
import * as Icons from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { TiltCard } from '@/components/shared/TiltCard';
import { industries } from '@/lib/data/industries';

export const metadata = { title: 'Industries — KVL Business Solutions' };

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="INDUSTRIES WE SERVE" title="Industry-Specific" accent="Solutions" description="Deep domain expertise across 9 sectors with specialized software, automation, GPS and analytics." breadcrumb="Industries" />
      <section className="section">
        <div className="container space-y-5">
          {industries.map(ind => {
            const Icon = (Icons as any)[ind.icon] || Icons.Box;
            return (
              <TiltCard key={ind.slug} className="card-base p-7 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
                <div className="w-20 h-20 rounded-2xl grid place-items-center text-white text-3xl" style={{ background: `linear-gradient(135deg, ${ind.c1}, ${ind.c2})` }}>
                  <Icon className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{ind.name}</h3>
                  <p className="text-text2 text-sm mb-2">{ind.desc}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {ind.tags.map(t => <span key={t} className="text-[11px] px-2.5 py-1 surface2-tint border border-tint rounded-full text-text2">{t}</span>)}
                  </div>
                </div>
                <Link href="/contact" className="btn btn-primary">Explore</Link>
              </TiltCard>
            );
          })}
        </div>
      </section>
      <CtaBanner title="Don't see your industry?" desc="We build custom solutions for any business vertical. Tell us your needs." />
    </>
  );
}
