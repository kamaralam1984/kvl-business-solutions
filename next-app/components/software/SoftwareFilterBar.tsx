'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X, Loader2, SlidersHorizontal } from 'lucide-react';
import { Panel, cn } from '@/components/ui';

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
      <Panel className="mb-8 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search aria-hidden className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text3" />
            <input
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="Search by name or description…"
              aria-label="Search software"
              className="min-h-[44px] w-full rounded-full border border-line bg-card pl-10 pr-11 text-sm text-text placeholder:text-text3 transition-shadow duration-base focus-visible:border-gold focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            />
            {queryInput && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQueryInput('')}
                className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-text3 hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="shrink-0">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              aria-label="Sort software products"
              className="min-h-[44px] rounded-full border border-line bg-card px-4 text-sm text-text transition-shadow duration-base focus-visible:border-gold focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {isPending && <Loader2 role="status" className="h-4 w-4 shrink-0 animate-spin text-gold-text motion-reduce:animate-none" aria-label="Updating results" />}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="mr-1 flex items-center gap-1 text-xs text-text3"><SlidersHorizontal aria-hidden className="h-3 w-3" /> Category:</span>
          {categories.map(cat => {
            const active = activeCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                aria-pressed={active}
                className={cn(
                  'min-h-[44px] rounded-full border px-4 text-xs font-semibold transition-colors duration-base focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
                  active ? 'border-gold bg-gold text-[#080910]' : 'border-line bg-transparent text-text2 hover:border-gold hover:text-text',
                )}
              >
                {cat}
              </button>
            );
          })}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto flex min-h-[44px] items-center gap-1 text-xs font-semibold text-text2 hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            >
              <X aria-hidden className="h-3 w-3" /> Clear filters
            </button>
          )}
        </div>
      </Panel>

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between text-sm text-text3">
        <p>
          Showing <span className="text-text2 font-semibold">{filteredCount}</span> of {totalCount} products
        </p>
      </div>
    </div>
  );
}
