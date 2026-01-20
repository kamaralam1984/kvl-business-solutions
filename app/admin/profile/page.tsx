'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function AdminProfilePage() {
  const { profile, user } = useAuth()

  const username = profile?.username || user || 'Admin'
  const email = profile?.email || '-'
  const role = profile?.role || '-'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-[#0E0C1D] mb-2">Profile</h1>
      <p className="text-gray-600 mb-4">Your admin account details</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Username</div>
          <div className="text-sm font-semibold text-[#0E0C1D]">{username}</div>
        </div>
        <div className="p-4 rounded-lg border bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Email</div>
          <div className="text-sm font-semibold text-[#0E0C1D]">{email}</div>
        </div>
        <div className="p-4 rounded-lg border bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Role</div>
          <div className="text-sm font-semibold text-[#0E0C1D] text-uppercase">{role}</div>
        </div>
      </div>
    </div>
  )
}

