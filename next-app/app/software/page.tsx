import { CtaBanner } from '@/components/home/CtaBanner';
import { SoftwareCard } from '@/components/software/SoftwareCard';
import { softwareProducts } from '@/lib/data/software';
import { ShoppingCart, Zap, Play, Star, Shield, Headphones } from 'lucide-react';

export const metadata = { title: 'Software Marketplace — KVL Business Solutions' };

export default function SoftwarePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%,#7c3aed33 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,#2563eb33 0%,transparent 60%)' }} />
        <div className="container relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 backdrop-blur">
            <Star className="w-3.5 h-3.5 text-yellow-400" /> 15 Powerful SaaS Products • Buy or Rent
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
            Enterprise Software<br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Built for India</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Ready-to-deploy software for every business. Own it forever or rent month-to-month — your choice. Free demo, instant setup.
          </p>

          {/* Buy vs Rent comparison */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <div className="bg-white/10 border border-white/20 backdrop-blur rounded-2xl px-6 py-4 text-left sm:w-64">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm">Buy (Own Forever)</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>✓ One-time payment</li>
                <li>✓ Lifetime license</li>
                <li>✓ Cloud or On-Premise</li>
                <li>✓ 1 year free support</li>
              </ul>
            </div>
            <div className="bg-violet-600/30 border border-violet-500/40 backdrop-blur rounded-2xl px-6 py-4 text-left sm:w-64">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="font-bold text-sm">Rent (Monthly SaaS)</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>✓ Low monthly cost</li>
                <li>✓ Cancel anytime</li>
                <li>✓ Always latest version</li>
                <li>✓ No setup fee</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center text-xs text-slate-400">
            <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-400" /> 30-day money-back</div>
            <div className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-blue-400" /> Free live demo</div>
            <div className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5 text-violet-400" /> Setup within 24 hours</div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-text2 text-sm">Click <strong>Demo</strong> to explore live interactive dashboard • Hover card for instant preview</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareProducts.map(p => <SoftwareCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      <CtaBanner title="Not sure which software fits your business?" desc="Talk to our experts for a personalized recommendation and free 7-day trial." />
    </>
  );
}
