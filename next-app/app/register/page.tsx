'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { UserPlus, MailCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GoogleSignInButton } from '@/components/widgets/GoogleSignInButton';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) { setErr(data.error || 'Failed'); return; }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    setSent(true);
    setTimeout(() => router.push('/dashboard'), 2500);
  };

  if (sent) return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card-base p-8 max-w-md w-full text-center">
        <MailCheck className="w-14 h-14 mx-auto text-green-500 mb-3" />
        <h1 className="text-2xl font-extrabold">Check your inbox!</h1>
        <p className="text-text2 mt-2 text-sm">We sent a verification link to <b>{form.email}</b>. Click it to confirm your account.</p>
        <p className="text-xs text-text2 mt-3">Redirecting you to your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card-base p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold">Create your account</h1>
          <p className="text-sm text-text2 mt-1">Join 1000+ businesses on KVL</p>
        </div>
        <Suspense fallback={null}><GoogleSignInButton /></Suspense>
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-tint flex-1" />
          <span className="text-xs text-text2">or</span>
          <div className="h-px bg-tint flex-1" />
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input className="form-control" required placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input type="email" className="form-control" required placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" className="form-control" required minLength={6} placeholder="Password (6+ chars)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <input className="form-control" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input className="form-control" placeholder="Company (optional)" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
          {err && <p className="text-red-500 text-xs">{err}</p>}
          <button disabled={loading} className="btn btn-primary w-full justify-center"><UserPlus className="w-4 h-4" /> {loading ? 'Creating...' : 'Create Account'}</button>
          <p className="text-[10px] text-text2 text-center">By signing up, you agree to our <Link href="/terms" className="text-primary">Terms</Link> and <Link href="/privacy" className="text-primary">Privacy Policy</Link>.</p>
        </form>
        <p className="text-sm text-text2 text-center mt-5">Have an account? <Link href="/login" className="text-primary">Login</Link></p>
      </div>
    </div>
  );
}
