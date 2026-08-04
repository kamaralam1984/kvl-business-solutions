'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Send, CheckCircle2 } from 'lucide-react';
import { FileUploader, UploadedFile } from '@/components/widgets/FileUploader';

export function ApplicationForm({ jobSlug, jobTitle }: { jobSlug: string; jobTitle: string }) {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', currentRole: '', linkedinUrl: '', coverLetter: '' });
  const [resume, setResume] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending'); setErr('');
    try {
      const r = await fetch('/api/jobs/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobSlug, ...form,
          resumeUrl: resume[0]?.url, resumePublicId: resume[0]?.publicId,
        }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Failed');
      setStatus('success');
    } catch (e: any) { setStatus('error'); setErr(e.message); }
  };

  if (status === 'success') return (
    <div className="text-center py-4">
      <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-2" />
      <h3 className="font-bold">Application sent!</h3>
      <p className="text-xs text-text2 mt-2">We&apos;ll review and respond within 5 business days.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-2 text-sm">
      <input className="form-control" required placeholder="Full name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="email" className="form-control" required placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input className="form-control" required placeholder="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input className="form-control" placeholder="Years of experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
      <input className="form-control" placeholder="Current role" value={form.currentRole} onChange={e => setForm({ ...form, currentRole: e.target.value })} />
      <input className="form-control" placeholder="LinkedIn URL (optional)" value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} />
      <textarea className="form-control" rows={3} placeholder="Why are you a fit for this role?" value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} />

      {session?.user ? (
        <div>
          <label className="text-xs text-text2 mb-1 block">Resume (PDF, max 5MB)</label>
          <FileUploader folder="kvl/users" multiple={false} accept="application/pdf,image/*" maxSizeMB={5} value={resume} onChange={setResume} />
        </div>
      ) : (
        <p className="text-xs text-text2">Sign in to upload resume. Otherwise, attach via email after applying.</p>
      )}

      {err && <p className="text-red-500 text-xs">{err}</p>}
      <button disabled={status === 'sending'} className="btn btn-primary w-full justify-center">
        <Send className="w-4 h-4" /> {status === 'sending' ? 'Sending...' : `Apply for ${jobTitle.slice(0, 20)}...`}
      </button>
    </form>
  );
}
