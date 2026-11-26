import type { CaseStudy } from './case-studies';

// Additional hosted products. Every claim below is limited to what is publicly visible
// on the live site itself (features, plans, languages) — no invented metrics.
// Screenshots live in /public/projects/<slug>/{desktop,tablet,mobile}.jpg

type Seed = Omit<CaseStudy, 'images' | 'seo'> & { alt: string; seoDescription: string };

function build(s: Seed): CaseStudy {
  const { alt, seoDescription, ...rest } = s;
  const dir = `/projects/${s.slug}`;
  return {
    ...rest,
    images: {
      hero: `${dir}/desktop.jpg`,
      gallery: [
        { src: `${dir}/desktop.jpg`, alt: `${alt} on desktop`, device: 'desktop' },
        { src: `${dir}/tablet.jpg`, alt: `${alt} on tablet`, device: 'tablet' },
        { src: `${dir}/mobile.jpg`, alt: `${alt} on mobile`, device: 'mobile' },
      ],
    },
    seo: {
      title: `${s.name} Case Study — ${s.tagline} | KVL Business Solutions`,
      description: seoDescription,
    },
  };
}

const faq = (name: string, host: string, what: string, role: string) => [
  { q: `Is ${name} a real, live product?`, a: `Yes. ${name} is live in production at ${host} — ${what}.` },
  { q: `What was KVL's role in ${name}?`, a: role },
  { q: `Can KVL build something similar for my business?`, a: `Yes. If you need a product like ${name}, talk to us — we scope, price and timeline it in writing before any work begins.` },
];

export const moreCaseStudies: CaseStudy[] = [
  build({
    slug: '8rupiya',
    name: '8Rupiya',
    url: 'https://8rupiya.in',
    tagline: 'AI-Powered Exam Preparation, Premium Tests From ₹8',
    industry: 'Education',
    businessCategory: 'EdTech · AI Exam Preparation Platform',
    overview: 'An AI-powered exam-preparation platform for Indian competitive exams — mock tests, performance analytics, an AI study mentor, live and free classes, and gamified practice — with premium tests unlocking for just ₹8.',
    alt: '8Rupiya exam preparation platform',
    seoDescription: 'How KVL Business Solutions built 8Rupiya, an AI-powered exam preparation platform with mock tests, analytics, AI mentor and live classes for Indian competitive exams.',
    challenge: {
      headline: 'Good exam preparation was priced out of reach for most aspirants',
      body: 'Students preparing for CTET, SSC, Railway, Banking, CUET and board exams usually pay for separate mock-test series, coaching and doubt-solving — and still get a generic report. The brief was one affordable place that practises, analyses and guides in the language students actually use.',
    },
    goals: [
      'Cover many major Indian exams on one platform instead of one app per exam',
      'Turn every test into a personal weakness analysis, not just a score',
      'Keep the price low enough that a single premium test costs about ₹8',
      'Work on a phone, including when the connection is poor',
    ],
    solution: {
      headline: 'One exam operating system: practise, analyse, improve',
      body: 'The platform brings exam-wise mock tests, daily practice problems, battles, live and free classes, and an AI mentor into one account, with analytics that point to weak topics and an AI-built study plan around them. It installs on a phone like an app and speaks Hinglish.',
      pillars: [
        { title: 'Business Process', desc: 'Replaces separate test series, coaching apps and doubt groups with a single subscription-light platform.' },
        { title: 'User Experience', desc: 'Hinglish interface, three-step start, and an installable phone experience for offline reading.' },
        { title: 'Automation', desc: 'AI analyses weak areas, builds study plans and answers doubts without a human mentor on call.' },
        { title: 'Scalability', desc: 'New exams and batches are added as content, so the same platform keeps widening its catalogue.' },
      ],
    },
    keyFeatures: [
      { icon: 'Target', title: 'Exam-Wise Mock Tests', desc: 'Calibrated mock tests for NEET, CTET, SSC, Railway, Banking, CUET, Class 10, NIIT, Police and teacher exams.' },
      { icon: 'BarChart3', title: 'Weakness Analytics', desc: 'Every attempt feeds a personal analysis of which topics need work.' },
      { icon: 'Brain', title: 'AI Study Plans', desc: 'AI turns analytics into a study plan instead of leaving students to guess what to revise.' },
      { icon: 'MessageCircle', title: 'Golu AI Mentor', desc: 'A 24×7 AI mentor that answers doubts and suggests what to practise next.' },
      { icon: 'Video', title: 'Live & Free Classes', desc: 'Live classes plus free YouTube classes alongside the practice tests.' },
      { icon: 'Sparkles', title: 'Gamified Practice', desc: 'Daily practice problems and battles make regular practice a habit.' },
      { icon: 'Smartphone', title: 'Installable & Offline', desc: 'Installs on the phone and supports offline reading.' },
      { icon: 'Globe', title: 'Hinglish Interface', desc: 'Written the way students talk, so nothing feels like translated software.' },
    ],
    tech: ['Next.js', 'AI', 'Web App'],
    benefits: [
      { title: 'Affordable by design', desc: 'Premium tests unlock at about ₹8, so cost is not the barrier to practising.' },
      { title: 'Practice that points somewhere', desc: 'Analytics and AI plans turn scores into a next step.' },
      { title: 'One account for many exams', desc: 'Students preparing for more than one exam stay on one platform.' },
      { title: 'Phone-first', desc: 'Built for the device most aspirants actually own.' },
    ],
    relatedServiceSlugs: ['ai', 'website', 'custom-software'],
    faq: faq('8Rupiya', '8rupiya.in', 'students can take mock tests, see analytics and use the AI mentor today', 'KVL designed, built and hosts the platform — the web app, test and analytics system, and the AI features.'),
  }),

  build({
    slug: 'balratn-oil',
    name: 'Bal Ratn Oil',
    url: 'https://balratnoil.in',
    tagline: 'A Bilingual Product Website For An Ayurvedic Children’s Oil',
    industry: 'Ayurveda & Consumer Products',
    businessCategory: 'Consumer Brand · Bilingual Product Website',
    overview: 'A Hindi and English product website for Bal Ratn Oil, an Ayurvedic massage oil for children — brand story, pack sizes with prices, usage instructions and contact details, built so a parent can understand and enquire in minutes.',
    alt: 'Bal Ratn Oil website',
    seoDescription: 'How KVL Business Solutions built the bilingual Bal Ratn Oil website — pack sizes, usage guide and enquiry flow for an Ayurvedic children’s massage oil brand.',
    challenge: {
      headline: 'A trusted family product with no clear place online',
      body: 'Bal Ratn Oil is bought on word of mouth. Parents searching online found nothing that explained the product, the pack sizes or how to use it — and many of them read Hindi first.',
    },
    goals: [
      'Present the product, pack sizes and prices clearly in Hindi with an English option',
      'Explain how to use the oil step by step',
      'Make it one tap to ask a question or enquire',
      'Load quickly on ordinary phones',
    ],
    solution: {
      headline: 'A clear, Hindi-first brand page that ends in an enquiry',
      body: 'The site tells the brand story, shows pack sizes with MRP, explains usage and puts contact details and an "ask now" action within reach on every screen, with a Hindi/English switch in the header.',
      pillars: [
        { title: 'Business Process', desc: 'Turns word-of-mouth interest into direct enquiries instead of lost visitors.' },
        { title: 'User Experience', desc: 'Hindi-first copy with an English toggle and a simple, scannable layout.' },
        { title: 'Automation', desc: 'Language switching and pack selection work without any manual updates.' },
        { title: 'Scalability', desc: 'New pack sizes or products are added as content on the same pages.' },
      ],
    },
    keyFeatures: [
      { icon: 'Globe', title: 'Hindi & English', desc: 'A language switch lets parents read the whole site in either language.' },
      { icon: 'Box', title: 'Pack Selector', desc: 'Pack sizes with prices shown side by side so the choice is obvious.' },
      { icon: 'FileText', title: 'Usage Guide', desc: 'Step-by-step instructions on how to use the oil.' },
      { icon: 'Send', title: 'One-Tap Enquiry', desc: 'An always-visible "ask now" action sends the enquiry straight to the brand.' },
      { icon: 'MapPin', title: 'Contact Details', desc: 'Address and contact information on the page, not buried in a footer.' },
      { icon: 'Smartphone', title: 'Mobile-First', desc: 'Designed for the phones parents actually use.' },
    ],
    tech: ['Next.js', 'Responsive Web', 'Bilingual (Hindi/English)'],
    benefits: [
      { title: 'Found and understood online', desc: 'The product now has a proper home page parents can search for and read.' },
      { title: 'Readable for the real audience', desc: 'Hindi-first copy rather than an English site translated as an afterthought.' },
      { title: 'Direct line to enquiries', desc: 'No marketplace in the middle between the brand and the parent.' },
    ],
    relatedServiceSlugs: ['website', 'branding', 'digital-marketing'],
    faq: faq('Bal Ratn Oil', 'balratnoil.in', 'the full bilingual product site is available today', 'KVL designed, built and hosts the website — the bilingual content structure, pack and usage pages and the enquiry flow.'),
  }),

  build({
    slug: 'ai-coach',
    name: 'AI Coach Easily',
    url: 'https://aicoach.kvlbusinesssolutions.com',
    tagline: 'A 24×7 Support Assistant In English, Hinglish And Marathi',
    industry: 'AI & Customer Support',
    businessCategory: 'AI SaaS · Multilingual Support Chatbot',
    overview: 'An AI support assistant for the Coach Easily platform that answers questions about credits, payments, AI tools, roadmaps and login instantly, in English, Hinglish and Marathi, and hands over to WhatsApp support when needed.',
    alt: 'AI Coach Easily support assistant',
    seoDescription: 'How KVL Business Solutions built AI Coach Easily, a multilingual AI support assistant answering product, credits and payment questions in English, Hinglish and Marathi.',
    challenge: {
      headline: 'The same few questions kept reaching a human',
      body: 'Users asked about credits, failed payments, slow generation and login again and again, in whichever language they were comfortable with. Every repeat question took time from a small support team.',
    },
    goals: [
      'Answer common questions instantly at any hour',
      'Reply in English, Hinglish and Marathi',
      'Let users flag a wrong answer so it gets fixed',
      'Keep a human route (WhatsApp) for what the bot cannot solve',
    ],
    solution: {
      headline: 'An assistant that answers first and escalates second',
      body: 'A chat assistant trained on the platform answers credit, payment, tooling and login questions with suggested prompts, switches languages automatically, lets users mark a bad answer for review, and links to WhatsApp support and self-help tools.',
      pillars: [
        { title: 'Business Process', desc: 'Deflects repeat questions before they reach the support team.' },
        { title: 'User Experience', desc: 'Suggested questions and language switching make the first answer one tap away.' },
        { title: 'Automation', desc: 'Replies instantly, around the clock, with auto language detection.' },
        { title: 'Scalability', desc: 'An admin area lets the team keep improving answers as the product grows.' },
      ],
    },
    keyFeatures: [
      { icon: 'MessageCircle', title: 'Instant Answers', desc: 'Replies right away on credits, payments, AI tools, roadmap and login.' },
      { icon: 'Globe', title: 'Three Languages', desc: 'English, Hinglish and Marathi, with automatic language detection.' },
      { icon: 'Sparkles', title: 'Suggested Questions', desc: 'Common questions are offered as one-tap prompts.' },
      { icon: 'Eye', title: 'Feedback Loop', desc: 'Users can mark an answer as wrong so the team can correct it.' },
      { icon: 'Send', title: 'WhatsApp Escalation', desc: 'A direct WhatsApp support link for issues the assistant cannot solve.' },
      { icon: 'RefreshCw', title: 'Self-Help Tools', desc: 'Built-in shortcuts such as hard refresh and clearing cookies.' },
    ],
    tech: ['AI Chatbot', 'Multilingual NLP', 'Web App'],
    benefits: [
      { title: 'Support that never sleeps', desc: 'Users get an answer at any hour without waiting for a person.' },
      { title: 'Speaks the user’s language', desc: 'English, Hinglish and Marathi in the same conversation.' },
      { title: 'Gets better with use', desc: 'Flagged answers feed corrections back into the assistant.' },
    ],
    relatedServiceSlugs: ['ai', 'custom-software', 'api-development'],
    faq: faq('AI Coach Easily', 'aicoach.kvlbusinesssolutions.com', 'the assistant is answering questions today', 'KVL designed, built and hosts the assistant — the chat experience, multilingual answers, feedback loop and admin area.'),
  }),

  build({
    slug: 'kvl-track',
    name: 'KVL Track',
    url: 'https://kvltrack.kvlbusinesssolutions.com',
    tagline: 'Family Safety Platform With Live Location, SOS And AI Insights',
    industry: 'Family Safety & Mobility',
    businessCategory: 'Mobile + Web Platform · Family Safety & Location Sharing',
    overview: 'A family safety platform that connects parents, children and grandparents through live location sharing, emergency SOS, geofence zones, check-ins and AI-powered insights, with mobile apps, separate parent and child views and an enterprise offering.',
    alt: 'KVL Track family safety platform',
    seoDescription: 'How KVL Business Solutions built KVL Track, a family safety platform with live location sharing, SOS alerts, geofence zones, AI insights and mobile apps.',
    challenge: {
      headline: 'Families wanted peace of mind without constant phone calls',
      body: 'Parents want to know a child reached school and that grandparents are safe; children and elders do not want to be interrogated. Most tools were either too basic to trust in an emergency or too intrusive to live with.',
    },
    goals: [
      'Show the whole family on one live map',
      'Make an SOS reach the right people instantly',
      'Notify on arrival, departure and low battery without anyone calling',
      'Respect privacy with controls such as a ghost mode',
    ],
    solution: {
      headline: 'A shared map, smart alerts and an AI guardian',
      body: 'KVL Track combines live family location, geofenced safe zones, safe check-ins, route sharing and battery alerts with an AI guardian that watches for unusual patterns. Parents and children get purpose-built views, and organisations get an enterprise plan.',
      pillars: [
        { title: 'Business Process', desc: 'Replaces ad-hoc check-in calls with automatic arrival and safety updates.' },
        { title: 'User Experience', desc: 'Separate parent and child panels, with the family map as the home screen.' },
        { title: 'Automation', desc: 'Geofences, battery alerts and the AI guardian trigger notifications on their own.' },
        { title: 'Scalability', desc: 'Free and paid plans for families plus an enterprise offering for organisations.' },
      ],
    },
    keyFeatures: [
      { icon: 'Map', title: 'Live Family Map', desc: 'Every member’s location on one map, in real time.' },
      { icon: 'ShieldAlert', title: 'Emergency SOS', desc: 'One tap sends the live location to the family circle.' },
      { icon: 'Locate', title: 'Geofence Safe Zones', desc: 'Alerts when someone arrives at or leaves a place such as school or home.' },
      { icon: 'ShieldCheck', title: 'Safe Check-in', desc: 'Members can confirm they are safe with a single tap.' },
      { icon: 'BatteryMedium', title: 'Battery Alerts', desc: 'Warns the family before a phone dies.' },
      { icon: 'Brain', title: 'AI Guardian', desc: 'AI-powered insights that flag unusual movement patterns.' },
      { icon: 'Clock', title: 'Location History & Routes', desc: 'Review past locations and share a route in real time.' },
      { icon: 'Eye', title: 'Ghost Mode', desc: 'Privacy control for pausing location sharing.' },
    ],
    tech: ['Next.js', 'Mobile Apps (iOS & Android)', 'Real-Time Location', 'AI'],
    benefits: [
      { title: 'Fewer worry calls', desc: 'Arrival, departure and battery updates arrive without anyone asking.' },
      { title: 'Help when it matters', desc: 'SOS puts a live location in front of the family immediately.' },
      { title: 'Built for every age', desc: 'Parent, child and elder-care use cases in one product.' },
      { title: 'Privacy options', desc: 'Controls like ghost mode keep sharing something people choose.' },
    ],
    relatedServiceSlugs: ['android', 'gps', 'ai', 'custom-software'],
    faq: faq('KVL Track', 'kvltrack.kvlbusinesssolutions.com', 'the family safety platform and apps are available today', 'KVL designed, built and hosts the platform — the live map, SOS and alerting system, AI guardian, mobile apps and enterprise offering.'),
  }),

  build({
    slug: 'naaz-creation',
    name: 'Naaz Creation',
    url: 'https://naazcreation.kvlbusinesssolutions.com',
    tagline: 'A Luxury Online Store For Handcrafted Indian Décor And Gifts',
    industry: 'E-Commerce & Handicrafts',
    businessCategory: 'E-Commerce · Handcrafted Home Décor & Gifting',
    overview: 'An online store for handcrafted Indian décor — golden straw art, Madhubani paintings, mirror-work, hand-smocked cushions and heirloom gifts — with collections, occasion-based shopping, corporate gifting and an artisans story.',
    alt: 'Naaz Creation online store',
    seoDescription: 'How KVL Business Solutions built the Naaz Creation online store for handcrafted Indian home décor, with collections, gifting and artisan stories.',
    challenge: {
      headline: 'Handmade work was being sold like mass-produced goods',
      body: 'Artisan pieces carry a story and a maker, but marketplace listings flatten them into thumbnails. The brand needed a store that felt as considered as the pieces, and could serve both single buyers and corporate gifting.',
    },
    goals: [
      'Present each piece with the craft and the artisan behind it',
      'Organise a large catalogue by category, collection and occasion',
      'Serve corporate and festive gifting as first-class journeys',
      'Make checkout and delivery terms clear',
    ],
    solution: {
      headline: 'A storefront that sells the craft, not only the product',
      body: 'The store groups products by category, featured collection and occasion, tells the artisans’ story, runs festive offers and gifting pages, and states shipping and checkout assurances up front.',
      pillars: [
        { title: 'Business Process', desc: 'Sells directly to buyers and corporates instead of relying on a marketplace.' },
        { title: 'User Experience', desc: 'Shop by category, collection or occasion, with a luxury visual style.' },
        { title: 'Automation', desc: 'Cart, offers and festive collections are managed as content, not code changes.' },
        { title: 'Scalability', desc: 'New collections and seasonal campaigns slot into the same structure.' },
      ],
    },
    keyFeatures: [
      { icon: 'ShoppingCart', title: 'Full Online Store', desc: 'Cart and checkout for a catalogue of handcrafted pieces.' },
      { icon: 'Layers', title: 'Categories & Collections', desc: 'Home décor, paintings, cushions, wall hangings, mirror work, flowers, bags and more.' },
      { icon: 'Tag', title: 'Festive Offers', desc: 'A festive collection with promotional pricing and banners.' },
      { icon: 'Users', title: 'Meet Our Artisans', desc: 'A dedicated section that puts the makers in front of the buyer.' },
      { icon: 'Building2', title: 'Corporate Gifting', desc: 'A gifting journey for businesses ordering for clients and teams.' },
      { icon: 'Truck', title: 'Delivery Assurances', desc: 'Free shipping above a threshold, secure checkout and easy returns, stated clearly.' },
    ],
    tech: ['Next.js', 'E-Commerce', 'Responsive Web'],
    benefits: [
      { title: 'A brand, not a listing', desc: 'The store tells the craft and artisan story marketplaces cannot.' },
      { title: 'Gifting that scales', desc: 'Occasion and corporate pages bring in larger orders.' },
      { title: 'Direct customer relationship', desc: 'Orders and customers belong to the brand.' },
    ],
    relatedServiceSlugs: ['website', 'custom-software', 'branding'],
    faq: faq('Naaz Creation', 'naazcreation.kvlbusinesssolutions.com', 'the full storefront is available to browse today', 'KVL designed, built and hosts the store — the catalogue structure, storefront design, cart and checkout, and gifting pages.'),
  }),

  build({
    slug: 'piyu-ai',
    name: 'Piyu AI',
    url: 'https://ai.kvlbusinesssolutions.com',
    tagline: 'A Personal Voice Assistant For Business, Study, Parenting And Kids',
    industry: 'AI & Personal Productivity',
    businessCategory: 'AI SaaS · Personal Assistant App',
    overview: 'A multilingual personal assistant that adapts to who is using it — a business user, student, parent or child — with voice and alarms, tasks and documents, study tools and child-safe stories and lessons, sold on simple token-based plans.',
    alt: 'Piyu AI personal assistant',
    seoDescription: 'How KVL Business Solutions built Piyu, a multilingual AI personal assistant for business, students, parents and children with voice, tasks and token-based plans.',
    challenge: {
      headline: 'One assistant for very different people',
      body: 'A shop owner needs reminders and documents; a student needs quizzes; a parent needs to know a child is safe; a child needs stories and routine. Generic assistants treat them all the same and mostly speak English.',
    },
    goals: [
      'Tailor the assistant to four roles from the first screen',
      'Support Hindi, English and Bengali',
      'Work by voice, including alarms and wake-up',
      'Keep pricing simple and pay-as-you-go',
    ],
    solution: {
      headline: 'Choose who you are, and the assistant becomes yours',
      body: 'Piyu opens by asking whether the user is business, student, parent or child, then offers the matching tools — alarms and documents, study quizzes and flashcards, parent alerts and location, or a child’s routine, games and stories. Everything is language-switchable and sold through token plans.',
      pillars: [
        { title: 'Business Process', desc: 'One subscription model serving individuals, students and families.' },
        { title: 'User Experience', desc: 'Role-first onboarding and voice wake-up in the user’s own language.' },
        { title: 'Automation', desc: 'AI generates stories, lessons and quizzes and tracks tasks and alarms.' },
        { title: 'Scalability', desc: 'Free, Basic, Standard and Pro plans plus token top-ups let usage grow with spend.' },
      ],
    },
    keyFeatures: [
      { icon: 'Users', title: 'Four Role Modes', desc: 'Business, Student, Parent and Child experiences from the first screen.' },
      { icon: 'MessageCircle', title: 'Voice & Alarms', desc: 'One tap to wake Piyu for voice commands and alarms.' },
      { icon: 'CalendarCheck', title: 'Tasks & Missed Tasks', desc: 'Today’s, missed and all tasks in one view.' },
      { icon: 'FileText', title: 'Documents', desc: 'A place to keep and ask about the user’s own documents.' },
      { icon: 'GraduationCap', title: 'Study Tools', desc: 'Quizzes and flashcards for students.' },
      { icon: 'ShieldAlert', title: 'Parent Alerts', desc: 'Location, reports, alerts and SOS for parents watching over a child.' },
      { icon: 'Globe', title: 'Hindi, English, Bengali', desc: 'Switch language at any time.' },
      { icon: 'Wallet', title: 'Token Plans', desc: 'Free to start, with simple paid plans and top-up tokens.' },
    ],
    tech: ['AI Assistant', 'Voice', 'Multilingual', 'Web App'],
    benefits: [
      { title: 'One product, four audiences', desc: 'Families can use the same account type across roles.' },
      { title: 'In the user’s language', desc: 'Hindi, English and Bengali without leaving the app.' },
      { title: 'Low-friction pricing', desc: 'Start free, then pay only for what is used.' },
    ],
    relatedServiceSlugs: ['ai', 'android', 'custom-software'],
    faq: faq('Piyu AI', 'ai.kvlbusinesssolutions.com', 'you can sign up and start free today', 'KVL designed, built and hosts the assistant — the role-based experience, voice features, AI content generation and the token-based plans.'),
  }),

  build({
    slug: 'gravity-pro',
    name: 'Gravity Pro',
    url: 'https://gravitypro.kvlbusinesssolutions.com',
    tagline: 'Keep Your Family Safe And Connected, On One Live Map',
    industry: 'Family Safety & Mobility',
    businessCategory: 'Mobile + Web Platform · Family Location Sharing',
    overview: 'A family safety platform with live location sharing, geofenced safe zones and an SOS panic button, with separate parent and child panels and an Android app, designed for families across Kenya, India, the UAE, the UK and the USA.',
    alt: 'Gravity Pro family safety platform',
    seoDescription: 'How KVL Business Solutions built Gravity Pro, a family safety platform with live location, geofencing, SOS and parent and child panels, with an Android app.',
    challenge: {
      headline: 'Families spread across cities and countries wanted one trusted view',
      body: 'Relatives live in different cities and countries, and phone calls are a poor way to know everyone is safe. The brief was a single place that shows where everyone is and lets them ask for help instantly.',
    },
    goals: [
      'Show every family member’s location and battery on one live map',
      'Mark safe zones and alert on entering or leaving them',
      'Give children a one-tap SOS',
      'Serve families in several countries with one app',
    ],
    solution: {
      headline: 'A live family map with the right panel for each person',
      body: 'Gravity Pro shows members, speed and battery on a live map with street, satellite and dark/light views, adds geofenced safe zones and an SOS panic button, and gives parents and children separate panels. The Android app is available for download from the site.',
      pillars: [
        { title: 'Business Process', desc: 'Replaces constant check-in calls with a shared, always-on view.' },
        { title: 'User Experience', desc: 'Separate parent and child panels and a map with street, satellite, dark and light modes.' },
        { title: 'Automation', desc: 'Geofence and SOS alerts fire automatically to the family circle.' },
        { title: 'Scalability', desc: 'Built for families across Kenya, India, UAE, UK and USA from the start.' },
      ],
    },
    keyFeatures: [
      { icon: 'Map', title: 'Live Family Map', desc: 'Members, speed and battery on one real-time map.' },
      { icon: 'MapPin', title: 'Live Location Sharing', desc: 'Always-on location sharing between family members.' },
      { icon: 'Locate', title: 'Safe Zones & Geofencing', desc: 'Alerts when someone enters or leaves a marked place.' },
      { icon: 'ShieldAlert', title: 'SOS Panic Button', desc: 'A one-tap emergency alert to the family.' },
      { icon: 'Users', title: 'Parent & Child Panels', desc: 'A purpose-built view for each role.' },
      { icon: 'Smartphone', title: 'Android App', desc: 'Download the Android app straight from the site.' },
      { icon: 'BatteryMedium', title: 'Battery Status', desc: 'See each member’s battery level at a glance.' },
      { icon: 'Satellite', title: 'Satellite & Street Views', desc: 'Switch between street and satellite maps, in dark or light mode.' },
    ],
    tech: ['Real-Time Location', 'Android', 'Web App', 'Maps'],
    benefits: [
      { title: 'One view of the whole family', desc: 'Everyone’s location and battery without a phone call.' },
      { title: 'Faster help', desc: 'SOS puts a live location in front of the family immediately.' },
      { title: 'Works across borders', desc: 'Designed for families spread across several countries.' },
    ],
    relatedServiceSlugs: ['gps', 'android', 'custom-software'],
    faq: faq('Gravity Pro', 'gravitypro.kvlbusinesssolutions.com', 'the web experience is available and the Android app can be downloaded today', 'KVL designed, built and hosts the platform — the live map, geofencing and SOS alerts, parent and child panels and the Android app.'),
  }),
];
