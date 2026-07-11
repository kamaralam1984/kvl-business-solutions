'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const r = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || 'Something went wrong');
      setSent(true);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card-base p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold">Forgot password?</h1>
          <p className="text-sm text-text2 mt-1">Enter your email and we'll send a reset link.</p>
        </div>
        {sent ? (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-5xl">✓</div>
            <p className="text-sm">If <b>{email}</b> is registered, a reset link has been sent. Check your inbox (and spam) — the link expires in 1 hour.</p>
            <Link href="/login" className="btn btn-ghost w-full justify-center"><ArrowLeft className="w-4 h-4" /> Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <label htmlFor="forgot-email" className="sr-only">Your email</label>
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-text2" />
              <input
                id="forgot-email"
                name="email"
                className="form-control pl-10"
                type="email"
                autoComplete="email"
                required
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-invalid={!!err}
                aria-describedby={err ? 'forgot-error' : undefined}
              />
            </div>
            {err && <p id="forgot-error" role="alert" className="text-red-500 text-xs">{err}</p>}
            <button disabled={loading} className="btn btn-primary w-full justify-center">{loading ? 'Sending…' : 'Send Reset Link'}</button>
            <p className="text-sm text-text2 text-center mt-5">
              <Link href="/login" className="text-primary">← Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
