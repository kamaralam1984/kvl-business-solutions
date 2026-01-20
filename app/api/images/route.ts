import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getImages, saveImage, deleteImage } from "@/lib/db";

export const runtime = "nodejs";

/* =========================
   GET – fetch images
========================= */
export async function GET() {
  try {
    const images = await getImages();
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

    /* ========= BATCH UPLOAD ========= */
    if (Array.isArray(body.images)) {
      const savedImages = [];
      const errors = [];

      for (const img of body.images) {
        const { title, description, imageUrl, category, uploadedBy } = img;

        if (!title || !imageUrl || !category) {
          errors.push({ image: title || "Unknown", error: "Missing fields" });
          continue;
        }

        try {
          const upload = await cloudinary.uploader.upload(imageUrl, {
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

          savedImages.push(image);
        } catch (err) {
          console.error("Batch upload failed:", err);
          errors.push({ image: title || "Unknown", error: "Upload failed" });
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

    /* ========= SINGLE UPLOAD ========= */
    const { title, description, imageUrl, category, uploadedBy } = body;

    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const upload = await cloudinary.uploader.upload(imageUrl, {
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
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Image ID required" },
        { status: 400 }
      );
    }

    const deleted = await deleteImage(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE image error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
