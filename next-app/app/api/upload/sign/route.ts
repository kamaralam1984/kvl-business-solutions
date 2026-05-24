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
  const paramsToSign = { timestamp, folder: safeFolder };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);

  return NextResponse.json({
    ok: true,
    signature,
    timestamp,
    folder: safeFolder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
