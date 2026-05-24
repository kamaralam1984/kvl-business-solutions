export type Service = { slug: string; name: string; description: string; icon: string; color: string };

export const services: Service[] = [
  { slug: 'custom-software', name: 'Custom Software Development', description: 'Tailor-made software for your unique workflow.', icon: 'LaptopMinimal', color: '#3b82f6' },
  { slug: 'website', name: 'Website Development', description: 'Modern, responsive, SEO-friendly websites.', icon: 'Globe', color: '#06b6d4' },
  { slug: 'android', name: 'Android App Development', description: 'Native + cross-platform mobile apps.', icon: 'Smartphone', color: '#22c55e' },
  { slug: 'gps', name: 'GPS Installation & Monitoring', description: 'End-to-end GPS hardware + 24/7 monitoring.', icon: 'Satellite', color: '#f97316' },
  { slug: 'civil', name: 'Civil Engineering Work', description: 'Construction, RCC, interiors, civil projects.', icon: 'HardHat', color: '#eab308' },
  { slug: 'mechanical', name: 'Mechanical Work', description: 'Fabrication, machining, welding, AMC.', icon: 'Cog', color: '#0d9488' },
  { slug: 'automation', name: 'Industrial Automation', description: 'PLC, SCADA, IoT, Industry 4.0.', icon: 'Bot', color: '#22c55e' },
  { slug: 'cctv', name: 'CCTV & Security Systems', description: 'HD/4K CCTV, biometrics, access control.', icon: 'Video', color: '#ef4444' },
  { slug: 'erp', name: 'ERP Solutions', description: 'End-to-end ERP for finance, sales, HR.', icon: 'Network', color: '#3b82f6' },
  { slug: 'cloud', name: 'Cloud Hosting', description: 'AWS, Azure, GCP managed hosting.', icon: 'Cloud', color: '#06b6d4' },
  { slug: 'ai', name: 'AI Automation', description: 'Chatbots, AI agents, document processing.', icon: 'Brain', color: '#9333ea' },
  { slug: 'digital-marketing', name: 'Digital Marketing', description: 'SEO, Google/Meta ads, social media.', icon: 'Megaphone', color: '#ef4444' },
  { slug: 'branding', name: 'Business Branding', description: 'Logo, identity, brochures, packaging.', icon: 'Palette', color: '#f97316' },
  { slug: 'consultancy', name: 'Technical Consultancy', description: 'Tech audits, CTO-as-a-service.', icon: 'Users', color: '#14b8a6' },
];
