import { getMongoDb } from "@/lib/mongodb";

/* =========================
   TYPES
========================= */
export interface Image {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
  email: string;
  role: "super_admin" | "admin";
  createdAt: string;
}

export interface Page {
  id: string;
  path: string;
  title: string;
  description?: string;
  sections: any[];
  updatedAt?: string; // ✅ optional (handled internally)
  updatedBy: string;
}

/* =========================
   COUNTER (AUTO ID)
========================= */
async function getNextSequence(name: string): Promise<number> {
  const db = await getMongoDb();
  const res = await db.collection<any>("counters").findOneAndUpdate(
    { _id: name } as any,
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  return (res as any)?.value?.seq || 1;
}

/* =========================
   IMAGES
========================= */
export async function getImages(): Promise<Image[]> {
  const db = await getMongoDb();
  return db.collection<Image>("images").find().sort({ id: -1 }).toArray();
}

export async function saveImage(image: Omit<Image, "id">): Promise<Image> {
  const db = await getMongoDb();
  const id = await getNextSequence("images");
  const newImage: Image = { ...image, id };
  await db.collection<Image>("images").insertOne(newImage as any);
  return newImage;
}

export async function deleteImage(id: number): Promise<boolean> {
  const db = await getMongoDb();
  const res = await db.collection<Image>("images").deleteOne({ id });
  return res.deletedCount === 1;
}

/* =========================
   ADMINS
========================= */
export async function getAdmins(): Promise<Admin[]> {
  const db = await getMongoDb();
  return db.collection<Admin>("admins").find().toArray();
}

export async function getAdminByUsername(
  username: string
): Promise<Admin | null> {
  const db = await getMongoDb();
  return db.collection<Admin>("admins").findOne({ username });
}

export async function createAdmin(
  admin: Omit<Admin, "id" | "createdAt">
): Promise<Admin> {
  const db = await getMongoDb();
  const id = await getNextSequence("admins");

  const newAdmin: Admin = {
    ...admin,
    id,
    createdAt: new Date().toISOString(),
  };

  await db.collection<Admin>("admins").insertOne(newAdmin as any);
  return newAdmin;
}

export async function deleteAdmin(id: number): Promise<boolean> {
  const db = await getMongoDb();
  const res = await db.collection<Admin>("admins").deleteOne({ id });
  return res.deletedCount === 1;
}

/* =========================
   PAGES
========================= */
export async function getPages(): Promise<Page[]> {
  const db = await getMongoDb();
  return db.collection<Page>("pages").find().toArray();
}

export async function getPageByPath(path: string): Promise<Page | null> {
  const db = await getMongoDb();
  return db.collection<Page>("pages").findOne({ path });
}

type SavePageInput = Omit<Page, "updatedAt"> & { updatedAt?: string }

export async function savePage(page: SavePageInput): Promise<Page> {
  const db = await getMongoDb();

  const pageToSave: Page = {
    ...page,
    updatedAt: page.updatedAt || new Date().toISOString(),
  };

  await db
    .collection<Page>("pages")
    .updateOne(
      { id: pageToSave.id },
      { $set: pageToSave },
      { upsert: true }
    );

  return pageToSave;
}

export async function deletePage(id: string): Promise<boolean> {
  const db = await getMongoDb();
  const res = await db.collection<Page>("pages").deleteOne({ id });
  return res.deletedCount === 1;
}
