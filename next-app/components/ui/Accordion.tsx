'use client';
import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './cn';

export type AccordionItem = { id: string; question: string; answer: React.ReactNode };

// Smooth height animation via grid-template-rows (no layout-property JS).
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const uid = useId();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map(it => {
        const isOpen = open === it.id;
        return (
          <div key={it.id}>
            <h3>
              <button
                id={`${uid}-b-${it.id}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-r-${it.id}`}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex w-full min-h-[44px] items-center justify-between gap-4 py-4 text-left font-display text-base font-semibold text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] rounded-btn"
              >
                {it.question}
                <ChevronDown className={cn('h-5 w-5 shrink-0 text-gold-text transition-transform duration-base', isOpen && 'rotate-180')} aria-hidden />
              </button>
            </h3>
            <div
              id={`${uid}-r-${it.id}`}
              role="region"
              aria-labelledby={`${uid}-b-${it.id}`}
              className={cn('grid transition-[grid-template-rows,opacity] duration-slow ease-brand', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
            >
              <div className="overflow-hidden"><div className="pb-5 text-text2">{it.answer}</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
