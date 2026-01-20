'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/contexts/UserAuthContext'

export default function UserLoginPage() {
  const router = useRouter()
  const { login } = useUserAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) router.push('/user/profile')
    else setError('Invalid email or password')
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ maxWidth: 420, width: '100%', borderRadius: '16px' }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h4 fw-bold mb-1 text-center" style={{ color: '#0E0C1D' }}>User Login</h1>
          <p className="text-muted text-center mb-4">Sign in to your account</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label mb-1 fw-semibold">Email</label>
              <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="form-label mb-1 fw-semibold">Password</label>
              <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button
              type="submit"
              className="btn text-white w-100 mt-2"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '999px' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <div className="text-center">
              <span className="text-muted small">Don&apos;t have an account? </span>
              <Link href="/register" className="small fw-semibold text-decoration-none">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

