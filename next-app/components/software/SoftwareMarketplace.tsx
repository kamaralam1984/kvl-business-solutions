'use client';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X, Loader2, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { SoftwareCard } from '@/components/software/SoftwareCard';
import type { Software } from '@/lib/data/software';

type SortOption = 'popular' | 'newest' | 'alpha';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Popular (by customer reviews)' },
  { value: 'newest', label: 'Newest' },
  { value: 'alpha', label: 'Alphabetical (A–Z)' },
];

export function SoftwareMarketplace({
  products,
  reviewCounts,
}: {
  products: Software[];
  /** Approved-review count per product slug, from the real Review model — used as an honest "popularity" proxy since products have no popularity field. */
  reviewCounts: Record<string, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).sort(),
    [products]
  );

  const qParam = searchParams.get('q') || '';
  const activeCategories = useMemo(
    () => (searchParams.get('category') || '').split(',').filter(Boolean),
    [searchParams]
  );
  const sort = (searchParams.get('sort') as SortOption) || 'popular';

  // Local, debounced copy for the search text input so every keystroke doesn't spam router.replace
  const [queryInput, setQueryInput] = useState(qParam);

  useEffect(() => { setQueryInput(qParam); }, [qParam]);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    startTransition(() => {
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
    });
  }

  // Debounce search text -> URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (queryInput !== qParam) updateParams({ q: queryInput || null });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput]);

  function toggleCategory(cat: string) {
    const next = activeCategories.includes(cat)
      ? activeCategories.filter(c => c !== cat)
      : [...activeCategories, cat];
    updateParams({ category: next.length ? next.join(',') : null });
  }

  function setSort(value: SortOption) {
    updateParams({ sort: value === 'popular' ? null : value });
  }

  function clearFilters() {
    setQueryInput('');
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  const filtered = useMemo(() => {
    const q = qParam.trim().toLowerCase();
    let list = products.filter(p => {
      if (activeCategories.length && !activeCategories.includes(p.category)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      return true;
    });

    switch (sort) {
      case 'alpha':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // No real "createdAt" field on static catalog entries — honestly proxied by
        // reversing catalog (array) order, i.e. the most-recently-added product first.
        list = [...list].reverse();
        break;
      case 'popular':
      default:
        // No real "popularity"/view-count field — honestly proxied by approved review
        // count from the real Review model. Ties keep catalog order (stable sort).
        list = [...list].sort((a, b) => (reviewCounts[b.slug] || 0) - (reviewCounts[a.slug] || 0));
    }
    return list;
  }, [products, qParam, activeCategories, sort, reviewCounts]);

  const hasActiveFilters = Boolean(qParam || activeCategories.length || (sort !== 'popular'));

  if (products.length === 0) {
    return (
      <div className="card-luxury p-10 text-center">
        <PackageSearch className="w-10 h-10 text-text3 mx-auto mb-3" />
        <p className="text-text2">No software products are available right now. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="rounded-2xl border border-border/15 p-4 sm:p-5 mb-8" style={{ background: 'rgba(var(--text) / 0.03)', backdropFilter: 'blur(8px)' }}>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text3" />
            <input
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="Search by name or description…"
              aria-label="Search software"
              className="w-full pl-10 pr-9 py-2.5 rounded-full text-sm bg-text/5 border border-border/20 text-text placeholder:text-text3 focus:outline-none focus:border-violet-400/60"
            />
            {queryInput && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQueryInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text3 hover:text-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="shrink-0">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              aria-label="Sort software products"
              className="px-3 py-2.5 rounded-full text-xs bg-text/5 border border-border/20 text-text focus:outline-none focus:border-violet-400/60"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{o.label}</option>
              ))}
            </select>
          </div>

          {isPending && <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" aria-label="Updating results" />}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[11px] text-text3 flex items-center gap-1 mr-1"><SlidersHorizontal className="w-3 h-3" /> Category:</span>
          {categories.map(cat => {
            const active = activeCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
                  active
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-text/5 border-border/20 text-text2 hover:text-text hover:border-border/35'
                }`}
              >
                {cat}
              </button>
            );
          })}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-[11px] font-semibold text-text2 hover:text-text flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4 text-xs text-text3">
        <p>
          Showing <span className="text-text2 font-semibold">{filtered.length}</span> of {products.length} products
        </p>
      </div>

      {/* Grid / states */}
      <div className={isPending ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
        {filtered.length === 0 ? (
          <div className="card-luxury p-10 text-center">
            <PackageSearch className="w-10 h-10 text-text3 mx-auto mb-3" />
            <p className="text-text2 mb-4">No products match your filters.</p>
            <button type="button" onClick={clearFilters} className="btn btn-ghost text-xs mx-auto">
              <X className="w-3.5 h-3.5" /> Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => <SoftwareCard key={p.slug} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
