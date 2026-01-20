import { NextRequest, NextResponse } from 'next/server'
import { deleteAdmin } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admin ID required' },
        { status: 400 }
      )
    }

    const deleted = deleteAdmin(id)
    if (deleted) {
      return NextResponse.json({ success: true, message: 'Admin deleted' })
    } else {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete admin' },
      { status: 500 }
    )
  }
}
