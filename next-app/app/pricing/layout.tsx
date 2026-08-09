import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Pricing — Transparent, Fixed-Price Enterprise Software Plans';
const description = 'Clear, upfront pricing for enterprise software, ERP, CRM and automation solutions. No hidden costs, a 30-day money-back guarantee, and lifetime support on every plan.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/pricing` },
  openGraph: { title, description, url: `${SITE}/pricing`, type: 'website', images: [{ url: `/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: title }] },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
