// Simple file-based database for development
// In production, replace with MongoDB, PostgreSQL, or MySQL

import fs from 'fs'
import path from 'path'

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

// Image functions
export function getImages(): Image[] {
  try {
    const data = fs.readFileSync(imagesFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export function saveImage(image: Omit<Image, 'id'>): Image {
  const images = getImages()
  const newImage: Image = {
    ...image,
    id: images.length > 0 ? Math.max(...images.map(i => i.id)) + 1 : 1,
  }
  images.push(newImage)
  fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2))
  return newImage
}

export function deleteImage(id: number): boolean {
  const images = getImages()
  const filtered = images.filter(img => img.id !== id)
  fs.writeFileSync(imagesFile, JSON.stringify(filtered, null, 2))
  return filtered.length < images.length
}

// Admin functions
export function getAdmins(): Admin[] {
  try {
    const data = fs.readFileSync(adminsFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export function getAdminByUsername(username: string): Admin | null {
  const admins = getAdmins()
  return admins.find(admin => admin.username === username) || null
}

export function createAdmin(admin: Omit<Admin, 'id' | 'createdAt'>): Admin {
  const admins = getAdmins()
  const newAdmin: Admin = {
    ...admin,
    id: admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  }
  admins.push(newAdmin)
  fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2))
  return newAdmin
}

export function deleteAdmin(id: number): boolean {
  const admins = getAdmins()
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

export function getPages(): Page[] {
  try {
    const data = fs.readFileSync(pagesFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export function getPageByPath(path: string): Page | null {
  const pages = getPages()
  return pages.find(page => page.path === path) || null
}

export function savePage(page: Omit<Page, 'updatedAt' | 'updatedBy'> & { updatedBy: string }): Page {
  const pages = getPages()
  const existingIndex = pages.findIndex(p => p.id === page.id)
  
  const pageToSave: Page = {
    ...page,
    updatedAt: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    pages[existingIndex] = pageToSave
  } else {
    pages.push(pageToSave)
  }

  fs.writeFileSync(pagesFile, JSON.stringify(pages, null, 2))
  return pageToSave
}

export function deletePage(id: string): boolean {
  const pages = getPages()
  const filtered = pages.filter(page => page.id !== id)
  fs.writeFileSync(pagesFile, JSON.stringify(filtered, null, 2))
  return filtered.length < pages.length
}
