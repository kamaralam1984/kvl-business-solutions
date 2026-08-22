/* eslint-disable */
// One-off script to add/update the real live client sites (CRM, GrowthOS,
// Super AI, School) in the production Demo collection — editing the
// fallbackDemos array in app/website-demos/page.tsx has no effect once the
// DB already has entries, since that array is only used on a first deploy
// with an empty collection.
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import mongoose from 'mongoose';
import { Demo } from '../lib/models/Demo';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected.');

  // The existing "Bright Future Academy" entry already points at the real
  // school URL — rename/rewrite it in place instead of creating a duplicate
  // card for the same site.
  const school = await Demo.findOneAndUpdate(
    { url: 'https://school.kvlbusinesssolutions.com/' },
    {
      name: 'KVL International School',
      description: 'A premier CBSE-affiliated school website — admissions, academics and campus life presented with real polish',
      url: 'https://school.kvlbusinesssolutions.com/',
      category: 'school',
      technologies: ['Next.js', 'CMS', 'Production'],
      live: true,
      iconName: 'GraduationCap',
      c1: '#7c3aed',
      c2: '#4c1d95',
      active: true,
      startingPrice: 0,
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&crop=top&auto=format',
    },
    { upsert: true, new: true }
  );
  console.log('School entry:', school.name);

  const newDemos = [
    {
      name: 'KVL CRM',
      description: 'AI-powered enterprise CRM — pipeline, leads and follow-ups managed automatically for modern sales teams',
      url: 'https://crm.kvlbusinesssolutions.com/',
      category: 'business',
      technologies: ['Next.js', 'AI', 'Production'],
      live: true,
      iconName: 'Handshake',
      c1: '#ec4899', c2: '#be185d',
      order: 4, active: true, startingPrice: 0,
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&h=400&fit=crop&auto=format',
    },
    {
      name: 'KVL GrowthOS',
      description: 'The AI workforce that grows your business 24/7 — AI agents qualify leads, run outreach and draft proposals around the clock',
      url: 'https://growthos.kvlbusinesssolutions.com/',
      category: 'business',
      technologies: ['Next.js', 'AI Agents', 'Production'],
      live: true,
      iconName: 'TrendingUp',
      c1: '#10b981', c2: '#047857',
      order: 5, active: true, startingPrice: 0,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format',
    },
    {
      name: 'KVL Super AI',
      description: 'A smart AI chatbot you can install on any website in minutes — answers questions, captures leads and speaks every language',
      url: 'https://superai.kvlbusinesssolutions.com/',
      category: 'other',
      technologies: ['AI', 'Chatbot', 'Production'],
      live: true,
      iconName: 'Bot',
      c1: '#6366f1', c2: '#4338ca',
      order: 6, active: true, startingPrice: 0,
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop&auto=format',
    },
  ];

  for (const d of newDemos) {
    await Demo.findOneAndUpdate({ url: d.url }, d, { upsert: true });
    console.log('Upserted:', d.name);
  }

  await mongoose.disconnect();
  console.log('Done.');
}
main().catch(e => { console.error(e); process.exit(1); });
