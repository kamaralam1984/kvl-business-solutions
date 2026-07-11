export type Software = {
  slug: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  monthlyRent: number;
  unit: string;
  rentUnit: string;
  tag?: string;
  icon: string;
  image: string;
  c1: string;
  c2: string;
  demoNav: { label: string; icon: string }[];
  /** Real functional category derived from what the product actually does — used for marketplace filtering. */
  category: string;
};

export const softwareProducts: Software[] = [
  {
    slug: 'crm',
    name: 'CRM Software',
    description: 'AI-powered CRM that helps sales teams capture more leads, manage pipelines and close deals faster — every follow-up on time, no lead lost to a full inbox.',
    features: ['Sales pipeline', 'WhatsApp/Email automation', 'Lead scoring', 'Analytics dashboard', 'Mobile app', 'Team management'],
    price: 24999, monthlyRent: 2499, unit: '/year', rentUnit: '/month',
    tag: 'POPULAR', icon: 'Handshake', image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80&auto=format&fit=crop', c1: '#ec4899', c2: '#be185d',
    category: 'Sales & CRM',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Leads', icon: 'Users' }, { label: 'Pipeline', icon: 'GitBranch' }, { label: 'Follow-ups', icon: 'Bell' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'billing',
    name: 'Billing Software',
    description: 'Fast, GST-compliant billing that replaces manual invoicing with 1-click e-invoicing, e-way bills and Tally-ready records — accurate books without the month-end scramble.',
    features: ['1-click GST invoicing', 'Thermal printer support', 'Tally export', 'E-way bill', 'Multiple payment modes', 'Customer ledger'],
    price: 15999, monthlyRent: 1499, unit: '/year', rentUnit: '/month',
    tag: 'BESTSELLER', icon: 'Receipt', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop', c1: '#22c55e', c2: '#16a34a',
    category: 'Finance & Billing',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Invoices', icon: 'FileText' }, { label: 'Customers', icon: 'Users' }, { label: 'Payments', icon: 'CreditCard' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'erp',
    name: 'ERP Software',
    description: 'Enterprise ERP that unifies finance, HR, sales, purchase and inventory on one platform — replacing disconnected spreadsheets with real-time visibility across the business.',
    features: ['Multi-branch support', 'GST compliant', 'Cloud + Local hosting', 'Financial accounting', 'Purchase management', 'Custom reports'],
    price: 49999, monthlyRent: 4999, unit: '/year', rentUnit: '/month',
    tag: 'ENTERPRISE', icon: 'Network', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop', c1: '#3b82f6', c2: '#1d4ed8',
    category: 'Operations & ERP',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Accounting', icon: 'BookOpen' }, { label: 'Purchase', icon: 'ShoppingBag' }, { label: 'Sales', icon: 'TrendingUp' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'inventory',
    name: 'Inventory Software',
    description: 'Real-time inventory software that replaces manual stock counts with barcode-tracked visibility across every warehouse — fewer stockouts, fewer written-off goods.',
    features: ['Barcode/QR scanning', 'Multi-warehouse', 'Auto purchase order', 'Low stock alerts', 'Stock valuation', 'Supplier management'],
    price: 19999, monthlyRent: 1999, unit: '/year', rentUnit: '/month',
    tag: 'NEW', icon: 'Boxes', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80&auto=format&fit=crop', c1: '#06b6d4', c2: '#0891b2',
    category: 'Operations & ERP',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Products', icon: 'Package' }, { label: 'Stock In', icon: 'ArrowDownCircle' }, { label: 'Stock Out', icon: 'ArrowUpCircle' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'gps-tracking',
    name: 'GPS Tracking Software',
    description: 'Live GPS tracking software that gives fleet managers real-time vehicle visibility, route history and geofence alerts — so assets stay accounted for and fuel costs stay in check.',
    features: ['Real-time location', 'Geofence alerts', 'Mobile app', 'Route history', 'Driver behavior', 'Fuel monitoring'],
    price: 2999, monthlyRent: 299, unit: '/vehicle/year', rentUnit: '/vehicle/month',
    tag: 'PREMIUM', icon: 'Satellite', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80&auto=format&fit=crop', c1: '#f97316', c2: '#ea580c',
    category: 'Fleet & Logistics',
    demoNav: [{ label: 'Live Map', icon: 'Map' }, { label: 'Vehicles', icon: 'Truck' }, { label: 'Routes', icon: 'Route' }, { label: 'Alerts', icon: 'AlertTriangle' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'school',
    name: 'School Management Software',
    description: 'Complete school management software that runs admissions, fees, attendance, exams and transport from one platform — freeing staff from manual, paper-based tracking.',
    features: ['Parent + Student app', 'Online exams', 'Fee management', 'Attendance tracking', 'Transport management', 'Library management'],
    price: 29999, monthlyRent: 2999, unit: '/year', rentUnit: '/month',
    tag: 'EDUCATION', icon: 'GraduationCap', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80&auto=format&fit=crop', c1: '#8b5cf6', c2: '#6d28d9',
    category: 'Education',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Students', icon: 'Users' }, { label: 'Fees', icon: 'BadgeIndianRupee' }, { label: 'Attendance', icon: 'CalendarCheck' }, { label: 'Exams', icon: 'BookOpen' }],
  },
  {
    slug: 'hospital',
    name: 'Hospital Management Software',
    description: 'End-to-end hospital management software that unifies OPD, IPD, pharmacy, lab, billing and EMR into one patient record — so care teams spend less time on paperwork and more on patients.',
    features: ['EMR / EHR', 'Lab integration', 'Insurance claims', 'OPD/IPD management', 'Pharmacy module', 'Doctor scheduling'],
    price: 59999, monthlyRent: 5999, unit: '/year', rentUnit: '/month',
    tag: 'HEALTHCARE', icon: 'Stethoscope', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80&auto=format&fit=crop', c1: '#ef4444', c2: '#b91c1c',
    category: 'Healthcare',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'OPD Queue', icon: 'Users' }, { label: 'IPD', icon: 'Bed' }, { label: 'Pharmacy', icon: 'Pill' }, { label: 'Lab', icon: 'FlaskConical' }],
  },
  {
    slug: 'construction',
    name: 'Construction Management',
    description: 'Construction management software that tracks BOQ, materials, labour and site progress in real time — catching cost overruns and delays before they become expensive.',
    features: ['BOQ & estimation', 'Site progress tracking', 'Vendor management', 'Labour management', 'Gantt chart', 'Cost control'],
    price: 39999, monthlyRent: 3999, unit: '/year', rentUnit: '/month',
    icon: 'HardHat', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop', c1: '#eab308', c2: '#a16207',
    category: 'Construction & Real Estate',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Projects', icon: 'Briefcase' }, { label: 'Materials', icon: 'Package' }, { label: 'Labour', icon: 'Users' }, { label: 'Timeline', icon: 'CalendarDays' }],
  },
  {
    slug: 'workshop',
    name: 'Workshop Management',
    description: 'Workshop management software that replaces lost job cards and scattered records with tracked service jobs, spare parts and customer history — faster turnarounds, fewer disputes.',
    features: ['Service job cards', 'SMS notifications', 'Parts inventory', 'Customer history', 'Mechanic tracking', 'Invoice generation'],
    price: 17999, monthlyRent: 1799, unit: '/year', rentUnit: '/month',
    icon: 'Wrench', image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80&auto=format&fit=crop', c1: '#0d9488', c2: '#115e59',
    category: 'Operations & ERP',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Job Cards', icon: 'ClipboardList' }, { label: 'Spare Parts', icon: 'Cog' }, { label: 'Customers', icon: 'Users' }, { label: 'Invoices', icon: 'FileText' }],
  },
  {
    slug: 'payroll',
    name: 'Payroll Software',
    description: 'Payroll software that automates salary processing, payslips and PF/ESI/TDS compliance — accurate pay, on time, without a manual compliance scramble every month.',
    features: ['Auto payslip generation', 'PF, ESI, TDS compliance', 'Form 16', 'Leave management', 'Bank transfer file', 'Attendance integration'],
    price: 14999, monthlyRent: 1499, unit: '/year', rentUnit: '/month',
    icon: 'BadgeIndianRupee', image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80&auto=format&fit=crop', c1: '#14b8a6', c2: '#0f766e',
    category: 'HR & Workforce',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Employees', icon: 'Users' }, { label: 'Salary', icon: 'DollarSign' }, { label: 'Leaves', icon: 'CalendarOff' }, { label: 'Payslips', icon: 'FileText' }],
  },
  {
    slug: 'attendance',
    name: 'Attendance System',
    description: 'Biometric and mobile attendance software that replaces manual registers with accurate shift, leave and overtime tracking — payroll-ready data, no disputes over hours worked.',
    features: ['Face/Biometric support', 'Geo-fenced mobile', 'Shift management', 'Leave tracking', 'Overtime calculation', 'Reports & analytics'],
    price: 11999, monthlyRent: 1199, unit: '/year', rentUnit: '/month',
    icon: 'Fingerprint', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80&auto=format&fit=crop', c1: '#64748b', c2: '#1e293b',
    category: 'HR & Workforce',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Today', icon: 'CalendarCheck' }, { label: 'Employees', icon: 'Users' }, { label: 'Shifts', icon: 'Clock' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'ai-business',
    name: 'AI Business Software',
    description: 'Intelligent AI automation that scores leads, predicts sales trends and generates reports automatically — reducing manual analysis and helping teams act on data instead of chasing it.',
    features: ['AI chatbot + voice', 'Predictive analytics', 'Auto reports', 'Lead scoring AI', 'Document AI', 'Custom AI workflows'],
    price: 89999, monthlyRent: 8999, unit: '/year', rentUnit: '/month',
    tag: 'AI POWERED', icon: 'Brain', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop', c1: '#9333ea', c2: '#581c87',
    category: 'AI & Automation',
    demoNav: [{ label: 'AI Dashboard', icon: 'LayoutDashboard' }, { label: 'AI Chat', icon: 'MessageSquare' }, { label: 'Predictions', icon: 'TrendingUp' }, { label: 'Automation', icon: 'Zap' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'restaurant',
    name: 'Restaurant POS Software',
    description: 'Restaurant POS software that unifies tables, kitchen orders, billing and delivery platforms like Swiggy and Zomato — one system instead of five, with full visibility into real margins.',
    features: ['Table management', 'Kitchen Order Ticket', 'GST billing', 'Swiggy/Zomato sync', 'Inventory tracking', 'Sales reports'],
    price: 14999, monthlyRent: 1499, unit: '/year', rentUnit: '/month',
    tag: 'HOSPITALITY', icon: 'UtensilsCrossed', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', c1: '#f59e0b', c2: '#d97706',
    category: 'Hospitality',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Tables', icon: 'Grid3X3' }, { label: 'Orders', icon: 'ShoppingCart' }, { label: 'Kitchen', icon: 'ChefHat' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'hotel',
    name: 'Hotel Management Software',
    description: 'Hotel management software that runs front desk, reservations, housekeeping and billing from one system — synced with a channel manager so no booking is ever double-counted.',
    features: ['Reservation management', 'Front desk operations', 'Housekeeping module', 'Online booking engine', 'Channel manager', 'Restaurant billing'],
    price: 34999, monthlyRent: 2999, unit: '/year', rentUnit: '/month',
    tag: 'HOSPITALITY', icon: 'Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop', c1: '#8b5cf6', c2: '#7c3aed',
    category: 'Hospitality',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Rooms', icon: 'BedDouble' }, { label: 'Reservations', icon: 'CalendarDays' }, { label: 'Housekeeping', icon: 'Sparkles' }, { label: 'Billing', icon: 'Receipt' }],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate CRM',
    description: 'Real estate CRM that tracks every lead, site visit and commission in one pipeline — so enquiries convert to bookings instead of going cold.',
    features: ['Property listings', 'Lead management', 'Site visit tracking', 'Commission calculator', 'Document management', 'WhatsApp automation'],
    price: 29999, monthlyRent: 2499, unit: '/year', rentUnit: '/month',
    tag: 'REALESTATE', icon: 'Building2', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&auto=format&fit=crop', c1: '#10b981', c2: '#059669',
    category: 'Construction & Real Estate',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Properties', icon: 'Home' }, { label: 'Leads', icon: 'Users' }, { label: 'Site Visits', icon: 'MapPin' }, { label: 'Commission', icon: 'BadgeIndianRupee' }],
  },
];
