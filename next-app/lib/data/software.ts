export type Software = {
  slug: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  unit: string;
  tag?: string;
  icon: string;
  c1: string;
  c2: string;
};

export const softwareProducts: Software[] = [
  { slug: 'erp', name: 'ERP Software', description: 'Complete enterprise resource planning with finance, HR, sales, purchase & inventory.', features: ['Multi-branch support', 'GST compliant', 'Cloud + Local hosting'], price: 49999, unit: '/year', tag: 'BESTSELLER', icon: 'Network', c1: '#3b82f6', c2: '#1d4ed8' },
  { slug: 'billing', name: 'Billing Software', description: 'Fast GST billing, e-invoicing, e-way bill, multiple payment modes.', features: ['1-click invoicing', 'Thermal printer', 'Tally export'], price: 15999, unit: '/year', tag: 'POPULAR', icon: 'Receipt', c1: '#22c55e', c2: '#16a34a' },
  { slug: 'inventory', name: 'Inventory Software', description: 'Real-time stock tracking, barcode integration, low-stock alerts.', features: ['Barcode/QR scanning', 'Multi-warehouse', 'Auto PO'], price: 19999, unit: '/year', tag: 'NEW', icon: 'Boxes', c1: '#06b6d4', c2: '#0891b2' },
  { slug: 'gps-tracking', name: 'GPS Tracking Software', description: 'Live vehicle/asset tracking with route history, geofencing, analytics.', features: ['Real-time location', 'Geofence alerts', 'Mobile app'], price: 2999, unit: '/vehicle/year', tag: 'PREMIUM', icon: 'Satellite', c1: '#f97316', c2: '#ea580c' },
  { slug: 'school', name: 'School Management Software', description: 'Complete school ERP with admission, fees, attendance, exam, transport.', features: ['Parent + Student app', 'Online exams', 'Fee management'], price: 29999, unit: '/year', tag: 'EDUCATION', icon: 'GraduationCap', c1: '#8b5cf6', c2: '#6d28d9' },
  { slug: 'hospital', name: 'Hospital Management Software', description: 'End-to-end HMS with OPD, IPD, pharmacy, lab, billing, EMR.', features: ['EMR / EHR', 'Lab integration', 'Insurance claims'], price: 59999, unit: '/year', tag: 'HEALTHCARE', icon: 'Stethoscope', c1: '#ef4444', c2: '#b91c1c' },
  { slug: 'construction', name: 'Construction Management Software', description: 'Project planning, BOQ, material tracking, labor, Gantt timeline.', features: ['BOQ & estimation', 'Site progress', 'Vendor mgmt'], price: 39999, unit: '/year', icon: 'HardHat', c1: '#eab308', c2: '#a16207' },
  { slug: 'workshop', name: 'Mechanical Workshop Software', description: 'Service jobs, spare parts, customer history, mechanic tracking.', features: ['Service job cards', 'SMS notifications', 'Parts inventory'], price: 17999, unit: '/year', icon: 'Wrench', c1: '#0d9488', c2: '#115e59' },
  { slug: 'crm', name: 'CRM Software', description: 'Lead capture, pipeline, follow-ups, WhatsApp + email automation.', features: ['Sales pipeline', 'WhatsApp/Email auto', 'Lead scoring'], price: 24999, unit: '/year', icon: 'Handshake', c1: '#ec4899', c2: '#be185d' },
  { slug: 'payroll', name: 'Payroll Software', description: 'Salary processing, payslip, PF/ESI/TDS, leave management.', features: ['Auto payslip', 'PF, ESI, TDS', 'Form 16'], price: 14999, unit: '/year', icon: 'BadgeIndianRupee', c1: '#14b8a6', c2: '#0f766e' },
  { slug: 'attendance', name: 'Attendance System', description: 'Biometric + face + mobile attendance with shift & leave tracking.', features: ['Face/Biometric', 'Geo-fenced mobile', 'Shift mgmt'], price: 11999, unit: '/year', icon: 'Fingerprint', c1: '#64748b', c2: '#1e293b' },
  { slug: 'ai-business', name: 'AI Business Software', description: 'AI insights, sales prediction, chatbot, automated reports.', features: ['AI chatbot + voice', 'Predictive analytics', 'Auto reports'], price: 89999, unit: '/year', tag: 'AI POWERED', icon: 'Brain', c1: '#9333ea', c2: '#581c87' },
];
