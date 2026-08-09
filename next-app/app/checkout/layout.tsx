import type { Metadata } from 'next';

// Covers both /checkout and /checkout/success (nested route) — transactional
// pages with no unique content to rank on; robots.txt already disallows
// crawling them, this is the authoritative noindex signal for anything
// already linked/indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
