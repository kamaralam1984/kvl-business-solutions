import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}
const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Please define MONGODB_URI in .env.local');
  if (!cached.promise) {
    // Mongoose's default serverSelectionTimeoutMS is 30s — during a real Mongo
    // outage, the first request of every cache cycle would hang that long
    // before failing. 8s still covers a normal slow-start/reconnect but fails
    // fast enough that a visitor sees an error page instead of a frozen tab.
    cached.promise = mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Don't leave a dead, rejected promise cached forever — without this,
    // one transient connection failure (e.g. during a VPS reboot) wedges
    // every future request in this process onto the same rejection, even
    // long after Mongo recovers, until pm2 restarts the process. Clearing
    // it here means the next call attempts a fresh connect().
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}
