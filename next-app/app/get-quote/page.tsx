import { GetQuoteClient } from './GetQuoteClient';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Professional Website Design | Get Your Free Quote';
const description = 'A professional website design, built for you. Share your details and get a free quote in minutes.';

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
