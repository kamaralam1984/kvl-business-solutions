import type { Metadata } from 'next';

// The root layout's WebSite JSON-LD advertises this path as a SearchAction
// target — but per-query results have no unique indexable content, so it
// should never itself be crawled/indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
