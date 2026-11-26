import Link from 'next/link';
import {
  HardHat, Cog, Factory, Truck, School, Hospital, Store, Building2, Landmark,
  UtensilsCrossed, Wallet, Box,
  type LucideIcon,
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Button, Card, Section } from '@/components/ui';
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
      <Section containerClassName="container space-y-5">
        {industries.map(ind => {
          const Icon = ICON_MAP[ind.icon] || Box;
          return (
            <Card key={ind.slug} interactive className="relative grid items-center gap-6 p-7 md:grid-cols-[auto_1fr_auto]">
              <div aria-hidden className="grid h-20 w-20 place-items-center rounded-card text-white" style={{ background: `linear-gradient(135deg, ${ind.c1}, ${ind.c2})` }}>
                <Icon className="h-9 w-9" />
              </div>
              <div>
                <h2 className="font-display text-card-title text-text">
                  <Link href={`/industries/${ind.slug}`} className="rounded-btn after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">{ind.name}</Link>
                </h2>
                <p className="mb-3 mt-2 text-text2">{ind.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ind.tags.map(t => <span key={t} className="rounded-full border border-line bg-bg2 px-2.5 py-1 text-xs text-text2">{t}</span>)}
                </div>
              </div>
              <div className="relative z-10 flex flex-col gap-1">
                <Button href={`/industries/${ind.slug}`}>Explore Solutions</Button>
                <Link href="/contact" className="inline-flex min-h-[44px] items-center justify-center rounded-btn text-sm font-semibold text-gold-text hover:underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">Talk to us</Link>
              </div>
            </Card>
          );
        })}
      </Section>
      <CtaBanner title="Don't see your industry?" desc="We build custom solutions for any business vertical — tell us how your operation runs and we'll show you how we'd approach it." />
    </>
  );
}
