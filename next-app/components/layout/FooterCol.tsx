'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui';

// Accordion on mobile, plain always-open list from lg up. Links stay in the
// DOM when collapsed (display:none only) so the markup is identical for crawlers.
export function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line lg:border-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          className="flex min-h-[44px] w-full items-center justify-between rounded-btn py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] lg:pointer-events-none lg:py-0 lg:pb-4"
        >
          {title}
          <ChevronDown className={cn('h-4 w-4 text-gold-text transition-transform duration-base lg:hidden', open && 'rotate-180')} aria-hidden />
        </button>
      </h3>
      <ul className={cn('pb-4 lg:block lg:pb-0', open ? 'block' : 'hidden')}>
        {links.map(l => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="inline-flex min-h-[44px] items-center rounded-btn text-sm text-text2 lg:min-h-[36px] transition-colors duration-base hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
