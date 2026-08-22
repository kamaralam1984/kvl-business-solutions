import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

// Same fix as app/login/layout.tsx — client component, was silently
// inheriting the root layout's homepage canonical instead of its own.
export const metadata: Metadata = {
  title: 'Create Account',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE}/register` },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
