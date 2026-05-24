'use client';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { openQuoteModal } from '@/components/widgets/QuoteModal';

export function CtaBanner({ title, desc }: { title?: string; desc?: string }) {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP || '919000000000';
  return (
    <section className="section">
      <div className="container">
        <div className="rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #0c1740 100%)' }}>
          <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(249,115,22,0.15), transparent 50%)' }} />
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 relative">{title || 'Ready to Transform Your Business?'}</h2>
          <p className="text-white/85 mb-6 relative">{desc || 'Get a free consultation, custom quote, and live demo within 1 hour.'}</p>
          <div className="flex flex-wrap gap-3 justify-center relative">
            <button onClick={openQuoteModal} className="btn btn-orange"><Rocket className="w-4 h-4" /> Get Free Consultation</button>
            <Link href={`https://wa.me/${wa}`} target="_blank" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>💬 WhatsApp Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
