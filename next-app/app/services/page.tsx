import { services } from '@/lib/data/services';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle2, Box,
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video, Network, Cloud, Brain,
  Megaphone, Palette, Users, Contact2, Webhook, Tag, Workflow,
} from 'lucide-react';
import { JsonLd } from '@/components/shared/JsonLd';
import { PageHero } from '@/components/shared/PageHero';
import { StudioServiceIndex } from '@/components/studio/StudioServiceIndex';
import { Accordion, Button, Card, Panel, Section, SectionHeading } from '@/components/ui';

// Every distinct `icon` value used across lib/data/services.ts, plus the
// fallback (Box) for an unrecognized name.
const ICON_MAP: Record<string, LucideIcon> = {
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video, Network, Cloud, Brain,
  Megaphone, Palette, Users, Contact2, Webhook, Tag, Workflow,
};

const processSteps = [
  { num: '01', title: 'Discovery Call', desc: 'A free 30-minute consultation to understand your business, your goals, and what the system actually needs to do.' },
  { num: '02', title: 'Custom Proposal', desc: 'A detailed proposal with scope, timeline and fixed pricing — agreed in writing before any work begins.' },
  { num: '03', title: 'Development', desc: 'Our in-house team builds your solution with weekly progress updates, so nothing is a surprise.' },
  { num: '04', title: 'Launch & Support', desc: 'Go live with full training, documentation and ongoing support — not a handover and goodbye.' },
];

const faqs = [
  { q: 'Do you offer custom combinations of services?', a: 'Yes — we bundle any mix of our services under one team and one point of contact. Most clients combine software, website and digital marketing for the best return.' },
  { q: 'How long does a typical project take?', a: 'Website projects: 7–14 days. Custom software: 4–12 weeks. GPS and industrial projects vary by scope — we\'ll give you a firm timeline before you commit.' },
  { q: 'Is there an ongoing maintenance fee?', a: 'Every project includes a year of free support and updates. Renewal after that is optional and priced transparently, with no lock-in.' },
  { q: 'Can I see a live demo before buying?', a: 'Yes. Book a free 30-minute demo and our team will walk you through any product live, on your own use case.' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} id="services-faq-jsonld" />

      <PageHero
        eyebrow="OUR SERVICES"
        title="Our Services"
        description="One partner for every system your business runs on — software, infrastructure, automation and engineering — instead of five vendors who don't talk to each other."
        breadcrumb="Services"
      />

      <Section>
        <SectionHeading
          align="center"
          eyebrow="WHAT WE OFFER"
          title="Core Services"
          description="Each service is built and delivered by an in-house team — not subcontracted, not outsourced."
        />
        <div className="sx-hide mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(s => {
            const Icon = ICON_MAP[s.icon] || Box;
            return (
              <Card key={s.slug} interactive className="group relative flex h-full flex-col p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-btn border border-line bg-bg2 text-gold-text">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-display text-card-title text-text">{s.name}</h3>
                <p className="mb-4 mt-2 flex-1 leading-relaxed text-text2">{s.description}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-1 rounded-btn text-sm font-semibold text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] after:absolute after:inset-0 after:content-['']"
                >
                  Explore This Service <ArrowRight className="h-4 w-4 transition-transform duration-base group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </Link>
              </Card>
            );
          })}
        </div>
        <StudioServiceIndex bare />
      </Section>

      <Section tone="alt">
        <SectionHeading
          align="center"
          eyebrow="HOW WE WORK"
          title="A Process Built to Remove Guesswork"
          description="Fixed scope, fixed price, weekly visibility — the same process for every engagement."
        />
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map(step => (
            <li key={step.num}>
              <Card className="h-full p-6">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-full border border-gold bg-card font-display text-sm font-semibold text-gold-text">
                  {step.num}
                </span>
                <h3 className="font-display text-card-title text-text">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-text2">{step.desc}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading align="center" eyebrow="EVERY SERVICE INCLUDES" title="Our Standard of Excellence" />
        <ul className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'Free consultation & scoping', '1-hour response during business hours',
            'Transparent, fixed pricing', 'GST compliant invoicing',
            '30-day money-back guarantee', 'Free training & onboarding',
            'Lifetime technical support', 'Regular updates & improvements',
            'MSME registered — NDA on request',
          ].map(b => (
            <li key={b}>
              <Card className="flex h-full items-center gap-3 px-5 py-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-text" aria-hidden />
                <span className="font-medium text-text">{b}</span>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="alt" containerClassName="container max-w-3xl">
        <SectionHeading align="center" eyebrow="FAQ" title="Common Questions" />
        <Accordion
          className="mt-14"
          items={faqs.map((f, i) => ({ id: `faq-${i}`, question: f.q, answer: f.a }))}
        />
      </Section>

      <Section>
        <Panel className="bg-bg3 px-6 py-14 text-center sm:px-12 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow="GET STARTED"
            title="One Team. Every System Your Business Needs."
            description="Mix and match any of our services with one accountable team and one point of contact — no chasing multiple vendors."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/contact" size="lg">Talk to a Solution Architect</Button>
            <Button href="/book-demo" variant="secondary" size="lg">Request Enterprise Demo</Button>
          </div>
          <Link href="/downloads" className="mt-6 inline-flex min-h-[44px] items-center rounded-btn text-sm text-text2 underline hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
            Download our Service Brochure &amp; Company Profile
          </Link>
        </Panel>
      </Section>
    </>
  );
}
