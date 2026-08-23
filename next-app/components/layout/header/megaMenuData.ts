type MegaMenuItem = { label: string; desc: string; href: string; icon: string };
type MegaMenuFeatured = { title: string; desc: string; img: string; href: string };
type MegaMenu = { featured?: MegaMenuFeatured; items: MegaMenuItem[] };

export const megaMenus: Record<string, MegaMenu> = {
  'Software & Website': {
    featured: {
      title: 'School Management System',
      desc: 'Admissions, fees, attendance, exams — one platform',
      img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=80&auto=format&fit=crop',
      href: '/software/school',
    },
    items: [
      { label: 'ERP Software', desc: 'Enterprise resource planning', href: '/software/erp', icon: '⬡' },
      { label: 'CRM Software', desc: 'Pipeline, leads & follow-ups', href: '/software/crm', icon: '◻' },
      { label: 'Website Demo', desc: 'Fast, SEO-optimized sites', href: '/website-demos', icon: '◻' },
      { label: 'Hospital Management', desc: 'Patient & billing system', href: '/software/hospital', icon: '◈' },
      { label: 'Restaurant POS', desc: 'Orders, KOT, inventory', href: '/software/restaurant', icon: '◉' },
      { label: 'Hotel Management', desc: 'Booking & housekeeping', href: '/software/hotel', icon: '◎' },
      { label: 'Inventory & Billing', desc: 'GST-ready billing system', href: '/software/inventory', icon: '◈' },
    ],
  },
};

export type MegaMenuKey = keyof typeof megaMenus;
