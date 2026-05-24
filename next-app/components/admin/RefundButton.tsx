'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw, X, Loader2 } from 'lucide-react';

export function RefundButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const refund = async () => {
    setLoading(true); setErr('');
    try {
      const r = await fetch(`/api/admin/refund/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Refund failed');
      setOpen(false);
      router.refresh();
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-text2 hover:text-red-500 inline-flex items-center gap-1">
        <RefreshCcw className="w-3.5 h-3.5" /> Refund
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" onClick={() => !loading && setOpen(false)}>
          <div className="card-base p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold">Refund order</h3>
              <button onClick={() => !loading && setOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-text2 mb-3">Order: <code className="font-mono">{orderId}</code></p>
            <p className="text-sm mb-3">This will issue a <b>full refund</b> via Razorpay and mark the order as refunded. Customer will be emailed.</p>
            <textarea
              className="form-control mb-3"
              rows={3}
              placeholder="Reason for refund (optional, shown internally)"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            {err && <p className="text-red-500 text-xs mb-3">{err}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} disabled={loading} className="btn btn-ghost">Cancel</button>
              <button onClick={refund} disabled={loading} className="btn btn-primary bg-red-600 hover:bg-red-700">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <><RefreshCcw className="w-4 h-4" /> Confirm Refund</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
