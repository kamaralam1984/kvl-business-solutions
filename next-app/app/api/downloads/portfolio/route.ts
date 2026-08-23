import { getSiteSettings } from '@/lib/models/SiteSettings';
import { logDownload } from '@/lib/models/DownloadLog';
import { PortfolioPDF } from '@/lib/pdf/portfolio';
import { renderPdfBuffer } from '@/lib/pdf/render';

// Reads req.headers (for bot-detection) on every request, so this can never
// be static — declaring it explicitly stops Next.js from attempting static
// optimization and then bailing out with a noisy (harmless) build-log trace
// on every single build.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    logDownload('portfolio', req.headers.get('user-agent'));
    const settings = await getSiteSettings();
    const buffer = await renderPdfBuffer(await PortfolioPDF({ settings }));
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="KVL-Portfolio.pdf"',
      },
    });
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
