'use client';
import { useEffect, useState } from 'react';
import { Search, ShieldCheck, Shield, Trash2, Pencil, UserPlus, X, Eye, EyeOff } from 'lucide-react';
import { ExportButton } from '@/components/admin/ExportButton';
import { Modal } from '@/components/shared/Modal';

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', role: 'user' as 'user' | 'admin', password: '', emailVerified: true };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [loadError, setLoadError] = useState(false);

  const load = (search = '') => {
    setLoadError(false);
    return fetch(`/api/admin/users${search ? `?q=${encodeURIComponent(search)}` : ''}`)
      .then(r => r.json())
      .then(d => { if (d.ok) setUsers(d.users); else setLoadError(true); })
      .catch(() => setLoadError(true));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setErr(''); setShowPw(false);
    setModal('add');
  };

  const openEdit = (u: any) => {
    setEditing(u);
    setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', company: u.company || '', role: u.role, password: '', emailVerified: u.emailVerified });
    setErr(''); setShowPw(false);
    setModal('edit');
  };

  const closeModal = () => { setModal(null); setEditing(null); };

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) { setErr('Name, email aur password zaroori hai'); return; }
    setSaving(true); setErr('');
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const d = await res.json();
    setSaving(false);
    if (!d.ok) { setErr(d.error || 'Error'); return; }
    closeModal(); load(q);
  };

  const handleEdit = async () => {
    if (!form.name || !form.email) { setErr('Name aur email zaroori hai'); return; }
    setSaving(true); setErr('');
    const body: any = { name: form.name, email: form.email, phone: form.phone, company: form.company, role: form.role, emailVerified: form.emailVerified };
    if (form.password) body.password = form.password;
    const res = await fetch(`/api/admin/users/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await res.json();
    setSaving(false);
    if (!d.ok) { setErr(d.error || 'Error'); return; }
    closeModal(); load(q);
  };

  const del = async (u: any) => {
    if (!confirm(`Delete user ${u.email}? This is permanent.`)) return;
    await fetch(`/api/admin/users/${u._id}`, { method: 'DELETE' });
    load(q);
  };

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-text2 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="form-control w-full"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex justify-between items-end gap-4">
        <div>
          <p className="eyebrow mb-2">SYSTEM</p>
          <h1 className="text-2xl font-extrabold text-text">Users ({users.length})</h1>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton type="users" />
          <form onSubmit={e => { e.preventDefault(); load(q); }} className="relative w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'rgba(148,163,184,0.5)' }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or email"
              className="pl-9 w-full text-sm rounded-lg px-3 py-2 outline-none transition-all"
              style={{ background: 'rgba(var(--surface) / 0.04)', border: '1px solid rgba(var(--border) / 0.08)', color: 'rgba(var(--text) / 0.85)' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(200,169,110,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(var(--border) / 0.08)')} />
          </form>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.07)', borderRadius: '12px', overflow: 'hidden' }}>
        <table className="w-full text-sm">
          <thead style={{ borderBottom: '1px solid rgba(var(--border) / 0.07)' }}>
            <tr>
              {['Joined', 'Email', 'Name', 'Phone', 'Role', 'Verified', ''].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(148,163,184,0.6)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="transition-colors" style={{ borderBottom: '1px solid rgba(var(--border) / 0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(var(--surface) / 0.025)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-4 py-3 text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 font-semibold text-text">{u.email}</td>
                <td className="px-4 py-3 text-text2">{u.name || '—'}</td>
                <td className="px-4 py-3 text-text2 text-xs">{u.phone || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'text-[#888]'}`}
                    style={u.role === 'admin' ? undefined : { background: 'rgba(var(--surface) / 0.06)' }}
                  >
                    {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />} {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {u.emailVerified ? <span className="text-green-400">✓ verified</span> : <span className="text-amber-400">pending</span>}
                </td>
                <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                  <button onClick={() => openEdit(u)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ color: 'rgba(148,163,184,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgb(var(--text))')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(136,136,136,0.6)')}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(u)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ color: 'rgba(148,163,184,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.5)')}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center" style={{ color: 'rgba(148,163,184,0.5)' }}>
                {loadError ? 'Failed to load users — check your connection and try refreshing.' : 'No users found.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          onClose={closeModal}
          containerClassName="fixed inset-0 z-50 flex items-center justify-center p-4"
          containerStyle={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          className="rounded-2xl shadow-2xl w-full max-w-md"
          style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)' }}
        >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(var(--border) / 0.07)' }}>
              <h2 className="text-lg font-bold text-text">{modal === 'add' ? 'Add New User' : 'Edit User'}</h2>
              <button onClick={closeModal} style={{ color: 'rgba(148,163,184,0.6)' }} aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {field('name', 'Full Name', 'text', 'Full name')}
                {field('email', 'Email', 'email', 'user@example.com')}
                {field('phone', 'Phone', 'text', '+91 9999999999')}
                {field('company', 'Company', 'text', 'Company name')}
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-text2 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'user' | 'admin' }))} className="form-control w-full">
                  <option value="user" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>User</option>
                  <option value="admin" style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>Admin</option>
                </select>
              </div>

              {/* Email Verified toggle (edit only) */}
              {modal === 'edit' && (
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="ev" checked={form.emailVerified as boolean} onChange={e => setForm(f => ({ ...f, emailVerified: e.target.checked }))} className="w-4 h-4 accent-primary" />
                  <label htmlFor="ev" className="text-sm font-medium">Email Verified</label>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-text2 mb-1">
                  {modal === 'add' ? 'Password' : 'New Password (optional)'}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={modal === 'add' ? 'Min 6 characters' : 'Leave blank to keep current'}
                    className="form-control w-full pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-2.5 text-text2">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {err && <p className="text-red-500 text-sm">{err}</p>}
            </div>
            <div className="flex justify-end gap-3 px-5 pb-5">
              <button onClick={closeModal} className="btn-ghost">Cancel</button>
              <button onClick={modal === 'add' ? handleAdd : handleEdit} disabled={saving} className="btn-primary min-w-24">
                {saving ? 'Saving...' : modal === 'add' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
        </Modal>
      )}
    </div>
  );
}
