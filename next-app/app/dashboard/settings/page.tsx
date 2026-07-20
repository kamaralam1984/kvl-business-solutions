'use client';
import { useEffect, useState } from 'react';
import { Save, KeyRound, User as UserIcon, MapPin, Building2 } from 'lucide-react';

export default function SettingsPage() {
  const [u, setU] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(d => d.ok && setU(d.user));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const r = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: u.name, phone: u.phone, company: u.company, gstin: u.gstin, address: u.address || {} }),
      });
      const d = await r.json();
      setMsg(d.ok ? '✓ Profile saved' : `Error: ${d.error}`);
    } finally { setLoading(false); }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) { setPwMsg('Passwords do not match'); return; }
    setPwLoading(true); setPwMsg('');
    try {
      const r = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }),
      });
      const d = await r.json();
      setPwMsg(d.ok ? '✓ Password updated' : `Error: ${d.error}`);
      if (d.ok) setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } finally { setPwLoading(false); }
  };

  if (!u) return <div className="py-10">Loading…</div>;
  const addr = u.address || {};

  return (
    <div className="py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-1">Settings</h1>
      <p className="text-text2 mb-8">Manage your profile, billing info, and password.</p>

      <form onSubmit={save} className="card-base p-6 mb-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2"><UserIcon className="w-4 h-4 text-primary" /> Profile</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="text-xs text-text2">Full Name</label><input className="form-control" value={u.name || ''} onChange={e => setU({ ...u, name: e.target.value })} /></div>
          <div><label className="text-xs text-text2">Email</label><input className="form-control" value={u.email} disabled /></div>
          <div><label className="text-xs text-text2">Phone</label><input className="form-control" value={u.phone || ''} onChange={e => setU({ ...u, phone: e.target.value })} /></div>
          <div><label className="text-xs text-text2">Company</label><input className="form-control" value={u.company || ''} onChange={e => setU({ ...u, company: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="text-xs text-text2 flex items-center gap-1"><Building2 className="w-3 h-3" /> GSTIN (for tax invoices)</label><input className="form-control" placeholder="22AAAAA0000A1Z5" value={u.gstin || ''} onChange={e => setU({ ...u, gstin: e.target.value })} /></div>
        </div>

        <h3 className="font-semibold flex items-center gap-2 pt-4 border-t border-tint"><MapPin className="w-4 h-4 text-primary" /> Billing Address</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="form-control sm:col-span-2" placeholder="Address line 1" value={addr.line1 || ''} onChange={e => setU({ ...u, address: { ...addr, line1: e.target.value } })} />
          <input className="form-control sm:col-span-2" placeholder="Address line 2 (optional)" value={addr.line2 || ''} onChange={e => setU({ ...u, address: { ...addr, line2: e.target.value } })} />
          <input className="form-control" placeholder="City" value={addr.city || ''} onChange={e => setU({ ...u, address: { ...addr, city: e.target.value } })} />
          <input className="form-control" placeholder="State" value={addr.state || ''} onChange={e => setU({ ...u, address: { ...addr, state: e.target.value } })} />
          <input className="form-control" placeholder="Pincode" value={addr.pincode || ''} onChange={e => setU({ ...u, address: { ...addr, pincode: e.target.value } })} />
          <input className="form-control" placeholder="Country" value={addr.country || 'India'} onChange={e => setU({ ...u, address: { ...addr, country: e.target.value } })} />
        </div>

        <div className="flex items-center gap-3">
          <button disabled={loading} className="btn btn-primary"><Save className="w-4 h-4" /> {loading ? 'Saving…' : 'Save Profile'}</button>
          {msg && <span className="text-sm">{msg}</span>}
        </div>
      </form>

      <form onSubmit={changePassword} className="card-base p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2"><KeyRound className="w-4 h-4 text-primary" /> Change Password</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="form-control" type="password" required minLength={6} placeholder="Current password" value={pw.currentPassword} onChange={e => setPw({ ...pw, currentPassword: e.target.value })} />
          <input className="form-control" type="password" required minLength={6} placeholder="New password" value={pw.newPassword} onChange={e => setPw({ ...pw, newPassword: e.target.value })} />
          <input className="form-control" type="password" required minLength={6} placeholder="Confirm new" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} />
        </div>
        <div className="flex items-center gap-3">
          <button disabled={pwLoading} className="btn btn-primary">{pwLoading ? 'Updating…' : 'Update Password'}</button>
          {pwMsg && <span className="text-sm">{pwMsg}</span>}
        </div>
      </form>
    </div>
  );
}
