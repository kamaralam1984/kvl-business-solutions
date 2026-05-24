'use client';
import { useEffect, useState } from 'react';
import { Search, ShieldCheck, Shield, Trash2 } from 'lucide-react';
import { ExportButton } from '@/components/admin/ExportButton';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState('');

  const load = (search = '') => fetch(`/api/admin/users${search ? `?q=${encodeURIComponent(search)}` : ''}`).then(r => r.json()).then(d => d.ok && setUsers(d.users));
  useEffect(() => { load(); }, []);

  const toggleRole = async (u: any) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Make ${u.email} ${newRole === 'admin' ? 'an ADMIN' : 'a regular user'}?`)) return;
    await fetch(`/api/admin/users/${u._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: newRole }) });
    load(q);
  };

  const del = async (u: any) => {
    if (!confirm(`Delete user ${u.email}? This is permanent.`)) return;
    await fetch(`/api/admin/users/${u._id}`, { method: 'DELETE' });
    load(q);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4 gap-4">
        <h1 className="text-2xl font-extrabold">Users ({users.length})</h1>
        <div className="flex items-end gap-3">
          <ExportButton type="users" />
          <form onSubmit={e => { e.preventDefault(); load(q); }} className="relative w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or email" className="form-control pl-10" />
          </form>
        </div>
      </div>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Joined</th><th className="p-3">Email</th><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Role</th><th className="p-3">Verified</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-tint hover:bg-primary/5">
                <td className="p-3 text-xs text-text2">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3 font-semibold">{u.email}</td>
                <td className="p-3 text-text2">{u.name}</td>
                <td className="p-3 text-text2 text-xs">{u.phone || '—'}</td>
                <td className="p-3">
                  <button onClick={() => toggleRole(u)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-slate-500/20 text-slate-500'} hover:opacity-80`}>
                    {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />} {u.role.toUpperCase()}
                  </button>
                </td>
                <td className="p-3 text-xs">{u.emailVerified ? <span className="text-green-500">✓ verified</span> : <span className="text-yellow-500">pending</span>}</td>
                <td className="p-3 text-right">
                  <button onClick={() => del(u)} className="text-text2 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-text2">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
