import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading, Accordion } from '@/components/ui';

// A representative subset of the full FAQ at /faq — same real answers, not new claims.
const FAQS = [
  { q: 'What does KVL offer?', a: 'We provide 15 enterprise software products, custom development, GPS tracking, CCTV, civil work, and industrial automation services across India.' },
  { q: 'Do you serve small businesses?', a: 'Yes — we have plans designed for small and mid-sized businesses. Get in touch and we\'ll recommend the right fit.' },
  { q: 'Will you sign an NDA before discussing our project?', a: 'Yes — an NDA is available on request before we go into any project detail. Just ask on your first call.' },
  { q: 'Cloud or on-premise?', a: 'Most products support both. Cloud is faster to deploy; on-premise gives you full control.' },
  { q: 'Is training included?', a: 'Yes — every license includes 2 hours of free online training plus video documentation.' },
  { q: 'What is your SLA?', a: 'Critical issues: 1 hour. High: 4 hours. Medium: 1 day. Low: 3 days.' },
];

export function HomeFAQ() {
  return (
    <section className="bg-bg py-[var(--section-y)]">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Common Questions"
            title={<>Before you ask, <span className="text-gold-text">here&apos;s what most people want to know.</span></>}
          />
          <Link href="/faq" className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-btn font-semibold text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
            See all FAQs <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <Accordion items={FAQS.map((f, i) => ({ id: `faq-${i}`, question: f.q, answer: f.a }))} />
      </div>
    </section>
  );
}
