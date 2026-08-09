import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Leave a Review — KVL Business Solutions';
const description = 'Worked with KVL Business Solutions? Share your experience — real testimonials from real clients, no login required.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/reviews` },
  openGraph: { title, description, url: `${SITE}/reviews`, type: 'website', images: [{ url: `/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: title }] },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
