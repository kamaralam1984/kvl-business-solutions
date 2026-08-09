'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import type { Software } from '@/lib/data/software';

// Shown right after a purchase (checkout/success) and on the customer
// dashboard — the highest-intent moments to suggest a complementary product.
// Same-category products are prioritized; falls back to other active
// products if the purchased one has no category peers. Renders nothing
// while loading or if there's genuinely nothing to recommend.
export function UpsellRecommendations({ excludeSlug, title = 'Customers also use' }: { excludeSlug: string; title?: string }) {
  const [products, setProducts] = useState<Software[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { if (alive) setProducts(d.products || []); })
      .catch(() => { if (alive) setProducts([]); });
    return () => { alive = false; };
  }, []);

  if (!products) return null;

  const purchased = products.find(p => p.slug === excludeSlug);
  const rest = products.filter(p => p.slug !== excludeSlug);
  const sameCategory = purchased ? rest.filter(p => p.category === purchased.category) : [];
  const recommended = [...sameCategory, ...rest.filter(p => !sameCategory.includes(p))].slice(0, 3);

  if (recommended.length === 0) return null;

  return (
    <div className="card-base p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="font-bold text-sm">{title}</h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {recommended.map(p => (
          <Link
            key={p.slug}
            href={`/software/${p.slug}`}
            className="surface-tint rounded-xl p-4 hover:border-primary transition-colors group"
          >
            <div className="font-semibold text-sm mb-1">{p.name}</div>
            <div className="text-xs text-text2 mb-3 line-clamp-2">{p.description}</div>
            <div className="flex items-center justify-between">
              <span className="text-primary font-bold text-sm">{formatINR(p.price)}</span>
              <span className="text-[11px] text-text2 group-hover:text-primary flex items-center gap-0.5">
                View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
