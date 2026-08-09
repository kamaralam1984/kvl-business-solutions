import Link from 'next/link';
import {
  HardHat, Cog, Factory, Truck, School, Hospital, Store, Building2, Landmark,
  UtensilsCrossed, Wallet, Box,
  type LucideIcon,
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { TiltCard } from '@/components/shared/TiltCard';
import { industries } from '@/lib/data/industries';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Industries We Serve — Sector-Specific Enterprise Software';
const description = "KVL builds industry-specific software and systems for healthcare, education, manufacturing, construction, retail, real estate and government — engineered around how each sector actually operates.";

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/industries` },
  openGraph: { title, description, url: `${SITE}/industries`, type: 'website' },
};

const ICON_MAP: Record<string, LucideIcon> = {
  HardHat, Cog, Factory, Truck, School, Hospital, Store, Building2, Landmark,
  UtensilsCrossed, Wallet, Box,
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="INDUSTRIES WE SERVE" title="Different Sectors," accent="Different Rules" description="Every industry runs on different rules, compliance requirements and workflows. We build software and systems around the way your sector actually operates — not a generic template." breadcrumb="Industries" />
      <section className="section">
        <div className="container space-y-5">
          {industries.map(ind => {
            const Icon = ICON_MAP[ind.icon] || Box;
            return (
              <TiltCard key={ind.slug} className="card-base p-7 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
                <Link href={`/industries/${ind.slug}`} className="w-20 h-20 rounded-2xl grid place-items-center text-white text-3xl" style={{ background: `linear-gradient(135deg, ${ind.c1}, ${ind.c2})` }}>
                  <Icon className="w-9 h-9" />
                </Link>
                <Link href={`/industries/${ind.slug}`} className="block">
                  <h3 className="text-xl font-bold mb-2">{ind.name}</h3>
                  <p className="text-text2 text-sm mb-2">{ind.desc}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {ind.tags.map(t => <span key={t} className="text-[11px] px-2.5 py-1 surface2-tint border border-tint rounded-full text-text2">{t}</span>)}
                  </div>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link href={`/industries/${ind.slug}`} className="btn btn-primary">Explore Solutions</Link>
                  <Link href="/contact" className="text-xs text-center text-primary font-semibold hover:underline">Talk to us</Link>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>
      <CtaBanner title="Don't see your industry?" desc="We build custom solutions for any business vertical — tell us how your operation runs and we'll show you how we'd approach it." />
    </>
  );
}
