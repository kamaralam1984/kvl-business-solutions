// Default demos seeded into DB on first admin access (or via API seed endpoint)
// Edit these freely from /admin/demos once seeded.

export const DEFAULT_DEMOS = [
  // ─── Real LIVE production sites (KVL clients) ───
  { name: 'Vidyt', description: 'Live video / content platform — fully deployed for client', url: 'https://www.vidyt.com', category: 'video', technologies: ['Next.js', 'Tailwind', 'Production'], live: true, iconName: 'Video', c1: '#9333ea', c2: '#581c87', order: 0, active: true, startingPrice: 0 },
  { name: 'Aapka Plot', description: 'Real estate & property listing platform — live for plot buyers', url: 'https://www.aapkaplote.com', category: 'realestate', technologies: ['React', 'Real-time', 'Production'], live: true, iconName: 'Home', c1: '#16a34a', c2: '#14532d', order: 1, active: true, startingPrice: 0 },

  // ─── Sample design templates ───
  { name: 'Bright Future Academy', description: 'Modern school website with admission flow', url: '', category: 'school', technologies: ['React', 'Tailwind'], live: false, iconName: 'GraduationCap', c1: '#8b5cf6', c2: '#6d28d9', order: 10, active: true, startingPrice: 14999 },
  { name: 'City Care Multi-Speciality', description: 'Hospital site with online appointments', url: '', category: 'hospital', technologies: ['Next.js', 'API'], live: false, iconName: 'Hospital', c1: '#ef4444', c2: '#b91c1c', order: 11, active: true, startingPrice: 19999 },
  { name: 'Pillar Constructions', description: 'Premium construction company site', url: '', category: 'construction', technologies: ['WordPress', 'SEO'], live: false, iconName: 'HardHat', c1: '#eab308', c2: '#a16207', order: 12, active: true, startingPrice: 14999 },
  { name: 'FleetMaster Dashboard', description: 'Live GPS tracking SaaS dashboard', url: '', category: 'gps', technologies: ['React', 'Mapbox'], live: false, iconName: 'Satellite', c1: '#3b82f6', c2: '#1d4ed8', order: 13, active: true, startingPrice: 24999 },
  { name: 'SmartShop India', description: 'Multi-vendor e-commerce store', url: '', category: 'ecommerce', technologies: ['Shopify', 'UPI'], live: false, iconName: 'ShoppingCart', c1: '#22c55e', c2: '#16a34a', order: 14, active: true, startingPrice: 29999 },
  { name: 'Skyline Realty', description: 'Property listing + virtual tours', url: '', category: 'realestate', technologies: ['React', '360°'], live: false, iconName: 'Building2', c1: '#8b5cf6', c2: '#4c1d95', order: 15, active: true, startingPrice: 19999 },
  { name: 'SteelForge Industries', description: 'Mechanical workshop & fabrication', url: '', category: 'mechanical', technologies: ['HTML5', 'Animations'], live: false, iconName: 'Cog', c1: '#0d9488', c2: '#115e59', order: 16, active: true, startingPrice: 14999 },
  { name: 'Municipal Portal', description: 'Govt project & citizen services', url: '', category: 'government', technologies: ['Accessibility', 'Hindi'], live: false, iconName: 'Landmark', c1: '#64748b', c2: '#1e293b', order: 17, active: true, startingPrice: 39999 },
  { name: 'Creative Portfolio', description: 'Personal portfolio with animations', url: '', category: 'portfolio', technologies: ['GSAP', 'Three.js'], live: false, iconName: 'UserSquare', c1: '#ec4899', c2: '#be185d', order: 18, active: true, startingPrice: 9999 },
];
