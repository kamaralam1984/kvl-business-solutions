import type { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Demo } from '@/lib/models/Demo';
import { DemosClient } from './DemosClient';

export const dynamic = 'force-dynamic';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Live Software Demos — Explore Working Products Before You Buy';
const description = "Browse live, working demos of KVL's software products — CRM, ERP, school and hospital management, billing, and more. See real software in action, not screenshots.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/website-demos` },
  openGraph: { title, description, url: `${SITE}/website-demos`, type: 'website' },
};

// Fallback demos shown if DB has no entries yet (first deploy)
const fallbackDemos = [
  { _id: 'fb-1', name: 'VidYT', description: 'AI-powered YouTube growth platform — viral score prediction, script & thumbnail generation', url: 'https://www.vidyt.com', category: 'video', technologies: ['Next.js', 'AI', 'Production'], live: true, iconName: 'Video', c1: '#9333ea', c2: '#581c87', order: 0, active: true, startingPrice: 0, image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-2', name: 'AapKaPlot', description: "India's AI-powered real estate platform — live maps, satellite view, verified owners", url: 'https://aapkaplot.com/', category: 'realestate', technologies: ['React', 'AI', 'Production'], live: true, iconName: 'Home', c1: '#16a34a', c2: '#14532d', order: 1, active: true, startingPrice: 0, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-27', name: 'Gravity', description: 'Family safety & connectivity platform — live GPS tracking for loved ones', url: 'https://gravitypro.kvlbusinesssolutions.com/', category: 'gps', technologies: ['Next.js', 'GPS', 'Production'], live: true, iconName: 'Satellite', c1: '#3b82f6', c2: '#1d4ed8', order: 2, active: true, startingPrice: 0, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-28', name: 'Restro OS', description: 'Restaurant management platform — online ordering, billing, table reservations, live for clients', url: 'https://restro.kvlbusinesssolutions.com/', category: 'restaurant', technologies: ['Next.js', 'Razorpay', 'Production'], live: true, iconName: 'UtensilsCrossed', c1: '#f97316', c2: '#c2410c', order: 3, active: true, startingPrice: 0, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-3', name: 'Bright Future Academy', description: 'Modern school website with admission flow', category: 'school', technologies: ['React', 'Tailwind'], live: false, iconName: 'GraduationCap', c1: '#8b5cf6', c2: '#6d28d9', order: 10, active: true, startingPrice: 14999, image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-4', name: 'City Care Multi-Speciality', description: 'Hospital site with online appointments', category: 'hospital', technologies: ['Next.js', 'API'], live: false, iconName: 'Hospital', c1: '#ef4444', c2: '#b91c1c', order: 11, active: true, startingPrice: 19999, image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-5', name: 'Pillar Constructions', description: 'Premium construction company site', category: 'construction', technologies: ['WordPress', 'SEO'], live: false, iconName: 'HardHat', c1: '#eab308', c2: '#a16207', order: 12, active: true, startingPrice: 14999, image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-7', name: 'SmartShop India', description: 'Multi-vendor e-commerce store', category: 'ecommerce', technologies: ['Shopify', 'UPI'], live: false, iconName: 'ShoppingCart', c1: '#22c55e', c2: '#16a34a', order: 14, active: true, startingPrice: 29999, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-8', name: 'Skyline Realty', description: 'Property listing + virtual tours', category: 'realestate', technologies: ['React', '360°'], live: false, iconName: 'Building2', c1: '#8b5cf6', c2: '#4c1d95', order: 15, active: true, startingPrice: 19999, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-9', name: 'SteelForge Industries', description: 'Mechanical workshop & fabrication', category: 'mechanical', technologies: ['HTML5', 'Animations'], live: false, iconName: 'Cog', c1: '#0d9488', c2: '#115e59', order: 16, active: true, startingPrice: 14999 },
  { _id: 'fb-10', name: 'Municipal Portal', description: 'Govt project & citizen services', category: 'government', technologies: ['Accessibility', 'Hindi'], live: false, iconName: 'Landmark', c1: '#64748b', c2: '#1e293b', order: 17, active: true, startingPrice: 39999, image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-11', name: 'Creative Portfolio', description: 'Personal portfolio with animations', category: 'portfolio', technologies: ['GSAP', 'Three.js'], live: false, iconName: 'UserSquare', c1: '#ec4899', c2: '#be185d', order: 18, active: true, startingPrice: 9999, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-13', name: 'GrandStay Hotels', description: 'Hotel booking site with room management & payments', category: 'business', technologies: ['React', 'Stripe'], live: false, iconName: 'BedDouble', c1: '#a16207', c2: '#713f12', order: 20, active: true, startingPrice: 24999, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-14', name: 'FitZone Gym', description: 'Gym membership & class scheduling website', category: 'business', technologies: ['React', 'Tailwind'], live: false, iconName: 'Dumbbell', c1: '#dc2626', c2: '#7f1d1d', order: 21, active: true, startingPrice: 11999, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-15', name: 'SwiftCargo Logistics', description: 'Transport & freight management with live tracking', category: 'other', technologies: ['Next.js', 'Maps API'], live: false, iconName: 'Truck', c1: '#0284c7', c2: '#075985', order: 22, active: true, startingPrice: 19999, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-16', name: 'TravelNest Agency', description: 'Travel packages, tour booking & itinerary planner', category: 'other', technologies: ['React', 'API'], live: false, iconName: 'Plane', c1: '#0891b2', c2: '#164e63', order: 23, active: true, startingPrice: 16999, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-17', name: 'LegalEdge Associates', description: 'Law firm website with case inquiry & consultation booking', category: 'business', technologies: ['Next.js', 'SEO'], live: false, iconName: 'Scale', c1: '#1e3a5f', c2: '#0f172a', order: 24, active: true, startingPrice: 14999, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-18', name: 'BeautyBloom Salon', description: 'Salon & spa with online appointment booking', category: 'business', technologies: ['React', 'Booking API'], live: false, iconName: 'Sparkles', c1: '#db2777', c2: '#9d174d', order: 25, active: true, startingPrice: 10999, image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-19', name: 'MediQuick Pharmacy', description: 'Online pharmacy store with prescription upload', category: 'ecommerce', technologies: ['Next.js', 'UPI'], live: false, iconName: 'Pill', c1: '#16a34a', c2: '#14532d', order: 26, active: true, startingPrice: 22999, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-20', name: 'EduSpark Coaching', description: 'Online coaching platform with live classes & tests', category: 'school', technologies: ['Next.js', 'Zoom API'], live: false, iconName: 'BookOpen', c1: '#7c3aed', c2: '#4c1d95', order: 27, active: true, startingPrice: 29999, image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-21', name: 'AgroFresh Market', description: 'Farm-to-table marketplace for agricultural products', category: 'ecommerce', technologies: ['React', 'Razorpay'], live: false, iconName: 'Leaf', c1: '#15803d', c2: '#14532d', order: 28, active: true, startingPrice: 18999, image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-22', name: 'AutoDeals India', description: 'Car dealership with inventory, EMI calculator & test drive', category: 'business', technologies: ['Next.js', 'API'], live: false, iconName: 'Car', c1: '#475569', c2: '#1e293b', order: 29, active: true, startingPrice: 21999, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-23', name: 'FixIt Home Services', description: 'Home repair & maintenance service booking portal', category: 'other', technologies: ['React', 'Tailwind'], live: false, iconName: 'Wrench', c1: '#d97706', c2: '#92400e', order: 30, active: true, startingPrice: 13999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-24', name: 'CA Pro Accounting', description: 'Chartered accountant firm with client portal & filing', category: 'business', technologies: ['Next.js', 'Dashboard'], live: false, iconName: 'Calculator', c1: '#0369a1', c2: '#0c4a6e', order: 31, active: true, startingPrice: 16999, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-25', name: 'NestHomes Interior', description: 'Interior design studio with 3D project showcase', category: 'portfolio', technologies: ['React', 'Three.js'], live: false, iconName: 'Sofa', c1: '#b45309', c2: '#78350f', order: 32, active: true, startingPrice: 14999, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format' },
  { _id: 'fb-26', name: 'TechStartup SaaS', description: 'SaaS product landing page with pricing & onboarding', category: 'business', technologies: ['Next.js', 'Stripe'], live: false, iconName: 'Rocket', c1: '#6366f1', c2: '#3730a3', order: 33, active: true, startingPrice: 17999, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&auto=format' },
];

export default async function DemosPage() {
  let demos: any[] = [];
  try {
    await connectDB();
    const dbDemos = await Demo.find({ active: true }).sort({ live: -1, order: 1, createdAt: -1 }).lean();
    demos = dbDemos.length > 0 ? dbDemos.map((d: any) => ({ ...d, _id: d._id.toString() })) : fallbackDemos;
  } catch {
    demos = fallbackDemos;
  }

  return <DemosClient demos={demos} />;
}
