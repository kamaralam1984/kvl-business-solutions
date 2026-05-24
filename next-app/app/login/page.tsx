'use client';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock } from 'lucide-react';
import { GoogleSignInButton } from '@/components/widgets/GoogleSignInButton';

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setErr('Invalid email or password'); return; }
    const callback = sp.get('callbackUrl') || '/dashboard';
    router.push(callback);
  };

  return (
    <div className="card-base p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        <p className="text-sm text-text2 mt-1">Login to your KVL account</p>
      </div>
      <GoogleSignInButton />
      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-tint flex-1" />
        <span className="text-xs text-text2">or</span>
        <div className="h-px bg-tint flex-1" />
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div className="relative"><Mail className="absolute left-3 top-3.5 w-4 h-4 text-text2" /><input className="form-control pl-10" type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="relative"><Lock className="absolute left-3 top-3.5 w-4 h-4 text-text2" /><input className="form-control pl-10" type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        {err && <p className="text-red-500 text-xs">{err}</p>}
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
        </div>
        <button disabled={loading} className="btn btn-primary w-full justify-center"><LogIn className="w-4 h-4" /> {loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <p className="text-sm text-text2 text-center mt-5">No account? <Link href="/register" className="text-primary">Register here</Link></p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Suspense fallback={<div>Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
