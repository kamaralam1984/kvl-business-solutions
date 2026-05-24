import Link from 'next/link';
import { softwareProducts } from '@/lib/data/software';
import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { formatINR } from '@/lib/utils';
import { Check, X, Cloud, Server, Sparkles, Calendar } from 'lucide-react';

export const metadata = { title: 'Pricing — Compare All Software' };

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
    desc: 'For small businesses just getting started',
    products: ['billing', 'attendance', 'payroll'],
    extras: ['Up to 5 users', 'Email support', 'Cloud hosting included'],
    tag: '',
    multiplier: 1,
  },
  {
    name: 'Business',
    desc: 'Most popular for growing companies',
    products: ['erp', 'crm', 'inventory'],
    extras: ['Up to 25 users', 'Priority email + chat', 'Cloud or on-premise', 'Custom integrations (5)'],
    tag: 'MOST POPULAR',
    multiplier: 1,
  },
  {
    name: 'Enterprise',
    desc: 'For large operations with custom needs',
    products: ['ai-business', 'hospital', 'school'],
    extras: ['Unlimited users', '24×7 dedicated support', 'On-premise + dedicated server', 'Custom modules', 'SLA guarantee 99.9%'],
    tag: 'ENTERPRISE',
    multiplier: 1,
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="TRANSPARENT PRICING"
        title="Simple, honest"
        accent="pricing"
        description="No hidden fees. No surprises. 30-day money-back on everything."
        breadcrumb="Pricing"
      />

      <section className="section">
        <div className="container">
          <h2 className="text-2xl font-extrabold mb-2 text-center">Compare plans</h2>
          <p className="text-text2 text-center mb-10 text-sm">Bundle multiple products and save up to 30%.</p>

          <div className="grid md:grid-cols-3 gap-5">
            {planTiers.map(tier => {
              const products = tier.products.map(slug => softwareProducts.find(p => p.slug === slug)!).filter(Boolean);
              const total = products.reduce((s, p) => s + p.price, 0);
              const discount = tier.name === 'Business' ? 0.15 : tier.name === 'Enterprise' ? 0.30 : 0;
              const final = Math.round(total * (1 - discount));
              return (
                <div key={tier.name} className={`card-base p-6 relative ${tier.tag === 'MOST POPULAR' ? 'border-2 border-primary shadow-card-hover' : ''}`}>
                  {tier.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: tier.tag === 'MOST POPULAR' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>{tier.tag}</div>
                  )}
                  <h3 className="text-xl font-extrabold">{tier.name}</h3>
                  <p className="text-xs text-text2 mt-1 mb-4">{tier.desc}</p>
                  <div className="mb-4">
                    {discount > 0 && <div className="text-xs text-text2 line-through">{formatINR(total)}</div>}
                    <div className="text-3xl font-extrabold text-primary">{formatINR(final)}<span className="text-sm font-normal text-text2">/year</span></div>
                    {discount > 0 && <div className="text-xs text-green-500 font-semibold">Save {Math.round(discount * 100)}% as a bundle</div>}
                  </div>
                  <div className="space-y-2 text-sm mb-4 pb-4 border-b border-tint">
                    <div className="text-xs uppercase text-text2 font-bold mb-2">Includes</div>
                    {products.map(p => (
                      <div key={p.slug} className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm mb-5">
                    {tier.extras.map(e => (
                      <div key={e} className="flex gap-2 items-start text-text2">
                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className={`btn w-full justify-center ${tier.tag === 'MOST POPULAR' ? 'btn-primary' : 'btn-ghost border border-tint'}`}>Get {tier.name}</Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="text-2xl font-extrabold mb-2 text-center">Individual products</h2>
          <p className="text-text2 text-center mb-8 text-sm">Buy à la carte. All prices in INR, GST extra.</p>
          <div className="card-base overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="border-b border-tint">
                <tr className="text-left text-xs uppercase text-text2">
                  <th className="p-4">Product</th>
                  <th className="p-4">Key Features</th>
                  <th className="p-4 text-right">Cloud</th>
                  <th className="p-4 text-right">On-Premise</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {softwareProducts.map(p => {
                  const onPrem = Math.round(p.price * 1.5);
                  return (
                    <tr key={p.slug} className="border-b border-tint last:border-b-0 hover:bg-primary/5">
                      <td className="p-4">
                        <div className="font-bold">{p.name}</div>
                        <div className="text-xs text-text2 mt-1 max-w-xs">{p.description}</div>
                        {p.tag && <span className="inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}>{p.tag}</span>}
                      </td>
                      <td className="p-4 text-xs text-text2">
                        <ul className="space-y-1">
                          {p.features.slice(0, 3).map(f => <li key={f} className="flex gap-1 items-center"><Check className="w-3 h-3 text-green-500" /> {f}</li>)}
                        </ul>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-primary">{formatINR(p.price)}</div>
                        <div className="text-[10px] text-text2">{p.unit}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold">{formatINR(onPrem)}</div>
                        <div className="text-[10px] text-text2">{p.unit}</div>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/software/${p.slug}`} className="btn btn-ghost text-xs">View</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="text-2xl font-extrabold mb-6 text-center">What's always included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {universalFeatures.map(f => (
              <div key={f} className="card-base p-4 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-green-500/15 grid place-items-center shrink-0"><Check className="w-4 h-4 text-green-500" /></div>
                <span className="text-sm font-semibold">{f}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/book-demo" className="btn btn-primary"><Calendar className="w-4 h-4" /> Book a free demo</Link>
            <Link href="/contact" className="btn btn-ghost ml-3">Need custom pricing?</Link>
          </div>
        </div>
      </section>

      <CtaBanner title="Still not sure which plan fits?" desc="Our experts will recommend the perfect bundle for your business size and industry. Free 30-minute consultation." />
    </>
  );
}
