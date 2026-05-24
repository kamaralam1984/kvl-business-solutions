import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET(req: Request) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  const url = new URL(req.url);
  const q = url.searchParams.get('q');
  const filter = q ? { $or: [{ email: { $regex: q, $options: 'i' } }, { name: { $regex: q, $options: 'i' } }] } : {};
  await connectDB();
  const users = await User.find(filter).select('-passwordHash -verifyToken -resetToken').sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ ok: true, users });
}
