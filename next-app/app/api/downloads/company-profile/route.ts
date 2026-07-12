import { getSiteSettings } from '@/lib/models/SiteSettings';
import { renderDownloadShell } from '@/lib/download-page';
import { services } from '@/lib/data/services';
import { logDownload } from '@/lib/models/DownloadLog';

export async function GET() {
  logDownload('company-profile');
  const settings = await getSiteSettings();

  const body = `
    <h2>Who We Are</h2>
    <p>KVL Business Solutions is a digital transformation and business automation partner, founded in 2019 in Patna, Bihar, India. We combine enterprise software engineering with infrastructure, GPS and industrial systems, civil engineering and digital marketing — delivered by one accountable team instead of five disconnected vendors.</p>

    <div class="grid">
      <div class="box"><b>14+</b><br/><span class="muted">Services Offered</span></div>
      <div class="box"><b>2019</b><br/><span class="muted">Founded</span></div>
      <div class="box"><b>ISO 27001</b><br/><span class="muted">Certified</span></div>
      <div class="box"><b>4.8/5</b><br/><span class="muted">Client Rating</span></div>
    </div>

    <h2>Our Mission</h2>
    <p>Give Indian businesses access to enterprise-grade technology — the systems large companies use, built for businesses of any size.</p>

    <h2>Our Promise</h2>
    <p>A 1-hour response, transparent fixed pricing, an NDA on request before we discuss your project, and support that doesn't end when the invoice is paid.</p>

    <h2>What We Do</h2>
    <div>${services.map(s => `<span class="pill">${s.name}</span>`).join('')}</div>

    <h2>How We Work</h2>
    <p>Discover → Planning → Design → Development → Testing → Deployment → Support. Scope, timeline and pricing are fixed in writing before any work begins, with weekly progress updates during development and a year of free updates and support after launch.</p>

    <h2>Certifications</h2>
    <p>ISO 27001 (Information Security Management) and MSME registration (Government of India), formalized in 2023.</p>
  `;

  const html = renderDownloadShell({
    title: 'KVL Business Solutions — Company Profile',
    tag: 'Company Profile',
    bodyHtml: body,
    settings,
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
