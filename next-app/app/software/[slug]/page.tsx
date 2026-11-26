import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { getLiveSoftwareProduct, getLiveSoftwareProducts } from '@/lib/data/live-software';
import { Button, Card, Panel, Section } from '@/components/ui';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { ReviewsSection } from '@/components/widgets/ReviewsSection';
import { ViewContentTracker } from '@/components/analytics/ViewContentTracker';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import {
  Check, Cloud, ShieldCheck, Headphones, RefreshCcw, Award, Play, Zap,
  BadgeIndianRupee, BarChart2, Bell, BookOpen, CalendarClock, CalendarX2, ChefHat, ClipboardCheck,
  ClipboardList, Clock, CreditCard, Eye, FileCheck, FileText, Fingerprint, Fuel, GitBranch, Globe,
  Layers, LayoutGrid, MapPin, MessageSquare, Navigation, Network, PackageCheck, Receipt, Rocket,
  ScanLine, Search, Settings, ShieldAlert, Smartphone, Sparkles, Target, TrendingDown, TrendingUp,
  Users, Warehouse, Code2,
} from 'lucide-react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

// Every distinct `icon` value used inside `benefits[]` across
// lib/data/software.ts — the only data reaching this lookup. Zap (imported
// above) is both the fallback and one of the real benefit icons.
const ICON_MAP: Record<string, LucideIcon> = {
  BadgeIndianRupee, BarChart2, Bell, BookOpen, CalendarClock, CalendarX2, ChefHat, ClipboardCheck,
  ClipboardList, Clock, Cloud, Code2, CreditCard, Eye, FileCheck, FileText, Fingerprint, Fuel,
  GitBranch, Globe, Headphones, Layers, LayoutGrid, MapPin, MessageSquare, Navigation, Network,
  PackageCheck, Receipt, Rocket, ScanLine, Search, Settings, ShieldAlert, ShieldCheck, Smartphone,
  Sparkles, Target, TrendingDown, TrendingUp, Users, Warehouse, Zap,
};

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
  const title = p.buyOnly ? `${p.name} — Limited Time Offer` : `${p.name} — Buy or Rent, Free Live Demo`;
  const url = `${SITE}/software/${p.slug}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: p.description,
      url,
      type: 'website',
      images: [{ url: `/og?title=${encodeURIComponent(p.name)}`, width: 1200, height: 630, alt: p.name }],
    },
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
      highPrice: product.buyOnly ? cloudPrice : onPremPrice,
      offerCount: product.buyOnly ? 1 : 2,
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
      <ViewContentTracker id={product.slug} name={product.name} value={cloudPrice} category={product.category} />
      <PageHero
        eyebrow="SOFTWARE"
        title={product.name}
        description={product.description}
        breadcrumb={product.name}
        breadcrumbPath={[{ label: 'Software', href: '/software' }, { label: product.name }]}
      />

      {product.image && (
        <Section className="!pb-0">
          <div className="relative h-80 overflow-hidden rounded-panel shadow-soft-2">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(100deg, ${product.c1}e6 0%, ${product.c2}99 42%, transparent 78%)` }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-10">
              <div className="flex flex-wrap gap-2">
                {product.tag && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    {product.tag}
                  </span>
                )}
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section containerClassName="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {product.benefits.length > 0 && (
            <Card className="p-7">
              <h2 className="mb-1 font-display text-card-title text-text">Why this helps your business</h2>
              <p className="mb-5 text-text2">Not just features — real, measurable impact on how you operate day to day.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {product.benefits.map(b => {
                  const BenefitIcon = ICON_MAP[b.icon] || Zap;
                  return (
                    <div key={b.title} className="rounded-btn bg-bg2 p-4">
                      <div
                        className="mb-3 grid h-10 w-10 place-items-center rounded-btn"
                        style={{ background: `linear-gradient(135deg, ${product.c1}, ${product.c2})` }}
                      >
                        <BenefitIcon className="h-5 w-5 text-white" aria-hidden />
                      </div>
                      <div className="mb-1 font-bold text-text">{b.title}</div>
                      <div className="text-sm leading-relaxed text-text2">{b.desc}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="p-7">
            <h2 className="mb-4 font-display text-card-title text-text">Key Features</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.features.map(f => (
                <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-text" aria-hidden /> <span className="text-text2">{f}</span></li>
              ))}
            </ul>
          </Card>

          <Card className="p-7">
            <h2 className="mb-4 font-display text-card-title text-text">What&apos;s included</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { Icon: Cloud, t: 'Free installation', d: 'Our team deploys it for you within 24 hours.' },
                { Icon: Headphones, t: '1-year support', d: 'Email, chat & phone support included.' },
                { Icon: RefreshCcw, t: 'Free updates', d: 'Get all new features for 12 months.' },
                { Icon: Award, t: '30-day refund', d: 'Not happy? Get a full refund.' },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="flex gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-gold-text" aria-hidden />
                  <div><div className="font-semibold text-text">{t}</div><div className="text-sm text-text2">{d}</div></div>
                </div>
              ))}
            </div>
          </Card>

          <ReviewsSection productSlug={product.slug} productName={product.name} />

          <Card className="p-7">
            <h2 className="mb-4 font-display text-card-title text-text">Frequently asked</h2>
            <div className="space-y-4">
              <div><div className="font-semibold text-text">Is GST invoice provided?</div><div className="text-text2">Yes, you&apos;ll receive a GST-compliant invoice (18% GST) immediately after payment. Download from your dashboard.</div></div>
              <div><div className="font-semibold text-text">Can I cancel my subscription?</div><div className="text-text2">Yes, within 30 days for a full refund. See our refund policy.</div></div>
              <div><div className="font-semibold text-text">Do you offer custom features?</div><div className="text-text2">Yes — request a quote for custom modules.</div></div>
            </div>
          </Card>
        </div>

        <aside>
          <Panel className="sticky top-24 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-text2">Get Started</div>
            <div className="my-2 font-display text-card-title text-text">Pay an advance to begin — we&apos;ll discuss the rest on a call.</div>

            <div className="mt-5 space-y-3">
              {!product.noDemo && (
                <Button href={`/software/${product.slug}/demo`} variant="secondary" className="w-full">
                  <Play className="h-4 w-4" aria-hidden /> Launch Live Demo
                </Button>
              )}
              <Button href={`/checkout?product=${product.slug}&host=cloud`} className="w-full">
                <Cloud className="h-4 w-4" aria-hidden /> Advance Payment
              </Button>
            </div>

            <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-text2">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold-text" aria-hidden /> Secure Razorpay payment</div>
              <div className="flex items-center gap-2"><RefreshCcw className="h-4 w-4 text-gold-text" aria-hidden /> 30-day money-back</div>
              <div className="flex items-center gap-2"><Headphones className="h-4 w-4 text-gold-text" aria-hidden /> 1-year support</div>
            </div>
          </Panel>
        </aside>
      </Section>

      {related.length > 0 && (
        <Section tone="alt">
          <h2 className="mb-6 font-display text-section text-text">Related Software</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map(r => (
              <Link key={r.slug} href={`/software/${r.slug}`} className="block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                <Card interactive className="h-full p-5">
                  <div className="text-xs font-bold uppercase text-gold-text">{r.tag || 'Software'}</div>
                  <div className="mt-1 font-bold text-text">{r.name}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-text2">{r.description}</div>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
