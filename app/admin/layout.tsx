'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  FiLayout,
  FiUsers,
  FiMessageCircle,
  FiGlobe,
  FiUserX,
  FiSettings,
  FiBell,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
} from 'react-icons/fi'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: FiLayout },
  { name: 'Pages', href: '/admin/pages', icon: FiLayout },
  { name: 'Gallery', href: '/admin/gallery', icon: FiLayout },
  { name: 'Leads', href: '/admin/leads', icon: FiUsers },
  { name: 'Web Chats', href: '/admin/web-chats', icon: FiGlobe },
  { name: 'WhatsApp Users', href: '/admin/whatsapp-users', icon: FiMessageCircle },
  { name: 'Unknown Users', href: '/admin/unknown-users', icon: FiUserX },
  { name: 'GOLU AI Logs', href: '/admin/golu-logs', icon: FiMessageCircle },
  { name: 'Follow-up', href: '/admin/followup', icon: FiUsers },
  { name: 'Admins', href: '/admin/admins', icon: FiUserX },
  { name: 'Settings', href: '/admin/settings', icon: FiSettings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, logout, user, profile } = useAuth()

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isAuthenticated, pathname, router])

  if (!isAuthenticated && pathname !== '/admin/login') return null
  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="admin-layout">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-700"
          >
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl admin-btn flex items-center justify-center">
              <span className="text-white font-bold">KVL</span>
            </div>
            <span className="hidden md:block font-semibold text-lg">
              Admin Panel
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-black">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-white/60"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">
                  {profile?.username || user || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {profile?.role || 'Administrator'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full admin-btn flex items-center justify-center text-white font-bold">
                {(profile?.username || user || 'A')[0].toUpperCase()}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 admin-card p-2">
                <Link
                  href="/admin/profile"
                  className="admin-link"
                  onClick={() => setProfileOpen(false)}
                >
                  <FiUser /> Profile
                </Link>
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    logout()
                  }}
                  className="admin-link text-red-600"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`admin-sidebar fixed top-16 bottom-0 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`admin-link ${active ? 'active' : ''}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* ================= CONTENT ================= */}
      <main
        className={`admin-content pt-20 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-0'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
