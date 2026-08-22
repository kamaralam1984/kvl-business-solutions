import { indiaStatePages } from '@/lib/data/india-states';
import { CountryLandingTemplate, buildCountryMetadata } from '@/components/country-landing/CountryLandingTemplate';

const state = indiaStatePages.find(s => s.slug === 'tamil-nadu')!;

export const metadata = buildCountryMetadata(state);

export default function Page() {
  return <CountryLandingTemplate country={state} />;
}
