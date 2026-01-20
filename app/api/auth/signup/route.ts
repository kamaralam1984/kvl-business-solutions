import { NextRequest, NextResponse } from 'next/server'
import { createAdmin, getAdminByUsername } from '@/lib/db'
import { ensureMongoSuperAdmin } from '@/lib/seedAdmin'

export async function POST(request: NextRequest) {
  try {
    await ensureMongoSuperAdmin()
    const { username, password, email } = await request.json()

    if (!username || !password || !email) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    const existing = await getAdminByUsername(username)
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      )
    }

    const admin = await createAdmin({
      username,
      password, // NOTE: plain text for now; hash in real production
      email,
      role: 'admin',
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

