import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { getMongoDb, isMongoEnabled } from '@/lib/mongodb'

export type PublicUser = {
  id: number
  name: string
  email: string
  createdAt: string
}

type DbUser = PublicUser & {
  passwordHash: string
}

const SESSION_COOKIE = 'user_session'

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = scryptSync(password, salt, 64)
  const storedBuf = Buffer.from(hash, 'hex')
  if (storedBuf.length !== derived.length) return false
  return timingSafeEqual(storedBuf, derived)
}

async function getNextUserId(): Promise<number> {
  const db = await getMongoDb()
  const res = await db.collection<any>('counters').findOneAndUpdate(
    { _id: 'users' },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  )
  const seq = (res as any)?.value?.seq
  return typeof seq === 'number' ? seq : 1
}

export function getUserSessionCookieName() {
  return SESSION_COOKIE
}

export async function createUser(params: { name: string; email: string; password: string }): Promise<PublicUser> {
  if (!isMongoEnabled()) throw new Error('MongoDB not configured')

  const db = await getMongoDb()
  const users = db.collection<DbUser>('users')

  const email = params.email.trim().toLowerCase()
  const existing = await users.findOne({ email } as any)
  if (existing) throw new Error('Email already exists')

  const id = await getNextUserId()
  const createdAt = new Date().toISOString()
  const doc: DbUser = {
    id,
    name: params.name.trim(),
    email,
    createdAt,
    passwordHash: hashPassword(params.password),
  }

  await users.insertOne(doc as any)
  const { passwordHash: _, ...publicUser } = doc
  return publicUser
}

export async function authenticateUser(email: string, password: string): Promise<PublicUser | null> {
  if (!isMongoEnabled()) throw new Error('MongoDB not configured')

  const db = await getMongoDb()
  const users = db.collection<DbUser>('users')
  const user = await users.findOne({ email: email.trim().toLowerCase() } as any)
  if (!user) return null
  if (!verifyPassword(password, user.passwordHash)) return null
  const { passwordHash: _, ...publicUser } = user
  return publicUser
}

export async function createSession(userId: number): Promise<string> {
  if (!isMongoEnabled()) throw new Error('MongoDB not configured')

  const token = randomBytes(32).toString('hex')
  const db = await getMongoDb()
  await db.collection('user_sessions').insertOne({
    token,
    userId,
    createdAt: new Date().toISOString(),
  })
  return token
}

export async function deleteSession(token: string): Promise<void> {
  if (!isMongoEnabled()) return
  const db = await getMongoDb()
  await db.collection('user_sessions').deleteOne({ token })
}

export async function getUserBySession(token: string): Promise<PublicUser | null> {
  if (!isMongoEnabled()) return null
  const db = await getMongoDb()
  const sess = await db.collection<any>('user_sessions').findOne({ token })
  if (!sess?.userId) return null
  const user = await db.collection<DbUser>('users').findOne({ id: sess.userId } as any)
  if (!user) return null
  const { passwordHash: _, ...publicUser } = user
  return publicUser
}

