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
const BOT_UA_PATTERN = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|twitterbot|embedly|quora link preview|pinterest|preview|headless|curl|wget|python-requests|okhttp|axios|node-fetch/i;

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  return !userAgent || BOT_UA_PATTERN.test(userAgent);
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
