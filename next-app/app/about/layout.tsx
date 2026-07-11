import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'About Us — Enterprise Software & Digital Transformation Partner';
const description = 'KVL Business Solutions is a full-stack enterprise technology partner delivering custom software, ERP, CRM, AI automation and infrastructure for businesses across India. ISO 27001 certified, founded 2019.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/about` },
  openGraph: { title, description, url: `${SITE}/about`, type: 'website' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
