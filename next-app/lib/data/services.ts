export type Service = { slug: string; name: string; description: string; icon: string; color: string };

export const services: Service[] = [
  { slug: 'custom-software', name: 'Custom Software Development', description: 'Purpose-built software engineered around your exact workflow — not a template stretched to fit your business.', icon: 'LaptopMinimal', color: '#3b82f6' },
  { slug: 'website', name: 'Website Development', description: 'High-performance websites engineered for search visibility, speed, and conversions from day one.', icon: 'Globe', color: '#06b6d4' },
  { slug: 'android', name: 'Android App Development', description: 'Native and cross-platform mobile applications engineered for performance — built to keep customers engaged and coming back.', icon: 'Smartphone', color: '#22c55e' },
  { slug: 'gps', name: 'GPS Installation & Monitoring', description: 'End-to-end fleet visibility — GPS hardware, installation, and 24/7 monitoring that keeps vehicles and assets accounted for.', icon: 'Satellite', color: '#f97316' },
  { slug: 'civil', name: 'Civil Engineering Work', description: 'Construction and civil engineering delivered on schedule and to specification — from RCC structures to complete interiors.', icon: 'HardHat', color: '#eab308' },
  { slug: 'mechanical', name: 'Mechanical Work', description: 'Fabrication, machining, and maintenance contracts that keep production equipment running with minimal downtime.', icon: 'Cog', color: '#0d9488' },
  { slug: 'automation', name: 'Industrial Automation', description: 'Industrial automation that brings PLC, SCADA, and IoT data together — giving plant managers real-time visibility into the shop floor.', icon: 'Bot', color: '#22c55e' },
  { slug: 'cctv', name: 'CCTV & Security Systems', description: 'HD/4K surveillance, biometric access, and security systems engineered to protect people, assets, and premises around the clock.', icon: 'Video', color: '#ef4444' },
  { slug: 'erp', name: 'ERP Solutions', description: 'Enterprise ERP that unifies finance, sales, and HR on one platform — replacing disconnected spreadsheets with real-time visibility.', icon: 'Network', color: '#3b82f6' },
  { slug: 'cloud', name: 'Cloud Hosting', description: 'Managed cloud infrastructure on AWS, Azure, and GCP — engineered for uptime, so your systems stay online when it matters.', icon: 'Cloud', color: '#06b6d4' },
  { slug: 'ai', name: 'AI Automation', description: 'Intelligent AI agents and document automation that take repetitive work off your team\'s plate and reduce manual error.', icon: 'Brain', color: '#9333ea' },
  { slug: 'digital-marketing', name: 'Digital Marketing', description: 'Performance marketing across SEO, Google, and Meta — engineered to bring in qualified leads, not just traffic.', icon: 'Megaphone', color: '#ef4444' },
  { slug: 'branding', name: 'Business Branding', description: 'Brand identity and collateral engineered to make a premium first impression — from logo to packaging.', icon: 'Palette', color: '#f97316' },
  { slug: 'consultancy', name: 'Technical Consultancy', description: 'CTO-as-a-service and technical audits that give founders and leadership teams clarity before they commit budget.', icon: 'Users', color: '#14b8a6' },
  { slug: 'crm', name: 'CRM Development', description: 'Custom CRM systems that track leads, pipeline stages, and customer history in one place — built around your actual sales process.', icon: 'Contact2', color: '#f43f5e' },
  { slug: 'api-development', name: 'API Development', description: 'REST APIs and integration layers that connect your software to payment gateways, WhatsApp, accounting tools, and the systems you already run.', icon: 'Webhook', color: '#0ea5e9' },
  { slug: 'white-label', name: 'White Label Solutions', description: 'Rebrand-ready software for agencies and resellers — your brand and pricing, our engineering running underneath.', icon: 'Tag', color: '#8b5cf6' },
  { slug: 'enterprise-integrations', name: 'Enterprise Integrations', description: 'Connecting new systems to your existing ERP, CRM, and legacy databases — so software additions extend what you have instead of replacing it.', icon: 'Workflow', color: '#f59e0b' },
];
