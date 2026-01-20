import { NextRequest, NextResponse } from 'next/server'
import { createSession, createUser, getUserSessionCookieName } from '@/lib/userAuth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    if (String(password).length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const user = await createUser({ name, email, password })
    const token = await createSession(user.id)

    const res = NextResponse.json({ success: true, user })
    res.cookies.set(getUserSessionCookieName(), token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return res
  } catch (error: any) {
    const msg = typeof error?.message === 'string' ? error.message : 'Signup failed'
    const status = msg.includes('exists') ? 400 : 500
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}

