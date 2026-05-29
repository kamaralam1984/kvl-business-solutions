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
  c1: string;
  c2: string;
  demoNav: { label: string; icon: string }[];
};

export const softwareProducts: Software[] = [
  {
    slug: 'crm',
    name: 'CRM Software',
    description: 'Lead capture, sales pipeline, follow-ups, WhatsApp + email automation.',
    features: ['Sales pipeline', 'WhatsApp/Email automation', 'Lead scoring', 'Analytics dashboard', 'Mobile app', 'Team management'],
    price: 24999, monthlyRent: 2499, unit: '/year', rentUnit: '/month',
    tag: 'POPULAR', icon: 'Handshake', c1: '#ec4899', c2: '#be185d',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Leads', icon: 'Users' }, { label: 'Pipeline', icon: 'GitBranch' }, { label: 'Follow-ups', icon: 'Bell' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'billing',
    name: 'Billing Software',
    description: 'Fast GST billing, e-invoicing, e-way bill, multiple payment modes.',
    features: ['1-click GST invoicing', 'Thermal printer support', 'Tally export', 'E-way bill', 'Multiple payment modes', 'Customer ledger'],
    price: 15999, monthlyRent: 1499, unit: '/year', rentUnit: '/month',
    tag: 'BESTSELLER', icon: 'Receipt', c1: '#22c55e', c2: '#16a34a',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Invoices', icon: 'FileText' }, { label: 'Customers', icon: 'Users' }, { label: 'Payments', icon: 'CreditCard' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'erp',
    name: 'ERP Software',
    description: 'Complete enterprise resource planning with finance, HR, sales, purchase & inventory.',
    features: ['Multi-branch support', 'GST compliant', 'Cloud + Local hosting', 'Financial accounting', 'Purchase management', 'Custom reports'],
    price: 49999, monthlyRent: 4999, unit: '/year', rentUnit: '/month',
    tag: 'ENTERPRISE', icon: 'Network', c1: '#3b82f6', c2: '#1d4ed8',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Accounting', icon: 'BookOpen' }, { label: 'Purchase', icon: 'ShoppingBag' }, { label: 'Sales', icon: 'TrendingUp' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'inventory',
    name: 'Inventory Software',
    description: 'Real-time stock tracking, barcode integration, low-stock alerts.',
    features: ['Barcode/QR scanning', 'Multi-warehouse', 'Auto purchase order', 'Low stock alerts', 'Stock valuation', 'Supplier management'],
    price: 19999, monthlyRent: 1999, unit: '/year', rentUnit: '/month',
    tag: 'NEW', icon: 'Boxes', c1: '#06b6d4', c2: '#0891b2',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Products', icon: 'Package' }, { label: 'Stock In', icon: 'ArrowDownCircle' }, { label: 'Stock Out', icon: 'ArrowUpCircle' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'gps-tracking',
    name: 'GPS Tracking Software',
    description: 'Live vehicle/asset tracking with route history, geofencing, analytics.',
    features: ['Real-time location', 'Geofence alerts', 'Mobile app', 'Route history', 'Driver behavior', 'Fuel monitoring'],
    price: 2999, monthlyRent: 299, unit: '/vehicle/year', rentUnit: '/vehicle/month',
    tag: 'PREMIUM', icon: 'Satellite', c1: '#f97316', c2: '#ea580c',
    demoNav: [{ label: 'Live Map', icon: 'Map' }, { label: 'Vehicles', icon: 'Truck' }, { label: 'Routes', icon: 'Route' }, { label: 'Alerts', icon: 'AlertTriangle' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'school',
    name: 'School Management Software',
    description: 'Complete school ERP with admission, fees, attendance, exam, transport.',
    features: ['Parent + Student app', 'Online exams', 'Fee management', 'Attendance tracking', 'Transport management', 'Library management'],
    price: 29999, monthlyRent: 2999, unit: '/year', rentUnit: '/month',
    tag: 'EDUCATION', icon: 'GraduationCap', c1: '#8b5cf6', c2: '#6d28d9',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Students', icon: 'Users' }, { label: 'Fees', icon: 'BadgeIndianRupee' }, { label: 'Attendance', icon: 'CalendarCheck' }, { label: 'Exams', icon: 'BookOpen' }],
  },
  {
    slug: 'hospital',
    name: 'Hospital Management Software',
    description: 'End-to-end HMS with OPD, IPD, pharmacy, lab, billing, EMR.',
    features: ['EMR / EHR', 'Lab integration', 'Insurance claims', 'OPD/IPD management', 'Pharmacy module', 'Doctor scheduling'],
    price: 59999, monthlyRent: 5999, unit: '/year', rentUnit: '/month',
    tag: 'HEALTHCARE', icon: 'Stethoscope', c1: '#ef4444', c2: '#b91c1c',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'OPD Queue', icon: 'Users' }, { label: 'IPD', icon: 'Bed' }, { label: 'Pharmacy', icon: 'Pill' }, { label: 'Lab', icon: 'FlaskConical' }],
  },
  {
    slug: 'construction',
    name: 'Construction Management',
    description: 'Project planning, BOQ, material tracking, labor, Gantt timeline.',
    features: ['BOQ & estimation', 'Site progress tracking', 'Vendor management', 'Labour management', 'Gantt chart', 'Cost control'],
    price: 39999, monthlyRent: 3999, unit: '/year', rentUnit: '/month',
    icon: 'HardHat', c1: '#eab308', c2: '#a16207',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Projects', icon: 'Briefcase' }, { label: 'Materials', icon: 'Package' }, { label: 'Labour', icon: 'Users' }, { label: 'Timeline', icon: 'CalendarDays' }],
  },
  {
    slug: 'workshop',
    name: 'Workshop Management',
    description: 'Service jobs, spare parts, customer history, mechanic tracking.',
    features: ['Service job cards', 'SMS notifications', 'Parts inventory', 'Customer history', 'Mechanic tracking', 'Invoice generation'],
    price: 17999, monthlyRent: 1799, unit: '/year', rentUnit: '/month',
    icon: 'Wrench', c1: '#0d9488', c2: '#115e59',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Job Cards', icon: 'ClipboardList' }, { label: 'Spare Parts', icon: 'Cog' }, { label: 'Customers', icon: 'Users' }, { label: 'Invoices', icon: 'FileText' }],
  },
  {
    slug: 'payroll',
    name: 'Payroll Software',
    description: 'Salary processing, payslip, PF/ESI/TDS, leave management.',
    features: ['Auto payslip generation', 'PF, ESI, TDS compliance', 'Form 16', 'Leave management', 'Bank transfer file', 'Attendance integration'],
    price: 14999, monthlyRent: 1499, unit: '/year', rentUnit: '/month',
    icon: 'BadgeIndianRupee', c1: '#14b8a6', c2: '#0f766e',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Employees', icon: 'Users' }, { label: 'Salary', icon: 'DollarSign' }, { label: 'Leaves', icon: 'CalendarOff' }, { label: 'Payslips', icon: 'FileText' }],
  },
  {
    slug: 'attendance',
    name: 'Attendance System',
    description: 'Biometric + face + mobile attendance with shift & leave tracking.',
    features: ['Face/Biometric support', 'Geo-fenced mobile', 'Shift management', 'Leave tracking', 'Overtime calculation', 'Reports & analytics'],
    price: 11999, monthlyRent: 1199, unit: '/year', rentUnit: '/month',
    icon: 'Fingerprint', c1: '#64748b', c2: '#1e293b',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Today', icon: 'CalendarCheck' }, { label: 'Employees', icon: 'Users' }, { label: 'Shifts', icon: 'Clock' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'ai-business',
    name: 'AI Business Software',
    description: 'AI insights, sales prediction, chatbot, automated reports.',
    features: ['AI chatbot + voice', 'Predictive analytics', 'Auto reports', 'Lead scoring AI', 'Document AI', 'Custom AI workflows'],
    price: 89999, monthlyRent: 8999, unit: '/year', rentUnit: '/month',
    tag: 'AI POWERED', icon: 'Brain', c1: '#9333ea', c2: '#581c87',
    demoNav: [{ label: 'AI Dashboard', icon: 'LayoutDashboard' }, { label: 'AI Chat', icon: 'MessageSquare' }, { label: 'Predictions', icon: 'TrendingUp' }, { label: 'Automation', icon: 'Zap' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'restaurant',
    name: 'Restaurant POS Software',
    description: 'Table management, KOT, billing, inventory, online orders integration.',
    features: ['Table management', 'Kitchen Order Ticket', 'GST billing', 'Swiggy/Zomato sync', 'Inventory tracking', 'Sales reports'],
    price: 14999, monthlyRent: 1499, unit: '/year', rentUnit: '/month',
    tag: 'HOSPITALITY', icon: 'UtensilsCrossed', c1: '#f59e0b', c2: '#d97706',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Tables', icon: 'Grid3X3' }, { label: 'Orders', icon: 'ShoppingCart' }, { label: 'Kitchen', icon: 'ChefHat' }, { label: 'Reports', icon: 'BarChart2' }],
  },
  {
    slug: 'hotel',
    name: 'Hotel Management Software',
    description: 'Front desk, reservations, housekeeping, billing, channel manager.',
    features: ['Reservation management', 'Front desk operations', 'Housekeeping module', 'Online booking engine', 'Channel manager', 'Restaurant billing'],
    price: 34999, monthlyRent: 2999, unit: '/year', rentUnit: '/month',
    tag: 'HOSPITALITY', icon: 'Hotel', c1: '#8b5cf6', c2: '#7c3aed',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Rooms', icon: 'BedDouble' }, { label: 'Reservations', icon: 'CalendarDays' }, { label: 'Housekeeping', icon: 'Sparkles' }, { label: 'Billing', icon: 'Receipt' }],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate CRM',
    description: 'Property listings, client management, site visits, commission tracking.',
    features: ['Property listings', 'Lead management', 'Site visit tracking', 'Commission calculator', 'Document management', 'WhatsApp automation'],
    price: 29999, monthlyRent: 2499, unit: '/year', rentUnit: '/month',
    tag: 'REALESTATE', icon: 'Building2', c1: '#10b981', c2: '#059669',
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Properties', icon: 'Home' }, { label: 'Leads', icon: 'Users' }, { label: 'Site Visits', icon: 'MapPin' }, { label: 'Commission', icon: 'BadgeIndianRupee' }],
  },
];
