'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle2 } from 'lucide-react';

function ResetForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setErr('Passwords do not match'); return; }
    setLoading(true); setErr('');
    try {
      const r = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || 'Reset failed');
      setDone(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  if (!token) return (
    <div className="card-base p-8 max-w-md w-full text-center">
      <p className="text-red-500 mb-3">Invalid reset link</p>
      <Link href="/forgot-password" className="btn btn-primary">Request New Link</Link>
    </div>
  );

  return (
    <div className="card-base p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold">Reset password</h1>
        <p className="text-sm text-text2 mt-1">Choose a new password for your account.</p>
      </div>
      {done ? (
        <div className="text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <p className="font-semibold">Password reset successful!</p>
          <p className="text-sm text-text2">Redirecting to login…</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
            <input className="form-control pl-10" type="password" required minLength={6} placeholder="New password (6+ chars)" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
            <input className="form-control pl-10" type="password" required minLength={6} placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          {err && <p className="text-red-500 text-xs">{err}</p>}
          <button disabled={loading} className="btn btn-primary w-full justify-center">{loading ? 'Saving…' : 'Reset Password'}</button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Suspense fallback={<div>Loading…</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
