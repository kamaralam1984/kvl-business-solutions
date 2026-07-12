import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
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
import { getSiteSettings } from '@/lib/models/SiteSettings';
import { getActiveBanner } from '@/lib/models/Banner';
import { services } from '@/lib/data/services';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700','800','900'], variable: '--font-poppins', display: 'swap' });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const title = settings?.metaTitle || 'KVL Business Solutions — Enterprise Software, ERP, CRM & AI Automation';
  const desc = settings?.metaDescription || 'Custom software, ERP, CRM, and AI automation built for hospitals, schools, factories, and government offices across India. ISO 27001 certified.';

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
    foundingDate: '2019',
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
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'ISO 27001' },
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="pb-14 md:pb-0">
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
        <SessionProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
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
