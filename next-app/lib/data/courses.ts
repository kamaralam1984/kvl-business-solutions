export type Lesson = { id: string; title: string; duration: string; content: string };
export type Course = {
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  duration: string;
  icon: string;
  c1: string;
  c2: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    slug: 'erp-basics',
    title: 'ERP Software Mastery',
    description: 'Learn to use KVL ERP from zero to hero — finance, HR, sales, purchase, inventory.',
    level: 'Beginner',
    category: 'Software',
    duration: '4 hours',
    icon: 'Network',
    c1: '#3b82f6', c2: '#1d4ed8',
    lessons: [
      { id: 'intro', title: 'What is ERP?', duration: '8 min', content: '## What is ERP?\n\nERP = Enterprise Resource Planning. It\'s a single software that manages your entire business: finance, HR, inventory, sales, purchases.\n\n## Why use ERP?\n- Single source of truth\n- No more Excel sheets\n- Real-time reports\n- GST + tax compliance built-in\n\n## KVL ERP highlights\n- Multi-branch\n- Cloud + on-premise\n- ₹49,999/year\n- Free 7-day trial' },
      { id: 'setup', title: 'Initial setup', duration: '15 min', content: '## First-time login\n1. Open https://kvlbusinesssolutions.com/login\n2. Use credentials emailed to you\n3. Complete company profile (name, GSTIN, address)\n\n## Add your first user\nGo to Settings → Users → Add User. Set role (Admin/Sales/Finance).' },
      { id: 'invoicing', title: 'Creating GST invoices', duration: '20 min', content: '## Sales → New Invoice\n1. Choose customer\n2. Add line items (auto GST calc)\n3. Click Save → Print or Email PDF\n\n## E-invoice generation\nFor B2B > ₹500 — auto-pushed to IRP, IRN downloaded.' },
      { id: 'inventory', title: 'Inventory management', duration: '25 min', content: '## Add products\nProducts → New → enter name, HSN, GST rate, opening stock.\n\n## Stock adjustments\nUse Stock → Adjust for damage, theft, returns.' },
      { id: 'reports', title: 'Reports & dashboards', duration: '15 min', content: '## Available reports\n- Sales by month/customer/product\n- GST returns (GSTR-1, GSTR-3B)\n- P&L statement\n- Balance sheet\n- Inventory aging' },
    ],
  },
  {
    slug: 'gps-tracking',
    title: 'GPS Fleet Tracking',
    description: 'Master GPS device setup, geofencing, route history, and fuel monitoring.',
    level: 'Intermediate',
    category: 'GPS',
    duration: '2 hours',
    icon: 'Satellite',
    c1: '#f97316', c2: '#ea580c',
    lessons: [
      { id: 'devices', title: 'Choosing the right device', duration: '10 min', content: '## Device types\n- **Plug-and-play OBD** — easy install, basic tracking\n- **Wired GPS** — for trucks, advanced features\n- **AIS-140 certified** — for commercial fleet compliance' },
      { id: 'install', title: 'Installation guide', duration: '15 min', content: '## OBD device\n1. Find OBD port (under dashboard)\n2. Plug device, wait 2 min for GPS lock\n3. Open app → device appears\n\n## Wired GPS\nCall KVL technician — free install in Maharashtra.' },
      { id: 'geofence', title: 'Setting up geofences', duration: '12 min', content: '## What are geofences?\nVirtual boundaries on map. Get alerts when vehicle enters/exits.\n\n## Create one\n1. Map → Add Geofence\n2. Draw polygon or circle\n3. Set alerts (entry/exit/both)\n4. Choose vehicles to monitor' },
      { id: 'fuel', title: 'Fuel monitoring', duration: '18 min', content: '## Theft alerts\nGet SMS when fuel drops > 10% in 5 min (theft pattern).\n\n## Reports\nDaily/weekly/monthly fuel consumption vs km driven.' },
    ],
  },
  {
    slug: 'sales-101',
    title: 'B2B Sales Fundamentals',
    description: 'Free course on selling enterprise software in India. Real techniques from KVL sales team.',
    level: 'Beginner',
    category: 'Sales',
    duration: '3 hours',
    icon: 'Handshake',
    c1: '#22c55e', c2: '#16a34a',
    lessons: [
      { id: 'mindset', title: 'B2B sales mindset', duration: '12 min', content: '## You\'re a problem solver, not a seller\n- Understand the customer\'s pain point first\n- Map it to your product\'s value\n- Talk in their language (₹ savings, hours saved)' },
      { id: 'qualify', title: 'Qualifying leads (BANT)', duration: '15 min', content: '## BANT framework\n- **B**udget — do they have money?\n- **A**uthority — are they the decision maker?\n- **N**eed — is there real urgency?\n- **T**imeline — when do they want to buy?\n\nDon\'t waste 1 hr on a lead that fails all 4.' },
      { id: 'demo', title: 'Giving great demos', duration: '20 min', content: '## Demo structure (20 min)\n1. **2 min** — recap their pain\n2. **10 min** — show how product solves it (NOT a feature tour)\n3. **5 min** — answer questions\n4. **3 min** — close: "Should we set up a trial?"' },
      { id: 'objections', title: 'Handling objections', duration: '18 min', content: '## "Too expensive"\nResponse: "I understand. What ROI would justify this for you?" Then math out savings.\n\n## "We\'ll think about it"\nResponse: "What specifically would you need to see to decide?" — uncovers real objection.' },
    ],
  },
  {
    slug: 'gst-india',
    title: 'GST for Indian Businesses',
    description: 'Everything about GST returns, e-invoicing, HSN codes, and compliance.',
    level: 'Intermediate',
    category: 'Finance',
    duration: '5 hours',
    icon: 'BadgeIndianRupee',
    c1: '#eab308', c2: '#a16207',
    lessons: [
      { id: 'gst-basics', title: 'GST basics in 10 min', duration: '10 min', content: '## What is GST?\nGoods & Services Tax — replaced VAT, Service Tax, Excise.\n\n## Rates\n- 0% — essentials (milk, books)\n- 5% — basic (food grain, drugs)\n- 12% — packaged food, computers\n- 18% — most services, electronics\n- 28% — luxury (cars, AC)' },
      { id: 'gstr', title: 'GSTR-1 vs GSTR-3B', duration: '20 min', content: '## GSTR-1\nOutward sales — file by 11th of next month.\n\n## GSTR-3B\nSummary return — file by 20th.\n\n## Late fees\n₹50/day for nil return, ₹100/day for normal. Plus interest on tax due.' },
      { id: 'einvoice', title: 'E-invoicing rules', duration: '15 min', content: '## Who must e-invoice?\nB2B transactions > ₹500 if your turnover > ₹5 crore.\n\n## Process\n1. Generate invoice in software\n2. Auto-push to IRP\n3. Get IRN + QR code\n4. Print on invoice' },
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find(c => c.slug === slug);
}
