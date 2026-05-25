import { Check, CreditCard, Package, Sparkles, XCircle, RefreshCcw } from 'lucide-react';

type Status = 'created' | 'paid' | 'failed' | 'refunded';

export function OrderTimeline({ status, createdAt, paidAt, refundedAt }: { status: Status; createdAt: Date | string; paidAt?: Date | string; refundedAt?: Date | string }) {
  const isPaid = status === 'paid';
  const isFailed = status === 'failed';
  const isRefunded = status === 'refunded';

  const baseSteps = [
    { key: 'created', label: 'Order Created', Icon: Package, date: createdAt, done: true },
    { key: 'paid', label: 'Payment Received', Icon: CreditCard, date: paidAt, done: isPaid || isRefunded },
    { key: 'provisioned', label: 'License Issued', Icon: Sparkles, date: paidAt, done: isPaid || isRefunded },
    { key: 'active', label: 'Active & Ready', Icon: Check, date: paidAt, done: isPaid },
  ];

  // Replace last step on terminal states
  const steps = isFailed
    ? [...baseSteps.slice(0, 1), { key: 'failed', label: 'Payment Failed', Icon: XCircle, date: createdAt, done: true, error: true }]
    : isRefunded
    ? [...baseSteps.slice(0, 3), { key: 'refunded', label: 'Refunded', Icon: RefreshCcw, date: refundedAt, done: true, warning: true }]
    : baseSteps;

  return (
    <div className="card-base p-6">
      <h3 className="font-bold text-sm uppercase tracking-wider text-text2 mb-5">Order Status</h3>
      <ol className="relative">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          const Icon = s.Icon;
          const errored = (s as any).error;
          const warned = (s as any).warning;
          const colorClass = errored ? 'bg-red-500 text-white' : warned ? 'bg-slate-500 text-white' : s.done ? 'bg-primary text-white' : 'bg-tint text-text2';
          return (
            <li key={s.key} className="flex gap-4 pb-6 last:pb-0 relative">
              {!isLast && <span className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${s.done && steps[i+1]?.done ? 'bg-primary' : 'bg-tint'}`} />}
              <div className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 pt-1.5">
                <div className={`font-semibold text-sm ${s.done ? 'text-text' : 'text-text2'}`}>{s.label}</div>
                {s.date && s.done && (
                  <div className="text-xs text-text2 mt-0.5">
                    {new Date(s.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                {!s.done && !errored && !warned && <div className="text-xs text-text2 mt-0.5 italic">Pending</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
