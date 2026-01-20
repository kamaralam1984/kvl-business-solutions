'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/contexts/UserAuthContext'

export default function UserProfilePage() {
  const router = useRouter()
  const { user, loading, logout, refresh } = useUserAuth()

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading && !user) router.push('/user/login')
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 fw-bold mb-0" style={{ color: '#0E0C1D' }}>My Profile</h1>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded">
                <div className="text-muted small">Name</div>
                <div className="fw-semibold">{user.name}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 bg-light rounded">
                <div className="text-muted small">Email</div>
                <div className="fw-semibold">{user.email}</div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Link href="/" className="text-decoration-none fw-semibold">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

