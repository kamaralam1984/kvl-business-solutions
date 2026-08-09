import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/lib/models/Notification';

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    await Notification.findOneAndUpdate(
      { _id: params.id, userEmail: session.user.email.toLowerCase() },
      { $set: { read: true } }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    await Notification.findOneAndDelete({ _id: params.id, userEmail: session.user.email.toLowerCase() });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
