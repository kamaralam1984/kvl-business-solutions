import { NextRequest, NextResponse } from 'next/server'
import { getAdmins, createAdmin, getAdminByUsername } from '@/lib/db'

export async function GET() {
  try {
    const admins = getAdmins()
    // Don't send passwords
    const safeAdmins = admins.map(({ password, ...admin }) => admin)
    return NextResponse.json({ success: true, admins: safeAdmins })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admins' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, email, role } = body

    if (!username || !password || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existing = getAdminByUsername(username)
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      )
    }

    const admin = createAdmin({
      username,
      password, // In production, hash this password
      email,
      role: role || 'admin',
    })

    // Don't send password
    const { password: _, ...safeAdmin } = admin

    return NextResponse.json({ success: true, admin: safeAdmin })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}
