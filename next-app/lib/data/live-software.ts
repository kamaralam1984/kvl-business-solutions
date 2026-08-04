import { softwareProducts, type Software } from './software';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';

// Admin → Products only edits business content (name, description, features,
// price, unit, tag, active, image) — structural/design fields (icon, colors,
// category, demoNav) stay defined in the static catalog, since those aren't
// something a content edit should touch. This merges the two: DB values win
// for the fields admin controls, the static catalog supplies everything else.
function mergeOne(staticP: Software | undefined, db: any): Software | null {
  if (db?.active === false) return null;
  if (!staticP && !db) return null;

  if (!db) return staticP!;

  return {
    slug: db.slug,
    name: db.name || staticP?.name || db.slug,
    description: db.description || staticP?.description || '',
    features: db.features?.length ? db.features : (staticP?.features || []),
    price: db.price ?? staticP?.price ?? 0,
    monthlyRent: staticP?.monthlyRent ?? Math.round((db.price ?? 0) / 10),
    unit: db.unit || staticP?.unit || '/year',
    rentUnit: staticP?.rentUnit || '/month',
    tag: db.tag || staticP?.tag,
    icon: staticP?.icon || 'Box',
    image: db.image || staticP?.image || '',
    c1: staticP?.c1 || '#64748b',
    c2: staticP?.c2 || '#334155',
    category: staticP?.category || 'Custom Software',
    demoNav: staticP?.demoNav || [],
    benefits: staticP?.benefits || [],
  };
}

export async function getLiveSoftwareProducts(): Promise<Software[]> {
  await connectDB();
  const dbProducts = await Product.find({}).lean();
  const dbBySlug = new Map(dbProducts.map((d: any) => [d.slug, d]));

  const merged: Software[] = [];
  for (const staticP of softwareProducts) {
    const result = mergeOne(staticP, dbBySlug.get(staticP.slug));
    if (result) merged.push(result);
    dbBySlug.delete(staticP.slug);
  }
  // Whatever's left in dbBySlug is a product admin added with a slug that
  // doesn't exist in the static catalog — include it with generic fallbacks.
  for (const db of dbBySlug.values()) {
    const result = mergeOne(undefined, db);
    if (result) merged.push(result);
  }
  return merged;
}

export async function getLiveSoftwareProduct(slug: string): Promise<Software | null> {
  const staticP = softwareProducts.find(p => p.slug === slug);
  await connectDB();
  const db = await Product.findOne({ slug }).lean();
  return mergeOne(staticP, db);
}
