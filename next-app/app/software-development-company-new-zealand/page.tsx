import { countryPages } from '@/lib/data/country-pages';
import { CountryLandingTemplate, buildCountryMetadata } from '@/components/country-landing/CountryLandingTemplate';

const country = countryPages.find(c => c.slug === 'new-zealand')!;

export const metadata = buildCountryMetadata(country);

export default function Page() {
  return <CountryLandingTemplate country={country} />;
}
