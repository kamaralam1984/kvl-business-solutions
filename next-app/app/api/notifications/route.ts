import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/lib/models/Notification';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const url = new URL(req.url);
    const onlyUnread = url.searchParams.get('unread') === '1';
    const filter: any = { userEmail: session.user.email.toLowerCase() };
    if (onlyUnread) filter.read = false;

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(30).lean();
    const unreadCount = await Notification.countDocuments({ userEmail: session.user.email.toLowerCase(), read: false });

    return NextResponse.json({ ok: true, notifications, unreadCount });
  } catch (e) {
    return apiError(e);
  }
}

// Mark all as read
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    await Notification.updateMany({ userEmail: session.user.email.toLowerCase(), read: false }, { $set: { read: true } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
