'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill all fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Failed to create account.')
      } else {
        setSuccess('Signup successful! Redirecting to login...')
        setTimeout(() => {
          router.push('/admin/login')
        }, 1500)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ maxWidth: 420, width: '100%', borderRadius: '16px' }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h4 fw-bold mb-1 text-center" style={{ color: '#0E0C1D' }}>
            Create Admin Account
          </h1>
          <p className="text-muted text-center mb-4">KVL Business Solutions Admin Signup</p>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success py-2">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label mb-1 fw-semibold">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username or mobile/email"
              />
            </div>
            <div>
              <label className="form-label mb-1 fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="form-label mb-1 fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="form-label mb-1 fw-semibold">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              className="btn text-white w-100 mt-2"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '999px' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => router.push('/admin/login')}
            >
              Already have an account? Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

