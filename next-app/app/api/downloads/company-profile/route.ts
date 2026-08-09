import { getSiteSettings } from '@/lib/models/SiteSettings';
import { renderDownloadShell } from '@/lib/download-page';
import { services } from '@/lib/data/services';
import { logDownload } from '@/lib/models/DownloadLog';

export async function GET() {
  try {
  logDownload('company-profile');
  const settings = await getSiteSettings();

  const body = `
    <h2>Who We Are</h2>
    <p>KVL Business Solutions is a digital transformation and business automation partner, founded in 2015 in Patna, Bihar, India. We combine enterprise software engineering with infrastructure, GPS and industrial systems, civil engineering and digital marketing — delivered by one accountable team instead of five disconnected vendors.</p>

    <div class="grid">
      <div class="box"><b>14+</b><br/><span class="muted">Services Offered</span></div>
      <div class="box"><b>2015</b><br/><span class="muted">Founded</span></div>
      <div class="box"><b>MSME</b><br/><span class="muted">Registered</span></div>
      <div class="box"><b>NDA</b><br/><span class="muted">On Request</span></div>
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
    <p>MSME registration (Government of India), formalized in 2023. An NDA is available on request before any project discussion.</p>
  `;

  const html = renderDownloadShell({
    title: 'KVL Business Solutions — Company Profile',
    tag: 'Company Profile',
    bodyHtml: body,
    settings,
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (e) {
    // Opened directly as a browser navigation (<a target="_blank">), not
    // fetched as JSON — return an HTML error page on failure, matching this
    // route's actual response contract, instead of apiError()'s JSON shape.
    console.error(e);
    return new Response(
      '<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;padding:40px;text-align:center"><h1>Something went wrong</h1><p>Please try again in a moment.</p></body></html>',
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}
