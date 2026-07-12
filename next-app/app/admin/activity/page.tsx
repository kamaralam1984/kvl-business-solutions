import { connectDB } from '@/lib/mongodb';
import { ActivityLog } from '@/lib/models/ActivityLog';
import {
  Activity, User, Box, RefreshCcw, FileText, Layers, Tag, BookOpen,
  Megaphone, Monitor, Ticket as TicketIcon, Workflow as WorkflowIcon,
  Calendar, Star, Settings, Package,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Explicit overrides for actions that deserve a nicer label than the
// auto-generated one below (e.g. "Refund" instead of "Order refund").
const actionMeta: Record<string, { color: string; Icon: any; label: string }> = {
  'order.refund': { color: 'text-red-500 bg-red-500/10', Icon: RefreshCcw, label: 'Refund' },
  'workflow.run': { color: 'text-green-500 bg-green-500/10', Icon: WorkflowIcon, label: 'Workflow ran (automatic)' },
  'workflow.fail': { color: 'text-red-500 bg-red-500/10', Icon: WorkflowIcon, label: 'Workflow failed (automatic)' },
  'workflow.test': { color: 'text-blue-500 bg-blue-500/10', Icon: WorkflowIcon, label: 'Workflow tested' },
  'lead.auto_deal': { color: 'text-green-500 bg-green-500/10', Icon: User, label: 'Lead auto-converted to deal' },
};

// Icon per resource — used by the fallback below for every action type that
// doesn't have an explicit override, so nothing renders as a raw dot-notation
// string with a generic icon.
const RESOURCE_ICON: Record<string, any> = {
  product: Box, user: User, order: Package, blog: FileText, 'case-study': Layers,
  coupon: Tag, course: BookOpen, banner: Megaphone, demo: Monitor, ticket: TicketIcon,
  workflow: WorkflowIcon, booking: Calendar, quote: FileText, review: Star,
  lead: User, settings: Settings,
};

const PAST_TENSE: Record<string, string> = { create: 'created', delete: 'deleted', update: 'updated', seed: 'seeded', reply: 'replied' };

function getActionMeta(action: string): { color: string; Icon: any; label: string } {
  if (actionMeta[action]) return actionMeta[action];
  const [resource, ...verbParts] = action.split('.');
  const verb = verbParts.join('_');
  const Icon = RESOURCE_ICON[resource] || Activity;
  const color = verb.includes('delete') || verb.includes('fail') ? 'text-red-500 bg-red-500/10'
    : verb.includes('create') ? 'text-green-500 bg-green-500/10'
    : 'text-blue-500 bg-blue-500/10';
  const resourceLabel = resource ? resource.replace('-', ' ') : action;
  const verbLabel = PAST_TENSE[verb] || verb.replace('_', ' ') || 'updated';
  const label = `${resourceLabel.charAt(0).toUpperCase()}${resourceLabel.slice(1)} ${verbLabel}`;
  return { color, Icon, label };
}

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
          const meta = getActionMeta(l.action);
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
