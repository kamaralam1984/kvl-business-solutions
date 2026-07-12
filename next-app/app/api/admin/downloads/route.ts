import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { DownloadLog } from '@/lib/models/DownloadLog';
import { Lead } from '@/lib/models/Lead';
import { requireAdmin } from '@/lib/admin-guard';

const DOCS = [
  { type: 'company-profile', label: 'Company Profile', href: '/api/downloads/company-profile' },
  { type: 'portfolio', label: 'Portfolio', href: '/api/downloads/portfolio' },
  { type: 'service-brochure', label: 'Service Brochure', href: '/api/downloads/service-brochure' },
];

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();

  const docs = await Promise.all(DOCS.map(async d => {
    const [downloads, interested] = await Promise.all([
      DownloadLog.countDocuments({ type: d.type }),
      Lead.countDocuments({ source: `download-${d.type}` }),
    ]);
    return { ...d, downloads, interested };
  }));

  const recent = await DownloadLog.find({}).sort({ downloadedAt: -1 }).limit(20).lean();

  return NextResponse.json({ ok: true, docs, recent });
}
