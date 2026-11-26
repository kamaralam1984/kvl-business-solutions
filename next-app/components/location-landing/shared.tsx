import Link from 'next/link';
import {
  ArrowUpRight, ArrowRight, Clock, MessageCircle,
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video,
  Network, Cloud, Brain, Megaphone, Palette, Users, Contact2, Webhook, Tag,
  Workflow, Factory, Truck, School, Hospital, Store, Building2, Landmark,
  UtensilsCrossed, Wallet, Box,
  type LucideIcon,
} from 'lucide-react';
import { Card, Section, SectionHeading, buttonStyles, cn } from '@/components/ui';

/* Shared building blocks for the location / country landing templates.
   All server components, token-based so they follow light + dark themes. */

export const WA_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');

export const processSteps = [
  { num: '01', title: 'Discover',    desc: 'We learn the business, the goals and what the system actually needs to do.' },
  { num: '02', title: 'Planning',    desc: 'Scope, timeline and pricing get fixed in writing before any work begins.' },
  { num: '03', title: 'Design',      desc: 'We map the structure and interface before a single line of code is written.' },
  { num: '04', title: 'Development', desc: 'Engineers build the system, with weekly progress updates so nothing is a surprise.' },
  { num: '05', title: 'Testing',     desc: 'The system is reviewed and checked against the original requirements before it goes live.' },
  { num: '06', title: 'Deployment',  desc: 'We move the system into production and confirm it runs as intended.' },
  { num: '07', title: 'Support',     desc: 'Training and documentation come standard, plus a year of free updates and support.' },
];

export const TECH_STACK = ['Next.js', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AI / LLM Integration', 'GPS & Mapping APIs', 'Cloud Hosting (AWS / Azure / GCP)'];

const ICON_MAP: Record<string, LucideIcon> = {
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video,
  Network, Cloud, Brain, Megaphone, Palette, Users, Contact2, Webhook, Tag,
  Workflow, Factory, Truck, School, Hospital, Store, Building2, Landmark,
  UtensilsCrossed, Wallet, Box,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICON_MAP[name] || Box;
  return <Cmp className={className} aria-hidden />;
}

export const iconTile = 'mb-4 grid h-11 w-11 place-items-center rounded-btn bg-gold/15 text-gold-text';
const cardLink =
  'block p-6 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]';

/** Thin one-line statement strip under the hero. */
export function StripNote({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border-y border-line bg-bg2 py-6">
      <div className="container flex flex-wrap items-center justify-center gap-2.5 text-center text-sm text-text2">
        <span className="shrink-0 text-gold-text">{icon}</span>
        {children}
      </div>
    </section>
  );
}

export function WhyGrid({ reasons, eyebrow = 'Why KVL', title }: { reasons: string[]; eyebrow?: string; title: React.ReactNode }) {
  return (
    <Section>
      <SectionHeading align="center" eyebrow={eyebrow} title={title} />
      <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
        {reasons.map(r => (
          <Card key={r} className="flex items-start gap-3 p-6">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gold-text" aria-hidden />
            <span className="text-base leading-relaxed text-text">{r}</span>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function MarketSection({ eyebrow, title, paragraphs, tone = 'alt' }: { eyebrow: string; title: React.ReactNode; paragraphs: string[]; tone?: 'base' | 'alt' }) {
  return (
    <Section tone={tone} containerClassName="max-w-3xl">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-8 space-y-5">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-[1.8] text-text2">{p}</p>
        ))}
      </div>
    </Section>
  );
}

export type LinkCardItem = { key: string; href: string; title: string; desc: string; icon: React.ReactNode };

export function LinkCardGrid({ eyebrow, title, description, items, tone = 'base' }: {
  eyebrow: string; title: React.ReactNode; description?: React.ReactNode; items: LinkCardItem[]; tone?: 'base' | 'alt';
}) {
  return (
    <Section tone={tone}>
      <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(i => (
          <Link key={i.key} href={i.href} className="group rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
            <Card interactive className="h-full p-6">
              <div className={iconTile}>{i.icon}</div>
              <h3 className="mb-1.5 font-display text-card-title text-text">{i.title}</h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-text2">{i.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function TechChips({ tone = 'base' }: { tone?: 'base' | 'alt' }) {
  return (
    <Section tone={tone}>
      <SectionHeading align="center" eyebrow="Technology" title="Built With" />
      <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2.5">
        {TECH_STACK.map(t => (
          <li key={t} className="rounded-full border border-line bg-card px-4 py-1.5 text-sm font-medium text-gold-text">{t}</li>
        ))}
      </ul>
    </Section>
  );
}

export function TimezoneSection({ eyebrow = 'How We Work Together', title, text, tone = 'alt' }: { eyebrow?: string; title: React.ReactNode; text: string; tone?: 'base' | 'alt' }) {
  return (
    <Section tone={tone} containerClassName="max-w-3xl">
      <SectionHeading align="center" eyebrow={eyebrow} title={title} />
      <Card className="mt-10 flex items-start gap-4 p-8">
        <Clock className="mt-1 h-6 w-6 shrink-0 text-gold-text" aria-hidden />
        <p className="text-base leading-[1.8] text-text2">{text}</p>
      </Card>
    </Section>
  );
}

export function ProcessSection({ intro, tone = 'base' }: { intro: string; tone?: 'base' | 'alt' }) {
  return (
    <Section tone={tone}>
      <SectionHeading align="center" eyebrow="How We Build It" title="Our Standard Delivery Process" description={intro} />
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {processSteps.map(s => (
          <Card key={s.num} className="p-5">
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-gold/15 text-xs font-bold text-gold-text">{s.num}</div>
            <h3 className="mb-1.5 font-display text-lg font-semibold text-text">{s.title}</h3>
            <p className="text-sm leading-relaxed text-text2">{s.desc}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

type CaseItem = { slug: string; businessCategory: string; name: string; overview: string };

export function CaseGrid({ items, title, tone = 'base', wide = false }: { items: CaseItem[]; title: React.ReactNode; tone?: 'base' | 'alt'; wide?: boolean }) {
  return (
    <Section tone={tone}>
      <SectionHeading align="center" eyebrow="Proven Work" title={title} />
      <div className={cn('mt-10 grid gap-6 sm:grid-cols-2', wide ? 'lg:grid-cols-3' : 'mx-auto max-w-4xl')}>
        {items.map(cs => (
          <Link key={cs.slug} href={`/projects/${cs.slug}`} className="group rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
            <Card interactive className="h-full p-7">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gold-text">{cs.businessCategory}</div>
              <h3 className="mb-3 font-display text-card-title text-text">{cs.name}</h3>
              <p className="mb-4 text-base text-text2">{cs.overview}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-text">
                Read the case study <ArrowUpRight className="h-4 w-4 transition-transform duration-base group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function FaqSection({ faq, title, tone = 'base' }: { faq: { q: string; a: string }[]; title: React.ReactNode; tone?: 'base' | 'alt' }) {
  return (
    <Section tone={tone} containerClassName="max-w-3xl">
      <SectionHeading align="center" eyebrow="FAQ" title={title} />
      <div className="mt-10 space-y-4">
        {faq.map(f => (
          <Card key={f.q} className="p-6">
            <h3 className="mb-2 text-base font-semibold text-text">{f.q}</h3>
            <p className="text-base leading-relaxed text-text2">{f.a}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function PillLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line bg-card px-4 text-sm font-medium text-gold-text transition-[transform,box-shadow] duration-base ease-brand hover:-translate-y-px hover:shadow-soft-1 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      {icon} {children}
    </Link>
  );
}

export function CtaRow({ heading, waText, tone = 'base' }: { heading: React.ReactNode; waText: string; tone?: 'base' | 'alt' }) {
  return (
    <Section tone={tone}>
      <SectionHeading align="center" eyebrow="Get Started" title={heading} />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/book-demo" className={buttonStyles('primary', 'lg')}>
          Get Free Project Consultation <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="/contact" className={buttonStyles('secondary', 'lg')}>
          Talk to a Software Expert
        </Link>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`}
          target="_blank"
          rel="noreferrer"
          className={buttonStyles('secondary', 'lg')}
        >
          <MessageCircle className="h-4 w-4 text-gold-text" aria-hidden /> WhatsApp Us
        </a>
      </div>
    </Section>
  );
}
