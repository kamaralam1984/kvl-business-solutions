'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X, Workflow as WorkflowIcon, Zap, Play, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const TRIGGERS = [
  { id: 'new_lead', label: 'New lead form submission' },
  { id: 'new_order', label: 'New order created' },
  { id: 'new_ticket', label: 'New support ticket' },
  { id: 'order_paid', label: 'Order payment received' },
  { id: 'lead_inactive_3d', label: 'Lead inactive for 3 days' },
  { id: 'cart_abandoned', label: 'Cart abandoned (24h)' },
];

const ACTIONS = [
  { id: 'send_email', label: 'Send email' },
  { id: 'create_notification', label: 'Create in-app notification' },
  { id: 'add_to_crm', label: 'Add to CRM as deal' },
  { id: 'whatsapp_message', label: 'Send WhatsApp message' },
  { id: 'webhook', label: 'Call webhook URL' },
];

type Workflow = {
  _id?: string; name: string; description?: string; trigger: string; action: string;
  config: { emailSubject?: string; emailTemplate?: string; notificationTitle?: string; notificationMessage?: string; webhookUrl?: string; whatsappMessage?: string };
  active: boolean; runCount?: number; lastRunAt?: string; lastError?: string;
};

const empty: Workflow = {
  name: '', description: '', trigger: 'new_lead', action: 'send_email',
  config: { emailSubject: '', emailTemplate: '' }, active: true,
};

export default function WorkflowsPage() {
  const [items, setItems] = useState<Workflow[]>([]);
  const [editing, setEditing] = useState<Workflow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; result: any } | null>(null);

  const load = () => fetch('/api/admin/workflows').then(r => r.json()).then(d => d.ok && setItems(d.workflows));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/workflows' : `/api/admin/workflows/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    setEditing(null); load();
  };

  const toggleActive = async (w: Workflow) => {
    await fetch(`/api/admin/workflows/${w._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !w.active }) });
    load();
  };

  const del = async (id?: string) => {
    if (!id || !confirm('Delete workflow?')) return;
    await fetch(`/api/admin/workflows/${id}`, { method: 'DELETE' });
    load();
  };

  const runTest = async (id: string) => {
    setTesting(id); setTestResult(null);
    try {
      const r = await fetch(`/api/admin/workflows/${id}/test`, { method: 'POST' });
      const d = await r.json();
      setTestResult({ id, result: d });
    } catch (e: any) {
      setTestResult({ id, result: { ok: false, error: e.message } });
    } finally { setTesting(null); load(); }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2"><WorkflowIcon className="w-6 h-6 text-primary" /> Automation Workflows</h1>
          <p className="text-text2 text-sm mt-1">When X happens, do Y. Save hours of manual work.</p>
        </div>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Workflow</button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && <div className="card-base p-10 text-center text-text2"><Zap className="w-10 h-10 mx-auto opacity-30 mb-2" />No workflows yet. Click "New Workflow" to automate something.</div>}
        {items.map(w => {
          const trig = TRIGGERS.find(t => t.id === w.trigger)?.label || w.trigger;
          const act = ACTIONS.find(a => a.id === w.action)?.label || w.action;
          return (
            <div key={w._id} className="card-base p-5 flex items-center gap-5">
              <div className="text-3xl">⚡</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{w.name}</div>
                <div className="text-xs text-text2 mt-1">
                  <span className="font-semibold">When</span> {trig} → <span className="font-semibold">then</span> {act}
                </div>
                {w.description && <div className="text-xs text-text2 mt-1">{w.description}</div>}
                <div className="text-[10px] text-text2 mt-1 flex flex-wrap gap-3">
                  <span>Run {w.runCount || 0} times</span>
                  {w.lastRunAt && <span>Last: {new Date(w.lastRunAt).toLocaleString('en-IN')}</span>}
                </div>
                {w.lastError && (
                  <div className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Last error: {w.lastError}
                  </div>
                )}
                {testResult?.id === w._id && (
                  <div className={`mt-2 text-[10px] p-2 rounded ${testResult.result.ok ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {testResult.result.ok ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <AlertCircle className="w-3 h-3 inline mr-1" />}
                    Test: ran={testResult.result.result?.ran ?? 0}, failed={testResult.result.result?.failed ?? 0}
                    {testResult.result.error && ` — ${testResult.result.error}`}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(w)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.active ? 'bg-green-500/20 text-green-500' : 'bg-slate-500/20 text-slate-500'}`}>
                  {w.active ? 'ACTIVE' : 'PAUSED'}
                </button>
                <button onClick={() => runTest(w._id!)} disabled={testing === w._id} className="text-text2 hover:text-primary text-xs inline-flex items-center gap-1">
                  {testing === w._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} Test
                </button>
                <button onClick={() => { setEditing(w); setIsNew(false); }} className="text-text2 hover:text-primary text-xs">Edit</button>
                <button onClick={() => del(w._id)} className="text-text2 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" onClick={() => setEditing(null)}>
          <div className="card-base p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold">{isNew ? 'New Workflow' : 'Edit Workflow'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="form-control" placeholder="Workflow name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              <input className="form-control" placeholder="Description (optional)" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />

              <label className="text-xs text-text2">WHEN (trigger)</label>
              <select className="form-control" value={editing.trigger} onChange={e => setEditing({ ...editing, trigger: e.target.value })}>
                {TRIGGERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>

              <label className="text-xs text-text2">THEN (action)</label>
              <select className="form-control" value={editing.action} onChange={e => setEditing({ ...editing, action: e.target.value })}>
                {ACTIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>

              {editing.action === 'send_email' && (
                <>
                  <input className="form-control" placeholder="Email subject" value={editing.config.emailSubject || ''} onChange={e => setEditing({ ...editing, config: { ...editing.config, emailSubject: e.target.value } })} />
                  <textarea className="form-control" rows={4} placeholder="Email body (HTML supported)" value={editing.config.emailTemplate || ''} onChange={e => setEditing({ ...editing, config: { ...editing.config, emailTemplate: e.target.value } })} />
                </>
              )}
              {editing.action === 'create_notification' && (
                <>
                  <input className="form-control" placeholder="Notification title" value={editing.config.notificationTitle || ''} onChange={e => setEditing({ ...editing, config: { ...editing.config, notificationTitle: e.target.value } })} />
                  <input className="form-control" placeholder="Notification message" value={editing.config.notificationMessage || ''} onChange={e => setEditing({ ...editing, config: { ...editing.config, notificationMessage: e.target.value } })} />
                </>
              )}
              {editing.action === 'webhook' && (
                <input className="form-control" placeholder="https://..." value={editing.config.webhookUrl || ''} onChange={e => setEditing({ ...editing, config: { ...editing.config, webhookUrl: e.target.value } })} />
              )}
              {editing.action === 'whatsapp_message' && (
                <textarea className="form-control" rows={3} placeholder="WhatsApp message text" value={editing.config.whatsappMessage || ''} onChange={e => setEditing({ ...editing, config: { ...editing.config, whatsappMessage: e.target.value } })} />
              )}

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Active
              </label>

              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save Workflow</button>
              <p className="text-[10px] text-text2">✓ Live execution enabled. Use template vars: <code>{'{{name}}'}</code>, <code>{'{{email}}'}</code>, <code>{'{{amount}}'}</code>, <code>{'{{productName}}'}</code>, <code>{'{{orderId}}'}</code>, etc. Click "Test" to dry-run with mock data.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
