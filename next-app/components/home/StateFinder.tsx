'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { SectionHeading, Card, Input } from '@/components/ui';

export function StateFinder({ locations }: { locations: { name: string; slug: string }[] }) {
  const [q, setQ] = useState('');
  if (locations.length === 0) return null;

  const filtered = q ? locations.filter(l => l.name.toLowerCase().includes(q.toLowerCase())) : locations;

  return (
    <section className="bg-bg py-[var(--section-y)]">
      <div className="container">
        <Card className="p-7 sm:p-10">
          <SectionHeading
            align="center"
            eyebrow="Coverage Across India"
            title="Find Our Services in Your State"
            description="We build ERP, CRM, and custom software for businesses across every Indian state and union territory."
          />
          <div className="mx-auto mt-8 max-w-md">
            <Input aria-label="Search your state or UT" placeholder="Search your state or UT…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5">
            {filtered.map(l => (
              <Link
                key={l.slug}
                href={`/india/${l.slug}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line bg-bg px-4 text-sm font-medium text-gold-text transition-colors duration-base hover:border-gold focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {l.name}
              </Link>
            ))}
            {filtered.length === 0 && <p className="text-sm text-text2">No matching state or UT — try a different search.</p>}
          </div>
          <div className="mt-8 text-center">
            <Link href="/india" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-btn font-semibold text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
              View all India locations <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
