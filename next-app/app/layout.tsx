import type { Metadata } from 'next';
import { Inter, Poppins, Bricolage_Grotesque, JetBrains_Mono, Cinzel, Space_Grotesk, Space_Mono, Plus_Jakarta_Sans, Fraunces, DM_Sans, DM_Serif_Display, Outfit } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { BootLoader } from '@/components/widgets/BootLoader';
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper';
import { JsonLd } from '@/components/shared/JsonLd';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { LinkedInInsight } from '@/components/analytics/LinkedInInsight';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';
import { GoogleAdsConversion } from '@/components/analytics/GoogleAdsConversion';
import { ScrollDepthTracker } from '@/components/analytics/ScrollDepthTracker';
import { getSiteSettings } from '@/lib/models/SiteSettings';
import { getActiveBanner } from '@/lib/models/Banner';
import { services } from '@/lib/data/services';
import { Suspense } from 'react';
import { StudioFX } from '@/components/studio/StudioFX';
import './globals.css';
import './themes.css';
import { THEME_IDS, THEMES } from '@/lib/themes';

function menuStyleScript(m?: { rotate?: boolean; enabled?: number[]; locked?: number }) {
  const enabled = (Array.isArray(m?.enabled) ? m!.enabled! : [1, 2, 3, 4]).filter(n => [1, 2, 3, 4].includes(n));
  const cfg = { r: m?.rotate !== false, e: enabled.length ? enabled : [1], l: [1, 2, 3, 4].includes(m?.locked ?? 0) ? m!.locked : 0 };
  return `(function(){var c=${JSON.stringify(cfg)},s=1;try{if(c.l){s=c.l}else if(!c.r){s=c.e[0]}else{var ss=+sessionStorage.getItem('kvl-menu-style');if(ss&&c.e.indexOf(ss)>-1){s=ss}else{var last=+localStorage.getItem('kvl-menu-last')||0;var p=c.e.filter(function(n){return n!==last});if(!p.length)p=c.e;s=p[Math.floor(Math.random()*p.length)];localStorage.setItem('kvl-menu-last',s);sessionStorage.setItem('kvl-menu-style',s)}}}catch(e){s=c.l||1}document.documentElement.setAttribute('data-menu-style',s)})();`;
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// Only 700/800/900 are ever paired with font-display site-wide (verified by
// grep across every file using the Tailwind utility, including @apply in
// globals.css's .heading-xl) — the other three weights were dead payload.
const poppins = Poppins({ subsets: ['latin'], weight: ['600','700','800','900'], variable: '--font-poppins', display: 'swap' });

// "Studio" design skin fonts. Not preloaded: the browser only downloads them when the
// Studio skin is active (the classic design never references these families).
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap', preload: false });
// Fonts for the extra themes (not preloaded; only fetched when a theme actually uses them).
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-spacegrotesk', display: 'swap', preload: false });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400','700'], variable: '--font-spacemono', display: 'swap', preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap', preload: false });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', preload: false });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dmsans', display: 'swap', preload: false });
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-dmserif', display: 'swap', preload: false });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap', preload: false });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['500','600','700'], variable: '--font-cinzel', display: 'swap', preload: false });
const jbmono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono', display: 'swap', preload: false });

// Picks the theme (studio is the default) before first paint. ?theme=<id> (or legacy ?design=) is a shareable
// link and is remembered. Themes that lock a tone (dark/light) also set next-themes' "theme" key so no flash.
// Same HTML for every visitor.
const themeScript = `(function(){var T=${JSON.stringify(THEME_IDS)},L=${JSON.stringify(Object.fromEntries(THEMES.filter(t => t.tone !== 'both').map(t => [t.id, t.tone])))},t='studio';try{var q=new URLSearchParams(location.search),p=q.get('theme')||q.get('design'),v=localStorage.getItem('kvl-theme')||localStorage.getItem('kvl-design');if(p&&T.indexOf(p)>-1){v=p;localStorage.setItem('kvl-theme',p)}if(v&&T.indexOf(v)>-1)t=v;if(L[t]){if(!localStorage.getItem('kvl-tone-pref'))localStorage.setItem('kvl-tone-pref',localStorage.getItem('theme')||'system');localStorage.setItem('theme',L[t]);document.documentElement.classList.toggle('dark',L[t]==='dark')}}catch(e){}var h=document.documentElement;h.setAttribute('data-theme',t);h.setAttribute('data-design',t==='studio'?'studio':'classic');if(t!=='classic')h.setAttribute('data-fx','1');if(L[t])h.setAttribute('data-tone-lock',L[t])})();`;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

// Without this, every page that Next.js can statically optimize (no page-level
// dynamic API used) gets prerendered ONCE at `next build` time and then served
// as frozen HTML forever after — a live edit in Admin > Site Settings (hero
// copy, banners, feature toggles, maintenance mode, anything read via
// getSiteSettings()/getActiveBanner() here or in a page under this layout)
// would silently never take effect until the next deploy. This makes the
// whole app revalidate in the background at most every 30s, matching the
// "✓ Saved — live in 30 seconds" promise already shown in the admin UI.
// Routes that already force their own dynamic rendering (session-gated
// pages, admin, etc.) are unaffected — a dynamic API call always wins.
export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const title = settings?.metaTitle || 'KVL Business Solutions — Enterprise Software, ERP, CRM & AI Automation';
  const desc = settings?.metaDescription || 'Custom software, ERP, CRM, and AI automation built for hospitals, schools, factories, and government offices across India. MSME registered, NDA on request.';

  return {
    metadataBase: new URL(SITE),
    title: { default: title, template: `%s · ${settings?.brandName || 'KVL Business Solutions'}` },
    description: desc,
    keywords: [
      'enterprise software company India', 'custom software development', 'ERP software India',
      'CRM software', 'AI automation', 'digital transformation partner', 'GPS fleet tracking software',
      'school ERP software', 'hospital management system', 'industrial automation', 'business software India',
    ],
    authors: [{ name: settings?.brandName || 'KVL Business Solutions' }],
    applicationName: 'KVL',
    formatDetection: { telephone: true, email: true, address: true },
    manifest: '/site.webmanifest',
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: SITE,
      siteName: settings?.brandName || 'KVL Business Solutions',
      title,
      description: desc,
      images: [{ url: '/og', width: 1200, height: 630, alt: settings?.brandName || 'KVL Business Solutions' }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: ['/og'] },
    robots: {
      index: !settings?.maintenanceMode,
      follow: !settings?.maintenanceMode,
      googleBot: { index: !settings?.maintenanceMode, follow: !settings?.maintenanceMode, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    alternates: { canonical: SITE },
    category: 'business',
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);
  const banner = await getActiveBanner().catch(() => null);

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: settings?.brandName || 'KVL Business Solutions',
    alternateName: 'KVL',
    url: SITE,
    logo: `${SITE}/og`,
    description: settings?.tagline || 'Custom software, ERP, CRM, and AI automation for businesses that run on real systems.',
    foundingDate: '2015',
    email: settings?.email || 'info@kvlbusinesssolutions.com',
    telephone: settings?.phone || '+919942000413',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.addressLine1 || 'Sultanganj',
      addressLocality: 'Patna',
      addressRegion: 'Bihar',
      addressCountry: 'IN',
    },
    sameAs: [
      settings?.social?.facebook,
      settings?.social?.linkedin,
      settings?.social?.twitter,
      settings?.social?.instagram,
      settings?.social?.youtube,
      settings?.social?.github,
    ].filter(Boolean),
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: settings?.phone || '+91-90000-00000',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    }],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'MSME Registration' },
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: settings?.brandName || 'KVL Business Solutions',
    publisher: { '@id': `${SITE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'Service',
      position: i + 1,
      name: s.name,
      provider: { '@id': `${SITE}/#organization` },
      areaServed: 'IN',
    })),
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE}/#localbusiness`,
    name: settings?.brandName || 'KVL Business Solutions',
    image: `${SITE}/og`,
    url: SITE,
    telephone: settings?.phone || '+919942000413',
    email: settings?.email || 'info@kvlbusinesssolutions.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.addressLine1 || 'Sultanganj',
      addressLocality: 'Patna',
      addressRegion: 'Bihar',
      addressCountry: 'IN',
    },
    openingHours: settings?.businessHours || 'Mon-Sat 09:00-20:00',
    areaServed: 'IN',
    geo: { '@type': 'GeoCoordinates', latitude: 25.5941, longitude: 85.1376 },
    parentOrganization: { '@id': `${SITE}/#organization` },
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${bricolage.variable} ${jbmono.variable} ${cinzel.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${jakarta.variable} ${fraunces.variable} ${dmSans.variable} ${dmSerif.variable} ${outfit.variable}`}>
      <head>
        {/* Picks the header menu style before first paint (no flash / hydration mismatch).
            Config comes from admin settings and is identical for every visitor, so cached
            HTML stays identical; the random choice happens client-side in this script. */}
        <script dangerouslySetInnerHTML={{ __html: menuStyleScript(settings?.menuStyle) }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <StudioFX />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd} id="org-jsonld" />
        <JsonLd data={websiteJsonLd} id="website-jsonld" />
        <JsonLd data={servicesJsonLd} id="services-jsonld" />
        <JsonLd data={localBusinessJsonLd} id="localbusiness-jsonld" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Suspense fallback={null}>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          </Suspense>
        )}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        )}
        {process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID && (
          <LinkedInInsight partnerId={process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID} />
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <MicrosoftClarity clarityId={process.env.NEXT_PUBLIC_CLARITY_ID} />
        )}
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
          <GoogleAdsConversion adsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID} />
        )}
        <Suspense fallback={null}>
          <ScrollDepthTracker />
        </Suspense>
        <SessionProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <BootLoader />
            <SiteChrome settings={settings} banner={banner} cookieConsentEnabled={settings?.features?.cookieConsent !== false}>
              {children}
            </SiteChrome>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
