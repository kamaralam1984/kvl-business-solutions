import { MongoClient, Db } from "mongodb";

/**
 * MongoDB connection helper
 * - Works on Vercel + local
 * - Prevents multiple connections
 */

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "kvl_business_solutions";

// Global cache (important for Next.js / Vercel)
let globalClient: MongoClient | null = null;
let globalDb: Db | null = null;

export function isMongoEnabled(): boolean {
  return !!process.env.MONGODB_URI && !!process.env.MONGODB_DB;
}

export async function getMongoDb(): Promise<Db> {
  if (!uri) {
    throw new Error("❌ MONGODB_URI is not set");
  }

  if (globalClient && globalDb) {
    return globalDb;
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();

    globalClient = client;
    globalDb = client.db(dbName);

    console.log("✅ MongoDB connected:", dbName);

    return globalDb;
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    throw error;
  }
}
