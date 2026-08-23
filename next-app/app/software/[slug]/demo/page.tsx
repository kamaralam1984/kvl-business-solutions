'use client';
import { useEffect, useState } from 'react';
import { softwareProducts, type Software } from '@/lib/data/software';
import { WebsiteDemoPreview } from '@/components/software/demos/WebsiteDemoPreview';
import { ProductMarketingDemo } from '@/components/software/demos/ProductMarketingDemo';

// 1-page/multi-page website packages get a real site-preview demo instead of a product marketing page.
const WEBSITE_DEMO_SLUGS = new Set(['independence-day-website', 'website-business-4999', 'website-growth-9999', 'website-advanced-14999']);

export default function DemoPage({ params }: { params: { slug: string } }) {
  const staticProduct = softwareProducts.find(p => p.slug === params.slug);
  // The static catalog covers every known product instantly with no fetch —
  // this only round-trips to /api/products for a slug that's DB-only (added
  // through Admin → Products with no matching static entry), so a product
  // added purely through the admin panel doesn't 404 on its /demo page.
  const [dbProduct, setDbProduct] = useState<Software | null | undefined>(staticProduct ? null : undefined);

  useEffect(() => {
    if (staticProduct) return;
    let cancelled = false;
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        const found = (data.products as Software[] | undefined)?.find(p => p.slug === params.slug);
        setDbProduct(found || null);
      })
      .catch(() => { if (!cancelled) setDbProduct(null); });
    return () => { cancelled = true; };
  }, [staticProduct, params.slug]);

  const product = staticProduct || dbProduct;

  if (product === undefined) {
    return <div className="min-h-screen bg-slate-950" />;
  }

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
