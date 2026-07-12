import { getSiteSettings } from '@/lib/models/SiteSettings';
import { renderDownloadShell } from '@/lib/download-page';
import { services } from '@/lib/data/services';
import { logDownload } from '@/lib/models/DownloadLog';

export async function GET() {
  logDownload('service-brochure');
  const settings = await getSiteSettings();

  const body = `
    <h2>Every Service We Offer</h2>
    <p>From custom software to civil engineering, all delivered by one accountable team.</p>

    <div class="grid">
      ${services.map(s => `
        <div class="box">
          <h3>${s.name}</h3>
          <p>${s.description}</p>
        </div>
      `).join('')}
    </div>

    <h2>How to Get Started</h2>
    <p>Book a free strategy call at kvlbusinesssolutions.com/book-demo, or message us on WhatsApp — we'll scope your project and send a fixed, transparent quote before any work begins.</p>
  `;

  const html = renderDownloadShell({
    title: 'KVL Business Solutions — Service Brochure',
    tag: 'Service Brochure',
    bodyHtml: body,
    settings,
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
