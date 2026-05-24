'use client';
import { useState } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Eye, ShoppingCart, Check } from 'lucide-react';
import { TiltCard } from '@/components/shared/TiltCard';
import { formatINR } from '@/lib/utils';
import type { Software } from '@/lib/data/software';

export function SoftwareCard({ product }: { product: Software }) {
  const [host, setHost] = useState<'cloud' | 'onprem'>('cloud');
  const Icon = (Icons as any)[product.icon] || Icons.Box;
  const wa = process.env.NEXT_PUBLIC_WHATSAPP || '919000000000';
  const hostMultiplier = host === 'onprem' ? 1.5 : 1;
  const price = Math.round(product.price * hostMultiplier);

  return (
    <TiltCard className="card-base overflow-hidden flex flex-col">
      <div className="h-40 relative grid place-items-center text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${product.c1}, ${product.c2})` }}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
        <Icon className="w-14 h-14 relative z-10 drop-shadow-lg" />
        {product.tag && <span className="absolute top-3 left-3 bg-black/40 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold z-10 backdrop-blur">{product.tag}</span>}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
        <p className="text-text2 text-[13px] mb-3">{product.description}</p>
        <ul className="mb-3 space-y-1">
          {product.features.map(f => (
            <li key={f} className="text-[12px] text-text2 flex items-center gap-1.5"><Check className="w-3 h-3 text-green-500" /> {f}</li>
          ))}
        </ul>
        <div className="inline-flex surface2-tint rounded-full p-1 mb-3 self-start">
          <button onClick={() => setHost('cloud')} className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${host === 'cloud' ? 'bg-primary text-white' : 'text-text2'}`}>☁ Cloud</button>
          <button onClick={() => setHost('onprem')} className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${host === 'onprem' ? 'bg-primary text-white' : 'text-text2'}`}>🖥 On-Premise</button>
        </div>
        <div className="flex items-baseline gap-1.5 py-3 border-t border-b border-dashed border-tint mb-3">
          <span className="text-2xl font-extrabold text-primary">{formatINR(price)}</span>
          <span className="text-xs text-text2">{product.unit}</span>
        </div>
        <div className="flex gap-2 mt-auto">
          <Link href={`/software/${product.slug}`} className="btn btn-primary flex-1 justify-center text-xs"><Eye className="w-3.5 h-3.5" /> Demo</Link>
          <Link href={`/checkout?product=${product.slug}&host=${host}`} className="btn btn-primary flex-1 justify-center text-xs" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}><ShoppingCart className="w-3.5 h-3.5" /> Buy</Link>
          <a href={`https://wa.me/${wa}?text=I'm interested in ${product.name}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp flex-1 justify-center text-xs">💬 Chat</a>
        </div>
      </div>
    </TiltCard>
  );
}
