import { NextRequest, NextResponse } from 'next/server'
import { getAdminByUsername } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      )
    }

    const admin = await getAdminByUsername(username)
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In production, use bcrypt to compare hashed passwords
    if (admin.password === password) {
      return NextResponse.json({
        success: true,
        user: {
          username: admin.username,
          email: admin.email,
          role: admin.role,
        }
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
