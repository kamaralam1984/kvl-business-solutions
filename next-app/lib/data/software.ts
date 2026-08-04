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
  /** Concrete business ROI, not feature restatements — shown on the product page's "Business Benefits" section. */
  benefits: { icon: string; title: string; desc: string }[];
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
    benefits: [
      { icon: 'Bell', title: 'Never lose a lead', desc: 'Every enquiry is auto-captured and reminded on — no deal forgotten in a full inbox or a salesperson’s memory.' },
      { icon: 'GitBranch', title: 'Close deals faster', desc: 'A visual pipeline shows exactly which deals need attention today, not a spreadsheet nobody updates.' },
      { icon: 'BarChart2', title: 'See real sales numbers', desc: 'Live dashboards replace end-of-month guesswork with an always-current view of pipeline and revenue.' },
    ],
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
    benefits: [
      { icon: 'ShieldCheck', title: 'GST-ready in one click', desc: 'Auto-calculated GST invoices and e-way bills — no manual tax errors, no compliance risk at filing time.' },
      { icon: 'Clock', title: 'Faster collections', desc: 'Digital invoices reach customers instantly, with automatic payment reminders built in.' },
      { icon: 'BookOpen', title: 'Tally-ready books', desc: 'Direct export means your accountant spends less time on data entry and more on advice.' },
    ],
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
    benefits: [
      { icon: 'Network', title: 'One system, not five', desc: 'Finance, HR, sales, purchase and inventory in one place — no more reconciling spreadsheets across departments.' },
      { icon: 'Eye', title: 'Real-time visibility', desc: 'See stock, cash and sales position across every branch, any time — not just at month-end.' },
      { icon: 'Clock', title: 'Faster month-end close', desc: 'Automated reporting cuts closing time from days to hours.' },
    ],
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
    benefits: [
      { icon: 'PackageCheck', title: 'Fewer stockouts', desc: 'Auto low-stock alerts and auto-purchase orders mean you reorder before you run out, not after.' },
      { icon: 'ScanLine', title: 'Less shrinkage', desc: 'Barcode tracking exposes exactly where and when stock goes missing.' },
      { icon: 'Warehouse', title: 'Multi-warehouse clarity', desc: 'Know what stock sits where, in real time, instead of calling each location to check.' },
    ],
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
    benefits: [
      { icon: 'Fuel', title: 'Lower fuel costs', desc: 'Route history and driver-behavior data expose fuel wastage you can actually act on.' },
      { icon: 'Navigation', title: 'Faster response', desc: 'Real-time location means dispatchers reroute vehicles instantly, not after a customer complains.' },
      { icon: 'ShieldAlert', title: 'Asset accountability', desc: 'Geofence alerts flag unauthorized stops or detours the moment they happen.' },
    ],
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
    benefits: [
      { icon: 'ClipboardCheck', title: 'Less admin overhead', desc: 'Fees, attendance and exams run from one system — staff stop chasing paper registers.' },
      { icon: 'Smartphone', title: 'Higher parent trust', desc: 'Parents see fees, attendance and results in real time through the parent app, not a term-end notebook.' },
      { icon: 'BadgeIndianRupee', title: 'Faster fee collection', desc: 'Automated reminders and online payment cut down on overdue fees every term.' },
    ],
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
    benefits: [
      { icon: 'Clock', title: 'Faster patient turnaround', desc: 'OPD queue, billing and pharmacy connected — patients spend less time waiting between departments.' },
      { icon: 'FileCheck', title: 'Fewer billing errors', desc: 'Insurance claims and billing pull from the same patient record, instead of being re-entered by hand.' },
      { icon: 'ShieldCheck', title: 'Compliant medical records', desc: 'EMR/EHR keeps a complete, audit-ready patient history available to every authorized department.' },
    ],
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
    benefits: [
      { icon: 'TrendingDown', title: 'Catch overruns early', desc: 'Real-time BOQ vs. actual spend flags cost overruns while there’s still time to act on them.' },
      { icon: 'CalendarClock', title: 'Fewer delays', desc: 'Gantt-tracked site progress shows exactly which task is behind schedule, and why.' },
      { icon: 'Users', title: 'Vendor accountability', desc: 'Every vendor and labour payment is logged against the project — no disputed bills at handover.' },
    ],
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
    benefits: [
      { icon: 'ClipboardList', title: 'No more lost job cards', desc: 'Every service job is logged digitally — nothing depends on a paper slip that can go missing.' },
      { icon: 'MessageSquare', title: 'Fewer disputes', desc: 'Full job and parts history per customer means no argument over what was actually done or charged.' },
      { icon: 'Clock', title: 'Faster turnarounds', desc: 'Mechanics see their assigned jobs and parts availability instantly, instead of walking over to ask.' },
    ],
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
    benefits: [
      { icon: 'ShieldCheck', title: 'No compliance scramble', desc: 'PF, ESI and TDS calculate automatically every cycle — no manual filing panic at month-end.' },
      { icon: 'Clock', title: 'Payroll runs in minutes', desc: 'Auto payslip generation replaces a manual spreadsheet exercise that used to take days.' },
      { icon: 'FileCheck', title: 'Audit-ready records', desc: 'Form 16, bank transfer files and leave records are always available, not scattered across old files.' },
    ],
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
    benefits: [
      { icon: 'Fingerprint', title: 'No more buddy-punching', desc: 'Face/biometric verification means attendance reflects who actually showed up.' },
      { icon: 'MapPin', title: 'Field staff accountability', desc: 'Geo-fenced mobile check-in works for site staff and field teams, not just an office register.' },
      { icon: 'FileCheck', title: 'Payroll-ready, no disputes', desc: 'Shift, leave and overtime data feeds straight into payroll — no arguing over hours worked.' },
    ],
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
    benefits: [
      { icon: 'Zap', title: 'Less manual analysis', desc: 'Auto-generated reports mean your team acts on data instead of spending hours compiling it.' },
      { icon: 'Target', title: 'Focus on hot leads', desc: 'AI lead scoring tells sales exactly who to call first, instead of working the list in order.' },
      { icon: 'MessageSquare', title: '24/7 first response', desc: 'The AI chatbot answers common questions instantly, even outside business hours.' },
    ],
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
    benefits: [
      { icon: 'ChefHat', title: 'Fewer kitchen mistakes', desc: 'Kitchen Order Tickets remove the handwriting-and-shouting order chain that causes wrong dishes.' },
      { icon: 'LayoutGrid', title: 'One view of all channels', desc: 'Dine-in, Swiggy and Zomato orders land in the same system — no separate tablets to babysit.' },
      { icon: 'TrendingUp', title: 'See your real margins', desc: 'Inventory tied to sales shows true food cost per dish, not just top-line revenue.' },
    ],
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
    benefits: [
      { icon: 'CalendarX2', title: 'No double bookings', desc: 'A synced channel manager means a room booked on one platform blocks it everywhere else, instantly.' },
      { icon: 'Sparkles', title: 'Rooms ready faster', desc: 'Housekeeping status updates in real time, so front desk always knows what’s actually available.' },
      { icon: 'Receipt', title: 'One combined bill', desc: 'Room, restaurant and services charges land on a single guest folio — no chasing separate slips.' },
    ],
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
    benefits: [
      { icon: 'Users', title: 'Fewer cold enquiries', desc: 'Every lead is tracked from first enquiry to site visit — nobody falls through simply because no one followed up.' },
      { icon: 'MapPin', title: 'Site visits that convert', desc: 'Visit outcomes are logged against each lead, so agents follow up with context instead of a cold call.' },
      { icon: 'BadgeIndianRupee', title: 'No commission disputes', desc: 'The commission calculator ties payouts directly to closed deals, transparent to every agent.' },
    ],
    demoNav: [{ label: 'Dashboard', icon: 'LayoutDashboard' }, { label: 'Properties', icon: 'Home' }, { label: 'Leads', icon: 'Users' }, { label: 'Site Visits', icon: 'MapPin' }, { label: 'Commission', icon: 'BadgeIndianRupee' }],
  },
];
