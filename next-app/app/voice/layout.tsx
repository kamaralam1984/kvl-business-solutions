import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'AI Voice Assistant Demo — Intelligent Voice Automation';
const description = "Experience KVL's AI voice technology live — see how intelligent voice automation can handle customer calls, bookings and support for your business.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/voice` },
  openGraph: { title, description, url: `${SITE}/voice`, type: 'website', images: [{ url: `/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: title }] },
};

export default function VoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
