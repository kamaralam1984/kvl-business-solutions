import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

// /login is a client component (can't export its own metadata), so it was
// silently inheriting the root layout's canonical — which points at the
// homepage, telling crawlers this page IS the homepage. Transactional page,
// no content to rank on — noindex plus its own correct canonical.
export const metadata: Metadata = {
  title: 'Log In',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE}/login` },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
