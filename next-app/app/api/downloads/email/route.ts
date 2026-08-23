import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError } from '@/lib/api-response';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { getSiteSettings } from '@/lib/models/SiteSettings';
import { sendNotification, downloadPdfEmail } from '@/lib/email';
import { renderPdfBuffer } from '@/lib/pdf/render';
import { CompanyProfilePDF } from '@/lib/pdf/companyProfile';
import { PortfolioPDF } from '@/lib/pdf/portfolio';
import { ServiceBrochurePDF } from '@/lib/pdf/serviceBrochure';

const DOCS = {
  'company-profile': { title: 'Company Profile', filename: 'KVL-Company-Profile.pdf', build: CompanyProfilePDF },
  portfolio: { title: 'Portfolio', filename: 'KVL-Portfolio.pdf', build: PortfolioPDF },
  'service-brochure': { title: 'Service Brochure', filename: 'KVL-Service-Brochure.pdf', build: ServiceBrochurePDF },
} as const;

const schema = z.object({
  type: z.enum(['company-profile', 'portfolio', 'service-brochure']),
  name: z.string().min(2),
  email: z.string().email(),
});

// Generates the requested document as a real PDF (see lib/pdf/*) and emails
// it to the person who filled the download-gate form — separate from
// /api/lead, which handles CRM/deal-pipeline creation for the same
// submission. Kept as its own endpoint so a PDF-generation failure never
// blocks lead capture, and vice versa.
export async function POST(req: Request) {
  const limit = rateLimit(`download-email:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many requests, try again later' }, { status: 429 });
  try {
    const { type, name, email } = schema.parse(await req.json());
    const doc = DOCS[type];
    const settings = await getSiteSettings();
    const buffer = await renderPdfBuffer(await doc.build({ settings }));

    await sendNotification(
      `Your ${doc.title} from KVL Business Solutions`,
      downloadPdfEmail({ name, docTitle: doc.title }),
      email,
      [{ filename: doc.filename, content: buffer }]
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
