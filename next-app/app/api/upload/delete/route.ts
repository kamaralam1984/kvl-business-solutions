import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cloudinary, isConfigured, ownerFolderKey } from '@/lib/cloudinary';

const schema = z.object({ publicId: z.string().min(2) });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 });
  if (!isConfigured()) return NextResponse.json({ ok: false, error: 'Uploads not configured' }, { status: 500 });

  try {
    const { publicId } = schema.parse(await req.json());
    const isAdmin = (session.user as any).role === 'admin';

    // Product images: admin only. Self-service folders (kvl/tickets,
    // kvl/users): uploads are signed into a per-user subfolder (see
    // app/api/upload/sign/route.ts) — a non-admin can only delete a
    // publicId under their own subfolder, not one they can guess/enumerate
    // for another user's ticket attachment or profile upload.
    if (publicId.startsWith('kvl/products/')) {
      if (!isAdmin) return NextResponse.json({ ok: false, error: 'Admin only' }, { status: 403 });
    } else if (!isAdmin) {
      const ownedPrefix = `/${ownerFolderKey(session.user.email)}/`;
      const isOwn = (publicId.startsWith('kvl/tickets/') || publicId.startsWith('kvl/users/')) && publicId.includes(ownedPrefix);
      if (!isOwn) return NextResponse.json({ ok: false, error: 'You can only delete your own uploads' }, { status: 403 });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return apiError(e);
  }
}
