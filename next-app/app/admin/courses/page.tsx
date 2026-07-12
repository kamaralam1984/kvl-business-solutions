'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, X } from 'lucide-react';

type Lesson = { id: string; title: string; duration: string; content: string };
type Course = {
  _id?: string; slug: string; title: string; description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced'; category: string; duration: string;
  icon: string; c1: string; c2: string; lessons: Lesson[];
};

const empty: Course = {
  slug: '', title: '', description: '', level: 'Beginner', category: '', duration: '',
  icon: 'BookOpen', c1: '#3b82f6', c2: '#1d4ed8', lessons: [{ id: 'intro', title: '', duration: '', content: '' }],
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch('/api/admin/courses').then(r => r.json()).then(d => d.ok && setCourses(d.courses));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/courses' : `/api/admin/courses/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const body = isNew ? editing : { ...editing, slug: undefined };
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.ok) { setEditing(null); setIsNew(false); setMsg('✓ Saved'); load(); }
    else setMsg(`Error: ${d.error}`);
  };

  const del = async (id?: string) => {
    if (!id || !confirm('Delete this course?')) return;
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    load();
  };

  const updateLesson = (i: number, key: keyof Lesson, val: string) => {
    if (!editing) return;
    const lessons = [...editing.lessons];
    lessons[i] = { ...lessons[i], [key]: val };
    setEditing({ ...editing, lessons });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold" style={{ color: '#f0ede6' }}>Courses ({courses.length})</h1>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> New Course</button>
      </div>
      <p className="text-[12.5px] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
        This lists only courses created here — the existing hand-written courses stay in code, but any new course below appears on /learn alongside them.
      </p>
      {msg && <div className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{msg}</div>}

      <div className="card-base overflow-hidden kpi-enter" style={{ background: 'linear-gradient(135deg, #0f0f12 0%, #111114 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase" style={{ color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <tr><th className="p-3">Title</th><th className="p-3">Slug</th><th className="p-3">Level</th><th className="p-3">Lessons</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c._id} className="transition-colors duration-150 hover:bg-white/[0.025]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="p-3 font-semibold" style={{ color: '#f0ede6' }}>{c.title}</td>
                <td className="p-3 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.slug}</td>
                <td className="p-3" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.level}</td>
                <td className="p-3" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.lessons.length}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(c); setIsNew(false); }} className="p-1" style={{ color: 'rgba(255,255,255,0.4)' }}><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => del(c._id)} className="p-1" style={{ color: 'rgba(255,255,255,0.4)' }}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && <tr><td colSpan={5} className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>No admin-created courses yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur" onClick={() => setEditing(null)}>
          <div
            className="p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold" style={{ color: '#f0ede6' }}>{isNew ? 'New Course' : 'Edit Course'}</h2>
              <button onClick={() => setEditing(null)} style={{ color: 'rgba(255,255,255,0.5)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {isNew && <input className="form-control" placeholder="slug (e.g., billing-basics)" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase() })} />}
              <input className="form-control" placeholder="Title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              <textarea className="form-control" rows={2} placeholder="Description" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              <div className="grid grid-cols-3 gap-2">
                <select className="form-control" value={editing.level} onChange={e => setEditing({ ...editing, level: e.target.value as Course['level'] })}>
                  <option value="Beginner" style={{ background: '#0f0f12', color: '#f0ede6' }}>Beginner</option>
                  <option value="Intermediate" style={{ background: '#0f0f12', color: '#f0ede6' }}>Intermediate</option>
                  <option value="Advanced" style={{ background: '#0f0f12', color: '#f0ede6' }}>Advanced</option>
                </select>
                <input className="form-control" placeholder="Category" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} />
                <input className="form-control" placeholder="Duration (e.g. 2 hours)" value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Lessons</label>
                  <button onClick={() => setEditing({ ...editing, lessons: [...editing.lessons, { id: `lesson-${editing.lessons.length + 1}`, title: '', duration: '', content: '' }] })} className="text-[11px] font-semibold" style={{ color: '#c8a96e' }}>+ Add Lesson</button>
                </div>
                <div className="space-y-2.5">
                  {editing.lessons.map((l, i) => (
                    <div key={i} className="p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex gap-2">
                        <input className="form-control flex-1" placeholder="Lesson title" value={l.title} onChange={e => updateLesson(i, 'title', e.target.value)} />
                        <input className="form-control w-24" placeholder="8 min" value={l.duration} onChange={e => updateLesson(i, 'duration', e.target.value)} />
                        <button onClick={() => setEditing({ ...editing, lessons: editing.lessons.filter((_, idx) => idx !== i) })} style={{ color: 'rgba(255,255,255,0.3)' }}><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <textarea className="form-control w-full" rows={3} placeholder="Lesson content (markdown)" value={l.content} onChange={e => updateLesson(i, 'content', e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={save} className="btn btn-primary w-full justify-center">Save Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
