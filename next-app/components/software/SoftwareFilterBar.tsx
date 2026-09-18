'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X, Loader2, SlidersHorizontal } from 'lucide-react';

export type SortOption = 'popular' | 'newest' | 'alpha';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Popular (by customer reviews)' },
  { value: 'newest', label: 'Newest' },
  { value: 'alpha', label: 'Alphabetical (A–Z)' },
];

/**
 * Pure client-side controls for the /software filter bar. Reads its current
 * values from props (sourced server-side from `searchParams`) instead of the
 * useSearchParams() hook — that hook forces Next.js to bail the whole
 * subtree out to client-only rendering, which was hiding the product grid
 * from non-JS crawlers. Updating the URL here triggers a normal Next.js
 * navigation, so the server component page re-renders with the new filters.
 */
export function SoftwareFilterBar({
  categories,
  q,
  activeCategories,
  sort,
  totalCount,
  filteredCount,
}: {
  categories: string[];
  q: string;
  activeCategories: string[];
  sort: SortOption;
  totalCount: number;
  filteredCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Local, debounced copy for the search text input so every keystroke doesn't spam router.replace
  const [queryInput, setQueryInput] = useState(q);

  useEffect(() => { setQueryInput(q); }, [q]);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (activeCategories.length) params.set('category', activeCategories.join(','));
    if (sort !== 'popular') params.set('sort', sort);
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
      if (queryInput !== q) updateParams({ q: queryInput || null });
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

  const hasActiveFilters = Boolean(q || activeCategories.length || sort !== 'popular');

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
          Showing <span className="text-text2 font-semibold">{filteredCount}</span> of {totalCount} products
        </p>
      </div>
    </div>
  );
}
