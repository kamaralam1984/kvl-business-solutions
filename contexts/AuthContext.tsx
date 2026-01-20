'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  user: string | null
  profile: { username: string; email?: string; role?: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [profile, setProfile] = useState<{ username: string; email?: string; role?: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('admin_auth')
    const adminUser = localStorage.getItem('admin_user')
    const adminProfileRaw = localStorage.getItem('admin_profile')
    
    if (auth === 'true' && adminUser) {
      setIsAuthenticated(true)
      setUser(adminUser)
      if (adminProfileRaw) {
        try {
          setProfile(JSON.parse(adminProfileRaw))
        } catch {
          // ignore
        }
      }
    } else if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [pathname, router])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check authentication via API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('admin_auth', 'true')
        localStorage.setItem('admin_user', data?.user?.username || username)
        if (data?.user) {
          localStorage.setItem('admin_profile', JSON.stringify(data.user))
          setProfile(data.user)
        }
        setIsAuthenticated(true)
        setUser(data?.user?.username || username)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_auth')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_profile')
    setIsAuthenticated(false)
    setUser(null)
    setProfile(null)
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, profile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
