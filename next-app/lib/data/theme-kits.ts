// 10 premium dark + gold color kits, extracted from the design reference files
// at ~/Documents/templet/color-kits/*.html — one theme assigned per software demo.
export type ThemeKit = {
  name: string;
  bg: string;
  surface: string;
  surfaceTint: string;
  border: string;
  metal: [string, string, string];
  metalInk: string;
};

export const THEME_KITS: ThemeKit[] = [
  { name: 'Sapphire Blue', bg: '#050f1c', surface: '#0b1d33', surfaceTint: '#12294a', border: 'rgba(47,143,255,0.26)', metal: ['#bcdcff', '#2f8fff', '#0b4fa8'], metalInk: '#04122b' },
  { name: 'Amethyst Purple', bg: '#100a1c', surface: '#1c1030', surfaceTint: '#2a1846', border: 'rgba(168,85,247,0.26)', metal: ['#e6d1ff', '#a855f7', '#5b1fa0'], metalInk: '#180529' },
  { name: 'Ruby Red', bg: '#170608', surface: '#2b0d10', surfaceTint: '#3d1418', border: 'rgba(255,59,92,0.26)', metal: ['#ffd0d8', '#ff3b5c', '#99102a'], metalInk: '#2a0308' },
  { name: 'Amber Orange', bg: '#170d03', surface: '#2b1806', surfaceTint: '#3d220a', border: 'rgba(255,138,61,0.26)', metal: ['#ffe0bf', '#ff8a3d', '#a34c05'], metalInk: '#2b1400' },
  { name: 'Magenta Pink', bg: '#170310', surface: '#2b0a1e', surfaceTint: '#3d0f2a', border: 'rgba(255,63,164,0.26)', metal: ['#ffd3ee', '#ff3fa4', '#99155f'], metalInk: '#26051a' },
  { name: 'Cyan Aqua', bg: '#041515', surface: '#0a2626', surfaceTint: '#0f3535', border: 'rgba(34,229,229,0.26)', metal: ['#c8fbfb', '#22e5e5', '#0a8a8a'], metalInk: '#03191c' },
  { name: 'Emerald Teal', bg: '#041613', surface: '#0a2622', surfaceTint: '#0f342f', border: 'rgba(20,184,166,0.26)', metal: ['#c3f7ec', '#14b8a6', '#0a6b60'], metalInk: '#03211d' },
  { name: 'Electric Indigo', bg: '#0a0a1c', surface: '#141433', surfaceTint: '#1d1d49', border: 'rgba(99,102,241,0.26)', metal: ['#d6d6ff', '#6366f1', '#2f31a8'], metalInk: '#0a0a24' },
  { name: 'Chartreuse Lime', bg: '#0d1203', surface: '#1a2306', surfaceTint: '#263309', border: 'rgba(163,230,53,0.26)', metal: ['#ecffc2', '#a3e635', '#5c8214'], metalInk: '#131c02' },
  { name: 'Platinum Silver', bg: '#0c0d0f', surface: '#17191c', surfaceTint: '#22252a', border: 'rgba(207,214,220,0.26)', metal: ['#ffffff', '#cfd6dc', '#7c868f'], metalInk: '#101214' },
];

export const GOLD: [string, string, string] = ['#f5dea0', '#d9ac3c', '#b8860b'];
export const KIT_FOREGROUND = '#f3f6f5';
export const KIT_MUTED = '#9aa8a4';

// Order matches the enterprise/software slugs in lib/data/software.ts (excluding the
// 4 website-package products, which use their own light business-site preview instead).
const THEME_ORDER = [
  'crm', 'billing', 'erp', 'inventory', 'gps-tracking', 'school', 'hospital', 'construction', 'workshop', 'payroll',
  'attendance', 'ai-business', 'restaurant', 'hotel', 'real-estate',
];

export function themeForSlug(slug: string): ThemeKit {
  const i = THEME_ORDER.indexOf(slug);
  return THEME_KITS[(i < 0 ? 0 : i) % THEME_KITS.length];
}

const SLIDER_EFFECTS = ['fadeScale', 'slide', 'kenburns', 'wipe', 'blur'] as const;
const GALLERY_EFFECTS = ['stagger', 'masonry', 'mosaic', 'carousel', 'polaroid'] as const;

export function effectsForSlug(slug: string): { sliderEffect: typeof SLIDER_EFFECTS[number]; galleryEffect: typeof GALLERY_EFFECTS[number] } {
  const i = THEME_ORDER.indexOf(slug);
  const idx = i < 0 ? 0 : i;
  return {
    sliderEffect: SLIDER_EFFECTS[idx % SLIDER_EFFECTS.length],
    galleryEffect: GALLERY_EFFECTS[(idx + 2) % GALLERY_EFFECTS.length],
  };
}

export const metalGradient = (m: [string, string, string], deg = 135) => `linear-gradient(${deg}deg, ${m[0]} 0%, ${m[1]} 45%, ${m[2]} 100%)`;
export const goldGradient = (deg = 135) => metalGradient(GOLD, deg);
