'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Target, Info, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function CrmDemoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@pulsecrm.demo');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/demo/crm/dashboard');
    }, 900);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
          <Link href="/demo/crm" className="flex items-center justify-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
              <Target className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">PulseCRM</span>
          </Link>

          <div className="mt-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to your PulseCRM workspace</p>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-sm text-rose-700">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>This is a live product demo — any email &amp; password will work. Just hit Sign In.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-400" />
                Remember me
              </label>
              <span className="cursor-pointer font-medium text-rose-600 hover:text-rose-700">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in&hellip;
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/software/crm" className="font-semibold text-rose-600 hover:text-rose-700">
            Demo by KVL Business Solutions
          </Link>
        </p>
      </div>
    </div>
  );
}
