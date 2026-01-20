import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, getUserSessionCookieName } from '@/lib/userAuth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(getUserSessionCookieName())?.value
    if (token) {
      await deleteSession(token)
    }
    const res = NextResponse.json({ success: true })
    res.cookies.set(getUserSessionCookieName(), '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    })
    return res
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 })
  }
}

