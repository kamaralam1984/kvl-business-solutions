import { countryPages } from '@/lib/data/country-pages';
import { CountryLandingTemplate, buildCountryMetadata } from '@/components/country-landing/CountryLandingTemplate';

const country = countryPages.find(c => c.slug === 'singapore')!;

export const metadata = buildCountryMetadata(country);

export default function Page() {
  return <CountryLandingTemplate country={country} />;
}
