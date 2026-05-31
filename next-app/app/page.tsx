import { Hero } from '@/components/home/Hero';
import { TrustedBy } from '@/components/home/TrustedBy';
import { Stats } from '@/components/home/Stats';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { GpsTracking } from '@/components/home/GpsTracking';
import { IndustriesGrid } from '@/components/home/IndustriesGrid';
import { CaseStudies } from '@/components/home/CaseStudies';
import { AnalyticsDashboard } from '@/components/home/AnalyticsDashboard';
import { Testimonials } from '@/components/home/Testimonials';
import { Certifications } from '@/components/home/Certifications';
import { CtaBanner } from '@/components/home/CtaBanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Stats />
      <ServicesPreview />
      <GpsTracking />
      <IndustriesGrid />
      <CaseStudies />
      <AnalyticsDashboard />
      <Testimonials />
      <Certifications />
      <CtaBanner />
    </>
  );
}
