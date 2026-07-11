import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cloudinary, isConfigured } from '@/lib/cloudinary';

const schema = z.object({ publicId: z.string().min(2) });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 });
  if (!isConfigured()) return NextResponse.json({ ok: false, error: 'Uploads not configured' }, { status: 500 });

  try {
    const { publicId } = schema.parse(await req.json());
    // Only admins can delete product images; users can only delete their own ticket attachments
    if (publicId.startsWith('kvl/products/') && (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Admin only' }, { status: 403 });
    }
    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return apiError(e);
  }
}
