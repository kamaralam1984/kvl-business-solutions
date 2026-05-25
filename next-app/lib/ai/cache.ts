import crypto from 'crypto';
import { Schema, models, model } from 'mongoose';

const AiCacheSchema = new Schema({
  _id: String,            // hash of the prompt
  reply: String,
  hits: { type: Number, default: 1 },
  expiresAt: Date,        // TTL index
}, { timestamps: true, _id: false });

AiCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AiCache = models.AiCache || model('AiCache', AiCacheSchema);

const TTL_DAYS = 7;

function hashKey(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 24);
}

export async function getCached(key: string): Promise<string | null> {
  try {
    const { connectDB } = await import('../mongodb');
    await connectDB();
    const hash = hashKey(key);
    const doc = await AiCache.findById(hash);
    if (!doc) return null;
    if (doc.expiresAt && doc.expiresAt < new Date()) return null;
    // Increment hit counter (async, don't await)
    AiCache.updateOne({ _id: hash }, { $inc: { hits: 1 } }).catch(() => {});
    return doc.reply;
  } catch {
    return null;
  }
}

export async function setCached(key: string, reply: string): Promise<void> {
  try {
    const { connectDB } = await import('../mongodb');
    await connectDB();
    const hash = hashKey(key);
    const expiresAt = new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000);
    await AiCache.findByIdAndUpdate(hash, { reply, expiresAt }, { upsert: true });
  } catch (e) {
    console.warn('[ai-cache] set failed', e);
  }
}

export async function getCacheStats() {
  try {
    const { connectDB } = await import('../mongodb');
    await connectDB();
    const total = await AiCache.countDocuments();
    const top = await AiCache.find({}).sort({ hits: -1 }).limit(5).lean();
    const totalHits = await AiCache.aggregate([{ $group: { _id: null, total: { $sum: '$hits' } } }]);
    return {
      cachedQueries: total,
      totalHits: totalHits[0]?.total || 0,
      topQueries: top.map((t: any) => ({ hits: t.hits, reply: t.reply.slice(0, 60) })),
    };
  } catch {
    return { cachedQueries: 0, totalHits: 0, topQueries: [] };
  }
}
