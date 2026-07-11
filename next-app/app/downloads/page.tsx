import { PageHero } from '@/components/shared/PageHero';
import { DownloadsSection } from '@/components/widgets/DownloadsSection';
import { CtaBanner } from '@/components/home/CtaBanner';

export const metadata = {
  title: 'Downloads — Company Profile, Portfolio & Service Brochure | KVL Business Solutions',
  description: 'Download the KVL Business Solutions company profile, portfolio of real projects, and service brochure.',
};

export default function DownloadsPage() {
  return (
    <>
      <PageHero
        eyebrow="RESOURCES"
        title="Everything About KVL,"
        accent="In One Place"
        description="Download our company profile, portfolio of real projects, and full service brochure — free, no strings attached."
        breadcrumb="Downloads"
      />
      <DownloadsSection />
      <CtaBanner />
    </>
  );
}
