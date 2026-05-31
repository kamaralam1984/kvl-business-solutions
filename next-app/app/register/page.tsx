'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, MailCheck, User, Mail, Lock, Phone, Building2 } from 'lucide-react';
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
    <div className="min-h-screen grid place-items-center p-4" style={{ background: '#0a0a0a' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card-premium p-10 max-w-md w-full text-center"
      >
        <div
          className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-4"
          style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)' }}
        >
          <MailCheck className="w-8 h-8" style={{ color: '#c8a96e' }} />
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>Check your inbox!</h1>
        <p className="mt-3 text-sm" style={{ color: '#888' }}>
          We sent a verification link to <span className="font-semibold" style={{ color: '#f5f5f0' }}>{form.email}</span>. Click it to confirm your account.
        </p>
        <p className="text-xs mt-3" style={{ color: '#888' }}>Redirecting you to your dashboard…</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>

      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: '#080808', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.4), transparent)' }} />
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,169,110,0.06) 0%, transparent 100%)' }} />

        <div className="relative z-10 text-center px-12">
          <div className="mb-8">
            <div className="text-6xl font-extrabold tracking-tight mb-2" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>KVL</div>
            <div className="text-sm tracking-[4px] uppercase" style={{ color: '#c8a96e' }}>Business Solutions</div>
          </div>

          <div className="divider-gold mb-8 max-w-[120px] mx-auto" />

          <h2 className="text-3xl font-extrabold mb-3 leading-tight" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>
            Join 1000+<br />businesses scaling<br />with KVL
          </h2>
          <p className="text-sm leading-relaxed max-w-xs mx-auto mb-8" style={{ color: '#888' }}>
            Access all products, track orders, and manage your business tools in one dashboard.
          </p>

          <div className="space-y-3 text-left max-w-xs mx-auto">
            {[
              'Free account — no credit card required',
              'Access to all 15 software demos',
              'Dedicated support from day one',
              'ISO 9001 certified service delivery',
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-sm" style={{ color: '#888' }}>
                <span className="text-xs shrink-0" style={{ color: '#c8a96e' }}>✓</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: '#0a0a0a' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-7">
            <h1 className="text-3xl font-extrabold" style={{ color: '#f5f5f0', fontFamily: 'Poppins, sans-serif' }}>Create your account</h1>
            <p className="text-sm mt-2" style={{ color: '#888' }}>Free forever — no credit card needed</p>
          </div>

          <Suspense fallback={null}><GoogleSignInButton /></Suspense>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs" style={{ color: '#888' }}>or sign up with email</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4" style={{ color: '#888' }} />
                <input
                  className="form-control pl-10"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4" style={{ color: '#888' }} />
                <input
                  type="email"
                  className="form-control pl-10"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4" style={{ color: '#888' }} />
                <input
                  type="password"
                  className="form-control pl-10"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  required
                  minLength={6}
                  placeholder="6+ characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Phone <span style={{ color: '#888' }}>(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4" style={{ color: '#888' }} />
                <input
                  className="form-control pl-10"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#f5f5f0' }}>Company <span style={{ color: '#888' }}>(optional)</span></label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 w-4 h-4" style={{ color: '#888' }} />
                <input
                  className="form-control pl-10"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#f5f5f0' }}
                  placeholder="Your company"
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                />
              </div>
            </div>
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <button
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-[11px] text-center mt-4" style={{ color: '#888' }}>
            By signing up, you agree to our{' '}
            <Link href="/terms" className="transition-colors" style={{ color: '#c8a96e' }}>Terms</Link> and{' '}
            <Link href="/privacy" className="transition-colors" style={{ color: '#c8a96e' }}>Privacy Policy</Link>.
          </p>
          <p className="text-sm text-center mt-3" style={{ color: '#888' }}>
            Have an account?{' '}
            <Link href="/login" className="font-medium transition-colors" style={{ color: '#c8a96e' }}>Login</Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
}
