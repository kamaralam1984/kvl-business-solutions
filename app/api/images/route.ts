import { NextRequest, NextResponse } from 'next/server'
import { getImages, saveImage, deleteImage } from '@/lib/db'

export async function GET() {
  try {
    let images = getImages()

    // If no images are present in the file-based DB (common on fresh deploys),
    // return a lightweight fallback set so the gallery is never empty in production.
    if (!images || images.length === 0) {
      images = [
        {
          id: 1,
          title: 'Modern Control Room',
          description: 'CCTV & command center setup for smart facilities.',
          imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=75',
          category: 'CCTV Installation',
          uploadedBy: 'system',
          uploadedAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Industrial Flooring',
          description: 'High-durability civil work for heavy traffic areas.',
          imageUrl: 'https://images.unsplash.com/photo-1503389152951-9f343605f61e?w=1200&q=75',
          category: 'Civil Work',
          uploadedBy: 'system',
          uploadedAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'Mechanical Assembly',
          description: 'Precision mechanical fabrication and assembly.',
          imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=75',
          category: 'Mechanical Work',
          uploadedBy: 'system',
          uploadedAt: new Date().toISOString(),
        },
      ]
    }

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
