import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'kvl_business_solutions'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export function isMongoEnabled() {
  return Boolean(uri)
}

export async function getMongoDb(): Promise<Db> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }

  if (cachedClient && cachedDb) return cachedDb

  const client = new MongoClient(uri)
  await client.connect()

  cachedClient = client
  cachedDb = client.db(dbName)
  return cachedDb
}

