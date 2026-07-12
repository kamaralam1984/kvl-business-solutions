import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cloudinary, isConfigured } from '@/lib/cloudinary';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 });
  if (!isConfigured()) return NextResponse.json({ ok: false, error: 'Uploads not configured' }, { status: 500 });

  const limit = rateLimit(`upload:${clientIp(req)}`, 20, 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many uploads' }, { status: 429 });

  const { folder = 'kvl/tickets' } = await req.json().catch(() => ({}));
  const allowedFolders = ['kvl/tickets', 'kvl/products', 'kvl/users'];
  const safeFolder = allowedFolders.includes(folder) ? folder : 'kvl/tickets';

  // Only admins can upload product images
  if (safeFolder === 'kvl/products' && (session.user as any).role !== 'admin') {
    return NextResponse.json({ ok: false, error: 'Admin only' }, { status: 403 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Compress every upload at ingest — auto quality + a sane max dimension —
  // so a 10MB photo lands in Cloudinary storage as a much smaller derivative
  // instead of keeping the original file size. Non-image files (PDFs, etc.)
  // pass through resource_type=auto unaffected since these only apply to images.
  const transformation = 'q_auto:good,w_1920,c_limit,f_auto';
  const paramsToSign = { timestamp, folder: safeFolder, transformation };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);

  return NextResponse.json({
    ok: true,
    signature,
    timestamp,
    folder: safeFolder,
    transformation,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
