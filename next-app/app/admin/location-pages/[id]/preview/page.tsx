import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import { LocationPage } from '@/lib/models/LocationPage';
import { Country } from '@/lib/models/Country';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';
import { LocationPageTemplate } from '@/components/location-landing/LocationPageTemplate';

export const metadata: Metadata = { robots: { index: false, follow: false } };

function toPlain(doc: any) {
  const { _id, __v, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}

export default async function LocationPagePreview({ params }: { params: { id: string } }) {
  await connectDB();
  const doc = await LocationPage.findById(params.id).lean();
  if (!doc) notFound();
  const loc = toPlain(doc) as any;

  const countryDoc = await Country.findOne({ slug: loc.country }).lean();
  const country = countryDoc ? toPlain(countryDoc) as any : {
    slug: loc.country, name: loc.country, heroTitle: '', heroDescription: '', intro: '',
    status: 'draft', seo: { title: '', description: '' }, createdAt: '', updatedAt: '',
  };

  const siblingDocs = await LocationPage.find({ country: loc.country, _id: { $ne: loc._id } }).limit(8).lean();
  const nearby = siblingDocs.map(toPlain) as any[];
  const products = await getLiveSoftwareProducts().catch(() => []);

  return (
    <div>
      <div className="py-3 text-center text-[13px] font-semibold" style={{ background: 'rgba(200,168,112,0.12)', color: '#a3814f' }}>
        Preview mode — status: {loc.status}. This page is never indexed.
      </div>
      <LocationPageTemplate country={country} loc={loc} nearby={nearby} products={products} />
    </div>
  );
}
