import { Schema, models, model } from 'mongoose';

const DownloadLogSchema = new Schema({
  type: { type: String, required: true, index: true }, // company-profile | portfolio | service-brochure
  downloadedAt: { type: Date, default: Date.now, index: true },
});

export const DownloadLog = models.DownloadLog || model('DownloadLog', DownloadLogSchema);

// Fire-and-forget — a logging failure must never break the download itself.
export async function logDownload(type: string) {
  try {
    const { connectDB } = await import('../mongodb');
    await connectDB();
    await DownloadLog.create({ type });
  } catch (e) {
    console.error('[download-log] failed:', e);
  }
}
