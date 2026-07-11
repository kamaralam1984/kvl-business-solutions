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
];
