import { GetQuoteClient } from './GetQuoteClient';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Independence Day Offer — Website at ₹999 | Get Your Free Quote';
const description = 'Independence Day special: a professional website starting at ₹999. Share your details and get a free quote in minutes — offer valid till 15 August.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/get-quote` },
  robots: { index: false, follow: false },
  openGraph: { title, description, url: `${SITE}/get-quote`, type: 'website' },
};

export default function GetQuotePage() {
  return <GetQuoteClient />;
}
