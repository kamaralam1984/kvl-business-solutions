'use client';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Palette, Check } from 'lucide-react';
import { THEMES, themeById, DEFAULT_THEME, type ThemeId } from '@/lib/themes';

const KEY = 'kvl-theme';
const PREF = 'kvl-tone-pref';

// 'classic' | 'studio' structure flag (kept for components that only care about the base skin)
export function readDesign(): 'classic' | 'studio' {
  return typeof document !== 'undefined' && document.documentElement.getAttribute('data-design') === 'studio' ? 'studio' : 'classic';
}
export function readTheme(): ThemeId {
  return ((typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || DEFAULT_THEME) as ThemeId;
}

// Header theme picker: applies a whole-site theme instantly (attributes on <html>, CSS does the rest),
// remembers it in localStorage and keeps next-themes' light/dark in step for themes that lock a tone.
export function DesignSwitcher() {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const { setTheme: setTone } = useTheme();

  useEffect(() => {
    setThemeState(readTheme());
    setMounted(true);
    const sync = () => setThemeState(readTheme());
    window.addEventListener('kvl:design', sync);
    return () => window.removeEventListener('kvl:design', sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  if (!mounted) return <div className="h-10 w-10" />;

  const pick = (id: ThemeId) => {
    const def = themeById(id);
    const root = document.documentElement;
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', id);
    root.setAttribute('data-design', id === 'studio' ? 'studio' : 'classic');
    if (id === 'classic') root.removeAttribute('data-fx'); else root.setAttribute('data-fx', '1');
    try {
      localStorage.setItem(KEY, id);
      if (def.tone !== 'both') {
        if (!localStorage.getItem(PREF)) localStorage.setItem(PREF, localStorage.getItem('theme') || 'system');
        root.setAttribute('data-tone-lock', def.tone);
        setTone(def.tone);
      } else {
        root.removeAttribute('data-tone-lock');
        const pref = localStorage.getItem(PREF);
        if (pref) { localStorage.removeItem(PREF); setTone(pref); }
      }
    } catch { /* storage blocked: still switches for this visit */ }
    setThemeState(id);
    window.dispatchEvent(new Event('kvl:design'));
    window.setTimeout(() => root.classList.remove('theme-switching'), 700);
    setOpen(false);
  };

  const current = themeById(theme);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Change site theme (current: ${current.label})`}
        title={`Theme: ${current.label}`}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-text transition-[transform,box-shadow] duration-base ease-brand hover:-translate-y-px hover:shadow-soft-1 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
      >
        <Palette className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <div role="menu" aria-label="Site themes" className="theme-pop absolute right-0 top-12 z-[300] w-[min(92vw,21rem)] rounded-[18px] border border-line p-2 shadow-soft-3" style={{ background: `rgb(var(--footer))` }}>
          <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">Choose a theme</p>
          <ul className="grid max-h-[70vh] gap-1 overflow-y-auto">
            {THEMES.map(t => (
              <li key={t.id}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={t.id === theme}
                  onClick={() => pick(t.id)}
                  className={`flex w-full items-center gap-3 rounded-btn px-2 py-2 text-left transition-colors hover:bg-text/10 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] ${t.id === theme ? 'bg-text/10' : ''}`}
                >
                  <span aria-hidden className="flex h-9 w-14 shrink-0 overflow-hidden rounded-md border border-line">
                    <i className="flex-1" style={{ background: t.swatch[0] }} />
                    <i className="flex-1" style={{ background: t.swatch[1] }} />
                    <i className="flex-1" style={{ background: t.swatch[2] }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-text">{t.label}</span>
                    <span className="block truncate text-xs text-text2">{t.note}</span>
                  </span>
                  {t.id === theme && <Check className="h-4 w-4 shrink-0 text-gold-text" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
