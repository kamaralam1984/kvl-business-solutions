import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/widgets/FloatingWidgets';
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper';
import { JsonLd } from '@/components/shared/JsonLd';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700','800','900'], variable: '--font-poppins' });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlsolutions.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'KVL Business Solutions — India\'s Next-Generation Business Technology',
    template: '%s · KVL Business Solutions',
  },
  description: 'Advanced Software, Industrial Solutions, GPS Systems & Modern Business Technology under one powerful platform.',
  keywords: ['ERP', 'GPS Tracking', 'Software', 'Industrial Automation', 'India', 'Civil Engineering', 'CCTV', 'Business Software'],
  authors: [{ name: 'KVL Business Solutions' }],
  creator: 'KVL Business Solutions',
  publisher: 'KVL Business Solutions',
  applicationName: 'KVL',
  generator: 'Next.js',
  formatDetection: { telephone: true, email: true, address: true },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE,
    siteName: 'KVL Business Solutions',
    title: 'KVL Business Solutions — Enterprise Software, GPS, Automation',
    description: '12+ ready-to-deploy software products, GPS tracking, custom development. 1000+ businesses trust KVL.',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'KVL Business Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KVL Business Solutions',
    description: 'India\'s next-gen business technology platform.',
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: SITE },
  category: 'business',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'KVL Business Solutions',
  alternateName: 'KVL',
  url: SITE,
  logo: `${SITE}/og`,
  description: 'India\'s next-generation business solutions company — enterprise software, GPS tracking, civil work, industrial automation, and CCTV/security.',
  email: 'info@kvlsolutions.in',
  telephone: '+919000000000',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://facebook.com/kvlsolutions',
    'https://linkedin.com/company/kvlsolutions',
    'https://twitter.com/kvlsolutions',
  ],
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+91-90000-00000',
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
  name: 'KVL Business Solutions',
  publisher: { '@id': `${SITE}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd} id="org-jsonld" />
        <JsonLd data={websiteJsonLd} id="website-jsonld" />
        <SessionProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Header />
            <main>{children}</main>
            <Footer />
            <FloatingWidgets />
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
