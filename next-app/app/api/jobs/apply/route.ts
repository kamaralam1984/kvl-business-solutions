import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { Job, Application } from '@/lib/models/Job';
import { sendNotification } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const schema = z.object({
  jobSlug: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  experience: z.string().optional(),
  currentRole: z.string().optional(),
  linkedinUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
  resumePublicId: z.string().optional(),
  coverLetter: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`apply:${clientIp(req)}`, 3, 60 * 60_000);
  if (!limit.allowed) return NextResponse.json({ ok: false, error: 'Too many applications' }, { status: 429 });

  try {
    const data = schema.parse(await req.json());
    await connectDB();
    const job = await Job.findOne({ slug: data.jobSlug });
    if (!job) return NextResponse.json({ ok: false, error: 'Job not found' }, { status: 404 });

    const app = await Application.create({
      ...data,
      job: job._id,
      jobTitle: job.title,
    });
    await Job.updateOne({ _id: job._id }, { $inc: { applicationCount: 1 } });

    sendNotification(
      `📋 New job application: ${data.name} for ${job.title}`,
      `<h2>New Application</h2>
       <p><b>${data.name}</b> (${data.email}, ${data.phone}) applied for <b>${job.title}</b></p>
       <p>Experience: ${data.experience || 'N/A'}<br/>Current role: ${data.currentRole || 'N/A'}<br/>LinkedIn: ${data.linkedinUrl || 'N/A'}</p>
       ${data.resumeUrl ? `<p>Resume: <a href="${data.resumeUrl}">Download</a></p>` : ''}
       <p>Cover letter:<br/>${data.coverLetter || 'N/A'}</p>`
    );

    return NextResponse.json({ ok: true, id: app._id });
  } catch (e) {
    return apiError(e);
  }
}
