'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Monitor, Smartphone, Star, Quote, Mail, Phone, MapPin, Instagram, Facebook, Twitter,
  MessageCircle, CheckCircle2, Palette, UtensilsCrossed, Stethoscope, Megaphone, User,
  ChevronDown, LayoutDashboard, FileText, Image as ImageIcon,
  Settings, Users2, Lock, Eye, Pencil, Sparkles,
} from 'lucide-react';
import { slugify } from '@/lib/utils';
import type { Software } from '@/lib/data/software';
import { cropVariant } from '@/lib/data/img';
import { EffectGallery, EffectSlider, type GalleryEffectKey, type SliderEffectKey } from './GalleryEffects';

type Testimonial = { quote: string; name: string; role: string };
type FaqItem = { q: string; a: string };
type TeamMember = { name: string; role: string };
type BlogPost = { title: string; excerpt: string };
type ServiceItem = { title: string; desc: string; price?: string };

type BusinessType = {
  key: string;
  label: string;
  icon: typeof Palette;
  siteName: string;
  tagline: string;
  subcopy: string;
  heroImg: string;
  sliderEffect: SliderEffectKey;
  galleryEffect: GalleryEffectKey;
  badge: string;
  accent: string;
  accent2: string;
  stats: { label: string; value: string }[];
  aboutTitle: string;
  aboutBody: string;
  servicesTitle: string;
  services: ServiceItem[];
  testimonials: Testimonial[];
  team: TeamMember[];
  faq: FaqItem[];
  blog: BlogPost[];
  ctaLabel: string;
};

const BUSINESS_TYPES: BusinessType[] = [
  {
    key: 'portfolio', label: 'Portfolio', icon: Palette,
    siteName: 'Aarav Mehta', tagline: 'UI/UX Designer crafting delightful digital products.',
    subcopy: 'I help startups and small brands turn rough ideas into clean, usable interfaces — from first sketch to shipped product.',
    heroImg: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200&q=80&auto=format&fit=crop',
    sliderEffect: 'fadeScale', galleryEffect: 'masonry',
    badge: '🎨 50+ Projects Shipped', accent: '#0f172a', accent2: '#334155',
    stats: [{ label: 'Years Experience', value: '6+' }, { label: 'Projects Shipped', value: '50+' }, { label: 'Happy Clients', value: '30+' }],
    aboutTitle: 'A little about me',
    aboutBody: 'I’m a freelance product designer based in India, working with founders who need their idea to look and feel finished — not just functional. My process starts with your users, not your feature list, which is why the products I design tend to actually get used.',
    servicesTitle: 'Selected Work',
    services: [
      { title: 'Brand Identity — Café Aroma', desc: 'Logo, packaging and a warm visual identity for a local coffee brand.' },
      { title: 'Fintech App Redesign', desc: 'Simplified a cluttered dashboard into a 3-step onboarding flow.' },
      { title: 'E-commerce UX Overhaul', desc: 'Cut checkout drop-off by rethinking the cart-to-payment journey.' },
      { title: 'SaaS Landing Page', desc: 'A conversion-first landing page that lifted signups by 40%.' },
      { title: 'Mobile Banking App', desc: 'Accessible, high-trust UI for a digital-first NBFC.' },
      { title: 'Restaurant Booking Flow', desc: 'A 3-tap reservation flow replacing a clunky phone-call process.' },
    ],
    testimonials: [
      { quote: 'Aarav turned our messy idea into a product people actually enjoy using.', name: 'Meera Iyer', role: 'Founder, Café Aroma' },
      { quote: 'Fast, thoughtful, and never precious about his own ideas — a rare combination.', name: 'Karan Shah', role: 'CEO, Finlytics' },
      { quote: 'Our signup rate jumped the week the new landing page went live.', name: 'Priya Nair', role: 'Growth Lead, Nimbus' },
    ],
    team: [{ name: 'Aarav Mehta', role: 'Founder & Designer' }],
    faq: [
      { q: 'How long does a typical project take?', a: 'Most single-product engagements take 2–4 weeks depending on scope, from first call to final handoff.' },
      { q: 'Do you work with early-stage startups?', a: 'Yes — a large part of my work is with pre-seed and seed-stage founders shaping their first real product.' },
      { q: 'What do I receive at the end?', a: 'Figma source files, a component library, and developer-ready specs — everything your team needs to build.' },
      { q: 'Can you also help after launch?', a: 'Yes, ongoing design support is available on a monthly retainer once the first version ships.' },
    ],
    blog: [
      { title: 'Why Most Startup Dashboards Fail', excerpt: 'The pattern I see across a dozen dashboard redesigns — and how to avoid it.' },
      { title: '5 Onboarding Mistakes Killing Your Signups', excerpt: 'Small friction points that quietly cost you half your new users.' },
      { title: 'Designing for Trust in Fintech', excerpt: 'What makes users comfortable handing over their money to an app.' },
    ],
    ctaLabel: 'Hire Me',
  },
  {
    key: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed,
    siteName: 'Spice Route Kitchen', tagline: 'Authentic North Indian flavours, made fresh daily.',
    subcopy: 'Family recipes, slow-cooked the traditional way — dine in, takeaway, or book us for your next celebration.',
    heroImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop',
    sliderEffect: 'slide', galleryEffect: 'carousel',
    badge: '⭐ 4.8/5 · 900+ Reviews', accent: '#b45309', accent2: '#d97706',
    stats: [{ label: 'Years Serving', value: '15+' }, { label: 'Fresh Daily', value: '100%' }, { label: 'Rated', value: '4.8★' }],
    aboutTitle: 'Our story',
    aboutBody: 'Spice Route Kitchen started as a 4-table family dhaba in 2009. Fifteen years later, the recipes haven’t changed — everything is still slow-cooked in small batches, using the same masalas ground fresh every morning.',
    servicesTitle: 'Menu Highlights',
    services: [
      { title: 'Butter Chicken', desc: 'Slow-simmered in a rich tomato-butter gravy.', price: '₹320' },
      { title: 'Paneer Tikka', desc: 'Char-grilled cottage cheese, smoky and spiced.', price: '₹260' },
      { title: 'Dal Makhani', desc: 'Black lentils, buttered and simmered overnight.', price: '₹220' },
      { title: 'Rogan Josh', desc: 'Kashmiri-style slow-cooked mutton curry.', price: '₹380' },
      { title: 'Tandoori Platter', desc: 'A mixed grill of our signature tandoor items.', price: '₹450' },
      { title: 'Gulab Jamun', desc: 'Warm, syrup-soaked, made fresh every evening.', price: '₹120' },
    ],
    testimonials: [
      { quote: 'Best butter chicken in the neighbourhood, hands down.', name: 'Rohit Verma', role: 'Google Review' },
      { quote: 'Booked them for a family function — food and service were both excellent.', name: 'Anjali Kapoor', role: 'Regular Customer' },
      { quote: 'The dal makhani tastes like my grandmother’s. That’s the highest compliment I can give.', name: 'Sameer Joshi', role: 'Google Review' },
    ],
    team: [
      { name: 'Chef Rakesh Yadav', role: 'Head Chef' },
      { name: 'Divya Menon', role: 'Restaurant Manager' },
    ],
    faq: [
      { q: 'Do you take table reservations?', a: 'Yes, you can reserve a table directly through this website or by calling us.' },
      { q: 'Is home delivery available?', a: 'We deliver within a 5km radius, and are also listed on Swiggy and Zomato.' },
      { q: 'Do you cater for events?', a: 'Yes, we handle catering for functions from 20 to 500 guests — enquire for a custom menu.' },
      { q: 'Are vegetarian options available?', a: 'Over half our menu is pure vegetarian, clearly marked on the menu card.' },
    ],
    blog: [
      { title: 'The Story Behind Our Butter Chicken', excerpt: 'A recipe passed down three generations, and why we’ll never change it.' },
      { title: 'Hosting a Function? Here’s Our Catering Menu', excerpt: 'Everything we offer for weddings, birthdays and office parties.' },
      { title: 'Why Fresh Masala Makes All the Difference', excerpt: 'A look inside our kitchen’s morning spice-grinding ritual.' },
    ],
    ctaLabel: 'Reserve a Table',
  },
  {
    key: 'clinic', label: 'Clinic', icon: Stethoscope,
    siteName: 'CarePlus Family Clinic', tagline: 'Trusted family healthcare, open 7 days a week.',
    subcopy: 'Experienced doctors, a caring staff and same-day appointments — healthcare that treats you like family.',
    heroImg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80&auto=format&fit=crop',
    sliderEffect: 'kenburns', galleryEffect: 'stagger',
    badge: '🩺 5000+ Patients Treated', accent: '#0e7490', accent2: '#0891b2',
    stats: [{ label: 'Years Practice', value: '10+' }, { label: 'Patients Treated', value: '5000+' }, { label: 'Open Days a Week', value: '7' }],
    aboutTitle: 'About our clinic',
    aboutBody: 'CarePlus was founded to give families a doctor they actually know by name. Our team of physicians and nurses focuses on continuity of care — the same familiar faces every visit, not a different doctor every time.',
    servicesTitle: 'Our Services',
    services: [
      { title: 'General Consultation', desc: 'Walk-in or scheduled visits with our family physicians.' },
      { title: 'Vaccination', desc: 'Full schedule of adult and child immunizations.' },
      { title: 'Health Checkups', desc: 'Preventive full-body screening packages.' },
      { title: 'Pediatric Care', desc: 'Dedicated child health checks and growth tracking.' },
      { title: 'Diagnostic Lab', desc: 'On-site blood work and reports within 24 hours.' },
      { title: 'Physiotherapy', desc: 'Post-injury and chronic-pain rehabilitation sessions.' },
    ],
    testimonials: [
      { quote: 'The doctors actually take time to listen. Never felt rushed.', name: 'Sunita Rao', role: 'Patient since 2019' },
      { quote: 'Got a same-day appointment when my son had a fever spike — huge relief.', name: 'Vikas Malhotra', role: 'Parent' },
      { quote: 'Clean, well-organized, and the staff remembers you by name.', name: 'Farah Sheikh', role: 'Patient' },
    ],
    team: [
      { name: 'Dr. Neha Kulkarni', role: 'Chief Physician, MD' },
      { name: 'Dr. Arjun Reddy', role: 'Pediatrician' },
      { name: 'Sr. Lata Fernandes', role: 'Head Nurse' },
    ],
    faq: [
      { q: 'Do I need an appointment?', a: 'Walk-ins are welcome, but booking online guarantees you a fixed time slot.' },
      { q: 'Do you accept insurance?', a: 'We work with most major insurance providers — bring your card at check-in.' },
      { q: 'Is emergency care available?', a: 'We handle urgent, non-critical cases on the same day; life-threatening emergencies should go to the nearest hospital.' },
      { q: 'Are reports available online?', a: 'Yes, lab reports are shared via WhatsApp and email within 24 hours.' },
    ],
    blog: [
      { title: '5 Symptoms You Shouldn’t Ignore', excerpt: 'When a common complaint is actually worth a same-day visit.' },
      { title: 'Your Child’s Vaccination Timeline', excerpt: 'A simple, printable schedule for the first 5 years.' },
      { title: 'Why Annual Checkups Matter More After 40', excerpt: 'What a basic screening panel can catch early.' },
    ],
    ctaLabel: 'Book Appointment',
  },
  {
    key: 'agency', label: 'Agency', icon: Megaphone,
    siteName: 'Bright Spark Digital', tagline: 'The marketing agency that grows small businesses online.',
    subcopy: 'Social media, ads and websites that bring in real customers — not just vanity likes.',
    heroImg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
    sliderEffect: 'wipe', galleryEffect: 'mosaic',
    badge: '📈 Avg. 3x Growth in 90 Days', accent: '#6d28d9', accent2: '#7c3aed',
    stats: [{ label: 'Clients Served', value: '80+' }, { label: 'Avg. Growth', value: '3x' }, { label: 'Support', value: '24/7' }],
    aboutTitle: 'Who we are',
    aboutBody: 'We’re a small, senior team of marketers and designers who got tired of watching local businesses get overcharged by agencies chasing vanity metrics. Every campaign we run is tied to a number that actually matters to your revenue.',
    servicesTitle: 'What We Do',
    services: [
      { title: 'Social Media Marketing', desc: 'Content, community and campaigns that build a following.' },
      { title: 'Website Design', desc: 'Fast, mobile-first sites built to convert visitors.' },
      { title: 'SEO & Paid Ads', desc: 'Ranking and running ads that pay for themselves.' },
      { title: 'Brand Strategy', desc: 'Positioning and messaging that makes you the obvious choice.' },
      { title: 'Content Production', desc: 'Photo, video and copy tailored to each platform.' },
      { title: 'Analytics & Reporting', desc: 'Clear monthly reports tied to leads, not just impressions.' },
    ],
    testimonials: [
      { quote: 'They doubled our leads in the first quarter. Worth every rupee.', name: 'Manish Agarwal', role: 'Local Business Owner' },
      { quote: 'Finally an agency that explains what they’re doing and why, in plain language.', name: 'Sonal Deshmukh', role: 'Boutique Owner' },
      { quote: 'Our ad spend went down and our bookings went up. That’s the whole pitch, and it worked.', name: 'Imran Qureshi', role: 'Gym Owner' },
    ],
    team: [
      { name: 'Rhea Kapoor', role: 'Founder & Strategist' },
      { name: 'Dev Patel', role: 'Performance Marketing Lead' },
    ],
    faq: [
      { q: 'What’s the minimum commitment?', a: 'We work on a 3-month minimum so campaigns have time to actually optimize and show results.' },
      { q: 'Do you work with our budget?', a: 'We scope ad spend recommendations around what you’re comfortable committing, no fixed minimums imposed.' },
      { q: 'Will I get reports?', a: 'Yes, a plain-language monthly report tied to leads and revenue, not just likes and reach.' },
      { q: 'Do you handle the website too?', a: 'Yes, design and marketing under one roof means the site and campaigns are built to work together.' },
    ],
    blog: [
      { title: 'Why Your Ads Aren’t Converting', excerpt: 'The 3 most common reasons local ad campaigns underperform.' },
      { title: 'A Simple Content Calendar for Small Teams', excerpt: 'How to post consistently without burning out.' },
      { title: 'SEO Basics Every Local Business Should Know', excerpt: 'The handful of things that actually move your ranking.' },
    ],
    ctaLabel: 'Get a Free Quote',
  },
  {
    key: 'personal', label: 'Personal', icon: User,
    siteName: 'Riya Sharma', tagline: 'Yoga instructor & wellness coach helping you build healthy habits.',
    subcopy: 'Certified 500-hour yoga teacher offering 1:1 coaching, group classes and workshops — online and in person.',
    heroImg: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80&auto=format&fit=crop',
    sliderEffect: 'blur', galleryEffect: 'polaroid',
    badge: '🧘 500+ Sessions Taught', accent: '#15803d', accent2: '#16a34a',
    stats: [{ label: 'Sessions Taught', value: '500+' }, { label: 'Happy Clients', value: '200+' }, { label: 'Certified', value: 'RYT-500' }],
    aboutTitle: 'My story',
    aboutBody: 'I started practicing yoga to manage my own anxiety a decade ago, and it changed the course of my life. Today I teach a grounded, no-frills style of yoga focused on breath and consistency — not perfect poses for Instagram.',
    servicesTitle: 'What I Offer',
    services: [
      { title: '1:1 Coaching', desc: 'Personalized sessions built around your goals and schedule.' },
      { title: 'Group Yoga Classes', desc: 'Small-batch morning and evening sessions, all levels welcome.' },
      { title: 'Wellness Workshops', desc: 'Half-day workshops on breathwork, nutrition and recovery.' },
      { title: 'Online Sessions', desc: 'Live 1:1 or group classes over video call, from anywhere.' },
      { title: 'Corporate Wellness', desc: 'On-site sessions for teams looking to de-stress together.' },
      { title: 'Prenatal Yoga', desc: 'Gentle, trimester-safe sessions for expecting mothers.' },
    ],
    testimonials: [
      { quote: 'Riya’s sessions changed how I deal with stress. Life-changing.', name: 'Kavya Menon', role: 'Client, 8 months' },
      { quote: 'The corporate workshop was the best team session we’ve ever run.', name: 'Aditya Bose', role: 'HR Manager' },
      { quote: 'I’ve tried a dozen instructors — Riya is the only one I’ve stuck with.', name: 'Neha Chawla', role: 'Client, 2 years' },
    ],
    team: [{ name: 'Riya Sharma', role: 'Founder, RYT-500 Instructor' }],
    faq: [
      { q: 'Do I need prior yoga experience?', a: 'Not at all — sessions are tailored to your current level, beginners are very welcome.' },
      { q: 'Are online sessions as effective?', a: 'Yes, with a good camera angle for form correction, online 1:1 sessions work just as well as in-person.' },
      { q: 'How do I book a session?', a: 'Use the contact form below or message directly on WhatsApp to check available slots.' },
      { q: 'Do you offer package deals?', a: 'Yes, monthly packages work out cheaper than paying per session — ask for current pricing.' },
    ],
    blog: [
      { title: '5-Minute Morning Breathing Routine', excerpt: 'A simple practice you can do before you even get out of bed.' },
      { title: 'Why Consistency Beats Intensity', excerpt: 'What a decade of teaching yoga taught me about real progress.' },
      { title: 'Yoga for Desk Workers', excerpt: '4 stretches to undo a full day of sitting.' },
    ],
    ctaLabel: 'Book a Session',
  },
];

const NAV_POOL = ['About', 'Services', 'Gallery', 'Testimonials', 'Team', 'FAQ', 'Blog', 'Locations', 'Careers'];

function pageCountOf(product: Software): number {
  const m = product.features[0]?.match(/(\d+)\s*Pages?/i);
  return m ? parseInt(m[1], 10) : 1;
}

function navItemsFor(pageCount: number): string[] {
  if (pageCount <= 1) return ['Home'];
  const take = Math.min(NAV_POOL.length, pageCount - 2);
  return ['Home', ...NAV_POOL.slice(0, take), 'Contact'];
}

// Every image below is a genuine crop/framing of the business type's own curated real photo —
// no random placeholder photography, so galleries stay topic-accurate to the site being previewed.
function sliderImagesFor(heroImg: string): string[] {
  return [
    cropVariant(heroImg, 1200, 700, 'entropy'),
    cropVariant(heroImg, 1200, 700, 'top'),
    cropVariant(heroImg, 1200, 700, 'bottom'),
  ];
}
function galleryImagesFor(heroImg: string): string[] {
  return [
    cropVariant(heroImg, 400, 400, 'entropy'),
    cropVariant(heroImg, 400, 500, 'top'),
    cropVariant(heroImg, 500, 400, 'right'),
    cropVariant(heroImg, 400, 400, 'left'),
    cropVariant(heroImg, 400, 500, 'bottom'),
    cropVariant(heroImg, 500, 375, 'center'),
  ];
}
function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const fade = { hidden: { opacity: 0, y: 16 }, show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' } }) };

function AdminPanelModal({ product, navItems, onClose }: { product: Software; navItems: string[]; onClose: () => void }) {
  const stats = [
    { label: 'Site Visitors (30d)', value: '2,431' },
    { label: 'Pages', value: String(navItems.length) },
    { label: 'Contact Messages', value: '18' },
    { label: 'Uptime', value: '99.9%' },
  ];
  return (
    <motion.div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="bg-slate-950 text-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex"
        initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }}
        onClick={e => e.stopPropagation()}
      >
        <aside className="w-40 sm:w-48 bg-slate-900 border-r border-slate-800 p-3 space-y-1 shrink-0">
          <div className="text-[10px] font-bold text-slate-500 px-2 mb-2 uppercase tracking-wide">Admin (Demo)</div>
          {[{ label: 'Dashboard', icon: LayoutDashboard }, { label: 'Pages', icon: FileText }, { label: 'Media', icon: ImageIcon }, { label: 'Team', icon: Users2 }, { label: 'Settings', icon: Settings }].map((item, i) => (
            <div key={item.label} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium ${i === 0 ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
              <item.icon className="w-3.5 h-3.5" /> {item.label}
            </div>
          ))}
        </aside>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-3 py-1">
              <Lock className="w-3 h-3" /> Demo only — not a live admin panel
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            {stats.map(s => (
              <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="text-lg font-extrabold">{s.value}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="text-xs font-bold text-slate-300 mb-2">Pages</div>
          <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
            {navItems.map(p => (
              <div key={p} className="flex items-center justify-between px-3 py-2 bg-slate-900/60 text-xs">
                <span className="text-slate-200 font-medium">{p}</span>
                <span className="flex items-center gap-2 text-slate-500">
                  <Eye className="w-3.5 h-3.5" /> <Pencil className="w-3.5 h-3.5" />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[11px] text-slate-500 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> The real {product.name} includes a working admin panel to edit every page yourself — this is a visual preview only.</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WebsiteDemoPreview({ product }: { product: Software }) {
  const [typeKey, setTypeKey] = useState(BUSINESS_TYPES[0].key);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [activePage, setActivePage] = useState('Home');
  const [adminOpen, setAdminOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const t = BUSINESS_TYPES.find(b => b.key === typeKey)!;

  const pageCount = pageCountOf(product);
  const navItems = navItemsFor(pageCount);
  const hasWhatsApp = product.features.some(f => /whatsapp/i.test(f));
  const seoLabel = product.features.some(f => /technical seo/i.test(f)) ? 'Technical SEO Ready' : product.features.some(f => /seo/i.test(f)) ? 'SEO Ready' : null;
  const domain = `www.${slugify(t.siteName)}.com`;

  useEffect(() => setActivePage('Home'), [typeKey]);
  useEffect(() => setOpenFaq(0), [typeKey, activePage]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Demo banner — no pricing, this is a design preview only */}
      <div className="z-50 text-center py-2 px-4 text-[11px] font-semibold flex items-center justify-center gap-3 flex-wrap text-white" style={{ background: `linear-gradient(90deg,${product.c1},${product.c2})` }}>
        <span>🎯 DEMO PREVIEW — {product.name} · {pageCount} page{pageCount > 1 ? 's' : ''}. Sample design, not the final site.</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setAdminOpen(true)} className="flex items-center gap-1 bg-white/20 border border-white/40 px-3 py-0.5 rounded-full text-[10px] font-bold hover:bg-white/30 transition">
            <Lock className="w-3 h-3" /> Admin Panel
          </button>
          <Link href={`/checkout?product=${product.slug}`} className="bg-white text-slate-900 px-3 py-0.5 rounded-full text-[10px] font-bold hover:opacity-90 transition">
            Advance Payment
          </Link>
          <Link href={`/software/${product.slug}`} className="opacity-80 hover:opacity-100"><X className="w-3.5 h-3.5" /></Link>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">Preview as:</span>
          {BUSINESS_TYPES.map(bt => {
            const Icon = bt.icon;
            const active = bt.key === typeKey;
            return (
              <button
                key={bt.key}
                onClick={() => setTypeKey(bt.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${active ? 'text-white border-transparent' : 'text-slate-600 border-slate-200 hover:border-slate-400'}`}
                style={active ? { background: `linear-gradient(135deg,${product.c1},${product.c2})` } : {}}
              >
                <Icon className="w-3.5 h-3.5" /> {bt.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
          <button onClick={() => setViewport('desktop')} className={`p-1.5 rounded-full transition ${viewport === 'desktop' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`} aria-label="Desktop preview">
            <Monitor className="w-4 h-4" />
          </button>
          <button onClick={() => setViewport('mobile')} className={`p-1.5 rounded-full transition ${viewport === 'mobile' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`} aria-label="Mobile preview">
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Browser frame */}
      <div className="flex-1 flex justify-center p-4 sm:p-8 bg-slate-100">
        <div className={`w-full ${viewport === 'mobile' ? 'max-w-sm' : 'max-w-5xl'} bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transition-all duration-300`}>
          {/* Chrome bar */}
          <div className="bg-slate-200 px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-full px-3 py-1 text-[11px] text-slate-500 truncate">{domain}/{activePage === 'Home' ? '' : slugify(activePage)}</div>
          </div>

          {/* Site nav — functional, drives activePage */}
          <div className="relative border-b border-slate-100 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
            <span className="font-bold text-sm text-slate-900">{t.siteName}</span>
            <nav className={`flex items-center gap-1 flex-wrap ${viewport === 'mobile' ? 'hidden' : ''}`}>
              {navItems.map(item => (
                <button key={item} onClick={() => setActivePage(item)} className="relative px-2 py-1 text-[11px] font-medium transition-colors" style={{ color: activePage === item ? t.accent : '#64748b' }}>
                  {item}
                  {activePage === item && (
                    <motion.span layoutId={`nav-underline-${product.slug}`} className="absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full" style={{ background: t.accent }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                </button>
              ))}
            </nav>
            <button onClick={() => setActivePage('Contact')} className="text-[11px] font-bold px-3 py-1.5 rounded-full text-white" style={{ background: t.accent }}>{t.ctaLabel}</button>
          </div>

          {/* Mobile page picker */}
          {viewport === 'mobile' && (
            <div className="flex gap-1.5 overflow-x-auto px-4 py-2 border-b border-slate-100">
              {navItems.map(item => (
                <button key={item} onClick={() => setActivePage(item)} className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold" style={activePage === item ? { background: t.accent, color: '#fff' } : { background: '#f1f5f9', color: '#64748b' }}>
                  {item}
                </button>
              ))}
            </div>
          )}

          <div className="max-h-[70vh] overflow-y-auto relative">
            <AnimatePresence mode="wait">
              <motion.div key={`${typeKey}-${activePage}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>

                {activePage === 'Home' && (
                  <>
                    <div className={`p-5 sm:p-8 grid gap-6 items-center ${viewport === 'mobile' ? '' : 'sm:grid-cols-2'}`}>
                      <motion.div variants={fade} initial="hidden" animate="show" custom={0}>
                        <motion.span variants={fade} custom={0.5} initial="hidden" animate="show" className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-3" style={{ background: `${t.accent}1a`, color: t.accent }}>{t.badge}</motion.span>
                        <motion.h1 variants={fade} custom={1} initial="hidden" animate="show" className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-3">{t.tagline}</motion.h1>
                        <motion.p variants={fade} custom={1.5} initial="hidden" animate="show" className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">{t.subcopy}</motion.p>
                        <motion.div variants={fade} custom={2} initial="hidden" animate="show" className="flex gap-2 flex-wrap">
                          <button onClick={() => setActivePage('Contact')} className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: t.accent }}>{t.ctaLabel}</button>
                          <button onClick={() => setActivePage(navItems.includes('About') ? 'About' : 'Home')} className="text-xs font-bold px-4 py-2 rounded-lg border border-slate-300 text-slate-700">Learn More</button>
                        </motion.div>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}>
                        <EffectSlider effect={t.sliderEffect} images={sliderImagesFor(t.heroImg)} fallback={t.heroImg} alt={t.siteName} heightClass="h-40 sm:h-56" />
                      </motion.div>
                    </div>

                    <div className="px-5 sm:px-8 pb-6 grid grid-cols-3 gap-3">
                      {t.stats.map((s, i) => (
                        <motion.div key={s.label} variants={fade} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center bg-slate-50 rounded-lg py-3 px-1">
                          <div className="text-sm sm:text-base font-extrabold" style={{ color: t.accent }}>{s.value}</div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{s.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="px-5 sm:px-8 pb-6">
                      <h2 className="text-sm font-bold text-slate-900 mb-3">{t.servicesTitle}</h2>
                      <div className={`grid gap-3 ${viewport === 'mobile' ? '' : 'sm:grid-cols-3'}`}>
                        {t.services.slice(0, 3).map((s, i) => (
                          <motion.div key={s.title} variants={fade} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ y: -3 }} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/60 transition-shadow hover:shadow-md">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-800">{s.title}</span>
                              {s.price && <span className="text-xs font-bold shrink-0" style={{ color: t.accent }}>{s.price}</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                      {navItems.includes('Services') && (
                        <button onClick={() => setActivePage('Services')} className="text-[11px] font-bold mt-3" style={{ color: t.accent }}>View all →</button>
                      )}
                    </div>

                    {!navItems.includes('Gallery') && (
                      <div className="px-5 sm:px-8 pb-6">
                        <h2 className="text-sm font-bold text-slate-900 mb-3">Gallery</h2>
                        <EffectGallery effect={t.galleryEffect} images={galleryImagesFor(t.heroImg)} fallback={t.heroImg} alt={t.siteName} accent={t.accent} />
                      </div>
                    )}

                    <div className="px-5 sm:px-8 pb-6">
                      <div className="rounded-xl p-4 flex gap-3 items-start" style={{ background: `${t.accent}0d` }}>
                        <Quote className="w-5 h-5 shrink-0 mt-0.5" style={{ color: t.accent }} />
                        <div>
                          <p className="text-xs text-slate-700 italic leading-relaxed mb-1.5">&ldquo;{t.testimonials[0].quote}&rdquo;</p>
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                            <Star className="w-3 h-3 fill-current" style={{ color: t.accent }} /> {t.testimonials[0].name}, {t.testimonials[0].role}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 sm:px-8 pb-8 border-t border-slate-100 pt-6">
                      <h2 className="text-sm font-bold text-slate-900 mb-3">What&rsquo;s Included</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {product.features.map((f, i) => (
                          <motion.div key={f} variants={fade} custom={i * 0.5} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-2 text-[11px] font-medium text-slate-600 bg-slate-50 rounded-lg px-2.5 py-2">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: t.accent }} /> {f}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activePage === 'About' && (
                  <div className="p-5 sm:p-8 space-y-6">
                    <motion.div variants={fade} initial="hidden" animate="show">
                      <h2 className="text-lg font-extrabold text-slate-900 mb-3">{t.aboutTitle}</h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.aboutBody}</p>
                    </motion.div>
                    <div className="grid grid-cols-3 gap-3">
                      {t.stats.map((s, i) => (
                        <motion.div key={s.label} variants={fade} custom={i} initial="hidden" animate="show" className="text-center bg-slate-50 rounded-lg py-3 px-1">
                          <div className="text-sm font-extrabold" style={{ color: t.accent }}>{s.value}</div>
                          <div className="text-[10px] font-semibold text-slate-500">{s.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'Services' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">{t.servicesTitle}</h2>
                    <div className={`grid gap-3 ${viewport === 'mobile' ? '' : 'sm:grid-cols-3'}`}>
                      {t.services.map((s, i) => (
                        <motion.div key={s.title} variants={fade} custom={i} initial="hidden" animate="show" whileHover={{ y: -3 }} className="border border-slate-100 rounded-xl p-4 bg-slate-50/60 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-slate-800">{s.title}</span>
                            {s.price && <span className="text-xs font-bold shrink-0" style={{ color: t.accent }}>{s.price}</span>}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'Gallery' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">Gallery</h2>
                    <EffectGallery effect={t.galleryEffect} images={galleryImagesFor(t.heroImg)} fallback={t.heroImg} alt={t.siteName} accent={t.accent} />
                  </div>
                )}

                {activePage === 'Testimonials' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">What People Say</h2>
                    <div className={`grid gap-3 ${viewport === 'mobile' ? '' : 'sm:grid-cols-3'}`}>
                      {t.testimonials.map((q, i) => (
                        <motion.div key={q.name} variants={fade} custom={i} initial="hidden" animate="show" className="rounded-xl p-4" style={{ background: `${t.accent}0d` }}>
                          <Quote className="w-4 h-4 mb-2" style={{ color: t.accent }} />
                          <p className="text-xs text-slate-700 italic leading-relaxed mb-2">&ldquo;{q.quote}&rdquo;</p>
                          <div className="text-[10px] font-semibold text-slate-500">{q.name} · {q.role}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'Team' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">Our Team</h2>
                    <div className={`grid gap-4 ${viewport === 'mobile' ? '' : 'sm:grid-cols-3'}`}>
                      {t.team.map((m, i) => (
                        <motion.div key={m.name} variants={fade} custom={i} initial="hidden" animate="show" className="text-center">
                          <div className="w-20 h-20 rounded-full mx-auto mb-2 grid place-items-center text-sm font-extrabold text-white" style={{ background: `linear-gradient(135deg,${t.accent},${t.accent2})` }}>{initials(m.name)}</div>
                          <div className="text-xs font-bold text-slate-800">{m.name}</div>
                          <div className="text-[10px] text-slate-500">{m.role}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'FAQ' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                      {t.faq.map((f, i) => (
                        <div key={f.q} className="border border-slate-100 rounded-xl overflow-hidden">
                          <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
                            <span className="text-xs font-bold text-slate-800">{f.q}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} style={{ color: t.accent }} />
                          </button>
                          <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: openFaq === i ? '1fr' : '0fr' }}>
                            <div className="overflow-hidden">
                              <p className="text-[11px] text-slate-500 leading-relaxed px-4 pb-3">{f.a}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'Blog' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">From the Blog</h2>
                    <div className={`grid gap-3 ${viewport === 'mobile' ? '' : 'sm:grid-cols-3'}`}>
                      {t.blog.map((b, i) => (
                        <motion.div key={b.title} variants={fade} custom={i} initial="hidden" animate="show" whileHover={{ y: -3 }} className="rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cropVariant(t.heroImg, 400, 220, ['top', 'bottom', 'entropy'][i % 3])} alt="" className="w-full h-28 object-cover" />
                          <div className="p-3">
                            <div className="text-xs font-bold text-slate-800 mb-1">{b.title}</div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{b.excerpt}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'Locations' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">Our Locations</h2>
                    <div className={`grid gap-3 ${viewport === 'mobile' ? '' : 'sm:grid-cols-2'}`}>
                      {['Main Branch — City Center', 'Second Branch — North Side'].map((loc, i) => (
                        <motion.div key={loc} variants={fade} custom={i} initial="hidden" animate="show" className="border border-slate-100 rounded-xl p-4 flex items-start gap-2.5 bg-slate-50/60">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: t.accent }} />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{loc}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">Open Mon–Sat, 10am–8pm</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'Careers' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-3">Join Our Team</h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">We&rsquo;re always open to hearing from motivated people who care about doing good work. Send your resume and a short note about why you&rsquo;d be a good fit.</p>
                    <button onClick={() => setActivePage('Contact')} className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: t.accent }}>Send Your Resume</button>
                  </div>
                )}

                {activePage === 'Contact' && (
                  <div className="p-5 sm:p-8">
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">Get in Touch</h2>
                    <div className={`grid gap-5 ${viewport === 'mobile' ? '' : 'sm:grid-cols-2'}`}>
                      <motion.div variants={fade} initial="hidden" animate="show" className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500"><Phone className="w-3.5 h-3.5" /> +91 98765 43210</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500"><Mail className="w-3.5 h-3.5" /> hello@{slugify(t.siteName)}.com</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500"><MapPin className="w-3.5 h-3.5" /> Your City, India</div>
                        <div className="flex gap-2 pt-1">
                          <span className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-slate-500"><Instagram className="w-3.5 h-3.5" /></span>
                          <span className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-slate-500"><Facebook className="w-3.5 h-3.5" /></span>
                          <span className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-slate-500"><Twitter className="w-3.5 h-3.5" /></span>
                        </div>
                      </motion.div>
                      <motion.div variants={fade} custom={1} initial="hidden" animate="show" className="space-y-2">
                        <div className="h-8 rounded-lg bg-slate-50 border border-slate-200 px-3 flex items-center text-[11px] text-slate-400">Your Name</div>
                        <div className="h-8 rounded-lg bg-slate-50 border border-slate-200 px-3 flex items-center text-[11px] text-slate-400">Phone or Email</div>
                        <div className="h-14 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] text-slate-400">Message</div>
                        <button className="w-full text-xs font-bold py-2 rounded-lg text-white" style={{ background: t.accent }}>Send Message</button>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="px-5 sm:px-8 py-5 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">&copy; {t.siteName} &middot; All rights reserved</span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="flex items-center gap-1 text-[10px] text-slate-400"><CheckCircle2 className="w-3 h-3 text-green-400" /> Mobile Responsive</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400"><CheckCircle2 className="w-3 h-3 text-green-400" /> SSL Secured</span>
                {seoLabel && <span className="flex items-center gap-1 text-[10px] text-slate-400"><CheckCircle2 className="w-3 h-3 text-green-400" /> {seoLabel}</span>}
              </div>
            </div>

            {hasWhatsApp && (
              <a
                href={`https://wa.me/919942000413?text=Hi, I'm interested in a website like ${t.siteName}`}
                target="_blank" rel="noreferrer"
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-green-500 grid place-items-center shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {adminOpen && <AdminPanelModal product={product} navItems={navItems} onClose={() => setAdminOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
