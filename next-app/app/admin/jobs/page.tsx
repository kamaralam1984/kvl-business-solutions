'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Save, Briefcase, ExternalLink } from 'lucide-react';

type Job = {
  _id?: string; slug: string; title: string; department: string; location: string;
  type: string; remote: boolean; experience?: string; salary?: string;
  description?: string; requirements: string[]; responsibilities: string[];
  active: boolean; applicationCount?: number;
};

const empty: Job = {
  slug: '', title: '', department: 'Engineering', location: 'Patna, India',
  type: 'Full-time', remote: false, experience: '', salary: '',
  description: '', requirements: [], responsibilities: [], active: true,
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editing, setEditing] = useState<Job | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/jobs')
      .then(r => r.json())
      .then(d => { if (d.ok) setJobs(d.jobs); else setLoadError(true); })
      .catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/jobs' : `/api/admin/jobs/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    setEditing(null); load();
  };

  const toggleActive = async (j: Job) => {
    await fetch(`/api/admin/jobs/${j._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !j.active }) });
    load();
  };

  const del = async (id?: string) => {
    if (!id || !confirm('Delete this job?')) return;
    await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary" /> Jobs ({jobs.length})</h1>
          <p className="text-text2 text-sm mt-1">Manage job postings. Active jobs appear at <a href="/careers" className="text-primary">/careers</a>.</p>
        </div>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Job</button>
      </div>

      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Title</th><th className="p-3">Department</th><th className="p-3">Location</th><th className="p-3 text-right">Applications</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {jobs.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-text2">{loadError ? 'Failed to load jobs — check your connection and try refreshing.' : <>No jobs yet. Click &quot;New Job&quot; to add.</>}</td></tr>}
            {jobs.map(j => (
              <tr key={j._id} className="border-b border-tint last:border-b-0 hover:bg-primary/5">
                <td className="p-3 font-semibold">
                  {j.title}
                  <div className="text-xs text-text2 font-mono">/careers/{j.slug}</div>
                </td>
                <td className="p-3 text-xs">{j.department}</td>
                <td className="p-3 text-xs">{j.location}{j.remote && ' · Remote'}</td>
                <td className="p-3 text-right font-bold">{j.applicationCount || 0}</td>
                <td className="p-3">
                  <button onClick={() => toggleActive(j)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${j.active ? 'bg-green-500/20 text-green-500' : 'bg-slate-500/20 text-slate-500'}`}>
                    {j.active ? 'LIVE' : 'HIDDEN'}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <a href={`/careers/${j.slug}`} target="_blank" rel="noreferrer" className="text-text2 hover:text-primary p-1 inline-block"><ExternalLink className="w-4 h-4" /></a>
                  <button onClick={() => { setEditing(j); setIsNew(false); }} className="text-text2 hover:text-primary text-xs ml-2">Edit</button>
                  <button onClick={() => del(j._id)} className="text-text2 hover:text-red-500 p-1 ml-2"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" onClick={() => setEditing(null)}>
          <div className="card-base p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold">{isNew ? 'New Job' : 'Edit Job'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {isNew && <input className="form-control" placeholder="slug (e.g., senior-backend-engineer)" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} />}
              <input className="form-control" placeholder="Job title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" placeholder="Department" value={editing.department} onChange={e => setEditing({ ...editing, department: e.target.value })} />
                <select className="form-control" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => (
                    <option key={t} style={{ background: 'rgb(var(--bg-2))', color: 'rgb(var(--text))' }}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" placeholder="Location" value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.remote} onChange={e => setEditing({ ...editing, remote: e.target.checked })} /> Remote OK</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="form-control" placeholder="Experience (e.g., 2-5 years)" value={editing.experience || ''} onChange={e => setEditing({ ...editing, experience: e.target.value })} />
                <input className="form-control" placeholder="Salary (e.g., ₹8-15 LPA)" value={editing.salary || ''} onChange={e => setEditing({ ...editing, salary: e.target.value })} />
              </div>
              <textarea className="form-control" rows={3} placeholder="Role description" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              <textarea className="form-control" rows={3} placeholder="Responsibilities (one per line)" value={editing.responsibilities.join('\n')} onChange={e => setEditing({ ...editing, responsibilities: e.target.value.split('\n').filter(Boolean) })} />
              <textarea className="form-control" rows={3} placeholder="Requirements (one per line)" value={editing.requirements.join('\n')} onChange={e => setEditing({ ...editing, requirements: e.target.value.split('\n').filter(Boolean) })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Active (publicly visible)</label>
              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
