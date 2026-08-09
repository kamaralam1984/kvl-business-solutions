import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Frequently Asked Questions';
const description = 'Answers to common questions about KVL Business Solutions — pricing, deployment, support, GST invoicing, and our enterprise software and services.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/faq` },
  openGraph: { title, description, url: `${SITE}/faq`, type: 'website', images: [{ url: `/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: title }] },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
