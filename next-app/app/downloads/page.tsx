import { PageHero } from '@/components/shared/PageHero';
import { DownloadsSection } from '@/components/widgets/DownloadsSection';
import { CtaBanner } from '@/components/home/CtaBanner';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Downloads — Company Profile, Portfolio & Service Brochure | KVL Business Solutions';
const description = 'Download the KVL Business Solutions company profile, portfolio of real projects, and service brochure.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/downloads` },
  openGraph: { title, description, url: `${SITE}/downloads`, type: 'website' },
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
