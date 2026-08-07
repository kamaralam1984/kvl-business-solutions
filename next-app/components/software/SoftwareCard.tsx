'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { Eye, ShoppingCart, Check, Calendar, Zap, Play } from 'lucide-react';
import { TiltCard } from '@/components/shared/TiltCard';
import { formatINR } from '@/lib/utils';
import type { Software } from '@/lib/data/software';

export function SoftwareCard({ product }: { product: Software }) {
  const [mode, setMode] = useState<'buy' | 'rent'>('buy');
  const [host, setHost] = useState<'cloud' | 'onprem'>('cloud');
  const Icon = (Icons as any)[product.icon] || Icons.Box;
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');
  const buyPrice = product.buyOnly
    ? product.price
    : mode === 'buy' ? Math.round(product.price * (host === 'onprem' ? 1.5 : 1)) : product.monthlyRent;
  const unit = product.buyOnly ? product.unit : mode === 'buy' ? product.unit : product.rentUnit;
  const isOffer = product.tag === 'OFFER';

  return (
    <TiltCard className="card-base overflow-hidden flex flex-col group">
      {/* Header */}
      <div className="h-44 relative flex flex-col items-center justify-end text-white overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 mb-4 flex flex-col items-center gap-2">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${product.c1}, ${product.c2})` }}
          >
            <Icon className="h-5.5 w-5.5 text-white" />
          </span>
          <span className="text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur">{product.name}</span>
        </div>
        {product.tag && (
          isOffer ? (
            <span className="absolute top-3 left-3 badge-offer-tricolor px-2.5 py-1 rounded-full text-[10px] font-extrabold z-10 flex items-center gap-1">
              🇮🇳 {product.tag}
              {product.offerValidTill && <span className="opacity-80 font-semibold">· till {product.offerValidTill}</span>}
            </span>
          ) : (
            <span className="absolute top-3 left-3 bg-black/40 text-white px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur z-10">{product.tag}</span>
          )
        )}
        {/* Demo overlay on hover */}
        {!product.noDemo && (
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 grid place-items-center z-20">
            <Link href={`/software/${product.slug}/demo`} className="btn btn-primary gap-2 shadow-xl">
              <Play className="w-4 h-4" /> Launch Live Demo
            </Link>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-text2 text-[13px] mb-3">{product.description}</p>

        <ul className="mb-4 space-y-1.5">
          {product.features.slice(0, 4).map(f => (
            <li key={f} className="text-[12px] text-text2 flex items-center gap-1.5">
              <Check className="w-3 h-3 text-green-500 shrink-0" /> {f}
            </li>
          ))}
        </ul>

        {/* Buy / Rent Toggle */}
        {!product.buyOnly && (
          <div className="inline-flex surface2-tint rounded-full p-1 mb-3 self-stretch">
            <button onClick={() => setMode('buy')} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all ${mode === 'buy' ? 'bg-primary text-white shadow' : 'text-text2 hover:text-text'}`}>
              <ShoppingCart className="w-3 h-3" /> Buy (Own)
            </button>
            <button onClick={() => setMode('rent')} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all ${mode === 'rent' ? 'bg-violet-600 text-white shadow' : 'text-text2 hover:text-text'}`}>
              <Calendar className="w-3 h-3" /> Rent (Monthly)
            </button>
          </div>
        )}

        {/* Hosting toggle — only for Buy mode */}
        {!product.buyOnly && mode === 'buy' && (
          <div className="inline-flex surface2-tint rounded-full p-0.5 mb-3 self-start">
            <button onClick={() => setHost('cloud')} className={`px-3 py-1 text-[10px] font-semibold rounded-full transition-all ${host === 'cloud' ? 'bg-sky-500 text-white' : 'text-text2'}`}>☁ Cloud</button>
            <button onClick={() => setHost('onprem')} className={`px-3 py-1 text-[10px] font-semibold rounded-full transition-all ${host === 'onprem' ? 'bg-slate-600 text-white' : 'text-text2'}`}>🖥 On-Premise</button>
          </div>
        )}

        {product.buyOnly && (
          <div className="flex items-center gap-2 text-[10px] text-amber-500 font-semibold mb-2">
            <Zap className="w-3 h-3" /> Free hosting included • No domain • One-time price
          </div>
        )}

        {!product.buyOnly && mode === 'rent' && (
          <div className="flex items-center gap-2 text-[10px] text-violet-500 font-semibold mb-2">
            <Zap className="w-3 h-3" /> Cancel anytime • No setup fee
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1.5 py-3 border-t border-b border-dashed border-tint mb-3">
          <span className={`text-2xl font-extrabold ${!product.buyOnly && mode === 'rent' ? 'text-violet-600' : 'text-primary'}`}>{formatINR(buyPrice)}</span>
          <span className="text-xs text-text2">{unit}</span>
          {product.buyOnly && <span className="ml-auto text-[10px] text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">Limited offer</span>}
          {!product.buyOnly && mode === 'buy' && <span className="ml-auto text-[10px] text-green-500 font-semibold bg-green-500/10 px-2 py-0.5 rounded-full">Lifetime license</span>}
          {!product.buyOnly && mode === 'rent' && <span className="ml-auto text-[10px] text-violet-500 font-semibold bg-violet-500/10 px-2 py-0.5 rounded-full">SaaS</span>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {!product.noDemo && (
            <Link href={`/software/${product.slug}/demo`} className="btn btn-ghost flex-1 justify-center text-xs border-primary/30 text-primary hover:bg-primary hover:text-white">
              <Eye className="w-3.5 h-3.5" /> Demo
            </Link>
          )}
          {mode === 'buy' ? (
            <Link href={`/checkout?product=${product.slug}&host=${host}`} className="btn btn-primary flex-1 justify-center text-xs">
              <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
            </Link>
          ) : (
            <Link href={`/checkout?product=${product.slug}&plan=monthly`} className="btn flex-1 justify-center text-xs text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              <Zap className="w-3.5 h-3.5" /> Start Now
            </Link>
          )}
          <a href={`https://wa.me/${wa}?text=I'm interested in ${product.name}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp text-xs px-3">💬</a>
        </div>
      </div>
    </TiltCard>
  );
}
