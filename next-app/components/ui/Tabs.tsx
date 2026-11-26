'use client';
import { useId, useRef, useState } from 'react';
import { cn } from './cn';

export type TabItem = { id: string; label: string; content: React.ReactNode };

// WAI-ARIA tabs: roving tabindex, Arrow/Home/End keys, horizontally scrollable on mobile.
export function Tabs({ items, defaultId, className }: { items: TabItem[]; defaultId?: string; className?: string }) {
  const uid = useId();
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (i: number) => {
    const n = items[(i + items.length) % items.length];
    setActive(n.id);
    refs.current[n.id]?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(items.length - 1); }
  };

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 overflow-x-auto rounded-full border border-line bg-card p-1 [scrollbar-width:none]">
        {items.map((t, i) => (
          <button
            key={t.id}
            ref={el => { refs.current[t.id] = el; }}
            role="tab"
            id={`${uid}-t-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`${uid}-p-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={e => onKey(e, i)}
            className={cn(
              'min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold transition-colors duration-base',
              'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
              active === t.id ? 'bg-gold text-[#080910]' : 'text-text2 hover:text-text',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map(t => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${uid}-p-${t.id}`}
          aria-labelledby={`${uid}-t-${t.id}`}
          hidden={active !== t.id}
          tabIndex={0}
          className="mt-5 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] rounded-panel"
        >
          {active === t.id && t.content}
        </div>
      ))}
    </div>
  );
}
