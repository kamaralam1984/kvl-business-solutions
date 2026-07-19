'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';

// No-login-required review submission — the review-request email
// (lib/email.ts reviewRequestEmail) links here with ?name=&company= prefilled
// so a client who worked with KVL but never created an account can still
// leave a real testimonial. Backed by the same public POST /api/reviews used
// by the logged-in ReviewsSection widget on product pages; goes to
// `approved: false` pending admin moderation either way.
function ReviewForm() {
  const sp = useSearchParams();
  const [form, setForm] = useState({
    name: sp.get('name') || '',
    email: '',
    company: sp.get('company') || '',
    rating: 5,
    title: '',
    message: '',
  });
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending'); setErr('');
    try {
      const r = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Could not submit — please try again');
      setState('success');
    } catch (e: any) {
      setState('error'); setErr(e.message);
    }
  };

  if (state === 'success') {
    return (
      <div className="card-base p-8 text-center max-w-lg mx-auto">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-1">Thank you!</h2>
        <p className="text-text2 text-sm">Your review is submitted and pending a quick moderation check before it goes live. We really appreciate it.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-base p-7 max-w-lg mx-auto space-y-3">
      <div>
        <label className="text-xs text-text2 mb-1 block">Your rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button type="button" key={i} onClick={() => setForm({ ...form, rating: i })}>
              <Star className={`w-8 h-8 transition-all ${i <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-text2 hover:text-yellow-500'}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="form-control" placeholder="Your name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="form-control" type="email" placeholder="Email *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>
      <input className="form-control" placeholder="Company (optional)" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
      <input className="form-control" placeholder="Title (optional, e.g. 'Cut our billing time in half')" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea className="form-control" rows={4} placeholder="Share your experience — what did we build, and what changed for your business? *" required minLength={10} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
      {err && <p className="text-red-500 text-xs">{err}</p>}
      <button disabled={state === 'sending'} className="btn btn-primary w-full justify-center">
        <Send className="w-4 h-4" /> {state === 'sending' ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="YOUR EXPERIENCE"
        title="Tell us how it"
        accent="went"
        description="Real reviews from real clients — moderated, never fabricated. Takes about 2 minutes."
        breadcrumb="Reviews"
      />
      <section className="section">
        <div className="container">
          <Suspense fallback={null}>
            <ReviewForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
