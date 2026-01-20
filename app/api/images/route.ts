import { NextRequest, NextResponse } from 'next/server'
import { getImages, saveImage, deleteImage } from '@/lib/db'

export async function GET() {
  try {
    const images = getImages()
    return NextResponse.json({ success: true, images })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if it's a batch upload (array of images)
    if (Array.isArray(body.images)) {
      const savedImages = []
      const errors = []

      for (const img of body.images) {
        const { title, description, imageUrl, category, uploadedBy } = img

        if (!title || !imageUrl || !category) {
          errors.push({ image: title || 'Unknown', error: 'Missing required fields' })
          continue
        }

        try {
          const image = saveImage({
            title,
            description: description || '',
            imageUrl,
            category,
            uploadedBy: uploadedBy || 'admin',
            uploadedAt: new Date().toISOString(),
          })
          savedImages.push(image)
        } catch (error) {
          errors.push({ image: title || 'Unknown', error: 'Failed to save' })
        }
      }

      return NextResponse.json({
        success: true,
        images: savedImages,
        saved: savedImages.length,
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined,
      })
    }

    // Single image upload (backward compatible)
    const { title, description, imageUrl, category, uploadedBy } = body

    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const image = saveImage({
      title,
      description: description || '',
      imageUrl,
      category,
      uploadedBy: uploadedBy || 'admin',
      uploadedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, image })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID required' },
        { status: 400 }
      )
    }

    const deleted = deleteImage(id)
    if (deleted) {
      return NextResponse.json({ success: true, message: 'Image deleted' })
    } else {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
