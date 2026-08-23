/* eslint-disable */
// One-off script to swap the generic stock-photo thumbnails on /website-demos
// for real branded card graphics — matched by URL (or name, for entries with
// no live URL). Editing the fallbackDemos array in app/website-demos/page.tsx
// has no effect once the DB already has entries, so this writes directly to
// the production Demo collection. Run with: npx tsx scripts/update-demo-images.ts
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import mongoose from 'mongoose';
import { Demo } from '../lib/models/Demo';

const updates = [
  { match: { url: 'https://www.vidyt.com' }, image: '/website-demos/vidyt.png' },
  { match: { url: 'https://growthos.kvlbusinesssolutions.com/' }, image: '/website-demos/kvl-growthos.png' },
  { match: { url: 'https://superai.kvlbusinesssolutions.com/' }, image: '/website-demos/kvl-super-ai.png' },
  { match: { url: 'https://school.kvlbusinesssolutions.com/' }, image: '/website-demos/kvl-international-school.png' },
  { match: { name: 'City Care Multi-Speciality' }, image: '/website-demos/city-care.png' },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected.');

  for (const u of updates) {
    const res = await Demo.findOneAndUpdate(u.match, { image: u.image }, { new: true });
    console.log(res ? `Updated: ${res.name} -> ${u.image}` : `No match for ${JSON.stringify(u.match)}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}
main().catch(e => { console.error(e); process.exit(1); });
