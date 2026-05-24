import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { IndustriesGrid } from '@/components/home/IndustriesGrid';
import { GpsTracking } from '@/components/home/GpsTracking';
import { CaseStudies } from '@/components/home/CaseStudies';
import { AnalyticsDashboard } from '@/components/home/AnalyticsDashboard';
import { Testimonials } from '@/components/home/Testimonials';
import { Certifications } from '@/components/home/Certifications';
import { TrustedBy } from '@/components/home/TrustedBy';
import { CtaBanner } from '@/components/home/CtaBanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesPreview />
      <IndustriesGrid />
      <GpsTracking />
      <CaseStudies />
      <AnalyticsDashboard />
      <Testimonials limit={3} />
      <Certifications />
      <TrustedBy />
      <CtaBanner />
    </>
  );
}
