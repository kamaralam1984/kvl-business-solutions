'use client';
import { useEffect, useState } from 'react';

const SESSION_FLAG = 'kvl_visit_counted';

// Small, quiet visitor count for the footer bottom bar.
export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let counted = false;
    try { counted = !!sessionStorage.getItem(SESSION_FLAG); if (!counted) sessionStorage.setItem(SESSION_FLAG, '1'); } catch {}
    fetch('/api/visitor-count', counted ? undefined : { method: 'POST' })
      .then(r => r.json()).then(d => { if (d.ok) setCount(d.count); }).catch(() => {});
  }, []);

  if (count == null) return null;
  return (
    <span className="inline-flex items-center gap-2 text-xs text-text2">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden />
      {count.toLocaleString('en-IN')} total visits
    </span>
  );
}
