import { ShieldCheck, Sparkles, Layers, LayoutDashboard, FileCheck, Headset } from 'lucide-react';
import { SectionHeading, Card } from '@/components/ui';

const reasons = [
  { Icon: ShieldCheck,     title: 'Verified Credentials',     desc: 'MSME-registered, with an NDA available on request before any project discussion.' },
  { Icon: Sparkles,        title: 'AI Failover, Built In',    desc: 'Multi-provider AI chain — no downtime on lead scoring or outreach.' },
  { Icon: Layers,          title: 'Modern Engineering Stack', desc: 'Next.js, React, TypeScript, and MongoDB.' },
  { Icon: LayoutDashboard, title: 'Working Software Suite',   desc: 'Real production software — not a prototype.' },
  { Icon: FileCheck,       title: 'Straightforward Terms',    desc: 'Fixed pricing, 30-day money-back guarantee.' },
  { Icon: Headset,         title: 'Fast, Human Support',      desc: 'Free onboarding, and a 1-hour response time.' },
];

// Icon cards only — the old poster images repeated the card text, so they are gone.
export function Certifications() {
  return (
    <section className="bg-bg py-[var(--section-y)]">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Why Businesses Trust KVL"
          title={<>Nothing here is inflated. <span className="text-gold-text">Every claim is verifiable.</span></>}
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(r => (
            <Card key={r.title} interactive className="p-7">
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-btn bg-gold/15 text-gold-text">
                <r.Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="font-display text-card-title text-text">{r.title}</h3>
              <p className="mt-2 text-text2">{r.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
