import { connectDB } from '@/lib/mongodb';
import { ActivityLog } from '@/lib/models/ActivityLog';
import { Activity, User, Package, Box, RefreshCcw, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

const actionMeta: Record<string, { color: string; Icon: any; label: string }> = {
  'order.refund': { color: 'text-red-500 bg-red-500/10', Icon: RefreshCcw, label: 'Refund' },
  'product.create': { color: 'text-green-500 bg-green-500/10', Icon: Box, label: 'Product created' },
  'product.update': { color: 'text-blue-500 bg-blue-500/10', Icon: Box, label: 'Product updated' },
  'product.delete': { color: 'text-red-500 bg-red-500/10', Icon: Box, label: 'Product deleted' },
  'user.update': { color: 'text-blue-500 bg-blue-500/10', Icon: User, label: 'User updated' },
  'user.delete': { color: 'text-red-500 bg-red-500/10', Icon: User, label: 'User deleted' },
};

export default async function AdminActivityPage() {
  await connectDB();
  const logs: any[] = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(200).lean();

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Activity Log ({logs.length})</h1>
        <span className="text-xs text-text2">Last 200 actions</span>
      </div>
      <div className="card-base">
        {logs.length === 0 && <div className="p-8 text-center text-text2">No activity yet. Admin actions will appear here.</div>}
        {logs.map((l: any) => {
          const meta = actionMeta[l.action] || { color: 'text-text2 bg-tint', Icon: Activity, label: l.action };
          return (
            <div key={l._id} className="border-b border-tint last:border-b-0 p-4 flex gap-3 items-start hover:bg-primary/5">
              <div className={`w-9 h-9 rounded-full grid place-items-center shrink-0 ${meta.color}`}><meta.Icon className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold">{meta.label}</span>
                  {l.target && <span className="text-text2 text-xs">{l.target}: <code className="font-mono">{l.targetId || '—'}</code></span>}
                </div>
                <div className="text-xs text-text2 mt-1 flex flex-wrap gap-3">
                  <span>by <b>{l.actorEmail || 'system'}</b></span>
                  <span>{new Date(l.createdAt).toLocaleString('en-IN')}</span>
                  {l.ip && <span>IP: {l.ip}</span>}
                </div>
                {l.details && Object.keys(l.details).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-[10px] text-text2 cursor-pointer">Details</summary>
                    <pre className="text-[10px] mt-1 surface-tint p-2 rounded overflow-x-auto">{JSON.stringify(l.details, null, 2)}</pre>
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
