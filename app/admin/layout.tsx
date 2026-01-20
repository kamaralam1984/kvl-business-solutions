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
  FiMenu,
  FiX
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isAuthenticated, pathname, router])

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-700 hover:text-[#0E0C1D] transition-colors"
            >
              {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0E0C1D] to-[#1E3A5F] rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">KVL</span>
              </div>
              <div className="hidden md:block">
                <span className="text-xl font-semibold text-[#0E0C1D]">Business Solution</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-[#0E0C1D] relative transition-colors">
              <FiBell className="text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-[#0E0C1D]">{user || 'Admin'}</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E0C1D] to-[#1E3A5F] flex items-center justify-center text-white font-semibold shadow-md">
                {user ? user.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
            <button 
              onClick={logout}
              className="text-gray-600 hover:text-red-600 flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <FiLogOut className="text-lg" />
              <span className="hidden md:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Left Sidebar */}
        <aside className={`bg-white border-r border-gray-200 w-64 fixed left-0 top-16 bottom-0 transition-transform duration-200 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0E0C1D] to-[#1E3A5F] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#0E0C1D]'
                  }`}
                >
                  <Icon className={`text-lg ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
