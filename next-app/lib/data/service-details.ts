// Extended, per-service copy for the /services/[slug] detail pages.
// Kept separate from lib/data/services.ts (the hub-page summary list) so the
// summary data stays lean while detail pages get real, specific scope copy.

export type ServiceDetail = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  /** 2-3 sentence expansion of the one-line hub description, used in the hero. */
  extendedDescription: string;
  /** Concrete "what's actually delivered" scope bullets. */
  includes: string[];
  /** Slugs into lib/data/software.ts — only set where a real SKU genuinely matches. */
  relatedSoftwareSlugs?: string[];
  /** Slugs into lib/data/industries.ts — genuine fit only. */
  relatedIndustrySlugs: string[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: 'custom-software',
    metaTitle: 'Custom Software Development Company in India | KVL Business Solutions',
    metaDescription: "KVL Business Solutions builds custom software engineered around your exact workflow — internal tools, customer portals and business systems, backed by an in-house team in Patna, Bihar.",
    extendedDescription: "We design and build software around your exact processes — not a generic template you have to bend your business to fit. That covers custom admin dashboards, internal tools, customer-facing portals, booking engines and business-specific workflows, built by an in-house engineering team from requirements through to production deployment and ongoing support.",
    includes: [
      'Requirements mapping and process discovery before a single line of code is written',
      'Custom admin dashboards and internal tools built around your actual workflow',
      'Customer-facing portals, booking engines and business-specific applications',
      "API integrations connecting your new software to payment gateways, SMS/WhatsApp, accounting tools and other systems you already use",
      'Enterprise system integrations — connecting new software to your existing ERP, CRM or legacy databases instead of replacing them wholesale',
      'Ongoing support, hosting guidance and a year of free updates after launch',
    ],
    relatedIndustrySlugs: ['realestate', 'retail', 'government', 'mechanical'],
  },
  {
    slug: 'website',
    metaTitle: 'Website Development Company in India | KVL Business Solutions',
    metaDescription: 'Custom-coded, SEO-ready websites built for speed and conversions by KVL Business Solutions, an MSME registered software company based in Patna, Bihar.',
    extendedDescription: "We build websites engineered for speed, search visibility and conversions — not just visual design. That covers everything from a company's public marketing site to a property portal with live map search, built on modern frameworks with SEO and performance handled from the first sprint, not bolted on afterward.",
    includes: [
      'Custom-coded websites (not drag-and-drop builders) for speed and control',
      'On-page SEO — meta structure, schema markup, sitemap and page speed optimization',
      'Content management so your team can update pages without calling a developer',
      'Mobile-responsive design tested across real devices',
      'Analytics and conversion tracking wired in from launch',
      'Hosting setup and post-launch performance monitoring',
    ],
    relatedIndustrySlugs: ['realestate', 'retail', 'schools'],
  },
  {
    slug: 'android',
    metaTitle: 'Android App Development Company in India | KVL Business Solutions',
    metaDescription: 'Native and cross-platform Android apps built for performance and retention by KVL Business Solutions, an enterprise software company based in Patna, Bihar.',
    extendedDescription: 'We build native and cross-platform Android applications engineered for performance and retention — from a driver-facing logistics app to a parent-facing school app. Every build includes backend API integration and push notifications, not just a working prototype.',
    includes: [
      'Native (Kotlin) or cross-platform (Flutter/React Native) development based on your performance needs',
      'Backend API integration so the app talks to your existing systems in real time',
      'Push notifications, offline support and background location/data sync where needed',
      'UI/UX designed for the specific user — driver, parent, customer or field staff',
      'Play Store listing, submission and release management',
      'Post-launch monitoring, crash reporting and update cycles',
    ],
    relatedIndustrySlugs: ['transport', 'schools', 'retail'],
  },
  {
    slug: 'gps',
    metaTitle: 'GPS Fleet Tracking Installation Company in India | KVL Business Solutions',
    metaDescription: 'End-to-end GPS installation and monitoring for fleets — hardware, installation and a 24/7 live tracking dashboard, delivered by KVL Business Solutions.',
    extendedDescription: 'We handle GPS fleet visibility end-to-end — hardware selection, professional installation, and a live monitoring dashboard with geofencing and driver behavior tracking. This is a physical-plus-software service: our technicians fit the device, and our GPS Tracking Software gives you the dashboard to watch it.',
    includes: [
      'On-site GPS device selection and professional installation across your fleet',
      'Live tracking dashboard with real-time vehicle location',
      'Geofence alerts when a vehicle enters or leaves a defined zone',
      'Route history, idle-time and driver behavior reporting',
      'Fuel monitoring and maintenance alert scheduling',
      '24/7 monitoring support and device servicing',
    ],
    relatedSoftwareSlugs: ['gps-tracking'],
    relatedIndustrySlugs: ['transport', 'construction', 'schools', 'hospitals'],
  },
  {
    slug: 'civil',
    metaTitle: 'Civil Engineering & Construction Contractor in India | KVL Business Solutions',
    metaDescription: 'Civil engineering and construction work delivered on schedule and to specification by KVL Business Solutions — from RCC structures to complete interiors.',
    extendedDescription: 'We deliver civil engineering and construction work on schedule and to specification — from RCC structural work to complete interior fit-outs. Projects run with fixed scope and fixed timelines, with site progress tracked against the original plan rather than managed informally.',
    includes: [
      'Site survey, structural planning and RCC construction',
      'Interior fit-out and finishing work',
      'Material and labour coordination through project completion',
      'Compliance with local building codes and government contract requirements',
      'Progress tracking against the original scope and timeline',
      'Handover documentation and post-completion support',
    ],
    relatedIndustrySlugs: ['construction', 'government'],
  },
  {
    slug: 'mechanical',
    metaTitle: 'Mechanical Fabrication & Maintenance Contractor in India | KVL Business Solutions',
    metaDescription: 'Fabrication, machining and maintenance contracts that keep production equipment running with minimal downtime, delivered by KVL Business Solutions.',
    extendedDescription: "We run fabrication, machining and maintenance contracts that keep production equipment running with minimal downtime. That covers scheduled preventive maintenance as well as emergency repair work, backed by tracked job cards and spare parts inventory so nothing gets lost between visits.",
    includes: [
      'Custom fabrication and precision machining',
      'Scheduled preventive maintenance contracts',
      'Emergency breakdown repair and callout service',
      'Job card tracking and spare parts inventory management',
      'Equipment servicing and calibration',
      'Maintenance history records for audit and compliance',
    ],
    relatedIndustrySlugs: ['mechanical', 'manufacturing'],
  },
  {
    slug: 'automation',
    metaTitle: 'Industrial Automation Company in India | KVL Business Solutions',
    metaDescription: 'PLC, SCADA and IoT-based industrial automation that gives plant managers real-time shop floor visibility, built by KVL Business Solutions.',
    extendedDescription: "We bring PLC, SCADA and IoT sensor data together onto one dashboard, so plant managers get real-time visibility into what's actually happening on the shop floor — machine uptime, output, and where the bottlenecks are — instead of finding out at the end of the shift.",
    includes: [
      'PLC and SCADA system integration',
      'IoT sensor deployment across production lines',
      'Real-time OEE (Overall Equipment Effectiveness) dashboards',
      'Automated alerts for machine downtime or output deviation',
      'Historical production data logging and reporting',
      'Integration with existing plant control systems',
    ],
    relatedIndustrySlugs: ['manufacturing', 'mechanical'],
  },
  {
    slug: 'cctv',
    metaTitle: 'CCTV & Security System Installation Company in India | KVL Business Solutions',
    metaDescription: 'HD/4K surveillance and biometric access systems installed and monitored by KVL Business Solutions, an MSME registered company in Patna, Bihar.',
    extendedDescription: 'We design and install HD/4K surveillance and biometric access systems engineered to protect people, assets and premises around the clock — covering everything from camera placement and cabling to remote monitoring access and biometric attendance integration.',
    includes: [
      'Site survey and camera placement planning for full coverage',
      'HD/4K CCTV installation with NVR/DVR setup',
      'Biometric access control and attendance integration',
      'Remote monitoring access via mobile app',
      'Storage and retention configuration for footage',
      'Ongoing maintenance and system health checks',
    ],
    relatedIndustrySlugs: ['construction', 'mechanical', 'government'],
  },
  {
    slug: 'erp',
    metaTitle: 'ERP Software Implementation Company in India | KVL Business Solutions',
    metaDescription: 'Enterprise ERP that unifies finance, sales and HR on one platform, implemented and supported by KVL Business Solutions.',
    extendedDescription: 'We implement enterprise ERP that unifies finance, sales, purchase, HR and inventory on one platform — replacing disconnected spreadsheets with real-time visibility across departments. Implementation is configured around your existing chart of accounts and workflows, not a forced rebuild of how your business already runs.',
    includes: [
      'Multi-module setup: finance, sales, purchase, HR and inventory on one platform',
      'Multi-branch and multi-location configuration',
      'GST-compliant accounting and reporting',
      'Data migration from existing spreadsheets or legacy systems',
      'Role-based access and approval workflows',
      'Staff training and post-go-live support',
    ],
    relatedSoftwareSlugs: ['crm', 'erp', 'inventory'],
    relatedIndustrySlugs: ['construction', 'schools', 'hospitals', 'government'],
  },
  {
    slug: 'cloud',
    metaTitle: 'Cloud Hosting & Infrastructure Management in India | KVL Business Solutions',
    metaDescription: 'Managed cloud infrastructure on AWS, Azure and GCP, engineered for uptime by KVL Business Solutions.',
    extendedDescription: 'We manage cloud infrastructure on AWS, Azure and GCP — engineered for uptime, so the systems your business depends on stay online when it matters. That covers server provisioning, security hardening, backups and ongoing monitoring, not just a one-time setup.',
    includes: [
      'Cloud server provisioning and configuration on AWS, Azure or GCP',
      'Security hardening, firewall and access control setup',
      'Automated backup and disaster recovery planning',
      'Uptime monitoring and alerting',
      'Cost optimization and resource scaling as you grow',
      'Migration support for moving existing systems to the cloud',
    ],
    relatedIndustrySlugs: ['retail', 'hospitals', 'government'],
  },
  {
    slug: 'ai',
    metaTitle: 'AI Automation Company in India | KVL Business Solutions',
    metaDescription: "AI agents and document automation that take repetitive work off your team's plate, built by KVL Business Solutions.",
    extendedDescription: "We build AI agents and document automation that take repetitive work off your team's plate — from AI chatbots that handle first-line customer queries to document processing that replaces manual data entry. Each build is scoped to a specific repetitive task your team is currently doing by hand.",
    includes: [
      'AI chatbot and voice assistant development for customer-facing queries',
      'Document automation — extracting and processing data from forms, invoices and records',
      'Predictive analytics and lead scoring built on your existing data',
      'Custom AI workflow automation for repetitive internal tasks',
      'Integration with your existing CRM, ERP or business systems',
      'Ongoing model tuning as your data and use case evolve',
    ],
    relatedSoftwareSlugs: ['ai-business'],
    relatedIndustrySlugs: ['realestate', 'hospitals', 'schools'],
  },
  {
    slug: 'digital-marketing',
    metaTitle: 'Digital Marketing Agency in India | KVL Business Solutions',
    metaDescription: 'Performance marketing across SEO, Google and Meta engineered to bring in qualified leads, run by KVL Business Solutions.',
    extendedDescription: 'We run performance marketing across SEO, Google Ads and Meta — engineered to bring in qualified leads, not just traffic. That means keyword and technical SEO work, structured ad campaigns with proper tracking, and monthly reporting tied to actual leads and conversions, not vanity metrics.',
    includes: [
      'Technical and on-page SEO audits and fixes',
      'Google Ads and Meta Ads campaign setup and management',
      'Conversion tracking and analytics setup',
      'Content and keyword strategy tied to real search intent',
      'Monthly performance reporting tied to leads, not just impressions',
      'Landing page optimization for conversion',
    ],
    relatedIndustrySlugs: ['retail', 'realestate', 'schools'],
  },
  {
    slug: 'branding',
    metaTitle: 'Business Branding & Identity Design Company in India | KVL Business Solutions',
    metaDescription: 'Brand identity and collateral engineered to make a premium first impression, designed by KVL Business Solutions.',
    extendedDescription: 'We build brand identity and collateral engineered to make a premium first impression — logo design, brand guidelines, business stationery and packaging design, delivered as a consistent system rather than one-off assets.',
    includes: [
      'Logo design and brand identity development',
      'Brand guidelines — colour, typography and usage rules',
      'Business stationery: cards, letterheads, invoices',
      'Packaging and product collateral design',
      'Marketing collateral: brochures, presentations, signage',
      'Brand asset delivery in every format your team needs',
    ],
    relatedIndustrySlugs: ['retail', 'realestate', 'schools'],
  },
  {
    slug: 'consultancy',
    metaTitle: 'Technical Consultancy & CTO-as-a-Service in India | KVL Business Solutions',
    metaDescription: 'CTO-as-a-service and technical audits that give founders clarity before they commit budget, from KVL Business Solutions.',
    extendedDescription: 'We provide CTO-as-a-service and technical audits that give founders and leadership teams clarity before they commit budget — reviewing your current systems, flagging technical risk, and recommending a realistic build-vs-buy path before you sign off on a large software investment.',
    includes: [
      'Technical audits of existing systems and infrastructure',
      'Build-vs-buy recommendations before you commit budget',
      'Technology roadmap and architecture planning',
      'Vendor evaluation and technical due diligence',
      'Fractional CTO support for ongoing technical decisions',
      'Team and process recommendations for scaling engineering',
    ],
    relatedIndustrySlugs: ['government', 'manufacturing', 'hospitals'],
  },
  {
    slug: 'crm',
    metaTitle: 'CRM Development Company in India | KVL Business Solutions',
    metaDescription: 'Custom CRM systems that track leads, pipeline stages and customer history in one place — built and supported by KVL Business Solutions.',
    extendedDescription: "We build CRM systems around your actual sales process — not a generic pipeline template you have to adapt to. That covers lead capture, pipeline stages, automated follow-ups, and reporting tied to what your sales team is actually doing, whether that's real estate site visits, B2B enterprise deals, or retail repeat-customer tracking.",
    includes: [
      'Lead capture and scoring from every channel — website, WhatsApp, phone, walk-in',
      'Pipeline stages built around your actual sales process, not a generic template',
      'Automated follow-up sequences (WhatsApp, email, SMS) so no lead goes cold',
      'Sales team performance and conversion reporting',
      'Integration with your existing ERP, billing or marketing tools',
      'Role-based access for sales reps, managers and leadership',
    ],
    relatedSoftwareSlugs: ['crm'],
    relatedIndustrySlugs: ['realestate', 'retail', 'government'],
  },
  {
    slug: 'api-development',
    metaTitle: 'API Development Company in India | KVL Business Solutions',
    metaDescription: 'Custom REST APIs and third-party integrations connecting your software to payment gateways, WhatsApp, accounting tools and more — built by KVL Business Solutions.',
    extendedDescription: "We design and build REST APIs and integration layers that connect your software to the tools you already run — payment gateways, SMS/WhatsApp providers, accounting software, mapping services, and other third-party platforms. This covers both building an API for your own product to expose, and integrating your systems with someone else's.",
    includes: [
      'REST API design and documentation for your own product or internal systems',
      'Third-party integrations — payment gateways, WhatsApp/SMS, accounting, mapping and logistics APIs',
      'Authentication and access control (API keys, OAuth, rate limiting)',
      'Webhook setup for real-time data sync between systems',
      'API performance monitoring and versioning strategy',
      'Migration support for legacy APIs to modern standards',
    ],
    relatedIndustrySlugs: ['realestate', 'retail', 'transport'],
  },
  {
    slug: 'white-label',
    metaTitle: 'White Label Software Solutions in India | KVL Business Solutions',
    metaDescription: 'Rebrand-ready software for agencies and resellers — your brand and pricing, built and maintained by KVL Business Solutions.',
    extendedDescription: "We build rebrand-ready software for agencies, resellers and consultants who want to offer software products under their own brand without building an engineering team. You set the branding and pricing; we handle the engineering, hosting and updates underneath — delivered as a genuine product, not a reskinned demo.",
    includes: [
      'Full white-label branding — your logo, colours and domain across the product',
      'Flexible licensing so you set your own pricing to your end clients',
      'Multi-tenant architecture so each of your clients gets their own isolated instance',
      'Ongoing engineering and updates handled behind the scenes',
      'Reseller/partner dashboard for managing multiple client accounts',
      'Confidential engineering — your end clients never see KVL in the product',
    ],
    relatedIndustrySlugs: ['retail', 'realestate'],
  },
  {
    slug: 'enterprise-integrations',
    metaTitle: 'Enterprise System Integration Company in India | KVL Business Solutions',
    metaDescription: 'Connecting new software to your existing ERP, CRM and legacy databases — enterprise integration work by KVL Business Solutions.',
    extendedDescription: "We connect new systems to what you already run — existing ERP, CRM, legacy databases and third-party platforms — so a new build extends your operations instead of forcing a wholesale replacement. This is the integration layer that makes multiple systems act like one, without the risk of a rip-and-replace migration.",
    includes: [
      'Integration mapping across existing ERP, CRM and legacy databases',
      'Middleware and data-sync layers connecting systems that were never built to talk to each other',
      'Phased migration planning that avoids downtime on systems already running production data',
      'Single sign-on and unified access across connected systems',
      'Data consistency and conflict-resolution rules for systems updating the same records',
      "Ongoing monitoring so integrations don't silently break after go-live",
    ],
    relatedIndustrySlugs: ['manufacturing', 'government', 'hospitals'],
  },
];

export function getServiceDetail(slug: string) {
  return serviceDetails.find(d => d.slug === slug);
}
