import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'AI Mock Interview Practice — Free Interview Preparation Tool';
const description = "Practice job interviews with KVL's AI-powered mock interview tool — realistic questions and instant feedback, free to use while you prepare for your next role.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/mock-interview` },
  openGraph: { title, description, url: `${SITE}/mock-interview`, type: 'website', images: [{ url: `/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: title }] },
};

export default function MockInterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
