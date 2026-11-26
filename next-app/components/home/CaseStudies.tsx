'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading, Card, Badge, cn } from '@/components/ui';
import type { CaseStudy } from '@/lib/data/case-studies';

// First segment of "AI SaaS · Sales & Revenue CRM" → "AI SaaS", used as the filter tab.
const categoryOf = (c: CaseStudy) => c.businessCategory.split('·')[0].trim().replace(/ Management Platform$/, '');

// Fetched server-side (app/page.tsx) so admin edits show up here. Every live
// project is shown, not a curated subset.
export function CaseStudies({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [filter, setFilter] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(caseStudies.map(categoryOf)))], [caseStudies]);
  const shown = filter === 'All' ? caseStudies : caseStudies.filter(c => categoryOf(c) === filter);

  return (
    <section className="bg-bg py-[var(--section-y)]">
      <div className="container">
        <SectionHeading
          eyebrow="Live Products, Not Mockups"
          title={<>Real products. Real users. <span className="text-gold-text">Verifiable today, not case studies we wrote ourselves.</span></>}
        />

        <div role="group" aria-label="Filter by category" className="mt-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {categories.map(cat => (
            <button
              key={cat}
              aria-pressed={filter === cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'min-h-[44px] shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors duration-base focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
                filter === cat ? 'border-gold bg-gold text-[#080910]' : 'border-line bg-card text-text2 hover:text-text',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento: first two cards are wide, the rest sit three across */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {shown.map((c, i) => (
            <Card
              key={c.slug}
              interactive
              className={cn('group flex flex-col overflow-hidden', i < 2 ? 'lg:col-span-3' : 'lg:col-span-2')}
            >
              <Link href={`/projects/${c.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-[#0a0a0a] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                <Image
                  src={c.images.hero}
                  alt={`${c.name} — live project built by KVL Business Solutions`}
                  fill
                  sizes={i < 2 ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw'}
                  className="object-cover object-top transition-transform duration-slow ease-brand group-hover:scale-[1.03]"
                />
              </Link>
              <div className="flex flex-1 items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-card-title text-text">{c.name}</h3>
                  <Badge className="mt-2">{categoryOf(c)}</Badge>
                </div>
                <Link
                  href={`/projects/${c.slug}`}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-btn text-sm font-semibold text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                >
                  View Case Study <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
