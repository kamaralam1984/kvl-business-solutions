'use client';
import { useEffect, useState } from 'react';
import { Star, Check, X, Trash2, Award } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const load = () => fetch('/api/admin/reviews').then(r => r.json()).then(d => d.ok && setReviews(d.reviews));
  useEffect(() => { load(); }, []);

  const set = async (id: string, data: any) => {
    await fetch(`/api/admin/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    load();
  };
  const del = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = reviews.filter(r => filter === 'all' || (filter === 'pending' ? !r.approved : r.approved));

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Reviews ({reviews.length})</h1>
        <div className="flex gap-1">
          {(['pending', 'approved', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold ${filter === f ? 'bg-primary text-white' : 'surface-tint text-text2'}`}>
              {f.toUpperCase()} {f === 'pending' && reviews.filter(r => !r.approved).length > 0 && <span className="ml-1">({reviews.filter(r => !r.approved).length})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="card-base p-8 text-center text-text2">No {filter} reviews.</div>}
        {filtered.map(r => (
          <div key={r._id} className="card-base p-5">
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <div className="font-bold">{r.name}{r.company && <span className="text-text2 font-normal text-xs"> · {r.company}</span>}</div>
                    <div className="text-xs text-text2">{r.email}{r.productSlug && ` · ${r.productSlug}`}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-text2'}`} />)}
                  <span className="text-xs text-text2 ml-1">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                {r.title && <div className="font-semibold mb-1">{r.title}</div>}
                <p className="text-sm text-text2">{r.message}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {!r.approved ? (
                  <button onClick={() => set(r._id, { approved: true })} className="btn btn-primary text-xs"><Check className="w-3.5 h-3.5" /> Approve</button>
                ) : (
                  <button onClick={() => set(r._id, { approved: false })} className="btn btn-ghost text-xs"><X className="w-3.5 h-3.5" /> Unapprove</button>
                )}
                {r.approved && (
                  <button onClick={() => set(r._id, { featured: !r.featured })} className={`btn text-xs ${r.featured ? 'btn-primary' : 'btn-ghost'}`}>
                    <Award className="w-3.5 h-3.5" /> {r.featured ? 'Featured' : 'Feature'}
                  </button>
                )}
                <button onClick={() => del(r._id)} className="btn btn-ghost text-xs text-red-500"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
