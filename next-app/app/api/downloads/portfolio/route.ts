import { getSiteSettings } from '@/lib/models/SiteSettings';
import { renderDownloadShell } from '@/lib/download-page';
import { caseStudies } from '@/lib/data/case-studies';
import { logDownload } from '@/lib/models/DownloadLog';

// Reads req.headers (for bot-detection) on every request, so this can never
// be static — declaring it explicitly stops Next.js from attempting static
// optimization and then bailing out with a noisy (harmless) build-log trace
// on every single build.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    logDownload('portfolio', req.headers.get('user-agent'));
    const settings = await getSiteSettings();

    const body = `
      <h2>Real Products, Live in Production</h2>
      <p>Every project below is a real, working product built by KVL Business Solutions — verifiable today, not a mockup or a representative example.</p>

      ${caseStudies.map(c => `
        <div class="box" style="margin:20px 0">
          <h3>${c.name} <span class="pill">${c.industry}</span></h3>
          <p class="muted">${c.businessCategory} · ${c.url.replace('https://', '')}</p>
          <p><b>Business Challenge:</b> ${c.challenge.body}</p>
          <p><b>Our Solution:</b> ${c.solution.body}</p>
          <p><b>Technology:</b> ${c.tech.join(', ')}</p>
          <img class="shot" src="${c.images.hero}" alt="${c.name} preview" />
        </div>
      `).join('')}
    `;

    const html = renderDownloadShell({
      title: 'KVL Business Solutions — Portfolio',
      tag: 'Portfolio',
      bodyHtml: body,
      settings,
    });

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (e) {
    // This route is opened directly as a browser navigation (<a target="_blank">),
    // not fetched as JSON — so on failure it must still return an HTML page,
    // not the {ok,error} JSON shape apiError() produces elsewhere.
    console.error(e);
    return new Response(
      '<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;padding:40px;text-align:center"><h1>Something went wrong</h1><p>Please try again in a moment.</p></body></html>',
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}
