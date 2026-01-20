'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Public login route that redirects to admin login
export default function LoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/login')
  }, [router])

  return null
}
