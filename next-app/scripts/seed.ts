/* eslint-disable */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../lib/models/User';
import { Product } from '../lib/models/Product';
import { softwareProducts } from '../lib/data/software';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected.');

  // Admin user
  const email = (process.env.ADMIN_EMAIL || 'admin@kvlsolutions.in').toLowerCase();
  const pass = process.env.ADMIN_PASSWORD || 'ChangeMe!2026';
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    existing.passwordHash = await bcrypt.hash(pass, 10);
    await existing.save();
    console.log('Admin updated:', email);
  } else {
    await User.create({ email, name: 'KVL Admin', passwordHash: await bcrypt.hash(pass, 10), role: 'admin' });
    console.log('Admin created:', email);
  }

  // Seed products
  for (const p of softwareProducts) {
    await Product.findOneAndUpdate({ slug: p.slug }, { ...p, active: true }, { upsert: true });
  }
  console.log(`Seeded ${softwareProducts.length} products.`);

  await mongoose.disconnect();
  console.log('Done.');
}
main().catch(e => { console.error(e); process.exit(1); });
