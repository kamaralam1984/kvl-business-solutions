import { CtaBanner } from '@/components/home/CtaBanner';
import { SoftwareCard } from '@/components/software/SoftwareCard';
import { softwareProducts } from '@/lib/data/software';
import { Star, Shield, Headphones, Zap } from 'lucide-react';

export const metadata = { title: 'Software Marketplace — KVL Business Solutions' };

export default function SoftwarePage() {
  return (
    <div style={{ background: '#050508' }} className="text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="noise-overlay" />
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, transparent 60%)' }} />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="relative z-10 container text-center">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 text-white/70" style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.05)' }}>
            <Star className="w-3.5 h-3.5 text-amber-400" /> 15 Powerful SaaS Products • Buy or Rent
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Enterprise Software<br />
            <span className="gradient-text">Built for India</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto mb-10">
            Ready-to-deploy software for every business. Own it forever or rent month-to-month — your choice. Free demo, instant setup.
          </p>

          {/* Buy vs Rent */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="card-luxury px-6 py-4 text-left">
              <div className="gradient-text-gold font-extrabold text-sm mb-1 uppercase tracking-wider">Buy Once</div>
              <p className="text-white/55 text-sm">One-time payment. Own forever. Free 1-year support.</p>
            </div>
            <div className="card-luxury px-6 py-4 text-left glow-violet">
              <div className="gradient-text font-extrabold text-sm mb-1 uppercase tracking-wider">Rent Monthly</div>
              <p className="text-white/55 text-sm">Low monthly fee. Cancel anytime. Always latest version.</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/50">
            {[
              { Icon: Shield, text: '30-day money-back' },
              { Icon: Zap, text: 'Setup in 24 hours' },
              { Icon: Headphones, text: 'Lifetime support' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-violet-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-white/40 text-sm">Click <span className="text-white/70 font-semibold">Demo</span> to explore live interactive dashboard • Hover card for instant preview</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareProducts.map(p => <SoftwareCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      <CtaBanner title="Not sure which software fits your business?" desc="Talk to our experts for a personalized recommendation and free 7-day trial." />
    </div>
  );
}
