import { NextRequest, NextResponse } from "next/server";
import { getImages, saveImage, deleteImage } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

/* =========================
   GET – fetch images
========================= */
export async function GET() {
  try {
    let images = await getImages();

    // fallback (safe to keep)
    if (!images || images.length === 0) {
      images = [
        {
          id: 1,
          title: "Modern Control Room",
          description: "CCTV & command center setup for smart facilities.",
          imageUrl:
            "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=75",
          category: "CCTV Installation",
          uploadedBy: "system",
          uploadedAt: new Date().toISOString(),
        },
      ];
    }

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("GET images error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

/* =========================
   POST – upload image(s)
========================= */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ✅ BATCH UPLOAD
    if (Array.isArray(body.images)) {
      const savedImages = [];
      const errors = [];

      for (const img of body.images) {
        const { title, description, imageBase64, category, uploadedBy } = img;

        if (!title || !imageBase64 || !category) {
          errors.push({
            image: title || "Unknown",
            error: "Missing required fields",
          });
          continue;
        }

        try {
          // Upload to Cloudinary
          const upload = await cloudinary.uploader.upload(imageBase64, {
            folder: "kvl-gallery",
          });

          const image = await saveImage({
            title,
            description: description || "",
            imageUrl: upload.secure_url, // ✅ Cloudinary URL
            category,
            uploadedBy: uploadedBy || "admin",
            uploadedAt: new Date().toISOString(),
          });

          savedImages.push(image);
        } catch (err) {
          console.error("Batch upload failed:", err);
          errors.push({
            image: title || "Unknown",
            error: "Upload failed",
          });
        }
      }

      return NextResponse.json({
        success: true,
        images: savedImages,
        saved: savedImages.length,
        failed: errors.length,
        errors: errors.length ? errors : undefined,
      });
    }

    // ✅ SINGLE UPLOAD (backward compatible)
    const { title, description, imageBase64, category, uploadedBy } = body;

    if (!title || !imageBase64 || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const upload = await cloudinary.uploader.upload(imageBase64, {
      folder: "kvl-gallery",
    });

    const image = await saveImage({
      title,
      description: description || "",
      imageUrl: upload.secure_url,
      category,
      uploadedBy: uploadedBy || "admin",
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("POST image error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save image" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE – remove image
========================= */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Image ID required" },
        { status: 400 }
      );
    }

    const deleted = await deleteImage(id);

    if (deleted) {
      return NextResponse.json({ success: true, message: "Image deleted" });
    }

    return NextResponse.json(
      { success: false, error: "Image not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("DELETE image error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
