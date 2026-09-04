'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ArrowUpRight } from 'lucide-react';

export function StateFinder({ locations }: { locations: { name: string; slug: string }[] }) {
  const [q, setQ] = useState('');
  if (locations.length === 0) return null;

  const filtered = q
    ? locations.filter(l => l.name.toLowerCase().includes(q.toLowerCase()))
    : locations;

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <span className="eyebrow">Coverage Across India</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">Find Our Services in Your State</h2>
          <p className="text-text2 text-[14.5px] leading-[1.7]">
            We build ERP, CRM, and custom software for businesses across every Indian state and union territory.
          </p>
        </div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text2" />
          <input
            className="form-control w-full pl-10"
            placeholder="Search your state or UT…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center max-w-4xl mx-auto">
          {filtered.map(l => (
            <Link
              key={l.slug}
              href={`/india/${l.slug}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-all hover:scale-[1.03]"
              style={{ background: 'rgba(200,168,112,0.08)', color: '#a3814f', border: '1px solid rgba(200,168,112,0.2)' }}
            >
              <MapPin className="w-3 h-3" /> {l.name}
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="text-text2 text-sm">No matching state or UT — try a different search.</p>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/india" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            View all India locations <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
