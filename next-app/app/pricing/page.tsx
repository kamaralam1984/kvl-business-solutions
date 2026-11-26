import Link from 'next/link';
import { softwareProducts } from '@/lib/data/software';
import { Check, Calendar, Shield, Clock, Award } from 'lucide-react';
import { ViewContentTracker } from '@/components/analytics/ViewContentTracker';
import { PageHero } from '@/components/shared/PageHero';
import { Accordion, Badge, Button, Card, Section, SectionHeading, cn } from '@/components/ui';

const universalFeatures = [
  'Free installation & setup',
  '1-year unlimited support',
  'Free training (2 hours)',
  'GST compliant',
  '30-day money-back',
  'Cloud + On-Premise',
  'Free updates for 12 months',
  'Mobile-friendly dashboard',
];

const planTiers = [
  {
    name: 'Starter',
    desc: 'For small businesses ready to move off spreadsheets and manual processes',
    products: ['billing', 'attendance', 'payroll'],
    extras: ['Up to 5 users', 'Email support', 'Cloud hosting included'],
    tag: '',
    badge: '',
  },
  {
    name: 'Business',
    desc: 'For growing companies that need real-time visibility across sales, inventory and operations',
    products: ['erp', 'crm', 'inventory'],
    extras: ['Up to 25 users', 'Priority email + chat', 'Cloud or on-premise', 'Custom integrations (5)'],
    tag: 'MOST POPULAR',
    badge: 'popular',
  },
  {
    name: 'Enterprise',
    desc: 'For large or multi-location operations that need dedicated support and guaranteed uptime',
    products: ['ai-business', 'hospital', 'school'],
    extras: ['Unlimited users', '24×7 dedicated support', 'On-premise + dedicated server', 'Custom modules', 'SLA guarantee 99.9%'],
    tag: 'ENTERPRISE',
    badge: 'gold',
  },
];

const pricingFaqs = [
  { q: 'Are there any hidden fees?', a: 'No hidden fees. GST is added at checkout per government norms.' },
  { q: 'What happens after the 1-year support period?', a: 'You can renew support at a discounted rate, or continue using the software without support.' },
  { q: 'Can I upgrade from Starter to Business later?', a: 'Yes — we offer seamless upgrades with data migration included at no extra charge.' },
  { q: 'Do you offer EMI or installment payments?', a: 'Yes, we partner with leading banks for 0% EMI on eligible orders.' },
];

export default function PricingPage() {
  return (
    <div className="bg-bg">
      <ViewContentTracker id="pricing" name="Pricing Page" category="Pricing" />

      <PageHero
        eyebrow="TRANSPARENT PRICING"
        title="Plans Built Around Your Business"
        description="Know exactly what you get — no hidden fees, no surprise renewals, 30-day money-back on everything. Talk to us for a plan matched to your business."
        breadcrumb="Pricing"
      />

      {/* Plan Tiers */}
      <Section>
        <SectionHeading align="center" title="Compare plans" description="Bundle multiple products and save as a package." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {planTiers.map(tier => {
            const products = tier.products.map(slug => softwareProducts.find(p => p.slug === slug)!).filter(Boolean);
            const isPopular = tier.badge === 'popular';
            return (
              <Card
                key={tier.name}
                className={cn('relative flex h-full flex-col p-7', isPopular && 'border-gold shadow-soft-3')}
              >
                {tier.tag && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 uppercase tracking-wide">{tier.tag}</Badge>
                )}
                <h3 className="mt-2 font-display text-card-title text-text">{tier.name}</h3>
                <p className="mb-6 mt-2 text-sm text-text2">{tier.desc}</p>
                <div className="mb-5 space-y-2 border-b border-line pb-5 text-sm">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-text2">Includes</div>
                  {products.map(p => (
                    <div key={p.slug} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-gold-text" aria-hidden />
                      <span className="text-text">{p.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mb-6 flex-1 space-y-2 text-sm">
                  {tier.extras.map(e => (
                    <div key={e} className="flex items-center gap-2 text-text2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-gold-text" aria-hidden />
                      <span>{e}</span>
                    </div>
                  ))}
                </div>
                <Button href="/contact" variant={isPopular ? 'primary' : 'secondary'} className="w-full">
                  Advance Payment
                </Button>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Universal Features */}
      <Section tone="alt">
        <SectionHeading align="center" eyebrow="INCLUDED IN EVERY PLAN" title="All plans include" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {universalFeatures.map(f => (
            <Card key={f} className="flex items-center gap-3 px-4 py-3">
              <Check className="h-4 w-4 shrink-0 text-gold-text" aria-hidden />
              <span className="text-sm text-text">{f}</span>
            </Card>
          ))}
        </div>
      </Section>

      {/* Individual Products Table */}
      <Section>
        <SectionHeading align="center" title="Individual products" description="Prefer one product at a time? Buy individually, cloud or on-premise." />
        <Card className="relative mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="sr-only">Individual software products</caption>
            <thead className="border-b border-line">
              <tr className="text-left text-xs uppercase tracking-wider text-text2">
                <th scope="col" className="p-4">Product</th>
                <th scope="col" className="p-4"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {softwareProducts.map(p => (
                <tr key={p.slug} className="border-b border-line last:border-0 transition-colors hover:bg-bg2">
                  <td className="p-4">
                    <div className="font-bold text-text">{p.name}</div>
                    <div className="mt-0.5 text-xs text-text2">{p.category}</div>
                    <ul className="mt-1.5 space-y-0.5">
                      {p.features?.slice(0, 2).map((f: string) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-text2">
                          <Check className="h-3 w-3 shrink-0 text-gold-text" aria-hidden /> {f}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 text-right">
                    <Button href="/book-demo" className="px-4 text-sm">Demo</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/book-demo" size="lg"><Calendar className="h-4 w-4" aria-hidden /> Book a free demo</Button>
          <Button href="/contact" variant="secondary" size="lg">Need a custom plan?</Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="alt" containerClassName="max-w-3xl">
        <SectionHeading align="center" eyebrow="PRICING FAQ" title="Frequently Asked Questions" />
        <Accordion
          className="mt-12"
          items={pricingFaqs.map((f, i) => ({ id: `faq-${i}`, question: f.q, answer: <p className="leading-relaxed">{f.a}</p> }))}
        />
      </Section>

      {/* Trust Indicators */}
      <Section>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            { Icon: Shield, title: '30-Day Money-Back', desc: 'Not satisfied? Full refund, no questions asked.' },
            { Icon: Clock, title: '1-Hour Response', desc: 'Our support team replies within 60 minutes during business hours.' },
            { Icon: Award, title: 'MSME Registered', desc: 'Govt. of India registered, with an NDA available on request.' },
          ].map(t => (
            <Card key={t.title} className="p-6 text-center">
              <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-btn border border-line bg-bg2">
                <t.Icon className="h-5 w-5 text-gold-text" aria-hidden />
              </div>
              <h3 className="mb-2 font-display text-base font-bold text-text">{t.title}</h3>
              <p className="text-sm text-text2">{t.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA Banner */}
      <Section tone="alt" containerClassName="text-center">
        <SectionHeading align="center" eyebrow="NEED HELP CHOOSING?" title="Still not sure which plan fits?"
          description="Talk to a solution architect for a bundle recommendation matched to your business size and industry — a free 30-minute consultation, no obligation." />
        <div className="mt-8">
          <Button href="/contact" size="lg">Talk to a Solution Architect</Button>
        </div>
        <Link href="/downloads" className="mt-6 inline-flex min-h-[44px] items-center rounded-btn text-sm text-text2 underline hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
          Download our Service Brochure & Company Profile
        </Link>
      </Section>
    </div>
  );
}
