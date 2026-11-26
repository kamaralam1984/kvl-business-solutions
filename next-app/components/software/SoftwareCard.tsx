'use client';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  Eye, Check, Zap, Play, Box,
  BadgeIndianRupee, Boxes, Brain, Building2, Code2, Fingerprint, Globe, GraduationCap, Handshake,
  HardHat, Hotel, Network, Receipt, Satellite, Stethoscope, TrendingUp, UtensilsCrossed, Wrench,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { formatINR } from '@/lib/utils';
import type { Software } from '@/lib/data/software';

// Every distinct top-level `icon` value used in lib/data/software.ts.
const ICON_MAP: Record<string, LucideIcon> = {
  BadgeIndianRupee, Boxes, Brain, Building2, Code2, Fingerprint, Globe, GraduationCap, Handshake,
  HardHat, Hotel, Network, Receipt, Satellite, Stethoscope, TrendingUp, UtensilsCrossed, Wrench,
};

export function SoftwareCard({ product }: { product: Software }) {
  const Icon = ICON_MAP[product.icon] || Box;
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');
  const isOffer = product.tag === 'OFFER';

  return (
    <Card interactive className="group flex h-full flex-col overflow-hidden">
      {/* Header */}
      {/* Product screenshot area: stays dark in both themes (real screenshot) */}
      <div className="relative flex h-44 flex-col items-center justify-end overflow-hidden text-white">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-slow group-hover:scale-105 motion-reduce:transition-none"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 mb-4 flex flex-col items-center gap-2">
          <span
            className="grid h-11 w-11 place-items-center rounded-btn shadow-soft-2"
            style={{ background: `linear-gradient(135deg, ${product.c1}, ${product.c2})` }}
          >
            <Icon aria-hidden className="h-5 w-5 text-white" />
          </span>
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-bold backdrop-blur">{product.name}</span>
        </div>
        {product.tag && (
          isOffer ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-gold px-2.5 py-1 text-xs font-extrabold text-[#080910]">{product.tag}</span>
          ) : (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">{product.tag}</span>
          )
        )}
        {/* Demo overlay on hover */}
        {!product.noDemo && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-black/80 opacity-0 transition-opacity duration-base group-focus-within:opacity-100 group-hover:opacity-100">
            <Button href={`/software/${product.slug}/demo`}>
              <Play className="h-4 w-4" aria-hidden /> Launch Live Demo
            </Button>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="mb-3 text-sm text-text2">{product.description}</p>

        <ul className="mb-4 space-y-1.5">
          {product.features.slice(0, 4).map(f => (
            <li key={f} className="flex items-center gap-1.5 text-xs text-text2">
              <Check aria-hidden className="h-3 w-3 shrink-0 text-green-600 dark:text-green-400" /> {f}
            </li>
          ))}
        </ul>

        {/* Rent-only badge strip — the Buy/Rent toggle and hosting picker (both
            tied to the now-removed Buy flow) are gone; every card just shows
            its rent terms. */}
        {!product.buyOnly && (
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gold-text">
            <Zap aria-hidden className="h-3 w-3" /> Cancel anytime • No setup fee
          </div>
        )}

        {/* Plan badge — price shown only after an advance payment enquiry */}
        <div className="flex items-baseline gap-1.5 py-3 border-y border-dashed border-line mb-3">
          <span className="text-xs font-semibold text-text2">Contact us for pricing</span>
          {product.buyOnly && <Badge className="ml-auto px-2 py-0.5">Limited offer</Badge>}
          {!product.buyOnly && <Badge className="ml-auto px-2 py-0.5">SaaS</Badge>}
        </div>

        {/* Actions — Buy/Advance Payment removed site-wide; rent-eligible
            products go straight to the monthly checkout, buy-only products
            (no rent pricing to fall back to) show Demo + WhatsApp only. */}
        <div className="flex gap-2 mt-auto">
          {!product.noDemo && (
            <Button href={`/software/${product.slug}/demo`} variant="secondary" className="flex-1 text-sm">
              <Eye aria-hidden className="h-4 w-4" /> Demo
            </Button>
          )}
          {!product.buyOnly && (
            <Button href={`/checkout?product=${product.slug}&plan=monthly`} className="flex-1 text-sm">
              <Zap aria-hidden className="h-4 w-4" /> Start Now
            </Button>
          )}
          <Button href={`https://wa.me/${wa}?text=${encodeURIComponent(`I'm interested in ${product.name}`)}`} target="_blank" rel="noreferrer" variant="secondary" aria-label={`WhatsApp us about ${product.name}`} className="px-3">💬</Button>
        </div>
      </div>
    </Card>
  );
}
