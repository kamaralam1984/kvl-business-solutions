import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { ArrowUpRight, Check } from 'lucide-react';
import { industries } from '@/lib/data/industries';
import { softwareProducts } from '@/lib/data/software';
import { caseStudies } from '@/lib/data/case-studies';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as any)[name] || Icons.Box;
  return <Cmp className={className} />;
}

type IndustryDetail = {
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  challenge: string[];
  softwareSlugs: string[];
  softwareNote?: string;
  caseStudySlug?: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaDesc: string;
};

const industryDetails: Record<string, IndustryDetail> = {
  construction: {
    metaTitle: 'Construction Industry Software Company in India',
    metaDescription: 'Construction management and GPS fleet software that tracks BOQ, materials, labour, site progress and vehicles in real time — built by KVL Business Solutions.',
    heroDescription: 'Track BOQ, materials, labor, and site progress in real time — so cost overruns and delays get caught before they become expensive, across every active site.',
    challenge: [
      "Construction projects rarely fail because of one big mistake — they fail because small overruns on cement, steel, and labour go unnoticed until the monthly reconciliation, by which point the budget is already blown. When BOQ tracking lives in a spreadsheet that only the site engineer updates once a week, the office has no real visibility into what's actually been consumed versus what was estimated.",
      "Site progress is another blind spot. Without a live way to see which milestones are on schedule, project managers find out about delays from a phone call instead of a dashboard — and by then, the knock-on effect on dependent trades has already started.",
      "Vehicles and material movement between sites add a further layer of risk: a truck that quietly detours, idles, or delivers late has no paper trail unless someone happens to notice, and with multiple sites running at once, keeping track of who's on site and what's leaving it is close to impossible without a system tying it together.",
    ],
    softwareSlugs: ['construction', 'gps-tracking'],
    faq: [
      { q: 'Does the construction software track material and labour against the original BOQ?', a: "Yes — BOQ & estimation is a core module, so material and labour consumption is tracked against your original bill of quantities, with cost control reporting to flag overruns." },
      { q: 'Can we track site progress against the project timeline?', a: "Yes, the software includes Gantt chart timelines and site progress tracking, so project managers can see what's on schedule and what's slipping without waiting for a site visit." },
      { q: 'Do you also handle GPS tracking for our trucks and equipment?', a: 'Yes — GPS Tracking Software is a separate product that pairs with construction management for real-time vehicle location, geofence alerts, and route history across your fleet.' },
      { q: 'Is the software available as a rental, or do we have to buy it outright?', a: "Both — Construction Management is available as an annual purchase or a monthly rental, so you can match the cost to how many active projects you're running." },
    ],
    ctaTitle: 'Need Software Built for Construction?',
    ctaDesc: 'Talk to a solution architect about BOQ tracking, site progress, and fleet visibility for your projects.',
  },
  mechanical: {
    metaTitle: 'Software for Mechanical Workshops in India',
    metaDescription: 'Workshop management software that replaces lost job cards with tracked service jobs, spare parts inventory, and customer history — built by KVL Business Solutions.',
    heroDescription: 'Manage service jobs, spare parts, and customer history in one system — faster turnarounds, no lost job cards, and no disputes over what was actually quoted.',
    challenge: [
      "A busy mechanical workshop runs on job cards — and paper job cards get lost, misfiled, or scribbled over until nobody can say for certain what work was actually approved, what parts were used, or what a customer was quoted. When that record lives in a notebook instead of a system, disputes over billing and turnaround time become routine.",
      "Spare parts inventory is the other pressure point. Without a live count of what's on the shelf, workshops either over-order and tie up cash in stock that sits for months, or under-order and leave a vehicle waiting on a part that should have been in stock already.",
      "Staff attendance and accountability add a third layer — with mechanics moving between bays and shifts, tracking who worked on which job without biometric or digital attendance records makes it hard to know where a delay actually came from.",
    ],
    softwareSlugs: ['workshop', 'attendance'],
    faq: [
      { q: 'Can the software replace our paper job cards completely?', a: 'Yes — Workshop Management is built around digital service job cards, so every job, part used, and customer history is recorded in the system instead of a notebook.' },
      { q: 'Does it track spare parts inventory?', a: 'Yes, parts inventory tracking is a core module of Workshop Management, so you can see stock levels in real time instead of relying on a manual count.' },
      { q: 'Can we track mechanic attendance and shift hours too?', a: 'Yes — our Attendance System pairs with Workshop Management to add biometric or geo-fenced mobile attendance, shift tracking, and overtime calculation.' },
      { q: 'How do customers get notified when their vehicle is ready?', a: 'Workshop Management includes SMS notifications, so customers are updated automatically as their job moves through each stage.' },
    ],
    ctaTitle: 'Need Software Built for Your Workshop?',
    ctaDesc: 'Talk to a solution architect about digitising job cards, parts inventory, and mechanic attendance.',
  },
  manufacturing: {
    metaTitle: 'Manufacturing Plant Software & Automation',
    metaDescription: 'ERP, inventory and industrial automation that bring PLC, SCADA, IoT and stock data onto one dashboard — built by KVL Business Solutions for Indian plants.',
    heroDescription: 'Bring PLC, SCADA, and IoT data onto one dashboard — giving plant managers real-time visibility into production, OEE, and stock, instead of a floor walk.',
    challenge: [
      "On a manufacturing floor, the systems that actually run production — PLCs, SCADA controllers, individual machine sensors — usually don't talk to each other, let alone to the ERP system finance and purchase run on. A plant manager ends up walking the floor to find out what a dashboard should already be telling them.",
      "That disconnect shows up hardest in OEE — overall equipment effectiveness is only useful as a number if it's calculated from real machine data, not a manually compiled shift report written up after the fact, by which point the downtime that caused it can't be traced back to a cause.",
      "The same gap extends into raw material and finished-goods stock: without inventory tied to the production line in real time, plants either overstock components to be safe or run into a line stoppage waiting on a part that finance didn't know was low.",
    ],
    softwareSlugs: ['erp', 'inventory'],
    softwareNote: "For the shop-floor layer itself — bringing PLC, SCADA, and IoT data onto one dashboard — that's handled through our Industrial Automation service, which works alongside the ERP and inventory systems below.",
    faq: [
      { q: 'Does KVL connect PLC/SCADA data directly, or is that a separate service?', a: "Bringing PLC, SCADA, and IoT data onto one dashboard is handled through our Industrial Automation service — it's engineered specifically for shop-floor integration, separate from the ERP and inventory software below." },
      { q: 'Can the ERP handle multiple manufacturing branches or plants?', a: 'Yes — ERP Software supports multi-branch operation with GST-compliant financial accounting, purchase management, and custom reporting across every plant.' },
      { q: 'Will it track raw material and finished-goods stock in real time?', a: 'Yes, Inventory Software adds barcode/QR scanning, multi-warehouse tracking, and low-stock alerts so raw material and finished-goods counts stay current.' },
      { q: 'Can we start with just inventory and add the full ERP later?', a: 'Yes — each product is licensed separately, so you can start with what solves the most urgent problem and add modules as the plant scales.' },
    ],
    ctaTitle: 'Need Software Built for Your Plant?',
    ctaDesc: 'Talk to a solution architect about connecting shop-floor data, inventory, and ERP on one dashboard.',
  },
  transport: {
    metaTitle: 'Fleet & Logistics Software Company in India',
    metaDescription: 'Live GPS fleet tracking software with route history, fuel monitoring and driver behaviour alerts — built and supported by KVL Business Solutions.',
    heroDescription: 'Track your fleet, optimize routes, and monitor fuel and driver behavior — cut costs and catch problems before they escalate, not after a customer complains.',
    challenge: [
      "Running a fleet without live location data means finding out about a problem — a detour, an idle vehicle, a late delivery — only when a customer complains or a driver eventually reports in. By then there's no way to reconstruct what actually happened on the route.",
      "Fuel is usually the biggest recurring cost in transport, and it's also the easiest to lose track of without a system tied to the vehicle itself. Manual fuel logs are easy to pad, and without a monitoring layer, there's no independent way to catch it.",
      "Route planning done manually also breaks down at any real scale — a dispatcher juggling a dozen vehicles and drop points on a whiteboard or spreadsheet can't optimize for distance or timing the way a system built to plan routes can, and driver behaviour stays invisible without a way to track it.",
    ],
    softwareSlugs: ['gps-tracking'],
    faq: [
      { q: 'Does the GPS system track fuel usage, not just location?', a: 'Yes — Fuel Monitoring is a built-in feature alongside real-time location, so you can see both where a vehicle is and how much fuel it\'s consuming.' },
      { q: 'Can we set alerts if a vehicle leaves an approved route or area?', a: 'Yes, Geofence Alerts notify you automatically the moment a vehicle enters or exits a defined zone.' },
      { q: 'Is this the same system you use for family or personal location tracking?', a: 'No — GPS Tracking Software is built specifically for fleet and vehicle management. We separately built Gravity, a consumer family-safety location app, for personal use cases; the two are different products.' },
      { q: 'How is pricing structured for a fleet with multiple vehicles?', a: "GPS Tracking Software is priced per vehicle, per year or per month, so the cost scales directly with the number of vehicles you're tracking." },
    ],
    ctaTitle: 'Need GPS Software Built for Your Fleet?',
    ctaDesc: 'Talk to a solution architect about real-time tracking, fuel monitoring, and route planning for your vehicles.',
  },
  schools: {
    metaTitle: 'School & College Management Software',
    metaDescription: 'School ERP software for admissions, fees, attendance, exams, transport and parent communication — built and supported by KVL Business Solutions.',
    heroDescription: 'Run admissions, fees, attendance, exams, transport, and parent communication from one platform — less manual work for staff, more visibility for parents.',
    challenge: [
      "Schools run on a calendar of recurring, deadline-bound work — admissions, fee collection, attendance, exams, report cards — and when each of these lives in a different register or spreadsheet, front-office staff spend more time reconciling records than actually helping parents and students.",
      "Parent communication is often the weakest link: without a dedicated app, updates about fees, attendance, or exam schedules go out over WhatsApp groups or printed circulars that are easy to miss, and parents have no direct way to check their child's status themselves.",
      "School transport adds its own risk — without live tracking on the bus fleet, parents have no visibility into where a bus actually is, and the school has no record to fall back on if a pickup or drop-off is disputed.",
    ],
    softwareSlugs: ['school'],
    faq: [
      { q: 'How do parents get access to the Parent App — do they need to download something separately?', a: 'The Parent + Student App is part of the School Management Software itself, giving parents a dedicated login to see fees, attendance, and exam results without relying on WhatsApp circulars.' },
      { q: 'Can it manage a single campus with multiple sections, or only one class group at a time?', a: 'The software is built for full-school management — admissions, fees, attendance, exams, transport and library — across every class and section on the same platform.' },
      { q: 'Does it track our school buses too?', a: 'Yes, Transport management is a built-in module, so bus routes and student pickup/drop tracking run from the same system as fees and attendance.' },
      { q: 'Is student data kept private and only visible to authorised staff?', a: 'Access is role-based, so parents see only their own child\'s records and staff see only what their role requires — an NDA is also available on request.' },
    ],
    ctaTitle: 'Need Software Built for Your School?',
    ctaDesc: 'Talk to a solution architect about admissions, fees, attendance, and parent communication in one platform.',
  },
  hospitals: {
    metaTitle: 'Hospital Management Software Company in India',
    metaDescription: 'Hospital management software unifying OPD, IPD, pharmacy, lab, billing and EMR into one patient record — built by KVL Business Solutions.',
    heroDescription: 'Unify OPD, IPD, pharmacy, lab, billing, and EMR into one patient record — so care teams spend less time on paperwork and more on patients.',
    challenge: [
      "In most hospitals, OPD registration, IPD admission, the pharmacy, the lab, and billing each run on their own system or paper register — which means a single patient's record is scattered across five places, and nobody on the care team has the full picture in one screen.",
      "That fragmentation costs time at every handoff: a doctor requesting a lab test, a pharmacist checking a prescription, or a billing desk closing out an IPD stay all have to chase down information instead of pulling it from one record.",
      "Ambulance and emergency response add urgency to the same problem — without live location tracking, dispatchers have no way to confirm how far an ambulance actually is from a pickup point or a hospital.",
    ],
    softwareSlugs: ['hospital'],
    faq: [
      { q: 'Is patient data secure and compliant with data protection expectations?', a: 'Hospital Management Software keeps OPD, IPD, pharmacy, lab and billing on one authenticated system rather than scattered paper registers, with an NDA available on request.' },
      { q: 'Does the system handle insurance claims, or is that separate?', a: 'Insurance claims processing is a built-in module, alongside OPD/IPD management, pharmacy and lab integration.' },
      { q: 'Can doctors manage their own appointment schedules in the system?', a: 'Yes — Doctor scheduling is included, so OPD appointments and availability are managed directly in the same platform patients and staff use.' },
      { q: 'Do you also provide ambulance GPS tracking?', a: 'Yes — GPS Tracking Software can be configured for ambulance fleets, giving dispatchers real-time location and route history.' },
    ],
    ctaTitle: 'Need Software Built for Your Hospital?',
    ctaDesc: 'Talk to a solution architect about unifying OPD, IPD, pharmacy, lab, and billing into one record.',
  },
  retail: {
    metaTitle: 'Retail POS & Inventory Software in India',
    metaDescription: 'Multi-outlet POS billing and inventory software synced with your online store — built and supported by KVL Business Solutions.',
    heroDescription: 'Run POS billing, inventory, and loyalty across every outlet from one system — synced with your online store, so no stock count is ever a guess.',
    challenge: [
      "A retail business with more than one outlet runs into the same problem eventually: each store's billing and stock count lives in its own silo, so head office only finds out about a stockout or a pricing mismatch after a customer has already been turned away.",
      "Loyalty programs run on paper punch cards or a spreadsheet lose most of their value — without a system that recognises a repeat customer automatically, loyalty becomes a manual, inconsistent process that staff either forget or apply differently at different counters.",
      "For retailers who also sell online, keeping stock in sync between the physical counter and the e-commerce store is a constant risk — a sale on one channel that isn't reflected on the other means overselling stock that's already gone.",
    ],
    softwareSlugs: ['billing', 'inventory'],
    faq: [
      { q: 'Can billing and inventory work across multiple outlets on one account?', a: "Yes — Billing Software and Inventory Software both support multi-outlet and multi-warehouse operation, so every store's stock and sales roll up to one view." },
      { q: 'Does it issue GST-compliant invoices at the counter?', a: '1-click GST invoicing with e-way bill support is built into Billing Software, along with Tally export for your accountant.' },
      { q: 'Will it stay in sync with our online store?', a: 'Stock sync with your online store is part of how Inventory Software is designed to work — talk to us about your specific e-commerce platform to confirm compatibility.' },
      { q: 'Can it print on our existing thermal billing printers?', a: 'Yes, thermal printer support is included in Billing Software, so you can use your existing counter hardware.' },
    ],
    ctaTitle: 'Need POS Software Built for Retail?',
    ctaDesc: 'Talk to a solution architect about multi-outlet billing, inventory, and loyalty for your stores.',
  },
  realestate: {
    metaTitle: 'Real Estate CRM & Software Company',
    metaDescription: 'Real estate lead CRM with site visit tracking, virtual tours and channel partner management — built by KVL Business Solutions, the team behind AapKaPlot.',
    heroDescription: 'Track every lead, showcase projects with virtual tours, and manage channel partners in one pipeline — so no enquiry goes cold waiting on a follow-up.',
    challenge: [
      "Real estate leads move fast and go cold even faster — a buyer who enquires about a project and doesn't hear back within a day or two has usually already moved on to the next listing. Without a CRM built for the sales cycle, follow-ups slip through simply because there's no system tracking who needs to be called next.",
      "Site visits and virtual tours are where a lead either converts or drops off, and if that stage isn't tracked, sales teams have no visibility into which leads actually visited a site versus which ones just enquired online and disappeared.",
      "Channel partners add another layer of coordination — without a shared portal, commission tracking and lead handoffs between the company and its brokers happen over calls and spreadsheets, which is exactly where disputes over who sourced a lead start.",
    ],
    softwareSlugs: ['real-estate'],
    caseStudySlug: 'aapkaplot',
    faq: [
      { q: 'Does the CRM track site visits, not just the initial enquiry?', a: 'Yes — Site visit tracking is a core feature, so sales teams can see which leads actually visited a property and which are still at the enquiry stage.' },
      { q: 'Can channel partners and brokers access their own leads and commissions?', a: 'Yes, the Commission calculator and document management modules are built to support channel partner workflows alongside your direct sales pipeline.' },
      { q: 'Does it send follow-ups over WhatsApp automatically?', a: "Yes — WhatsApp automation is included, so follow-up messages go out without a salesperson having to remember to send them manually." },
      { q: 'Have you built anything like this before?', a: 'Yes — AapKaPlot is a live, map-first property marketplace we built with verified listings and an AI recommendation layer. See the case study below.' },
    ],
    ctaTitle: 'Need CRM Software Built for Real Estate?',
    ctaDesc: 'Talk to a solution architect about lead tracking, site visits, and channel partner management.',
  },
  government: {
    metaTitle: 'Software for Government Contractors in India',
    metaDescription: 'ERP and custom compliance software for e-Tender, GEM and audit documentation — built and supported by KVL Business Solutions.',
    heroDescription: 'Manage e-Tenders, GEM listings, and compliance documentation end-to-end — so nothing is ever missed on audit day, and every cost traces back to its contract.',
    challenge: [
      "Government contracting runs on documentation — tender submissions, GEM listings, compliance certificates, work completion reports — and when that paperwork is scattered across email threads and local folders, a single missing document can delay a bid or trigger a query on audit day.",
      "Compliance deadlines in government work are non-negotiable, and unlike a private client, there's no room to negotiate an extension. Without a system tracking what's due and what's already been submitted, contractors are relying on someone remembering a date.",
      "Financial reporting for government contracts also has to hold up to scrutiny in a way ad-hoc spreadsheets don't — every payment, purchase, and cost has to be traceable back to the project it belongs to.",
    ],
    softwareSlugs: ['erp'],
    softwareNote: 'For a system built specifically around e-Tender and GEM compliance tracking, that\'s typically a Custom Software Development engagement, scoped around your exact documentation and deadline requirements.',
    faq: [
      { q: 'Can the ERP generate audit-ready financial reports?', a: 'Yes — custom reports and GST-compliant financial accounting are core to ERP Software, so records are structured to hold up to an audit rather than reconstructed after the fact.' },
      { q: 'Do you build custom e-Tender or GEM tracking tools, or only general ERP?', a: 'For a system built specifically around e-Tender and GEM compliance tracking, that\'s typically a Custom Software Development engagement — we scope it around your specific documentation and deadline requirements.' },
      { q: 'Can the system handle multiple government contracts or branches at once?', a: 'Yes, ERP Software supports multi-branch operation, so separate contracts and cost centres can be tracked individually within the same account.' },
      { q: 'Is data hosted securely for compliance purposes?', a: 'Both cloud and on-premise hosting options are available for ERP Software depending on your compliance requirements, with an NDA available on request.' },
    ],
    ctaTitle: 'Need Software Built for Government Contracting?',
    ctaDesc: 'Talk to a solution architect about e-Tender, GEM, and compliance documentation workflows.',
  },
  'restaurant-hospitality': {
    metaTitle: 'Restaurant & Hotel Software Company in India',
    metaDescription: 'Restaurant POS and hotel management software unifying billing, table bookings, delivery sync and reservations — built by KVL Business Solutions, the team behind Restro OS.',
    heroDescription: 'Run dine-in orders, table bookings, and hotel reservations from one system — synced with Zomato, Swiggy, and your channel manager so nothing is double-counted.',
    challenge: [
      "Running a restaurant or a small hotel usually means juggling a handful of disconnected tools — a POS for billing, a separate system for table or room bookings, and yet another app or dashboard for delivery orders coming in from Zomato and Swiggy. Reconciling the day's numbers means pulling data from all of them by hand.",
      "Double-bookings are the clearest symptom of that disconnect — a table or room booked over the phone and one booked online can collide if they aren't checked against the same calendar, and the guest finds out only when they arrive.",
      "Margins are the other blind spot: without billing tied to a kitchen order ticket or a room folio, owners can see total revenue but not which dishes or room types are actually profitable versus which ones are just high-volume.",
    ],
    softwareSlugs: ['restaurant', 'hotel'],
    caseStudySlug: 'restro-os',
    faq: [
      { q: 'Does the POS handle Zomato and Swiggy orders in the same system as dine-in?', a: 'Yes — Swiggy/Zomato sync is built into Restaurant POS Software, so delivery orders land in the same queue as dine-in and takeaway.' },
      { q: 'Can it manage both a restaurant and hotel rooms if we run both?', a: 'Yes — Restaurant POS Software and Hotel Management Software are separate products, and Hotel Management includes restaurant billing so the two can share data on one property.' },
      { q: 'Does it stop double-bookings between phone and online reservations?', a: 'Yes, Hotel Management Software includes an online booking engine synced with a channel manager, and Restaurant POS Software includes table management to prevent conflicting reservations.' },
      { q: 'Have you built something like this before?', a: 'Yes — Restro OS is a live restaurant platform we built that unifies ordering, billing, table reservations, and Zomato/Swiggy integration. See the case study below.' },
    ],
    ctaTitle: 'Need Software Built for Your Restaurant or Hotel?',
    ctaDesc: 'Talk to a solution architect about POS, table bookings, and delivery sync for your property.',
  },
  finance: {
    metaTitle: 'Finance & NBFC Software Company in India',
    metaDescription: 'Loan management, KYC and collections software for NBFCs and lending businesses — built and supported by KVL Business Solutions.',
    heroDescription: 'Manage loan disbursement, EMI collections, KYC verification and recovery tracking from one system — so NBFCs and lending businesses stop reconciling spreadsheets to know where a loan actually stands.',
    challenge: [
      "NBFCs and lending businesses running loan books on spreadsheets hit a ceiling fast — EMI schedules, overdue tracking, and collections follow-ups all live in different files, and by the time a defaulting account is flagged, it's often already several EMIs behind.",
      "KYC and documentation requirements add a compliance layer that manual processes handle inconsistently — a missing document or an unverified identity check discovered during an audit is a regulatory problem, not just an administrative one.",
      "Collections teams working without a system that tracks call history, promises-to-pay, and recovery status end up duplicating effort on the same accounts while others go untouched for weeks, and leadership has no real-time view of the loan book's actual health.",
    ],
    softwareSlugs: ['erp', 'crm'],
    softwareNote: "For a system built specifically around loan origination, EMI scheduling and NBFC-specific compliance workflows, that's typically a Custom Software Development engagement, scoped around your exact lending product and regulatory requirements.",
    faq: [
      { q: 'Do you build dedicated loan management or NBFC software, or only general ERP/CRM?', a: "For a system built specifically around loan origination, EMI scheduling and NBFC-specific compliance, that's typically a Custom Software Development engagement — we scope it around your exact lending product and regulatory requirements." },
      { q: 'Can the system track KYC documentation and flag incomplete files?', a: 'Yes — document management and compliance tracking are core to how we scope finance-sector systems, so incomplete KYC files are flagged before they become an audit problem.' },
      { q: 'Can collections teams track call history and promises-to-pay in the same system?', a: "Yes — collections workflow (call logs, promise-to-pay tracking, recovery status) is something we build into the CRM layer so accounts don't get worked twice or missed entirely." },
      { q: 'Is the system secure enough for financial and customer data?', a: 'Access is role-based, so sensitive loan and customer data is only visible to authorised staff — an NDA is also available on request.' },
    ],
    ctaTitle: 'Need Software Built for Your Lending Business?',
    ctaDesc: 'Talk to a solution architect about loan management, KYC tracking, and collections for your NBFC or finance business.',
  },
};

export function generateStaticParams() {
  return industries.map(i => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const ind = industries.find(i => i.slug === params.slug);
  const detail = ind ? industryDetails[ind.slug] : undefined;
  if (!ind || !detail) return { title: 'Industry not found' };
  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
    alternates: { canonical: `${SITE}/industries/${ind.slug}` },
    openGraph: {
      title: detail.metaTitle,
      description: detail.metaDescription,
      url: `${SITE}/industries/${ind.slug}`,
      type: 'website',
    },
  };
}

export default function IndustryPage({ params }: { params: { slug: string } }) {
  const industry = industries.find(i => i.slug === params.slug);
  const detail = industry ? industryDetails[industry.slug] : undefined;
  if (!industry || !detail) notFound();

  const products = detail.softwareSlugs
    .map(slug => softwareProducts.find(p => p.slug === slug))
    .filter(Boolean) as typeof softwareProducts;

  const caseStudy = detail.caseStudySlug
    ? caseStudies.find(c => c.slug === detail.caseStudySlug)
    : undefined;

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: `${industry.name} Software`,
    name: `${industry.name} Software Solutions`,
    description: detail.heroDescription,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: 'IN',
    url: `${SITE}/industries/${industry.slug}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: detail.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} id={`industry-${industry.slug}-service-jsonld`} />
      <JsonLd data={faqJsonLd} id={`industry-${industry.slug}-faq-jsonld`} />

      <PageHero
        eyebrow="INDUSTRY"
        title={industry.name}
        description={detail.heroDescription}
        breadcrumb={industry.name}
        breadcrumbPath={[{ label: 'Industries', href: '/industries' }, { label: industry.name }]}
      />

      {/* Business Challenge */}
      <section className="section">
        <div className="container max-w-3xl">
          <span className="eyebrow">The Business Challenge</span>
          <h2 className="text-3xl md:text-4xl font-extrabold my-4">What Makes {industry.name} Different</h2>
          <div className="space-y-5">
            {detail.challenge.map((p, i) => (
              <p key={i} className="text-text2 text-[15px] leading-[1.8]">{p}</p>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap mt-6">
            {industry.tags.map(t => (
              <span key={t} className="text-[11px] px-2.5 py-1 surface2-tint border border-tint rounded-full text-text2">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="eyebrow">What We Build</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">What We Build for {industry.name}</h2>
            {detail.softwareNote && <p className="text-text2 text-sm">{detail.softwareNote}</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {products.map(p => (
              <Link key={p.slug} href={`/software/${p.slug}`} className="card-premium p-7 block hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl grid place-items-center text-white shrink-0" style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}>
                    <Icon name={p.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{p.name}</h3>
                  </div>
                </div>
                <p className="text-text2 text-sm mb-5">{p.description}</p>
                <ul className="grid sm:grid-cols-2 gap-2.5 mb-5">
                  {p.features.map(f => (
                    <li key={f} className="flex gap-2 items-start text-[13px]">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  View {p.name} <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Proven in [Industry] */}
      {caseStudy && (
        <section className="section">
          <div className="container">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Proven in {industry.name}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">A Real System We Built</h2>
            </div>
            <Link href={`/projects/${caseStudy.slug}`} className="card-premium p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center block group max-w-4xl mx-auto">
              <div>
                <div className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: '#a3814f' }}>{caseStudy.businessCategory}</div>
                <h3 className="text-2xl font-black mb-3">{caseStudy.name}</h3>
                <p className="text-text2 text-sm mb-4">{caseStudy.challenge.body}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Read the case study <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-tint" style={{ height: 220 }}>
                <Image
                  src={caseStudy.images.hero}
                  alt={`${caseStudy.name} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className={`section ${caseStudy ? 'section-alt' : ''}`}>
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-extrabold my-4">Common Questions</h2>
          </div>
          <div className="space-y-5">
            {detail.faq.map(f => (
              <div key={f.q} className="card-base p-6">
                <div className="font-bold text-sm mb-2">{f.q}</div>
                <div className="text-text2 text-[13.5px] leading-[1.7]">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner title={detail.ctaTitle} desc={detail.ctaDesc} />
    </>
  );
}
