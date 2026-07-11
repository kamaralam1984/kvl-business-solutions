'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/data/case-studies';

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
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm card-base focus:outline-none"
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
        <p className="text-center text-text2 py-16">No projects match those filters.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(s => (
            <Link key={s.slug} href={`/projects/${s.slug}`} className="card-premium overflow-hidden group block">
              <div className="relative overflow-hidden" style={{ height: 200 }}>
                <Image
                  src={s.images.hero}
                  alt={`${s.name} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-4 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.3)', backdropFilter: 'blur(6px)' }}>
                  Live
                </span>
              </div>
              <div className="p-7">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#a3814f' }}>{s.industry}</span>
                  <span className="text-[10px] text-text2">·</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-text2">{s.businessCategory}</span>
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{s.name}</h3>
                <p className="text-text2 text-sm mb-5 line-clamp-2">{s.overview}</p>
                <div className="flex items-center justify-between pt-4 border-t border-tint">
                  <span className="text-[13px] font-semibold" style={{ color: '#c8a870' }}>View Case Study</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" style={{ color: '#c8a870' }} />
                </div>
              </div>
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
      onClick={onClick}
      className="text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors duration-200"
      style={active
        ? { background: '#c8a870', borderColor: '#c8a870', color: '#0a0a0a' }
        : { background: 'transparent', borderColor: 'rgba(var(--border) / 0.15)', color: 'rgb(var(--text-2))' }}
    >
      {label}
    </button>
  );
}
