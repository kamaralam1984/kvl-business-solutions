import { NextRequest, NextResponse } from 'next/server'
import { getUserBySession, getUserSessionCookieName } from '@/lib/userAuth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(getUserSessionCookieName())?.value
    if (!token) return NextResponse.json({ success: true, user: null })

    const user = await getUserBySession(token)
    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 })
  }
}

