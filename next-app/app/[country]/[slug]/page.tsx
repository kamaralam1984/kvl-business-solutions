import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLiveCountries, getLiveCountry, getLiveLocationPages, getLiveLocationPage } from '@/lib/data/live-locations';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';
import { LocationPageTemplate, buildLocationMetadata } from '@/components/location-landing/LocationPageTemplate';

export const revalidate = 300;

export async function generateStaticParams() {
  const countries = await getLiveCountries();
  const params: { country: string; slug: string }[] = [];
  for (const c of countries) {
    const locations = await getLiveLocationPages(c.slug);
    for (const loc of locations) params.push({ country: c.slug, slug: loc.slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: { country: string; slug: string } }): Promise<Metadata> {
  const country = await getLiveCountry(params.country);
  const loc = country ? await getLiveLocationPage(params.country, params.slug) : null;
  if (!country || !loc) return {};
  return buildLocationMetadata(country, loc);
}

export default async function LocationPage({ params }: { params: { country: string; slug: string } }) {
  const country = await getLiveCountry(params.country);
  if (!country) notFound();

  const loc = await getLiveLocationPage(params.country, params.slug);
  if (!loc) notFound();

  const [siblings, products] = await Promise.all([
    getLiveLocationPages(params.country),
    getLiveSoftwareProducts().catch(() => []),
  ]);
  const nearby = siblings.filter(s => s.slug !== loc.slug).slice(0, 8);

  return <LocationPageTemplate country={country} loc={loc} nearby={nearby} products={products} />;
}
