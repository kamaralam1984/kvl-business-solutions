import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Voice Assistant Demo — Intelligent Voice Automation',
  description: "Experience KVL's AI voice technology live — see how intelligent voice automation can handle customer calls, bookings and support for your business.",
};

export default function VoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
