'use client';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>

      {/* Left panel — hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: '#080808', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Gold accent top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.4), transparent)' }} />
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,169,110,0.06) 0%, transparent 100%)' }} />

        <div className="relative z-10 text-center px-12">
          {/* KVL wordmark */}
          <div className="mb-8">
            <div
              className="text-6xl font-extrabold tracking-tight mb-2"
              style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}
            >
              KVL
            </div>
            <div className="text-sm tracking-[4px] uppercase" style={{ color: '#c8a96e' }}>Business Solutions</div>
          </div>

          {/* Gold divider */}
          <div className="divider-gold mb-8 max-w-[120px] mx-auto" />

          <p className="text-base leading-relaxed max-w-xs mx-auto" style={{ color: '#888' }}>
            Your complete enterprise dashboard — software, GPS, projects and support in one place.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[['1000+', 'Businesses'], ['500+', 'Projects'], ['14+', 'Services'], ['ISO', 'Certified']].map(([val, label]) => (
              <div key={label} className="card-premium p-4 text-center">
                <div className="text-2xl font-extrabold" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>{val}</div>
                <div className="text-xs mt-1 uppercase tracking-wider" style={{ color: '#888' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative" style={{ background: '#0a0a0a' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>Welcome back</h1>
            <p className="text-sm mt-2" style={{ color: '#888' }}>Login to your KVL account</p>
          </div>

          <GoogleSignInButton />

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs" style={{ color: '#888' }}>or continue with email</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4" style={{ color: '#888' }} />
                <input
                  className="form-control pl-10"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4" style={{ color: '#888' }} />
                <input
                  className="form-control pl-10"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs transition-colors" style={{ color: '#c8a96e' }}>
                Forgot password?
              </Link>
            </div>
            <button
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#888' }}>
            {"Don't have an account?"}{' '}
            <Link href="/register" className="font-medium transition-colors" style={{ color: '#c8a96e' }}>
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen grid place-items-center" style={{ background: '#0a0a0a' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(200,169,110,0.4)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
