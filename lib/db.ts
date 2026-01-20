// Database layer
// - Uses MongoDB when MONGODB_URI is provided
// - Falls back to simple file-based JSON DB otherwise (dev / no-db environments)

import fs from 'fs'
import path from 'path'
import { getMongoDb, isMongoEnabled } from '@/lib/mongodb'

// Data directory resolution:
// - If DATA_DIR is set (e.g., to a persistent mount), use it.
// - On Vercel/readonly FS, fall back to /tmp which is writable at runtime.
// - Otherwise default to project ./data
const resolveDataDir = () => {
  if (process.env.DATA_DIR) return process.env.DATA_DIR
  if (process.env.VERCEL) return '/tmp/kvl-data'
  return path.join(process.cwd(), 'data')
}

const dbPath = resolveDataDir()
const imagesFile = path.join(dbPath, 'images.json')
const adminsFile = path.join(dbPath, 'admins.json')
const pagesFile = path.join(dbPath, 'pages.json')

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const ensureFile = (file: string, initial: any) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(initial, null, 2))
  }
}

// Ensure data directory and files exist (handles /tmp on serverless)
// Only needed for file-db fallback.
if (!isMongoEnabled()) {
  ensureDir(dbPath)
  ensureFile(imagesFile, [])
  ensureFile(adminsFile, [
    {
      id: 1,
      username: 'kamaralamjdu@gmail.com',
      password: 'Admin@143', // In production, hash this
      email: 'admin@kvlbusiness.com',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
    },
  ])
  ensureFile(pagesFile, [])
}

export interface Image {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  uploadedAt: string
  uploadedBy: string
}

export interface Admin {
  id: number
  username: string
  password: string
  email: string
  role: 'super_admin' | 'admin'
  createdAt: string
}

async function getNextSequence(name: string): Promise<number> {
  const db = await getMongoDb()
  const res = await db
    .collection<{ _id: string; seq: number }>('counters')
    .findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' }
    )

  // mongodb types can be strict here; handle null/undefined safely
  const seq = (res as any)?.value?.seq
  return typeof seq === 'number' ? seq : 1
}

// Image functions
export async function getImages(): Promise<Image[]> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    return await db.collection<Image>('images').find({}).sort({ id: -1 }).toArray()
  }

  try {
    const data = fs.readFileSync(imagesFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function saveImage(image: Omit<Image, 'id'>): Promise<Image> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    const id = await getNextSequence('images')
    const newImage: Image = { ...image, id }
    await db.collection<Image>('images').insertOne(newImage as any)
    return newImage
  }

  const images = await getImages()
  const newImage: Image = {
    ...image,
    id: images.length > 0 ? Math.max(...images.map(i => i.id)) + 1 : 1,
  }
  images.push(newImage)
  fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2))
  return newImage
}

export async function deleteImage(id: number): Promise<boolean> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    const res = await db.collection<Image>('images').deleteOne({ id })
    return res.deletedCount === 1
  }

  const images = await getImages()
  const filtered = images.filter(img => img.id !== id)
  fs.writeFileSync(imagesFile, JSON.stringify(filtered, null, 2))
  return filtered.length < images.length
}

// Admin functions
export async function getAdmins(): Promise<Admin[]> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    return await db.collection<Admin>('admins').find({}).sort({ id: -1 }).toArray()
  }

  try {
    const data = fs.readFileSync(adminsFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function getAdminByUsername(username: string): Promise<Admin | null> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    return await db.collection<Admin>('admins').findOne({ username })
  }

  const admins = await getAdmins()
  return admins.find(admin => admin.username === username) || null
}

export async function createAdmin(admin: Omit<Admin, 'id' | 'createdAt'>): Promise<Admin> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    const id = await getNextSequence('admins')
    const newAdmin: Admin = { ...admin, id, createdAt: new Date().toISOString() }
    await db.collection<Admin>('admins').insertOne(newAdmin as any)
    return newAdmin
  }

  const admins = await getAdmins()
  const newAdmin: Admin = {
    ...admin,
    id: admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  admins.push(newAdmin)
  fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2))
  return newAdmin
}

export async function deleteAdmin(id: number): Promise<boolean> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    const res = await db.collection<Admin>('admins').deleteOne({ id })
    return res.deletedCount === 1
  }

  const admins = await getAdmins()
  const filtered = admins.filter(admin => admin.id !== id)
  fs.writeFileSync(adminsFile, JSON.stringify(filtered, null, 2))
  return filtered.length < admins.length
}

// Page Content Management
export interface PageSection {
  id: string
  type: 'text' | 'image' | 'text-image' | 'hero' | 'cards' | 'gallery'
  title?: string
  content?: string
  imageUrl?: string
  imageAlt?: string
  order: number
  metadata?: Record<string, any>
}

export interface Page {
  id: string
  path: string
  title: string
  description?: string
  sections: PageSection[]
  updatedAt: string
  updatedBy: string
}

export async function getPages(): Promise<Page[]> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    return await db.collection<Page>('pages').find({}).sort({ updatedAt: -1 }).toArray()
  }

  try {
    const data = fs.readFileSync(pagesFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function getPageByPath(pathStr: string): Promise<Page | null> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    return await db.collection<Page>('pages').findOne({ path: pathStr })
  }

  const pages = await getPages()
  return pages.find(page => page.path === pathStr) || null
}

export async function savePage(
  page: Omit<Page, 'updatedAt' | 'updatedBy'> & { updatedBy: string }
): Promise<Page> {
  const pageToSave: Page = {
    ...page,
    updatedAt: new Date().toISOString(),
  }

  if (isMongoEnabled()) {
    const db = await getMongoDb()
    await db.collection<Page>('pages').updateOne({ id: page.id }, { $set: pageToSave }, { upsert: true })
    return pageToSave
  }

  const pages = await getPages()
  const existingIndex = pages.findIndex(p => p.id === page.id)

  if (existingIndex >= 0) {
    pages[existingIndex] = pageToSave
  } else {
    pages.push(pageToSave)
  }

  fs.writeFileSync(pagesFile, JSON.stringify(pages, null, 2))
  return pageToSave
}

export async function deletePage(id: string): Promise<boolean> {
  if (isMongoEnabled()) {
    const db = await getMongoDb()
    const res = await db.collection<Page>('pages').deleteOne({ id })
    return res.deletedCount === 1
  }

  const pages = await getPages()
  const filtered = pages.filter(page => page.id !== id)
  fs.writeFileSync(pagesFile, JSON.stringify(filtered, null, 2))
  return filtered.length < pages.length
}
