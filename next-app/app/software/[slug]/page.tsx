import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLiveSoftwareProduct, getLiveSoftwareProducts } from '@/lib/data/live-software';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { ReviewsSection } from '@/components/widgets/ReviewsSection';
import { formatINR } from '@/lib/utils';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { Check, Cloud, Server, ShieldCheck, Headphones, RefreshCcw, Award, Play, Zap } from 'lucide-react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

// Re-generated every 5 minutes (and on-demand for slugs not pre-rendered at
// build time) so Admin → Products edits (price, description, active/hidden)
// show up without a full redeploy.
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getLiveSoftwareProducts();
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getLiveSoftwareProduct(params.slug);
  if (!p) return { title: 'Product not found' };
  const title = `${p.name} — Buy or Rent, Free Live Demo`;
  const url = `${SITE}/software/${p.slug}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { title, description: p.description, url, type: 'website' },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, allProducts] = await Promise.all([
    getLiveSoftwareProduct(params.slug),
    getLiveSoftwareProducts(),
  ]);
  if (!product) notFound();

  const cloudPrice = product.price;
  const onPremPrice = Math.round(product.price * 1.5);
  const monthlyRent = product.monthlyRent;
  const related = allProducts.filter(p => p.slug !== product.slug).slice(0, 3);

  let ratingValue = 0;
  let reviewCount = 0;
  try {
    await connectDB();
    const approvedReviews = await Review.find({ productSlug: product.slug, approved: true }).lean();
    reviewCount = approvedReviews.length;
    if (reviewCount > 0) {
      const sum = approvedReviews.reduce((s: number, r: any) => s + r.rating, 0);
      ratingValue = Math.round((sum / reviewCount) * 10) / 10;
    }
  } catch {
    reviewCount = 0;
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Cloud, On-Premise',
    url: `${SITE}/software/${product.slug}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: cloudPrice,
      highPrice: onPremPrice,
      offerCount: 2,
      availability: 'https://schema.org/InStock',
    },
    provider: { '@id': `${SITE}/#organization` },
    ...(reviewCount > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue,
        reviewCount,
      },
    } : {}),
  };

  return (
    <>
      <JsonLd data={productJsonLd} id={`product-${product.slug}-jsonld`} />
      <PageHero
        eyebrow="SOFTWARE"
        title={product.name}
        description={product.description}
        breadcrumb={product.name}
        breadcrumbPath={[{ label: 'Software', href: '/software' }, { label: product.name }]}
      />

      <section className="section">
        <div className="container grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8">
            <div className="card-base p-7">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {product.features.map(f => (
                  <li key={f} className="flex gap-2 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> <span className="text-sm">{f}</span></li>
                ))}
              </ul>
            </div>

            <div className="card-base p-7">
              <h2 className="text-xl font-bold mb-4">What's included</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3"><Cloud className="w-5 h-5 text-primary shrink-0" /><div><div className="font-semibold text-sm">Free installation</div><div className="text-xs text-text2">Our team deploys it for you within 24 hours.</div></div></div>
                <div className="flex gap-3"><Headphones className="w-5 h-5 text-primary shrink-0" /><div><div className="font-semibold text-sm">1-year support</div><div className="text-xs text-text2">Email, chat & phone support included.</div></div></div>
                <div className="flex gap-3"><RefreshCcw className="w-5 h-5 text-primary shrink-0" /><div><div className="font-semibold text-sm">Free updates</div><div className="text-xs text-text2">Get all new features for 12 months.</div></div></div>
                <div className="flex gap-3"><Award className="w-5 h-5 text-primary shrink-0" /><div><div className="font-semibold text-sm">30-day refund</div><div className="text-xs text-text2">Not happy? Get a full refund.</div></div></div>
              </div>
            </div>

            <ReviewsSection productSlug={product.slug} productName={product.name} />

            <div className="card-base p-7">
              <h2 className="text-xl font-bold mb-4">Frequently asked</h2>
              <div className="space-y-4 text-sm">
                <div><div className="font-semibold">Is GST invoice provided?</div><div className="text-text2">Yes, you'll receive a GST-compliant invoice (18% GST) immediately after payment. Download from your dashboard.</div></div>
                <div><div className="font-semibold">Can I cancel my subscription?</div><div className="text-text2">Yes, within 30 days for a full refund. See our refund policy.</div></div>
                <div><div className="font-semibold">Do you offer custom features?</div><div className="text-text2">Yes — request a quote for custom modules.</div></div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card-base p-6 sticky top-24">
              <div className="text-xs uppercase tracking-wider text-text2">Starting at</div>
              <div className="text-4xl font-extrabold text-primary my-2">{formatINR(cloudPrice)}<span className="text-base text-text2 font-normal">{product.unit}</span></div>

              <div className="space-y-3 mt-5">
                <Link href={`/software/${product.slug}/demo`} className="btn w-full justify-center bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90">
                  <Play className="w-4 h-4" /> Launch Live Demo
                </Link>
                <Link href={`/checkout?product=${product.slug}&host=cloud`} className="btn btn-primary w-full justify-center">
                  <Cloud className="w-4 h-4" /> Buy Cloud — {formatINR(cloudPrice)}
                </Link>
                <Link href={`/checkout?product=${product.slug}&host=on-premise`} className="btn btn-ghost w-full justify-center">
                  <Server className="w-4 h-4" /> On-Premise — {formatINR(onPremPrice)}
                </Link>
                {monthlyRent && (
                  <Link href={`/checkout?product=${product.slug}&plan=monthly`} className="btn w-full justify-center border border-violet-500/50 text-violet-400 hover:bg-violet-500/10">
                    <Zap className="w-4 h-4" /> Rent — {formatINR(monthlyRent)}{product.rentUnit}
                  </Link>
                )}
              </div>

              <div className="mt-5 pt-5 border-t border-tint space-y-2 text-xs text-text2">
                <div className="flex gap-2 items-center"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure Razorpay payment</div>
                <div className="flex gap-2 items-center"><RefreshCcw className="w-3.5 h-3.5 text-green-500" /> 30-day money-back</div>
                <div className="flex gap-2 items-center"><Headphones className="w-3.5 h-3.5 text-green-500" /> 1-year support</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-app2">
          <div className="container">
            <h2 className="text-2xl font-extrabold mb-6">Related Software</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.slug} href={`/software/${r.slug}`} className="card-base p-5 hover:shadow-card-hover transition-all">
                  <div className="text-xs text-primary font-bold uppercase">{r.tag || 'Software'}</div>
                  <div className="font-bold mt-1">{r.name}</div>
                  <div className="text-xs text-text2 mt-1 line-clamp-2">{r.description}</div>
                  <div className="font-bold text-primary mt-3">{formatINR(r.price)}{r.unit}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
