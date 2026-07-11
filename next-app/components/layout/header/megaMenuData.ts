export const megaMenus = {
  Services: {
    featured: {
      title: 'Custom ERP Software',
      desc: 'Built for your exact workflow',
      img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&q=80&auto=format&fit=crop',
      href: '/software',
    },
    items: [
      { label: 'Software Development', desc: 'ERP, CRM, inventory systems', href: '/software', icon: '⬡' },
      { label: 'Website Development', desc: 'Fast, SEO-optimized sites', href: '/website-demos', icon: '◻' },
      { label: 'GPS Fleet Tracking', desc: 'Real-time vehicle management', href: '/services/gps', icon: '◈' },
      { label: 'Industrial Automation', desc: 'IoT, CCTV, civil work', href: '/services/automation', icon: '◉' },
      { label: 'CCTV & Security', desc: 'Surveillance solutions', href: '/services/cctv', icon: '◎' },
      { label: 'AI Business Tools', desc: 'Smart automation & insights', href: '/services/ai', icon: '◈' },
    ],
  },
  Software: {
    featured: {
      title: 'School Management System',
      desc: 'Admissions, fees, attendance, exams — one platform',
      img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=80&auto=format&fit=crop',
      href: '/software',
    },
    items: [
      { label: 'ERP Software', desc: 'Enterprise resource planning', href: '/software', icon: '⬡' },
      { label: 'School Management', desc: 'Fee, attendance, reports', href: '/software', icon: '◻' },
      { label: 'Hospital Management', desc: 'Patient & billing system', href: '/software', icon: '◈' },
      { label: 'Restaurant POS', desc: 'Orders, KOT, inventory', href: '/software', icon: '◉' },
      { label: 'Hotel Management', desc: 'Booking & housekeeping', href: '/software', icon: '◎' },
      { label: 'Inventory & Billing', desc: 'GST-ready billing system', href: '/software', icon: '◈' },
    ],
  },
} as const;

export type MegaMenuKey = keyof typeof megaMenus;
