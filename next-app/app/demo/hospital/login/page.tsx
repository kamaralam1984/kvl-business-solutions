'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HeartPulse, Mail, Lock, ArrowRight, Info } from 'lucide-react';

export default function HospitalDemoLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/demo/hospital/dashboard'), 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(13,148,136,0.07) 0%, transparent 60%)' }} />

      <div className="w-full max-w-sm relative">
        <Link href="/demo/hospital" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-teal-600 grid place-items-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">VitalCare<span className="text-teal-600">HMS</span></span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-8">
          <h1 className="text-xl font-extrabold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to City Care Hospital&apos;s workspace</p>

          <div className="flex items-start gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2.5 mb-6">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="text-xs text-teal-800 leading-relaxed">This is a live product demo — click <span className="font-semibold">Sign In</span> with any details to continue.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="hms-email" className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="hms-email"
                  type="email"
                  defaultValue="admin@citycarehospital.demo"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>
            <div>
              <label htmlFor="hms-password" className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="hms-password"
                  type="password"
                  defaultValue="demo1234"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-500">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" /> Remember me
              </label>
              <span className="text-teal-600 font-medium">Forgot password?</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Demo by <Link href="/software/hospital" className="font-semibold text-slate-500 hover:text-teal-600">KVL Business Solutions</Link>
        </p>
      </div>
    </div>
  );
}
