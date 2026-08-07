import { WebsiteOfferClient } from './WebsiteOfferClient';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { caseStudies } from '@/lib/data/case-studies';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Independence Day Offer — Professional Website Starting at ₹999';
const description = 'Independence Day special: modern, mobile-friendly, SEO-optimized websites starting at ₹999. Choose from 5 simple plans, delivered in as little as 3 days. Offer valid till 15 August.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/website-offer` },
  openGraph: { title, description, url: `${SITE}/website-offer`, type: 'website', images: [{ url: '/og?title=' + encodeURIComponent(title), width: 1200, height: 630, alt: title }] },
};

export default async function WebsiteOfferPage() {
  const allProducts = await getLiveSoftwareProducts();
  const plans = allProducts.filter(p => p.category === 'Website & Design');

  let reviews: any[] = [];
  try {
    await connectDB();
    const docs = await Review.find({ approved: true }).sort({ featured: -1, rating: -1, createdAt: -1 }).limit(9).lean();
    reviews = docs.map((r: any) => ({
      name: r.name, company: r.company || '', rating: r.rating, title: r.title || '', message: r.message,
    }));
  } catch {}

  const portfolio = caseStudies.map(c => ({
    slug: c.slug, name: c.name, industry: c.industry, image: c.images.hero, tagline: c.tagline,
  }));

  return <WebsiteOfferClient plans={plans} reviews={reviews} portfolio={portfolio} />;
}
