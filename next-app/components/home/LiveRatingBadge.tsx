'use client';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export function LiveRatingBadge() {
  const [data, setData] = useState<{ avgRating: number; count: number } | null>(null);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => { if (d.ok) setData({ avgRating: d.avgRating, count: d.count }); })
      .catch(() => {});
  }, []);

  // No approved reviews yet — don't show a fabricated number.
  if (!data || data.count === 0) return null;

  return (
    <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'rgb(var(--text-2))' }}>
      <Star className="w-4 h-4 shrink-0" style={{ color: '#f59e0b' }} />
      {data.avgRating}/5 Client Rating ({data.count} review{data.count === 1 ? '' : 's'})
    </div>
  );
}
