'use client';
import { softwareProducts } from '@/lib/data/software';
import { WebsiteDemoPreview } from '@/components/software/demos/WebsiteDemoPreview';
import { ProductMarketingDemo } from '@/components/software/demos/ProductMarketingDemo';

// 1-page/multi-page website packages get a real site-preview demo instead of a product marketing page.
const WEBSITE_DEMO_SLUGS = new Set(['independence-day-website', 'website-business-4999', 'website-growth-9999', 'website-advanced-14999']);

export default function DemoPage({ params }: { params: { slug: string } }) {
  const product = softwareProducts.find(p => p.slug === params.slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <div className="text-slate-400">Software not found</div>
        </div>
      </div>
    );
  }

  if (WEBSITE_DEMO_SLUGS.has(product.slug)) {
    return <WebsiteDemoPreview product={product} />;
  }

  return <ProductMarketingDemo product={product} />;
}
