import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner';
import { FloatingWidgets } from '@/components/widgets/FloatingWidgets';
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper';
import { JsonLd } from '@/components/shared/JsonLd';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { CookieConsent } from '@/components/widgets/CookieConsent';
import { getSiteSettings } from '@/lib/models/SiteSettings';
import { getActiveBanner } from '@/lib/models/Banner';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700','800','900'], variable: '--font-poppins' });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlsolutions.in';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const title = settings?.metaTitle || 'KVL Business Solutions — India\'s Next-Generation Business Technology';
  const desc = settings?.metaDescription || 'Advanced Software, Industrial Solutions, GPS Systems & Modern Business Technology under one powerful platform.';

  return {
    metadataBase: new URL(SITE),
    title: { default: title, template: `%s · ${settings?.brandName || 'KVL Business Solutions'}` },
    description: desc,
    keywords: ['ERP', 'GPS Tracking', 'Software', 'Industrial Automation', 'India', 'Civil Engineering', 'CCTV', 'Business Software'],
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
    description: settings?.tagline || 'India\'s next-generation business solutions company.',
    email: settings?.email || 'info@kvlsolutions.in',
    telephone: settings?.phone || '+919942000413',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.addressLine1 || 'Pune',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    sameAs: [
      settings?.social?.facebook,
      settings?.social?.linkedin,
      settings?.social?.twitter,
      settings?.social?.instagram,
      settings?.social?.youtube,
    ].filter(Boolean),
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: settings?.phone || '+91-90000-00000',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    }],
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

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd} id="org-jsonld" />
        <JsonLd data={websiteJsonLd} id="website-jsonld" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Suspense fallback={null}>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          </Suspense>
        )}
        <SessionProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <AnnouncementBanner banner={banner} />
            <Header />
            <main>{children}</main>
            <Footer settings={settings} />
            <FloatingWidgets />
            {settings?.features?.cookieConsent !== false && <CookieConsent />}
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
