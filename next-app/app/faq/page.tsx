'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { JsonLd } from '@/components/shared/JsonLd';

const faqs = [
  {
    cat: 'General',
    items: [
      { q: 'What does KVL offer?', a: 'KVL provides 15 enterprise software products, custom development, GPS tracking, CCTV, civil work, and industrial automation services across India.' },
      { q: 'Where are you located?', a: 'Our HQ is in Patna, Bihar, India. We serve clients across India and overseas.' },
      { q: 'Do you serve small businesses?', a: 'Yes — we have plans starting from ₹15,000 designed for small and mid-sized businesses.' },
      { q: 'Will you sign an NDA before discussing our project?', a: 'Yes — an NDA is available on request before we go into any project detail. Just ask on your first call.' },
    ],
  },
  {
    cat: 'Pricing & Payments',
    items: [
      { q: 'How do I pay?', a: 'We accept Razorpay (UPI, cards, netbanking, wallets) for online purchases. Bank transfer is also supported for enterprise orders.' },
      { q: 'Do you provide GST invoice?', a: 'Yes — every paid order generates a GST-compliant invoice (18%) downloadable from your dashboard.' },
      { q: 'Can I get a custom quote?', a: 'Absolutely. Use our /contact page or the floating quote widget.' },
    ],
  },
  {
    cat: 'Software & Licenses',
    items: [
      { q: 'Cloud or on-premise?', a: 'Most products support both. Cloud is faster to deploy; on-premise gives you full control.' },
      { q: 'How long does installation take?', a: 'Cloud: under 24 hours. On-premise: 2–5 business days depending on complexity.' },
      { q: 'Is training included?', a: 'Yes — every license includes 2 hours of free online training plus video documentation.' },
    ],
  },
  {
    cat: 'Support',
    items: [
      { q: 'How do I get support?', a: 'Email support@kvlbusinesssolutions.com, raise a ticket from /support, or use the chatbot. We respond within 4 business hours.' },
      { q: 'What is your SLA?', a: 'Critical issues: 1 hour. High: 4 hours. Medium: 1 day. Low: 3 days.' },
    ],
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap(group => group.items).map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} id="faq-jsonld" />
      <PageHero eyebrow="HELP CENTER" title="Frequently Asked" accent="Questions" description="Quick answers to common questions about KVL products and services." breadcrumb="FAQ" />
      <section className="section">
        <div className="container max-w-3xl space-y-8">
          {faqs.map(group => (
            <div key={group.cat}>
              <h2 className="text-xl font-extrabold flex items-center gap-2 mb-3"><HelpCircle className="w-5 h-5 text-primary" /> {group.cat}</h2>
              <div className="space-y-2">
                {group.items.map(item => <Item key={item.q} q={item.q} a={item.a} />)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <CtaBanner title="Still have questions?" desc="Need Similar Software? Book a free strategy call and talk it through with a solution architect." />
    </>
  );
}

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-base overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-4 flex justify-between items-center hover:bg-primary/5 transition-all">
        <span className="font-semibold text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 text-sm text-text2 border-t border-tint pt-3">{a}</div>}
    </div>
  );
}
