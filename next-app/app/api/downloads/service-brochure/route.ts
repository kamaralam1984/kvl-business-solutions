import { getSiteSettings } from '@/lib/models/SiteSettings';
import { logDownload } from '@/lib/models/DownloadLog';
import { ServiceBrochurePDF } from '@/lib/pdf/serviceBrochure';
import { renderPdfBuffer } from '@/lib/pdf/render';

// Reads req.headers (for bot-detection) on every request, so this can never
// be static — declaring it explicitly stops Next.js from attempting static
// optimization and then bailing out with a noisy (harmless) build-log trace
// on every single build.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    logDownload('service-brochure', req.headers.get('user-agent'));
    const settings = await getSiteSettings();
    const buffer = await renderPdfBuffer(ServiceBrochurePDF({ settings }));
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="KVL-Service-Brochure.pdf"',
      },
    });
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
