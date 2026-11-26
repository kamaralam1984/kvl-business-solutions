'use client';
import { useEffect, useState } from 'react';
import { Sparkles, LayoutTemplate } from 'lucide-react';

type Design = 'classic' | 'studio';
const KEY = 'kvl-design';

export function readDesign(): Design {
  return typeof document !== 'undefined' && document.documentElement.getAttribute('data-design') === 'studio' ? 'studio' : 'classic';
}

// Switches the whole site between the "Classic" design and the "Studio" remix at any time.
// The choice is remembered (localStorage) and applied before first paint by an inline script.
export function DesignSwitcher() {
  const [design, setDesign] = useState<Design>('classic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDesign(readDesign());
    setMounted(true);
    const sync = () => setDesign(readDesign());
    window.addEventListener('kvl:design', sync);
    return () => window.removeEventListener('kvl:design', sync);
  }, []);

  if (!mounted) return <div className="h-10 w-10" />;

  const next: Design = design === 'studio' ? 'classic' : 'studio';
  const toggle = () => {
    document.documentElement.setAttribute('data-design', next);
    try { localStorage.setItem(KEY, next); } catch { /* storage blocked: still switches for this visit */ }
    setDesign(next);
    window.dispatchEvent(new Event('kvl:design'));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={design === 'studio'}
      aria-label={design === 'studio' ? 'Switch to the classic design' : 'Switch to the studio design'}
      title={design === 'studio' ? 'Design: Studio — click for Classic' : 'Design: Classic — click for Studio'}
      className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-text transition-[transform,box-shadow] duration-base ease-brand hover:-translate-y-px hover:shadow-soft-1 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      {design === 'studio' ? <LayoutTemplate className="h-4 w-4" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
    </button>
  );
}
