import { DELIVERY_STAGES, deliveryStageInfo } from '@/lib/delivery-stages';

export function DeliveryProgress({ stage, notes, deliveredAt }: { stage?: string; notes?: string; deliveredAt?: Date | string }) {
  const current = deliveryStageInfo(stage || 'confirmed');
  const currentIdx = DELIVERY_STAGES.findIndex(s => s.key === current.key);

  return (
    <div className="card-base p-6">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold text-sm uppercase tracking-wider text-text2">Project Progress</h3>
        <span className="text-sm font-extrabold text-primary">{current.percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-tint overflow-hidden mb-5">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${current.percent}%` }} />
      </div>
      <ol className="space-y-3">
        {DELIVERY_STAGES.map((s, i) => (
          <li key={s.key} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full grid place-items-center shrink-0 text-[10px] font-bold ${
              i < currentIdx ? 'bg-primary text-white' : i === currentIdx ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-tint text-text2'
            }`}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${i <= currentIdx ? 'font-semibold text-text' : 'text-text2'}`}>{s.label}</span>
          </li>
        ))}
      </ol>
      {notes && (
        <div className="mt-5 surface-tint p-3 rounded-lg text-sm">
          <div className="text-xs text-text2 mb-1">Latest update</div>
          {notes}
        </div>
      )}
      {stage === 'delivered' && deliveredAt && (
        <div className="mt-3 text-xs text-text2">
          Delivered on {new Date(deliveredAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      )}
    </div>
  );
}
