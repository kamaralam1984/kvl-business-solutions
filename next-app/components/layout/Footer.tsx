import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Github, Phone, Mail, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';
import { FooterCol } from './FooterCol';
import { NewsletterForm } from '@/components/widgets/NewsletterForm';
import { VisitorCounter } from '@/components/widgets/VisitorCounter';

export function Footer({ settings }: { settings?: any }) {
  const brandName = settings?.brandName || 'KVL Business Solutions';
  const phone     = settings?.phone     || '+91 99420 00413';
  const email     = settings?.email     || 'info@kvlbusinesssolutions.com';
  const address   = [settings?.addressLine1, settings?.addressLine2].filter(Boolean).join(', ') || 'Patna, Sultanganj, Bihar, India';
  const whatsapp  = (settings?.whatsapp || '919942000413').replace(/\D/g, '');
  const tagline   = settings?.tagline   || 'Custom software, ERP, CRM, and AI automation for businesses that run on real systems.';
  const showNewsletter = settings?.features?.newsletter !== false;

  const socials = [
    { Icon: Facebook,  url: settings?.social?.facebook,  label: 'Facebook' },
    { Icon: Instagram, url: settings?.social?.instagram, label: 'Instagram' },
    { Icon: Linkedin,  url: settings?.social?.linkedin,  label: 'LinkedIn' },
    { Icon: Youtube,   url: settings?.social?.youtube,   label: 'YouTube' },
    { Icon: Twitter,   url: settings?.social?.twitter,   label: 'Twitter / X' },
    { Icon: Github,    url: settings?.social?.github,    label: 'GitHub' },
  ].filter(s => !!s.url);

  const services = [
    { label: 'Website Development', href: '/services/website' },
    { label: 'Mobile Apps',         href: '/services/android' },
    { label: 'ERP',                 href: '/services/erp' },
    { label: 'CRM',                 href: '/services/crm' },
    { label: 'AI Automation',       href: '/services/ai' },
    { label: 'Custom Software',     href: '/services/custom-software' },
  ];

  const industries = [
    { label: 'Healthcare',    href: '/industries/hospitals' },
    { label: 'Education',     href: '/industries/schools' },
    { label: 'Real Estate',   href: '/industries/realestate' },
    { label: 'Construction',  href: '/industries/construction' },
    { label: 'Manufacturing', href: '/industries/manufacturing' },
    { label: 'Government',    href: '/industries/government' },
  ];

  const portfolio = [
    { label: 'VidYT',            href: '/projects/vidyt' },
    { label: 'AapKaPlot',        href: '/projects/aapkaplot' },
    { label: 'Gravity',          href: '/projects/gravity' },
    { label: 'Restro OS',        href: '/projects/restro-os' },
    { label: 'KVL CRM',          href: '/projects/kvl-crm' },
    { label: 'KVL GrowthOS',     href: '/projects/kvl-growthos' },
    { label: 'KVL Super AI',     href: '/projects/kvl-super-ai' },
    { label: 'KVL Intl. School', href: '/projects/kvl-international-school' },
    { label: 'Body Tracker',     href: '/projects/body-tracker' },
    { label: 'All Projects',     href: '/projects' },
    { label: 'Website Demos',    href: '/website-demos' },
  ];

  const company = [
    { label: 'About Us',    href: '/about' },
    { label: 'Reviews',     href: '/reviews' },
    { label: 'Patna Office', href: '/software-development-company-patna' },
    { label: 'Coverage Across India', href: '/software-development-company-india' },
    { label: 'Global Delivery', href: '/global' },
    { label: 'Brand',       href: '/brand' },
    { label: 'Careers',     href: '/careers' },
    { label: 'Pricing',     href: '/pricing' },
    { label: 'Mock Interview', href: '/mock-interview' },
  ];

  const resources = [
    { label: 'Blog',           href: '/blog' },
    { label: 'Knowledge Base', href: '/docs' },
    { label: 'Learn',          href: '/learn' },
    { label: 'AI Voice Demo',  href: '/voice' },
    { label: 'FAQ',            href: '/faq' },
    { label: 'Support',        href: '/support' },
    { label: 'Downloads',      href: '/downloads' },
  ];

  const legal = [
    { label: 'Privacy Policy',  href: '/privacy' },
    { label: 'Terms of Use',    href: '/terms' },
    { label: 'Refund Policy',   href: '/refund-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Sitemap',         href: '/site-map' },
  ];

  const contact = [
    { Icon: Phone,         label: phone,      href: `tel:${phone.replace(/\s/g, '')}` },
    { Icon: Mail,          label: email,      href: `mailto:${email}` },
    { Icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/${whatsapp}`, external: true },
    { Icon: MapPin,        label: address,    href: 'https://www.google.com/maps/search/?api=1&query=25.5941,85.1376', external: true },
  ];

  return (
    <footer className="sx-footer border-t border-line bg-footer">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2.75fr] lg:gap-14">

          {/* Brand, contact, socials, newsletter */}
          <div>
            <Link href="/" aria-label={`${brandName} — home`} className="inline-flex rounded-btn focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
              <span className="relative h-[43px] w-[138px] shrink-0 overflow-hidden rounded-lg bg-[#080910] ring-1 ring-gold/40">
                <Image src="/brand-logo.png" alt={brandName} fill sizes="138px" className="object-cover" />
              </span>
            </Link>
            <p className="mt-5 max-w-[340px] text-sm leading-relaxed text-text2">{tagline}</p>

            <ul className="mt-6 space-y-1">
              {contact.map(c => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="flex min-h-[44px] items-center gap-2.5 rounded-btn text-sm text-text2 transition-colors duration-base hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                  >
                    <c.Icon className="h-4 w-4 shrink-0 text-gold-text" aria-hidden />
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {socials.map(s => (
                  <Link
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-btn border border-line text-text2 transition-colors duration-base hover:border-gold hover:text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                  >
                    <s.Icon className="h-4 w-4" aria-hidden />
                  </Link>
                ))}
              </div>
            )}

            {showNewsletter && (
              <div className="mt-6 max-w-[340px]">
                <div className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-text">Stay Updated</div>
                <p className="mb-3 text-xs text-text2">Get product updates and business insights from KVL, sent occasionally.</p>
                <NewsletterForm />
              </div>
            )}
          </div>

          {/* Four link columns — accordions on mobile */}
          <div className="grid gap-x-8 lg:grid-cols-4">
            <FooterCol title="Services" links={services} />
            <FooterCol title="Industries" links={industries} />
            <FooterCol title="Portfolio" links={portfolio} />
            <FooterCol title="Company & Resources" links={[...company, ...resources]} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-text2 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved. Built in Patna, India.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5">
            {legal.map(item => (
              <li key={item.label}>
                <Link href={item.href} className="inline-flex min-h-[44px] items-center rounded-btn transition-colors duration-base hover:text-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <VisitorCounter />
        </div>
      </div>
      <div className="sx-only sx-mark" aria-hidden>
        <svg viewBox="0 0 720 250" preserveAspectRatio="xMidYMid meet" focusable="false">
          <defs>
            <linearGradient id="sx-gold-run" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#b8902a" />
              <stop offset="0.5" stopColor="#f6e7a6" />
              <stop offset="1" stopColor="#d4af37" />
            </linearGradient>
          </defs>
          <text className="sx-mark-base" x="360" y="212" textAnchor="middle" textLength="660" lengthAdjust="spacingAndGlyphs">KVL</text>
          <text className="sx-mark-run" x="360" y="212" textAnchor="middle" textLength="660" lengthAdjust="spacingAndGlyphs">KVL</text>
        </svg>
      </div>
    </footer>
  );
}
