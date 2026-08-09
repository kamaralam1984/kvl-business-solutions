import { Schema, models, model } from 'mongoose';

const DownloadLogSchema = new Schema({
  type: { type: String, required: true, index: true }, // company-profile | portfolio | service-brochure
  downloadedAt: { type: Date, default: Date.now, index: true },
});

export const DownloadLog = models.DownloadLog || model('DownloadLog', DownloadLogSchema);

// These 3 documents are linked as plain <a target="_blank"> on /thank-you
// (intentionally ungated there — the visitor is already a captured lead
// from whatever form got them to that page). Link-preview crawlers (chat
// apps, social unfurlers) and scrapers fetch every href on a page within
// milliseconds of each other, which was inflating "Downloads" with
// non-human hits — e.g. all 3 doc types logged within ~100ms, repeatedly.
// A real visitor never opens all three at once like that.
const BOT_UA_PATTERN = /bot|crawl|spider|slurp|facebookexternalhit|telegrambot|slackbot|discordbot|linkedinbot|twitterbot|embedly|quora link preview|pinterest|preview|headless|curl|wget|python-requests|okhttp|axios|node-fetch/i;

// WhatsApp's own link-preview fetcher (triggered when someone pastes a URL
// into a chat) sends a bare "WhatsApp/x.y.z" UA with no browser engine token.
// A real visitor who taps a link INSIDE the WhatsApp app — a primary lead
// channel for this business — gets a full mobile browser UA with
// "WhatsApp/x.y.z" merely appended (Mozilla/... AppleWebKit/... WhatsApp/x.y.z).
// Only the former should count as a bot; matching "whatsapp" unconditionally
// would silently drop every real WhatsApp-referred download too.
function isWhatsAppPreviewFetcher(userAgent: string): boolean {
  return /whatsapp/i.test(userAgent) && !/mozilla|applewebkit/i.test(userAgent);
}

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_UA_PATTERN.test(userAgent) || isWhatsAppPreviewFetcher(userAgent);
}

// Fire-and-forget — a logging failure must never break the download itself.
export async function logDownload(type: string, userAgent?: string | null) {
  if (isBotUserAgent(userAgent)) return;
  try {
    const { connectDB } = await import('../mongodb');
    await connectDB();
    await DownloadLog.create({ type });
  } catch (e) {
    console.error('[download-log] failed:', e);
  }
}
