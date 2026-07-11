import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Transparent, Fixed-Price Enterprise Software Plans',
  description: 'Clear, upfront pricing for enterprise software, ERP, CRM and automation solutions. No hidden costs, a 30-day money-back guarantee, and lifetime support on every plan.',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
