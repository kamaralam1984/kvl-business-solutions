import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/home/Hero';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';
import { getLiveCaseStudies } from '@/lib/data/live-case-studies';
import { getSiteSettings } from '@/lib/models/SiteSettings';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Custom Software Development Company in India — Enterprise ERP, CRM & AI Automation | KVL Business Solutions';
const description = 'KVL Business Solutions builds custom software, enterprise ERP, CRM and AI automation for hospitals, schools, factories and government offices across India — MSME registered, one accountable team from discovery to support.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: SITE },
  openGraph: { title, description, url: SITE, type: 'website' },
};

// Hero is the only section guaranteed above the fold — everything below is
// code-split into its own chunk so it doesn't block initial JS parse/hydration.
// Core Services lives on its own /services page (linked from the navbar) —
// not duplicated here.
const StatsBar          = dynamic(() => import('@/components/home/StatsBar').then(m => m.StatsBar));
const IndustriesGrid    = dynamic(() => import('@/components/home/IndustriesGrid').then(m => m.IndustriesGrid));
const CaseStudies       = dynamic(() => import('@/components/home/CaseStudies').then(m => m.CaseStudies));
const Certifications    = dynamic(() => import('@/components/home/Certifications').then(m => m.Certifications));
const Process           = dynamic(() => import('@/components/home/Process').then(m => m.Process));
const Testimonials      = dynamic(() => import('@/components/home/Testimonials').then(m => m.Testimonials));
const HomeFAQ           = dynamic(() => import('@/components/home/HomeFAQ').then(m => m.HomeFAQ));
const CtaBanner         = dynamic(() => import('@/components/home/CtaBanner').then(m => m.CtaBanner));

export default async function HomePage() {
  const [products, caseStudies, settings] = await Promise.all([
    getLiveSoftwareProducts().catch(() => []),
    getLiveCaseStudies().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  return (
    <>
      <Hero settings={settings} products={products} />
      <StatsBar productCount={products.length} caseStudyCount={caseStudies.length} />
      <IndustriesGrid />
      <CaseStudies caseStudies={caseStudies} />
      <Certifications />
      <Process />
      <Testimonials />
      <HomeFAQ />
      <CtaBanner />
    </>
  );
}
