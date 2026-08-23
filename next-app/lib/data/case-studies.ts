export type CaseStudy = {
  slug: string;
  name: string;
  url: string;
  tagline: string;
  industry: string;
  industrySlug?: string;
  businessCategory: string;
  overview: string;
  images: {
    hero: string;
    gallery: { src: string; alt: string; device: 'desktop' | 'tablet' | 'mobile' }[];
  };
  challenge: { headline: string; body: string };
  goals: string[];
  solution: { headline: string; body: string; pillars: { title: string; desc: string }[] };
  keyFeatures: { icon: string; title: string; desc: string }[];
  tech: string[];
  benefits: { title: string; desc: string }[];
  relatedServiceSlugs: string[];
  faq: { q: string; a: string }[];
  seo: { title: string; description: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'vidyt',
    name: 'VidYT',
    url: 'https://www.vidyt.com',
    tagline: 'AI Growth Engine for YouTube Creators',
    industry: 'Media & Content Creation',
    businessCategory: 'AI SaaS · Creator Analytics',
    overview: "An AI-powered platform that scores videos before they're published, so YouTube creators can catch a weak hook or a low-CTR thumbnail before it costs them views — not after.",
    images: {
      hero: '/projects/vidyt/desktop.png',
      gallery: [
        { src: '/projects/vidyt/desktop.png', alt: 'VidYT dashboard on desktop', device: 'desktop' },
        { src: '/projects/vidyt/tablet.png', alt: 'VidYT interface on tablet', device: 'tablet' },
        { src: '/projects/vidyt/mobile.png', alt: 'VidYT interface on mobile', device: 'mobile' },
      ],
    },
    challenge: {
      headline: 'Publishing was a guess, not a decision',
      body: "Creators were investing hours into filming, editing and publishing without any way to know how a video would actually perform. A weak thumbnail, a slow hook, or a title that didn't land could quietly sink hours of work — and creators would only find out after the video was live and the algorithm had already moved on.",
    },
    goals: [
      'Give creators a way to catch weak videos before they go live, not after',
      'Turn editing decisions from guesswork into data',
      'Help creators find rising topics before a niche gets saturated',
      'Support the full workflow — script, thumbnail, title and clipping — not just analytics',
    ],
    solution: {
      headline: "A pre-upload scoring layer built into the creator's workflow",
      body: "VidYT reviews a video before it's published and scores its likely performance — flagging a weak hook, a thumbnail with low predicted CTR, or a title that underperforms similar content. Instead of publishing and hoping, creators get a checkpoint that turns editing into a decision backed by data.",
      pillars: [
        { title: 'Business Process', desc: "Moves quality control earlier — from 'after it flops' to 'before it publishes'." },
        { title: 'User Experience', desc: "Built directly into the upload workflow so creators don't need a separate analytics tool." },
        { title: 'Automation', desc: 'AI tools handle scripting, hook writing and thumbnail generation so creators spend less time guessing.' },
        { title: 'Scalability', desc: 'Works across YouTube, Shorts, Instagram Reels, Facebook and TikTok from one dashboard.' },
      ],
    },
    keyFeatures: [
      { icon: 'TrendingUp', title: 'Viral Score AI', desc: "Predicts a video's likely CTR and retention before it's uploaded." },
      { icon: 'Radar', title: 'Trend Radar', desc: 'Surfaces rising topics in a creator\'s niche before they peak.' },
      { icon: 'BarChart3', title: 'Performance Intelligence', desc: 'Breaks down which past videos drove growth, and why.' },
      { icon: 'Clock', title: 'Best Upload Time', desc: 'Recommends posting windows based on audience activity.' },
      { icon: 'Eye', title: 'Competitor Spy', desc: "Benchmarks formats and hooks that are working for rival channels." },
      { icon: 'Wand2', title: 'AI Content Tools', desc: 'Script generator, hook optimizer and title CTR optimizer in one place.' },
      { icon: 'Scissors', title: 'Shorts Clipping AI', desc: 'Automatically cuts long-form video into short-form clips.' },
      { icon: 'Layers', title: 'Multi-Platform Support', desc: 'One workflow across YouTube, Shorts, Instagram Reels, Facebook and TikTok.' },
    ],
    tech: ['Next.js', 'TypeScript', 'AI/LLM', 'MongoDB'],
    benefits: [
      { title: 'Fewer wasted uploads', desc: "Weak videos get caught at the editing stage instead of after they've already underperformed." },
      { title: 'Faster creative decisions', desc: 'Creators get a data point on hooks, titles and thumbnails instead of relying on instinct alone.' },
      { title: 'One workflow, not five tools', desc: 'Scripting, thumbnail generation, trend research and analytics live in a single platform.' },
      { title: "Built to scale with a creator's output", desc: 'The same AI review process works whether a channel publishes one video a week or one a day.' },
    ],
    relatedServiceSlugs: ['ai', 'custom-software'],
    faq: [
      { q: 'Is VidYT a real, live product?', a: "Yes. VidYT is live in production at vidyt.com and used by working YouTube creators today — it isn't a mockup or a concept." },
      { q: "What was KVL's role in building VidYT?", a: 'KVL designed and engineered the platform end-to-end — the AI scoring layer, the content tooling, and the underlying product.' },
      { q: 'Can KVL build something similar for my business?', a: 'Yes. If your business needs an AI layer that scores, predicts or automates a repetitive decision, this is the kind of system we build. Talk to us about your use case.' },
    ],
    seo: {
      title: 'VidYT Case Study — AI Video Scoring Platform Built by KVL Business Solutions',
      description: 'How KVL Business Solutions built VidYT, an AI-powered platform that scores YouTube videos before they publish — turning editing into a data-backed decision.',
    },
  },
  {
    slug: 'aapkaplot',
    name: 'AapKaPlot',
    url: 'https://aapkaplot.com',
    tagline: 'Where Property Meets Trust',
    industry: 'Real Estate',
    industrySlug: 'realestate',
    businessCategory: 'PropTech · Property Marketplace',
    overview: 'A map-first property marketplace that shows verified plots, flats, houses and commercial listings with satellite views and direct owner contact — built to replace scattered, unverified listings with one trustworthy search.',
    images: {
      hero: '/projects/aapkaplot/desktop.png',
      gallery: [
        { src: '/projects/aapkaplot/desktop.png', alt: 'AapKaPlot property map on desktop', device: 'desktop' },
        { src: '/projects/aapkaplot/tablet.png', alt: 'AapKaPlot interface on tablet', device: 'tablet' },
        { src: '/projects/aapkaplot/mobile.png', alt: 'AapKaPlot interface on mobile', device: 'mobile' },
      ],
    },
    challenge: {
      headline: "Property buyers couldn't trust what they were looking at",
      body: 'Buyers searching for plots, flats and land in India were relying on scattered listings with no way to verify who actually owned the property, where it really sat on a map, or whether the listing was even current. Every enquiry started with doubt instead of information.',
    },
    goals: [
      'Give buyers a single, searchable map of verified listings',
      'Let buyers see satellite and location detail before booking a site visit',
      'Connect buyers directly with owners instead of routing through unverified middlemen',
      'Support the full range of property types — plots, flats, houses, commercial and agricultural land',
    ],
    solution: {
      headline: 'A live map, not a list',
      body: 'AapKaPlot puts every listing on a satellite-capable live map with location detection, so buyers can search by area, filter by budget and property type, and see exactly where a property sits before ever visiting. Verified owner contact replaces the guesswork of unverified listings, and an AI assistant helps buyers narrow down options conversationally.',
      pillars: [
        { title: 'Business Process', desc: 'Shifts verification earlier — buyers filter out bad listings on the map, not after a wasted site visit.' },
        { title: 'User Experience', desc: "Map-first search with satellite view, GPS-based 'nearby' discovery, and one-tap owner contact." },
        { title: 'Automation', desc: 'AI-assisted property recommendations narrow thousands of listings down to what actually fits a buyer\'s criteria.' },
        { title: 'Scalability', desc: 'Built to carry a nationwide, constantly-growing listings base across every property category.' },
      ],
    },
    keyFeatures: [
      { icon: 'Map', title: 'Live Map Search', desc: 'Every listing is plotted on a live, satellite-capable map, not just a text list.' },
      { icon: 'ShieldCheck', title: 'Verified Owner Contact', desc: 'Buyers connect directly with verified owners instead of unverified middlemen.' },
      { icon: 'Locate', title: 'GPS-Based Discovery', desc: "Detects a buyer's location to surface nearby properties automatically." },
      { icon: 'SlidersHorizontal', title: 'Category & Budget Filters', desc: 'Buy, Rent, Plots, Flats, Houses, Commercial and Agriculture Land, filtered by budget and configuration.' },
      { icon: 'Sparkles', title: 'AI Recommendations', desc: "Suggests listings personalized to what a buyer is actually searching for." },
      { icon: 'MessageCircle', title: 'AI Chat Assistant', desc: 'A conversational assistant helps buyers narrow down listings without manually filtering.' },
      { icon: 'Building2', title: 'Post Property Free', desc: 'Owners can list a property directly at no cost, growing the marketplace organically.' },
    ],
    tech: ['Next.js', 'React', 'MongoDB', 'GPS APIs'],
    benefits: [
      { title: 'Buyers verify before they visit', desc: 'Satellite view and verified owner details cut down on wasted site visits to bad listings.' },
      { title: 'Search replaces scrolling', desc: 'Map and filter-based discovery gets buyers to relevant listings faster than a flat list.' },
      { title: 'Owners list directly', desc: 'Free listing removes the friction that used to push owners through unverified middlemen.' },
      { title: 'Built for national scale', desc: 'The map and filter architecture holds up whether the listings base is in one city or across the country.' },
    ],
    relatedServiceSlugs: ['custom-software', 'website', 'ai'],
    faq: [
      { q: 'Is AapKaPlot a real, live product?', a: 'Yes. AapKaPlot is live in production at aapkaplot.com with real listings and real users searching for property today.' },
      { q: "What was KVL's role in building AapKaPlot?", a: 'KVL designed and engineered the full platform — the map search, listing verification flow, filters, and AI recommendation layer.' },
      { q: 'Can KVL build a similar marketplace for another industry?', a: "Yes. Map-based marketplaces with verification and filtering are a pattern we've built before — talk to us about your listings model." },
    ],
    seo: {
      title: 'AapKaPlot Case Study — Verified Property Marketplace Built by KVL Business Solutions',
      description: 'How KVL Business Solutions built AapKaPlot, a map-first property marketplace with verified listings and satellite search for buyers across India.',
    },
  },
  {
    slug: 'gravity',
    name: 'Gravity',
    url: 'https://gravitypro.kvlbusinesssolutions.com',
    tagline: 'Keep Your Family Safe & Connected',
    industry: 'Consumer Safety',
    businessCategory: 'Consumer SaaS · GPS & Family Safety',
    overview: 'A real-time family location platform that replaces occasional check-in calls with always-on visibility — built with separate parent and child experiences and live geofencing alerts.',
    images: {
      hero: '/projects/gravity/desktop.png',
      gallery: [
        { src: '/projects/gravity/desktop.png', alt: 'Gravity live family map on desktop', device: 'desktop' },
        { src: '/projects/gravity/tablet.png', alt: 'Gravity interface on tablet', device: 'tablet' },
        { src: '/projects/gravity/mobile.png', alt: 'Gravity interface on mobile', device: 'mobile' },
      ],
    },
    challenge: {
      headline: 'Families only knew where loved ones were if someone remembered to call',
      body: 'Parents and families wanted to know that their kids, elderly relatives or loved ones were safe, but the only tool available was a phone call or a text — periodic, manual and easy to forget. There was no continuous, reliable way to see where family members actually were.',
    },
    goals: [
      "Give families continuous visibility into loved ones' location, not just periodic updates",
      'Alert parents automatically when someone leaves or enters a set zone',
      'Build separate, appropriate experiences for parents and children',
      'Support families across multiple countries and network conditions',
    ],
    solution: {
      headline: 'Always-on visibility, not a check-in call',
      body: 'Gravity shares live location, battery status and movement on one map that updates continuously, with geofence alerts that notify a parent automatically the moment someone leaves a safe zone. A dedicated Parent Panel and Child Panel keep the experience appropriate for each side of the relationship, rather than forcing one interface on everyone.',
      pillars: [
        { title: 'Business Process', desc: 'Replaces manual, easy-to-forget check-ins with an always-on system that needs no one to remember anything.' },
        { title: 'User Experience', desc: 'Separate Parent and Child panels, live map with battery and movement status, and light/dark/satellite map views.' },
        { title: 'Automation', desc: 'Geofence alerts fire automatically the instant someone leaves or enters a defined zone — no manual monitoring needed.' },
        { title: 'Scalability', desc: 'Built to serve families across multiple countries and time zones — Kenya, India, UAE, UK and USA today.' },
      ],
    },
    keyFeatures: [
      { icon: 'MapPin', title: 'Real-Time Location Sharing', desc: 'Continuous, always-on location visibility for every family member on one map.' },
      { icon: 'ShieldAlert', title: 'Geofencing & Instant Alerts', desc: 'Automatic notifications the moment someone leaves or enters a set zone.' },
      { icon: 'Users', title: 'Parent & Child Panels', desc: 'Separate, purpose-built experiences for parents monitoring and children being monitored.' },
      { icon: 'BatteryMedium', title: 'Battery & Status Visibility', desc: "See device battery level alongside location, so a dead phone doesn't mean a mystery." },
      { icon: 'Globe', title: 'Multi-Country Support', desc: 'Built to serve families across Kenya, India, UAE, UK and USA.' },
      { icon: 'Map', title: 'Live Map Views', desc: 'Dark, light, satellite and street map modes for how a family wants to see location data.' },
    ],
    tech: ['React', 'Node.js', 'GPS APIs', 'MongoDB'],
    benefits: [
      { title: "Peace of mind that doesn't depend on a phone call", desc: 'Families get continuous visibility instead of hoping someone remembers to check in.' },
      { title: 'Alerts happen automatically', desc: 'Geofencing removes the need for anyone to actively watch a map — the system notifies when it matters.' },
      { title: 'Appropriate experience for every user', desc: 'Parents and children each get an interface built for their role, not a one-size-fits-all app.' },
      { title: 'Works across borders', desc: 'The same platform already serves families spread across five countries.' },
    ],
    relatedServiceSlugs: ['gps', 'android', 'custom-software'],
    faq: [
      { q: 'Is Gravity a real, live product?', a: 'Yes. Gravity is live in production at gravitypro.kvlbusinesssolutions.com and used by real families today.' },
      { q: "What was KVL's role in building Gravity?", a: 'KVL designed and engineered the platform end-to-end — the live-tracking map, geofencing logic, and the separate Parent and Child applications.' },
      { q: "Is this the same as KVL's fleet GPS tracking software?", a: 'No. Gravity is a consumer family-safety product. KVL separately builds fleet and vehicle GPS tracking software for businesses — see our GPS Tracking Software for that use case.' },
    ],
    seo: {
      title: 'Gravity Case Study — Real-Time Family Location App Built by KVL Business Solutions',
      description: 'How KVL Business Solutions built Gravity, a real-time family location and geofencing platform serving families across five countries.',
    },
  },
  {
    slug: 'restro-os',
    name: 'Restro OS',
    url: 'https://restro.kvlbusinesssolutions.com',
    tagline: 'One Platform for Every Part of Running a Restaurant',
    industry: 'Restaurants & Hospitality',
    industrySlug: 'restaurant-hospitality',
    businessCategory: 'Restaurant Management Platform',
    overview: 'A restaurant management platform that unifies ordering, billing, table reservations and delivery-partner integration into one system — replacing a stack of disconnected tools with a single source of truth.',
    images: {
      hero: '/projects/restro-os/desktop.png',
      gallery: [
        { src: '/projects/restro-os/desktop.png', alt: 'Restro OS ordering interface on desktop', device: 'desktop' },
        { src: '/projects/restro-os/tablet.png', alt: 'Restro OS interface on tablet', device: 'tablet' },
        { src: '/projects/restro-os/mobile.png', alt: 'Restro OS interface on mobile', device: 'mobile' },
      ],
    },
    challenge: {
      headline: 'Running a restaurant meant juggling five disconnected tools',
      body: "Restaurant owners were managing table bookings, in-house billing, delivery orders and platform integrations like Zomato and Swiggy across separate, disconnected tools. Reconciling the day's numbers meant pulling data from every one of them by hand — and real margins, like which dishes actually made money, were invisible.",
    },
    goals: [
      'Unify ordering, billing and reservations into one system',
      'Remove double-bookings from table reservations',
      'Bring delivery-platform orders into the same view as in-house orders',
      'Give owners visibility into which dishes and hours actually drive revenue',
    ],
    solution: {
      headline: 'Order, bill, book and deliver from one screen',
      body: 'Restro OS runs dine-in, takeaway and delivery from a single platform, with automated table booking that eliminates double-bookings, GST-ready billing, and direct integration with Zomato and Swiggy so delivery orders land in the same system as in-house ones. An analytics layer turns all of that activity into a clear read on which dishes and hours actually drive revenue.',
      pillars: [
        { title: 'Business Process', desc: 'Replaces five disconnected tools — booking, billing, delivery, staff — with one system and one source of truth.' },
        { title: 'User Experience', desc: 'A single ordering flow across dine-in, takeaway and delivery, with a customer-facing menu and table booking.' },
        { title: 'Automation', desc: 'Automated billing and booking cut manual reconciliation and eliminate double-booked tables.' },
        { title: 'Scalability', desc: 'Built to run a single restaurant today and extend to multiple outlets without a re-platform.' },
      ],
    },
    keyFeatures: [
      { icon: 'Receipt', title: 'POS & Billing', desc: 'Automated, GST-ready billing across dine-in, takeaway and delivery.' },
      { icon: 'CalendarCheck', title: 'Table Reservations', desc: 'Automated booking that prevents the double-bookings manual systems used to miss.' },
      { icon: 'Truck', title: 'Zomato & Swiggy Integration', desc: 'Delivery orders from both platforms land in the same system as in-house orders.' },
      { icon: 'BarChart3', title: 'Revenue & Dish Analytics', desc: 'Shows which dishes and hours actually drive revenue, not just total sales.' },
      { icon: 'Users', title: 'Staff Management', desc: 'Tracks staff activity and shift accountability from the same platform.' },
      { icon: 'ShoppingCart', title: 'Online Ordering', desc: 'Customers can browse the menu and order directly, with deals and offers built in.' },
    ],
    tech: ['Next.js', 'Node.js', 'Razorpay', 'MongoDB'],
    benefits: [
      { title: 'One system instead of five', desc: 'Owners stop reconciling bookings, billing and delivery orders across separate tools by hand.' },
      { title: 'No more double-booked tables', desc: 'Automated reservations catch conflicts that manual booking books used to miss.' },
      { title: 'Real margin visibility', desc: 'Dish-level analytics show owners which items actually drive profit, not just which sell the most.' },
      { title: 'Delivery and dine-in, one view', desc: 'Zomato and Swiggy orders appear alongside in-house orders instead of in a separate app.' },
    ],
    relatedServiceSlugs: ['custom-software', 'website', 'android'],
    faq: [
      { q: 'Is Restro OS a real, live product?', a: 'Yes. Restro OS is live in production at restro.kvlbusinesssolutions.com, running real ordering, billing and reservation flows today.' },
      { q: "What was KVL's role in building Restro OS?", a: 'KVL designed and engineered the full platform — POS, billing, reservations, staff management and the Zomato/Swiggy integrations.' },
      { q: 'Can KVL build something similar for my restaurant or retail business?', a: 'Yes — we also offer Restaurant POS Software as a standalone product, and build fully custom platforms for businesses with more specific needs.' },
    ],
    seo: {
      title: 'Restro OS Case Study — Restaurant Management Platform Built by KVL Business Solutions',
      description: 'How KVL Business Solutions built Restro OS, a unified restaurant platform for billing, table reservations and Zomato/Swiggy delivery integration.',
    },
  },
  {
    slug: 'kvl-crm',
    name: 'KVL CRM',
    url: 'https://crm.kvlbusinesssolutions.com',
    tagline: 'Your Entire Revenue Engine, Unified',
    industry: 'Business Software',
    businessCategory: 'AI SaaS · Sales & Revenue CRM',
    overview: 'An AI-powered CRM that unifies sales, marketing, customer success, finance and communication into a single platform — so pipeline, leads and follow-ups no longer live in five different tools.',
    images: {
      hero: '/projects/kvl-crm/desktop.png',
      gallery: [
        { src: '/projects/kvl-crm/desktop.png', alt: 'KVL CRM dashboard on desktop', device: 'desktop' },
        { src: '/projects/kvl-crm/tablet.png', alt: 'KVL CRM interface on tablet', device: 'tablet' },
        { src: '/projects/kvl-crm/mobile.png', alt: 'KVL CRM interface on mobile', device: 'mobile' },
      ],
    },
    challenge: {
      headline: 'Revenue teams were running on five disconnected tools',
      body: 'Sales, marketing, customer success and finance teams were each working out of their own tool, with leads and follow-ups falling through the cracks between them. No one had one place to see the whole revenue picture, and keeping every tool in sync ate hours that should have gone into selling.',
    },
    goals: [
      'Bring sales, marketing, customer success and finance into one platform',
      'Stop leads and follow-ups from falling through the cracks between tools',
      'Automate the manual pipeline and lead management busywork',
      'Give revenue teams one real-time view of the business, not five partial ones',
    ],
    solution: {
      headline: 'One intelligent platform instead of five disconnected tools',
      body: 'KVL CRM runs the full revenue engine — pipeline, leads, follow-ups, marketing and customer communication — from a single intelligent platform. AI handles the repetitive tracking and follow-up work automatically, so sales teams spend their time selling instead of updating five different tools by hand.',
      pillars: [
        { title: 'Business Process', desc: 'Replaces five disconnected sales, marketing and finance tools with one system of record.' },
        { title: 'User Experience', desc: 'A single pipeline view for sales, marketing and customer success teams to work from.' },
        { title: 'Automation', desc: 'AI manages leads and follow-ups automatically, instead of relying on reps to remember.' },
        { title: 'Scalability', desc: 'Built to run a growing revenue team without adding another tool to the stack.' },
      ],
    },
    keyFeatures: [
      { icon: 'GitBranch', title: 'Pipeline Management', desc: 'Tracks every deal stage across sales, marketing and customer success in one view.' },
      { icon: 'Users', title: 'Lead & Contact Management', desc: 'Centralizes leads and follow-ups so nothing falls through the cracks between teams.' },
      { icon: 'Sparkles', title: 'AI-Automated Follow-Ups', desc: 'Follow-ups and routine lead management are handled automatically, not tracked by hand.' },
      { icon: 'Megaphone', title: 'Marketing & Communication', desc: 'Runs marketing and customer communication from the same platform as the pipeline.' },
      { icon: 'Wallet', title: 'Finance Visibility', desc: 'Brings finance into the same system instead of a separate spreadsheet.' },
      { icon: 'ShieldCheck', title: 'GDPR-Compliant by Design', desc: 'Built to meet the compliance requirements revenue teams already work under.' },
    ],
    tech: ['Next.js', 'TypeScript', 'AI/LLM', 'MongoDB'],
    benefits: [
      { title: 'One system instead of five', desc: 'Sales, marketing, customer success and finance work from the same platform instead of syncing separate tools by hand.' },
      { title: 'Nothing falls through the cracks', desc: 'Automated lead and follow-up tracking catches what used to slip between disconnected tools.' },
      { title: 'Faster onboarding, faster selling', desc: 'A single platform means new reps ramp up on one system, not five.' },
      { title: 'Free to start, no card required', desc: 'A 14-day free trial with no credit card removes the friction of evaluating a new CRM.' },
    ],
    relatedServiceSlugs: ['crm', 'ai', 'custom-software'],
    faq: [
      { q: 'Is KVL CRM a real, live product?', a: 'Yes. KVL CRM is live in production at crm.kvlbusinesssolutions.com and used by real revenue teams today.' },
      { q: "What was KVL's role in building KVL CRM?", a: 'KVL designed and engineered the platform end-to-end — the pipeline system, AI-driven lead automation, and the unified sales, marketing and finance workflow.' },
      { q: 'Can KVL build a custom CRM for my business instead?', a: 'Yes — we also build fully custom CRM systems tailored to a specific sales process; see our CRM Development service for that option.' },
    ],
    seo: {
      title: 'KVL CRM Case Study — AI-Powered Revenue CRM Built by KVL Business Solutions',
      description: 'How KVL Business Solutions built KVL CRM, an AI-powered platform unifying sales, marketing, customer success and finance into one revenue engine.',
    },
  },
  {
    slug: 'kvl-growthos',
    name: 'KVL GrowthOS',
    url: 'https://growthos.kvlbusinesssolutions.com',
    tagline: 'The AI Workforce That Grows Your Business 24/7',
    industry: 'Business Growth & Automation',
    businessCategory: 'AI SaaS · Autonomous Sales Agents',
    overview: "A team of five AI agents that runs a business's revenue pipeline around the clock — qualifying leads, drafting proposals and running outreach sequences whether or not anyone is logged in.",
    images: {
      hero: '/projects/kvl-growthos/desktop.png',
      gallery: [
        { src: '/projects/kvl-growthos/desktop.png', alt: 'KVL GrowthOS dashboard on desktop', device: 'desktop' },
        { src: '/projects/kvl-growthos/tablet.png', alt: 'KVL GrowthOS interface on tablet', device: 'tablet' },
        { src: '/projects/kvl-growthos/mobile.png', alt: 'KVL GrowthOS interface on mobile', device: 'mobile' },
      ],
    },
    challenge: {
      headline: 'Growth stalled the moment the team logged off',
      body: "Qualifying leads, drafting proposals and running outreach sequences all depended on someone being available to do them. Pipeline only moved during working hours, inbound leads sat unqualified overnight, and proposals took days to go out because they waited on a person's schedule.",
    },
    goals: [
      'Keep pipeline moving around the clock, not just during working hours',
      'Qualify inbound leads and score them against the ideal customer profile automatically',
      'Get proposals and outreach sequences out in minutes, not days',
      'Sync every touch back into the CRM without manual data entry',
    ],
    solution: {
      headline: 'Five AI agents that run the pipeline while the team is offline',
      body: 'GrowthOS replaces the manual side of growth with five AI agents — CEO AI for strategy and prioritization, Sales AI for lead qualification, Marketing AI for content and campaigns, Proposal AI for quotes, and Outreach AI for cold email and LinkedIn sequences. Together they run a ten-stage pipeline: ingesting leads, scoring intent and ICP fit, enriching firmographic data, generating proposals, running multi-touch outreach, scheduling meetings and syncing every step back into the CRM.',
      pillars: [
        { title: 'Business Process', desc: 'Runs the full lead-to-meeting pipeline autonomously instead of waiting on a person at each stage.' },
        { title: 'User Experience', desc: 'Five specialized agents split the work the way a real growth team would — strategy, sales, marketing, proposals, outreach.' },
        { title: 'Automation', desc: 'Lead scoring, enrichment, proposal drafting and outreach sequencing all run without manual triggering.' },
        { title: 'Scalability', desc: 'Set up in under fifteen minutes and built to keep working nights and weekends as pipeline grows.' },
      ],
    },
    keyFeatures: [
      { icon: 'Bot', title: 'Five Specialized AI Agents', desc: 'CEO, Sales, Marketing, Proposal and Outreach AI each handle a distinct part of the growth pipeline.' },
      { icon: 'Target', title: 'Automatic Lead Qualification', desc: 'Scores inbound leads against the ideal customer profile as they arrive.' },
      { icon: 'FileText', title: 'AI-Drafted Proposals', desc: 'Generates proposals and quotes from enriched lead profiles without manual writing.' },
      { icon: 'Send', title: 'Multi-Touch Outreach', desc: 'Runs personalized cold email and LinkedIn sequences automatically.' },
      { icon: 'CalendarClock', title: 'Autonomous Meeting Scheduling', desc: 'Books meetings and syncs calendars without back-and-forth.' },
      { icon: 'RefreshCw', title: 'CRM Sync', desc: 'Updates CRM records automatically at every stage of the pipeline.' },
    ],
    tech: ['Next.js', 'AI Agents', 'TypeScript', 'MongoDB'],
    benefits: [
      { title: 'Pipeline moves nights and weekends', desc: "Growth doesn't stop when the team logs off — the agents keep qualifying leads and reaching out." },
      { title: 'Leads get qualified the moment they arrive', desc: 'Intent and ICP scoring happen automatically instead of sitting in a queue.' },
      { title: 'Proposals go out in minutes', desc: 'AI drafts quotes from enriched lead data instead of a rep starting from a blank page.' },
      { title: 'Live in fifteen minutes', desc: 'Setup is fast enough that a growth team can automate their first pipeline the same day.' },
    ],
    relatedServiceSlugs: ['ai', 'digital-marketing', 'custom-software'],
    faq: [
      { q: 'Is KVL GrowthOS a real, live product?', a: 'Yes. KVL GrowthOS is live in production at growthos.kvlbusinesssolutions.com, running real outreach and qualification pipelines today.' },
      { q: "What was KVL's role in building GrowthOS?", a: 'KVL designed and engineered the platform end-to-end — the five AI agents, the ten-stage pipeline, and the CRM sync layer.' },
      { q: 'Can KVL build an AI agent workflow for my business?', a: 'Yes. If your business has a repetitive sales or growth workflow, this is the kind of AI agent system we build — talk to us about your pipeline.' },
    ],
    seo: {
      title: 'KVL GrowthOS Case Study — Autonomous AI Sales Agents Built by KVL Business Solutions',
      description: 'How KVL Business Solutions built KVL GrowthOS, a team of five AI agents that qualifies leads, drafts proposals and runs outreach around the clock.',
    },
  },
  {
    slug: 'kvl-super-ai',
    name: 'KVL Super AI',
    url: 'https://superai.kvlbusinesssolutions.com',
    tagline: 'A Chatbot That Learns Your Website by Itself',
    industry: 'AI & Customer Support',
    businessCategory: 'AI SaaS · Website Chatbot',
    overview: 'A self-training AI chatbot that scans a website, builds its own knowledge base from what it finds, and goes live behind a one-line embed script — answering questions and capturing leads in every language, with no manual setup.',
    images: {
      hero: '/projects/kvl-super-ai/desktop.png',
      gallery: [
        { src: '/projects/kvl-super-ai/desktop.png', alt: 'KVL Super AI chatbot installer on desktop', device: 'desktop' },
        { src: '/projects/kvl-super-ai/tablet.png', alt: 'KVL Super AI interface on tablet', device: 'tablet' },
        { src: '/projects/kvl-super-ai/mobile.png', alt: 'KVL Super AI interface on mobile', device: 'mobile' },
      ],
    },
    challenge: {
      headline: 'Every website chatbot needed weeks of manual setup',
      body: "Businesses wanted an AI chatbot that could actually answer questions about their own pages, products and FAQs — but the usual path meant manually feeding a knowledge base, writing scripts, and maintaining it every time the website changed. Most businesses never got past the setup stage.",
    },
    goals: [
      'Let a chatbot learn a website automatically, with no manual knowledge-base entry',
      'Keep the AI strictly read-only so it can never modify site data',
      'Get from signup to a live, embedded chatbot in minutes, not weeks',
      'Support businesses whose visitors speak different languages',
    ],
    solution: {
      headline: 'Sign up, give it a URL, get an embed script',
      body: "KVL Super AI scans a website's pages, products, services and FAQs on its own, trains itself into a real knowledge base from what it finds, and hands back a one-line embed script that puts the chat widget live instantly. It never modifies a business's data — access is strictly read-only — and the whole setup runs self-hosted, on the business's own server and data.",
      pillars: [
        { title: 'Business Process', desc: 'Removes the manual knowledge-base setup that used to stall chatbot projects before they launched.' },
        { title: 'User Experience', desc: 'One embed script, no configuration screens, chat widget live in minutes.' },
        { title: 'Automation', desc: 'The AI discovers and trains on site content automatically as it scans.' },
        { title: 'Scalability', desc: "Self-hosted on the business's own server, so data and infrastructure stay under their control." },
      ],
    },
    keyFeatures: [
      { icon: 'Radar', title: 'Automatic Site Scanning', desc: 'Discovers pages, products, services and FAQs on its own — no manual setup.' },
      { icon: 'GraduationCap', title: 'Self-Training Knowledge Base', desc: 'Turns what it scans into a real knowledge base the AI can answer from.' },
      { icon: 'ShieldCheck', title: 'Read-Only, Always', desc: 'The AI never modifies site data — access is limited to exactly what a business allows.' },
      { icon: 'Code2', title: 'One-Line Embed', desc: 'A single script tag puts the chat widget live instantly.' },
      { icon: 'Globe', title: 'Multi-Language Support', desc: 'Answers visitors in their own language automatically.' },
      { icon: 'Server', title: 'Self-Hosted', desc: "Runs on the business's own server and data, not a third-party black box." },
    ],
    tech: ['Next.js', 'AI/LLM', 'TypeScript', 'Self-Hosted'],
    benefits: [
      { title: 'Live in minutes, not weeks', desc: 'Signup to embedded chatbot takes minutes because the AI trains itself.' },
      { title: 'No manual knowledge-base upkeep', desc: "The chatbot re-learns a site's content instead of needing someone to maintain a script." },
      { title: "Data stays under the business's control", desc: "Self-hosted, read-only access means a business's data never leaves its own server." },
      { title: 'Answers visitors in their own language', desc: 'One chatbot serves every visitor regardless of what language they search in.' },
    ],
    relatedServiceSlugs: ['ai', 'website', 'custom-software'],
    faq: [
      { q: 'Is KVL Super AI a real, live product?', a: 'Yes. KVL Super AI is live in production at superai.kvlbusinesssolutions.com and installed on real business websites today.' },
      { q: "What was KVL's role in building KVL Super AI?", a: 'KVL designed and engineered the platform end-to-end — the site-scanning crawler, the self-training knowledge base, and the embeddable chat widget.' },
      { q: 'Can KVL install an AI chatbot like this on my website?', a: 'Yes. Talk to us about your website and we can scope a self-training chatbot for your business.' },
    ],
    seo: {
      title: 'KVL Super AI Case Study — Self-Training Website Chatbot Built by KVL Business Solutions',
      description: 'How KVL Business Solutions built KVL Super AI, a self-training chatbot that scans a website, builds its own knowledge base, and embeds in one line.',
    },
  },
  {
    slug: 'kvl-international-school',
    name: 'KVL International School',
    url: 'https://school.kvlbusinesssolutions.com',
    tagline: 'Where Every Child Discovers Their Greatness',
    industry: 'Education',
    businessCategory: 'Education · School Website & CMS',
    overview: 'A premier CBSE-affiliated school website that presents admissions, academics and campus life with the polish of a real institution — built to carry admissions, faculty, gallery and events content without looking like a template.',
    images: {
      hero: '/projects/kvl-international-school/desktop.png',
      gallery: [
        { src: '/projects/kvl-international-school/desktop.png', alt: 'KVL International School homepage on desktop', device: 'desktop' },
        { src: '/projects/kvl-international-school/tablet.png', alt: 'KVL International School interface on tablet', device: 'tablet' },
        { src: '/projects/kvl-international-school/mobile.png', alt: 'KVL International School interface on mobile', device: 'mobile' },
      ],
    },
    challenge: {
      headline: "A school's website needed to feel as credible as its 30-year track record",
      body: 'Schools competing for admissions need a website that reflects genuine institutional trust — rankings, faculty credentials, campus facilities and a clear admissions process — not a generic template that undersells decades of results. Prospective parents were forming their first impression online, and it had to hold up.',
    },
    goals: [
      'Present admissions, academics and campus life with real institutional polish',
      'Make the admissions process clear and easy to start online',
      'Give faculty, rankings and student outcomes visible proof, not just claims',
      'Support ongoing content — gallery, news and events — without a redesign each time',
    ],
    solution: {
      headline: 'A content-rich site built around real admissions and academic detail',
      body: "The school's site leads with its actual results — rankings, enrollment, university acceptance rate and faculty credentials — alongside a clear admissions flow, an eight-department academic overview, campus facilities, a categorized gallery and a news & events section that keeps the site current without a rebuild.",
      pillars: [
        { title: 'Business Process', desc: 'Turns institutional credibility — rankings, faculty, outcomes — into the first thing a visiting parent sees.' },
        { title: 'User Experience', desc: 'A clear path from homepage to admissions application, with portal login for existing students and parents.' },
        { title: 'Automation', desc: 'Gallery, news and events sections are built to be updated as content, not re-coded each time.' },
        { title: 'Scalability', desc: 'Structured for a growing academic calendar and admissions cycle without a redesign.' },
      ],
    },
    keyFeatures: [
      { icon: 'FileText', title: 'Admissions Flow', desc: 'A clear, direct path to apply for the current admissions cycle.' },
      { icon: 'GraduationCap', title: 'Academics Overview', desc: 'Presents all eight academic departments, from Sciences to Performing Arts.' },
      { icon: 'Camera', title: 'Categorized Gallery', desc: 'Campus, academic, sports and event photos organized for easy browsing.' },
      { icon: 'Newspaper', title: 'News & Events', desc: 'Keeps achievements and upcoming activities current on the site.' },
      { icon: 'LogIn', title: 'Student & Parent Portal Login', desc: 'Separate portal access for students and parents, linked from the main site.' },
      { icon: 'Users', title: 'Faculty Directory', desc: "Staff profiles with qualifications and experience, backing the school's credibility." },
    ],
    tech: ['Next.js', 'CMS', 'TypeScript'],
    benefits: [
      { title: 'Credibility on the homepage, not buried in a subpage', desc: 'Rankings, enrollment and faculty credentials are visible from the first screen.' },
      { title: 'Admissions starts online, not with a phone call', desc: 'A direct application path removes the friction of the first step.' },
      { title: 'Content stays current', desc: 'Gallery, news and events update without needing a developer for every change.' },
      { title: 'One site for every audience', desc: 'Prospective parents, current parents and students all have a clear path in.' },
    ],
    relatedServiceSlugs: ['website', 'custom-software', 'branding'],
    faq: [
      { q: 'Is this a real, live school website?', a: "Yes. KVL International School is live in production at school.kvlbusinesssolutions.com, presenting a real CBSE-affiliated institution's admissions and academic content." },
      { q: "What was KVL's role in building this site?", a: 'KVL designed and engineered the full website — admissions flow, academics presentation, gallery, faculty directory and the content system behind news and events.' },
      { q: 'Can KVL build a website like this for my school or institution?', a: "Yes — this is a pattern we've built before. Talk to us about your admissions process and academic programs." },
    ],
    seo: {
      title: 'KVL International School Case Study — CBSE School Website Built by KVL Business Solutions',
      description: 'How KVL Business Solutions built a premier CBSE school website with admissions, academics, faculty and campus-life content.',
    },
  },
];
