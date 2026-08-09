import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Customer Support — Talk to Our Team';
const description = "Get help from KVL Business Solutions via WhatsApp, phone, email or our AI assistant. Raise a support ticket and hear back within 1 hour during business hours.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/support` },
  openGraph: { title, description, url: `${SITE}/support`, type: 'website', images: [{ url: `/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: title }] },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
