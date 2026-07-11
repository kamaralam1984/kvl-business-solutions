import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about KVL Business Solutions — pricing, deployment, support, GST invoicing, and our enterprise software and services.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
