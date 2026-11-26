import { CtaBanner } from '@/components/home/CtaBanner';
import { SoftwareFilterBar, type SortOption } from '@/components/software/SoftwareFilterBar';
import { SoftwareCard } from '@/components/software/SoftwareCard';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { Shield, Headphones, Zap, X } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { Button, Card, Section, StateMessage } from '@/components/ui';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Software Marketplace — Enterprise-Grade Business Software, Buy or Rent';
const description = "Explore KVL's marketplace of ready-to-deploy business software — CRM, ERP, billing, hospital and school management, and more. Live demos, transparent pricing, buy outright or rent month-to-month.";

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/software` },
  openGraph: { title, description, url: `${SITE}/software`, type: 'website' },
};

export default async function SoftwarePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string };
}) {
  const products = await getLiveSoftwareProducts();

  // Real approved-review counts per product, used as an honest "Popular" sort proxy
  // in the marketplace filters — no fabricated popularity numbers.
  let reviewCounts: Record<string, number> = {};
  try {
    await connectDB();
    const counts = await Review.aggregate([
      { $match: { approved: true, productSlug: { $in: products.map(p => p.slug) } } },
      { $group: { _id: '$productSlug', count: { $sum: 1 } } },
    ]);
    reviewCounts = Object.fromEntries(counts.map((c: any) => [c._id, c.count]));
  } catch {}

  // Filtering/sorting happens here, server-side, driven by the URL's search
  // params — not inside a client component reading useSearchParams(), which
  // forces Next.js to bail the whole subtree out to client-only rendering
  // and hides the product grid from crawlers that don't execute JS.
  const categories = Array.from(new Set(products.map(p => p.category))).sort();
  const q = (searchParams.q || '').trim();
  const activeCategories = (searchParams.category || '').split(',').filter(Boolean);
  const sort = ((searchParams.sort as SortOption) || 'popular');

  let filtered = products.filter(p => {
    if (activeCategories.length && !activeCategories.includes(p.category)) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.description.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  switch (sort) {
    case 'alpha':
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      // No real "createdAt" field on static catalog entries — honestly proxied by
      // reversing catalog (array) order, i.e. the most-recently-added product first.
      filtered = [...filtered].reverse();
      break;
    case 'popular':
    default:
      // No real "popularity"/view-count field — honestly proxied by approved review
      // count from the real Review model. Ties keep catalog order (stable sort).
      filtered = [...filtered].sort((a, b) => (reviewCounts[b.slug] || 0) - (reviewCounts[a.slug] || 0));
  }

  return (
    <>
      <PageHero
        eyebrow={`${products.length} Enterprise-Grade Software Products • Buy or Rent`}
        title="Enterprise Software"
        accent="Built for India"
        description="Ready-to-deploy software for every business function — CRM, ERP, billing, HMS and more. Own it outright or rent month-to-month, and see it running live before you commit."
        breadcrumb="Software"
      />

      <Section className="!pb-0">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gold-text">Buy Once</div>
            <p className="text-text2">One-time payment. Own forever. Free 1-year support.</p>
          </Card>
          <Card className="p-6">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gold-text">Rent Monthly</div>
            <p className="text-text2">Low monthly fee. Cancel anytime. Always latest version.</p>
          </Card>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-text2">
          {[
            { Icon: Shield, text: '30-day money-back' },
            { Icon: Zap, text: 'Setup in 24 hours' },
            { Icon: Headphones, text: 'Lifetime support' },
          ].map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gold-text" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <p className="mb-10 text-center text-sm text-text3">
          Click <span className="font-semibold text-text2">Demo</span> to explore live interactive dashboard • Hover card for instant preview
        </p>
        {products.length === 0 ? (
          <StateMessage kind="empty" title="No software products are available right now." description="Please check back soon." />
        ) : (
          <>
            <SoftwareFilterBar
              categories={categories}
              q={q}
              activeCategories={activeCategories}
              sort={sort}
              totalCount={products.length}
              filteredCount={filtered.length}
            />
            {filtered.length === 0 ? (
              <StateMessage
                kind="empty"
                title="No products match your filters."
                action={
                  <Button href="/software" variant="secondary">
                    <X className="h-4 w-4" aria-hidden /> Clear all filters
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map(p => <SoftwareCard key={p.slug} product={p} />)}
              </div>
            )}
          </>
        )}
      </Section>

      <CtaBanner title="Not sure which software fits your business?" desc="Talk to a solution architect for a personalized recommendation — every product ships with a free live demo and a 30-day money-back guarantee." />
    </>
  );
}
