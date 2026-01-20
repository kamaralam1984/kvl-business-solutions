'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  user: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('admin_auth')
    const adminUser = localStorage.getItem('admin_user')
    
    if (auth === 'true' && adminUser) {
      setIsAuthenticated(true)
      setUser(adminUser)
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
        localStorage.setItem('admin_user', username)
        setIsAuthenticated(true)
        setUser(username)
        return true
      }
      return false
    } catch (error) {
      // Fallback to default admin for development
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_auth', 'true')
        localStorage.setItem('admin_user', username)
        setIsAuthenticated(true)
        setUser(username)
        return true
      }
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_auth')
    localStorage.removeItem('admin_user')
    setIsAuthenticated(false)
    setUser(null)
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
