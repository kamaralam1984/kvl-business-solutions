import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Support — Talk to Our Team',
  description: "Get help from KVL Business Solutions via WhatsApp, phone, email or our AI assistant. Raise a support ticket and hear back within 1 hour during business hours.",
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
