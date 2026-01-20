import { NextRequest, NextResponse } from 'next/server'
import { getPages, getPageByPath, savePage, deletePage } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (path) {
      const page = getPageByPath(path)
      if (page) {
        return NextResponse.json({ success: true, page })
      } else {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 }
        )
      }
    }

    const pages = getPages()
    return NextResponse.json({ success: true, pages })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, path, title, description, sections, updatedBy } = body

    if (!path || !title || !sections) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const page = savePage({
      id: id || `page-${Date.now()}`,
      path,
      title,
      description: description || '',
      sections: sections || [],
      updatedBy: updatedBy || 'admin',
    })

    return NextResponse.json({ success: true, page })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save page' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Page ID required' },
        { status: 400 }
      )
    }

    const deleted = deletePage(id)
    if (deleted) {
      return NextResponse.json({ success: true, message: 'Page deleted' })
    } else {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}
