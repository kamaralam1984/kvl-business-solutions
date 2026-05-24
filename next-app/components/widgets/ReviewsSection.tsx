'use client';
import { useEffect, useState } from 'react';
import { Star, Send, MessageSquarePlus } from 'lucide-react';
import { useSession } from 'next-auth/react';

type Review = { _id: string; name: string; company?: string; rating: number; title?: string; message: string; createdAt: string };

export function ReviewsSection({ productSlug, productName }: { productSlug?: string; productName?: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [err, setErr] = useState('');

  const load = () => {
    const q = productSlug ? `?product=${productSlug}` : '';
    fetch(`/api/reviews${q}`).then(r => r.json()).then(d => {
      if (d.ok) { setReviews(d.reviews); setAvg(d.avgRating); setCount(d.count); }
    });
  };
  useEffect(load, [productSlug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setState('sending'); setErr('');
    try {
      const r = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: session.user.name || 'Customer',
          email: session.user.email,
          rating: form.rating,
          title: form.title,
          message: form.message,
          productSlug,
        }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Failed');
      setState('success');
      setForm({ rating: 5, title: '', message: '' });
      setTimeout(() => { setOpen(false); setState('idle'); }, 2500);
    } catch (e: any) { setState('error'); setErr(e.message); }
  };

  return (
    <div className="card-base p-7">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">Customer Reviews</h2>
          {count > 0 ? (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(avg) ? 'text-yellow-500 fill-yellow-500' : 'text-text2'}`} />)}</div>
              <span className="text-sm font-bold">{avg}</span>
              <span className="text-xs text-text2">based on {count} review{count !== 1 ? 's' : ''}</span>
            </div>
          ) : (
            <p className="text-text2 text-sm mt-1">Be the first to review {productName || 'this'}</p>
          )}
        </div>
        {session?.user && (
          <button onClick={() => setOpen(!open)} className="btn btn-primary text-sm">
            <MessageSquarePlus className="w-4 h-4" /> Write Review
          </button>
        )}
      </div>

      {open && session?.user && (
        <form onSubmit={submit} className="surface-tint p-5 rounded-xl mb-6 space-y-3">
          <div>
            <label className="text-xs text-text2 mb-1 block">Your rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button type="button" key={i} onClick={() => setForm({ ...form, rating: i })}>
                  <Star className={`w-7 h-7 transition-all ${i <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-text2 hover:text-yellow-500'}`} />
                </button>
              ))}
            </div>
          </div>
          <input className="form-control" placeholder="Title (optional)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="form-control" rows={4} placeholder="Share your experience…" required minLength={10} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          {err && <p className="text-red-500 text-xs">{err}</p>}
          {state === 'success' && <p className="text-green-500 text-sm">✓ Thanks! Your review is pending approval.</p>}
          <button disabled={state === 'sending' || state === 'success'} className="btn btn-primary">
            <Send className="w-4 h-4" /> {state === 'sending' ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}

      {!session?.user && (
        <p className="text-xs text-text2 mb-4">
          <a href="/login" className="text-primary hover:underline">Sign in</a> to write a review.
        </p>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-text2 text-sm text-center py-6">No reviews yet.</p>
        ) : reviews.map(r => (
          <div key={r._id} className="border-b border-tint pb-4 last:border-b-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-primary/15 grid place-items-center text-primary font-bold text-sm">{r.name[0]?.toUpperCase()}</div>
              <div>
                <div className="font-semibold text-sm">{r.name}{r.company && <span className="text-text2 font-normal"> · {r.company}</span>}</div>
                <div className="flex items-center gap-2">
                  <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-text2'}`} />)}</div>
                  <span className="text-[10px] text-text2">{new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
            {r.title && <div className="font-semibold text-sm mt-2">{r.title}</div>}
            <p className="text-sm text-text2 mt-1">{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
