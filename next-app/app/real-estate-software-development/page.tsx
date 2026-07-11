import { industryLandingPages } from '@/lib/data/industry-landing-pages';
import { IndustryLandingTemplate, buildIndustryMetadata } from '@/components/industry-landing/IndustryLandingTemplate';

const data = industryLandingPages.find(i => i.slug === 'real-estate-software-development')!;

export const metadata = buildIndustryMetadata(data);

export default function Page() {
  return <IndustryLandingTemplate data={data} />;
}
