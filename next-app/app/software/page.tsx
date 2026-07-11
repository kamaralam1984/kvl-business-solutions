import { Suspense } from 'react';
import { CtaBanner } from '@/components/home/CtaBanner';
import { SoftwareMarketplace } from '@/components/software/SoftwareMarketplace';
import { softwareProducts } from '@/lib/data/software';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { Star, Shield, Headphones, Zap } from 'lucide-react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Software Marketplace — Enterprise-Grade Business Software, Buy or Rent';
const description = "Explore KVL's marketplace of ready-to-deploy business software — CRM, ERP, billing, hospital and school management, and more. Live demos, transparent pricing, buy outright or rent month-to-month.";

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/software` },
  openGraph: { title, description, url: `${SITE}/software`, type: 'website' },
};

export default async function SoftwarePage() {
  // Real approved-review counts per product, used as an honest "Popular" sort proxy
  // in the marketplace filters — no fabricated popularity numbers.
  let reviewCounts: Record<string, number> = {};
  try {
    await connectDB();
    const counts = await Review.aggregate([
      { $match: { approved: true, productSlug: { $in: softwareProducts.map(p => p.slug) } } },
      { $group: { _id: '$productSlug', count: { $sum: 1 } } },
    ]);
    reviewCounts = Object.fromEntries(counts.map((c: any) => [c._id, c.count]));
  } catch {}

  return (
    <div style={{ background: 'rgb(var(--bg))' }}>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="noise-overlay" />
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, transparent 60%)' }} />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="relative z-10 container text-center">
          <div className="inline-flex items-center gap-2 border border-border/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 text-text/70" style={{ backdropFilter: 'blur(8px)', background: 'rgba(var(--text) / 0.05)' }}>
            <Star className="w-3.5 h-3.5 text-amber-400" /> 15 Enterprise-Grade Software Products • Buy or Rent
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight text-text">
            Enterprise Software<br />
            <span className="gradient-text">Built for India</span>
          </h1>
          <p className="text-text2 text-lg max-w-2xl mx-auto mb-10">
            Ready-to-deploy software for every business function — CRM, ERP, billing, HMS and more. Own it outright or rent month-to-month, and see it running live before you commit.
          </p>

          {/* Buy vs Rent */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="card-luxury px-6 py-4 text-left">
              <div className="gradient-text-gold font-extrabold text-sm mb-1 uppercase tracking-wider">Buy Once</div>
              <p className="text-text2 text-sm">One-time payment. Own forever. Free 1-year support.</p>
            </div>
            <div className="card-luxury px-6 py-4 text-left glow-violet">
              <div className="gradient-text font-extrabold text-sm mb-1 uppercase tracking-wider">Rent Monthly</div>
              <p className="text-text2 text-sm">Low monthly fee. Cancel anytime. Always latest version.</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-text2">
            {[
              { Icon: Shield, text: '30-day money-back' },
              { Icon: Zap, text: 'Setup in 24 hours' },
              { Icon: Headphones, text: 'Lifetime support' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-violet-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-text3 text-sm">Click <span className="text-text/70 font-semibold">Demo</span> to explore live interactive dashboard • Hover card for instant preview</p>
          </div>
          <Suspense fallback={<div className="text-center py-16 text-text3 text-sm">Loading marketplace filters…</div>}>
            <SoftwareMarketplace products={softwareProducts} reviewCounts={reviewCounts} />
          </Suspense>
        </div>
      </section>

      <CtaBanner title="Not sure which software fits your business?" desc="Talk to a solution architect for a personalized recommendation — every product ships with a free live demo and a 30-day money-back guarantee." />
    </div>
  );
}
