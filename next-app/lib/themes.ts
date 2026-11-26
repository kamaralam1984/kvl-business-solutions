// Single source of truth for the site-wide themes. The CSS lives in app/themes.css
// (scoped to html[data-theme="<id>"]); the picker is components/studio/DesignSwitcher.tsx;
// the inline script in app/layout.tsx applies the saved choice before first paint.
export type ThemeId =
  | 'studio' | 'classic' | 'aurora' | 'brutal' | 'glass' | 'bento' | 'editorial' | 'terminal' | 'earth' | 'mesh';

export interface ThemeDef {
  id: ThemeId;
  label: string;
  note: string;
  /** 'both' = the light/dark toggle still works; otherwise the theme locks that tone. */
  tone: 'both' | 'light' | 'dark';
  /** 3 swatches for the picker: background, surface, accent */
  swatch: [string, string, string];
}

export const THEMES: ThemeDef[] = [
  { id: 'studio',    label: 'Studio',          note: 'Rose-maroon & gold',      tone: 'both',  swatch: ['#7d2040', '#a0385c', '#d4af37'] },
  { id: 'classic',   label: 'Classic',         note: 'Warm cream & gold',       tone: 'both',  swatch: ['#faf7f1', '#ffffff', '#c8a870'] },
  { id: 'aurora',    label: 'Midnight Aurora', note: 'Dark glow, neon gradient', tone: 'dark',  swatch: ['#070816', '#12142c', '#8b6cff'] },
  { id: 'brutal',    label: 'Brutalist Mono',  note: 'Bold blocks, hard shadow', tone: 'light', swatch: ['#fff8e1', '#ffffff', '#ffd60a'] },
  { id: 'glass',     label: 'Soft Glass',      note: 'Frosted cards, pastel',   tone: 'light', swatch: ['#e9eeff', '#f6f3ff', '#6366f1'] },
  { id: 'bento',     label: 'Bento Light',     note: 'Clean boxes, blue accent', tone: 'light', swatch: ['#f5f5f7', '#ffffff', '#0071e3'] },
  { id: 'editorial', label: 'Neo-Editorial',   note: 'Magazine serif, vermilion', tone: 'light', swatch: ['#f4f1ea', '#ffffff', '#d94824'] },
  { id: 'terminal',  label: 'Cyber Terminal',  note: 'Mono code, green on black', tone: 'dark',  swatch: ['#050a06', '#0a120c', '#39ff6e'] },
  { id: 'earth',     label: 'Warm Earth',      note: 'Terracotta & olive',      tone: 'light', swatch: ['#f5ede0', '#fcf7ee', '#c1623e'] },
  { id: 'mesh',      label: 'Gradient Pop',    note: 'Playful pink-orange mesh', tone: 'light', swatch: ['#fff4fa', '#ffffff', '#ff4d8d'] },
];

export const THEME_IDS = THEMES.map(t => t.id);
export const DEFAULT_THEME: ThemeId = 'studio';
export const themeById = (id: string) => THEMES.find(t => t.id === id) ?? THEMES[0];
