import { isMongoEnabled, getMongoDb } from '@/lib/mongodb'

// Reads admin credentials from env, supporting the user's .env.local keys (Email_id + Password),
// plus a few common alternatives for flexibility.
function getEnvAdminCredentials() {
  const email =
    process.env.Email_id ||
    process.env.EMAIL_ID ||
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const password =
    process.env.Password ||
    process.env.PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  return { email, password }
}

export async function ensureMongoSuperAdmin() {
  if (!isMongoEnabled()) return

  const { email, password } = getEnvAdminCredentials()
  if (!email || !password) return

  const db = await getMongoDb()

  const admins = db.collection<any>('admins')
  const existing = await admins.findOne({ role: 'super_admin' })
  if (existing) return

  const counters = db.collection<any>('counters')
  const seqRes = await counters.findOneAndUpdate(
    { _id: 'admins' },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  )
  const id = (seqRes as any)?.value?.seq ?? 1

  await admins.insertOne({
    id,
    username: email,
    password,
    email,
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  })
}

