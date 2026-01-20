'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/contexts/UserAuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { signup } = useUserAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Password and Confirm Password do not match.')
      return
    }
    setLoading(true)
    const ok = await signup(name, email, password)
    setLoading(false)
    if (ok) router.push('/user/profile')
    else setError('Failed to register. Email may already exist.')
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ maxWidth: 460, width: '100%', borderRadius: '16px' }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h4 fw-bold mb-1 text-center" style={{ color: '#0E0C1D' }}>Create Account</h1>
          <p className="text-muted text-center mb-4">Register to login/logout anytime</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label mb-1 fw-semibold">Name</label>
              <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="form-label mb-1 fw-semibold">Email</label>
              <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="form-label mb-1 fw-semibold">Password</label>
              <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className="form-text">Minimum 6 characters</div>
            </div>
            <div>
              <label className="form-label mb-1 fw-semibold">Confirm Password</label>
              <input className="form-control" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>

            <button
              type="submit"
              className="btn text-white w-100 mt-2"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '999px' }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Register'}
            </button>

            <div className="text-center">
              <span className="text-muted small">Already have an account? </span>
              <Link href="/user/login" className="small fw-semibold text-decoration-none">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

