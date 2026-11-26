// One data source for all four menu styles — links, order and labels are
// identical whichever style a visitor gets (so nobody gets lost and SEO links
// don't change). Every href below is a real /software/<slug> page; images are
// the same product photos already used on those pages.
export type MegaMenuItem = {
  label: string; desc: string; href: string; icon: string;
  /** Longer line shown in the hover preview. */
  blurb: string; tag: string; img: string; c1: string; c2: string;
};
export type MegaMenuFeatured = { title: string; desc: string; img: string; href: string };
export type MegaMenu = { featured?: MegaMenuFeatured; items: MegaMenuItem[]; allLabel?: string; allHref?: string };

const u = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

export const megaMenus: Record<string, MegaMenu> = {
  'Software & Website': {
    featured: {
      title: 'CRM Software',
      desc: 'Sales pipeline, WhatsApp/Email automation and lead scoring.',
      img: u('photo-1553729459-efe14ef6055d'),
      href: '/software/crm',
    },
    items: [
      { label: 'ERP',          desc: 'Run every department',  href: '/software/erp',          icon: 'Boxes',           tag: 'Enterprise', img: u('photo-1522071820081-009f0129c71c'), c1: '#3b82f6', c2: '#1d4ed8', blurb: 'One system for finance, HR, stock and operations — every department on the same live data.' },
      { label: 'CRM',          desc: 'Leads and follow-ups',  href: '/software/crm',          icon: 'Handshake',       tag: 'Popular',    img: u('photo-1553729459-efe14ef6055d'), c1: '#ec4899', c2: '#be185d', blurb: 'Sales pipeline, WhatsApp and email automation, and lead scoring in one place.' },
      { label: 'Billing',      desc: 'Invoices and GST',      href: '/software/billing',      icon: 'Receipt',         tag: 'Bestseller', img: u('photo-1554224155-6726b3ff858f'), c1: '#22c55e', c2: '#16a34a', blurb: 'GST-ready invoicing, payments and reports without the spreadsheet work.' },
      { label: 'Inventory',    desc: 'Stock and warehouses',  href: '/software/inventory',    icon: 'Package',         tag: 'New',        img: u('photo-1553413077-190dd305871c'), c1: '#06b6d4', c2: '#0891b2', blurb: 'Know what is in stock, where it is and when to reorder — across every warehouse.' },
      { label: 'GPS Tracking', desc: 'Live fleet location',   href: '/software/gps-tracking', icon: 'MapPin',          tag: 'Premium',    img: u('photo-1519003722824-194d4455a60c'), c1: '#f97316', c2: '#ea580c', blurb: 'Live vehicle location, routes and alerts on a single map.' },
      { label: 'Restaurant',   desc: 'POS and online orders', href: '/software/restaurant',   icon: 'UtensilsCrossed', tag: 'Hospitality', img: u('photo-1414235077428-338989a2e8c0'), c1: '#f59e0b', c2: '#d97706', blurb: 'Billing, tables, kitchen and delivery orders synced in real time.' },
    ],
    allLabel: 'View all software & websites',
    allHref: '/software',
  },
};

export type MegaMenuKey = keyof typeof megaMenus;
