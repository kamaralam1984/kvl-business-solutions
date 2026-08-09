'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingBag } from 'lucide-react';

type Purchase = { firstName: string; city: string | null; product: string; minutesAgo: number };
type Data = { liveCount: number; recentPurchases: Purchase[] };

// Real live-viewer count + recent-purchase ticker for the ad landing pages.
// Both numbers come from actual VIP session/order data (see
// app/api/public/social-proof/route.ts) — never fabricated. Renders nothing
// at all if there's genuinely no live traffic and no recent purchase to
// show, rather than displaying a padded/fake number.
export function LiveSocialProof({ path, dark = false }: { path: string; dark?: boolean }) {
  const [data, setData] = useState<Data | null>(null);
  const [purchaseIdx, setPurchaseIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () => fetch(`/api/public/social-proof?path=${encodeURIComponent(path)}`)
      .then(r => r.json())
      .then(d => { if (alive && d.ok) setData(d); })
      .catch(() => {});
    load();
    const t = setInterval(load, 25_000);
    return () => { alive = false; clearInterval(t); };
  }, [path]);

  useEffect(() => {
    if (!data || data.recentPurchases.length < 2) return;
    const t = setInterval(() => setPurchaseIdx(i => (i + 1) % data.recentPurchases.length), 4500);
    return () => clearInterval(t);
  }, [data]);

  if (!data || (data.liveCount === 0 && data.recentPurchases.length === 0)) return null;

  const textColor = dark ? 'rgba(255,255,255,0.7)' : '#4b5563';
  const subColor = dark ? 'rgba(255,255,255,0.4)' : '#9ca3af';
  const purchase = data.recentPurchases[purchaseIdx];

  return (
    <div className="flex flex-col items-center gap-1.5">
      {data.liveCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-[11.5px] font-semibold"
          style={{ color: textColor }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          <Users className="w-3.5 h-3.5" style={{ color: subColor }} />
          {data.liveCount} {data.liveCount === 1 ? 'person is' : 'people are'} viewing this offer right now
        </motion.div>
      )}

      {purchase && (
        <AnimatePresence mode="wait">
          <motion.div
            key={purchaseIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-1.5 text-[11px]"
            style={{ color: subColor }}
          >
            <ShoppingBag className="w-3 h-3 shrink-0" />
            <span>
              <b style={{ color: textColor }}>{purchase.firstName}</b>
              {purchase.city ? ` (${purchase.city})` : ''} bought {purchase.product} · {purchase.minutesAgo}m ago
            </span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
