'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/data/case-studies';
import { Card, Badge, StateMessage, cn } from '@/components/ui';

export function ProjectFilterBar({ studies }: { studies: CaseStudy[] }) {
  const [query, setQuery]         = useState('');
  const [industry, setIndustry]   = useState<string | null>(null);
  const [tech, setTech]           = useState<string | null>(null);

  const industries = useMemo(() => Array.from(new Set(studies.map(s => s.industry))), [studies]);
  const techs      = useMemo(() => Array.from(new Set(studies.flatMap(s => s.tech))).sort(), [studies]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return studies.filter(s => {
      if (industry && s.industry !== industry) return false;
      if (tech && !s.tech.includes(tech)) return false;
      if (term) {
        const haystack = `${s.name} ${s.overview} ${s.businessCategory} ${s.tech.join(' ')}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [studies, query, industry, tech]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-10">
        <div className="relative w-full md:max-w-xs">
          <Search aria-hidden className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text2" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            className="min-h-[44px] w-full rounded-btn border border-line bg-card pl-10 pr-4 text-sm text-text placeholder:text-text3 transition-shadow duration-base focus-visible:border-gold focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip label="All Industries" active={!industry} onClick={() => setIndustry(null)} />
          {industries.map(i => (
            <FilterChip key={i} label={i} active={industry === i} onClick={() => setIndustry(industry === i ? null : i)} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip label="All Technology" active={!tech} onClick={() => setTech(null)} />
          {techs.map(t => (
            <FilterChip key={t} label={t} active={tech === t} onClick={() => setTech(tech === t ? null : t)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <StateMessage title="No projects match those filters" description="Try a different industry or technology, or clear the search." />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(s => (
            <Link key={s.slug} href={`/projects/${s.slug}`} className="group block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
             <Card interactive className="h-full overflow-hidden">
              {/* Real product screenshot: dark frame is allowed in both themes */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
                <Image
                  src={s.images.hero}
                  alt={`${s.name} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain transition-transform duration-slow group-hover:scale-105 motion-reduce:transition-none"
                />
                <Badge className="absolute left-4 top-3 border-green-500/30 bg-green-500/15 text-xs uppercase tracking-wider text-green-600 backdrop-blur dark:text-green-400">Live</Badge>
              </div>
              <div className="p-7">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-text">{s.industry}</span>
                  <span aria-hidden className="text-xs text-text2">·</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-text2">{s.businessCategory}</span>
                </div>
                <h3 className="mb-2 font-display text-card-title text-text">{s.name}</h3>
                <p className="text-text2 text-sm mb-5 line-clamp-2">{s.overview}</p>
                <div className="flex items-center justify-between border-t border-line pt-4">
                  <span className="text-sm font-semibold text-gold-text">View Case Study</span>
                  <ArrowUpRight aria-hidden className="h-4 w-4 text-gold-text transition-transform duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </div>
              </div>
             </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'min-h-[44px] rounded-full border px-4 text-xs font-semibold transition-colors duration-base',
        'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
        active ? 'border-gold bg-gold text-[#080910]' : 'border-line bg-transparent text-text2 hover:border-gold hover:text-text',
      )}
    >
      {label}
    </button>
  );
}
