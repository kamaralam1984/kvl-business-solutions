'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type UserProfile = { id: number; name: string; email: string; createdAt: string }

interface UserAuthContextType {
  user: UserProfile | null
  loading: boolean
  refresh: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const Ctx = createContext<UserAuthContextType | undefined>(undefined)

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await fetch('/api/user/me', { cache: 'no-store' })
      const data = await res.json()
      if (data?.success) setUser(data.user || null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data?.success) {
      setUser(data.user)
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (data?.success) {
      setUser(data.user)
      return true
    }
    return false
  }

  const logout = async () => {
    await fetch('/api/user/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  return (
    <Ctx.Provider value={{ user, loading, refresh, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useUserAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider')
  return ctx
}

