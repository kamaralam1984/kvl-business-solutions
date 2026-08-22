'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Github, Phone, Mail, MapPin, MessageCircle, ArrowUpRight, ArrowRight } from 'lucide-react';
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
    { label: 'All Projects',     href: '/projects' },
    { label: 'Website Demos',    href: '/website-demos' },
  ];

  const company = [
    { label: 'About Us',    href: '/about' },
    { label: 'Reviews',     href: '/reviews' },
    { label: 'Patna Office', href: '/software-development-company-patna' },
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
  ];

  return (
    <footer style={{ background: 'rgb(var(--bg-3))', position: 'relative', overflow: 'hidden' }}>

      {/* Premium top gold line */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(200,168,112,0.5) 25%, rgba(200,168,112,0.85) 50%, rgba(200,168,112,0.5) 75%, transparent 100%)',
      }} />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden style={{
        background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,168,112,0.05) 0%, transparent 70%)',
      }} />

      {/* CTA banner strip */}
      <div className="relative z-10 border-b" style={{ borderColor: 'rgba(var(--border) / 0.07)', background: 'rgb(var(--bg-2))' }}>
        <div className="container py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="eyebrow mb-2" style={{ color: 'rgba(var(--text) / 0.45)' }}>Have a project in mind?</div>
            <h3 className="font-display font-black text-[1.6rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>
              Tell us what you&apos;re building.<br />
              <span style={{ color: '#c8a870' }}>We&apos;ll tell you how.</span>
            </h3>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #c8a870 0%, #d4b880 100%)',
                color: '#0a0a0a',
                boxShadow: '0 4px 20px rgba(200,168,112,0.3)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 35px rgba(200,168,112,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(200,168,112,0.3)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              Talk to us <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/book-demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold border transition-all duration-200"
              style={{ borderColor: 'rgba(var(--border) / 0.15)', color: 'rgba(var(--text) / 0.6)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--border) / 0.25)'; (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--border) / 0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(var(--text) / 0.6)'; }}
            >
              Book Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Brand + Newsletter row */}
      <div className="container relative z-10 pt-16 pb-10 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
        <div>
          <Link href="/" className="inline-flex mb-5 group">
            <span
              className="relative rounded-lg overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ width: 138, height: 43, boxShadow: '0 0 0 1px rgba(200,168,112,0.35), 0 2px 10px rgba(0,0,0,0.15)' }}
            >
              <Image src="/brand-logo.png" alt="KVL Business Solutions" fill sizes="138px" className="object-cover" />
            </span>
          </Link>

          <p className="text-[13px] leading-[1.8] mb-6" style={{ color: 'rgba(var(--text) / 0.45)', maxWidth: 340 }}>
            {tagline}
          </p>

          <div className="flex flex-wrap gap-2">
            {socials.map((s, i) => (
              <Link
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-xl grid place-items-center border transition-all duration-200"
                style={{ borderColor: 'rgba(var(--border) / 0.1)', color: 'rgb(var(--text-3))' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,168,112,0.5)'; (e.currentTarget as HTMLElement).style.color = '#c8a870'; (e.currentTarget as HTMLElement).style.background = 'rgba(200,168,112,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--border) / 0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text-3))'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <s.Icon className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>

        {showNewsletter && (
          <div className="rounded-xl p-5" style={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.08)' }}>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: 'rgb(var(--text))' }}>Stay Updated</div>
            <p className="text-[12px] mb-4 leading-relaxed" style={{ color: 'rgba(var(--text) / 0.45)' }}>
              Get product updates and business insights from KVL, sent occasionally.
            </p>
            <NewsletterForm />
          </div>
        )}
      </div>

      {/* Link columns */}
      <div className="container relative z-10 pb-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
        <FooterCol title="Services" links={services} />
        <FooterCol title="Industries" links={industries} />
        <FooterCol title="Portfolio" links={portfolio} />
        <FooterCol title="Company" links={company} />
        <FooterCol title="Resources" links={resources} />

        {/* Contact column */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: 'rgba(var(--text) / 0.5)' }}>
            Contact
          </div>
          <ul className="space-y-3">
            <li>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-start gap-2.5 text-[13px] transition-colors duration-200" style={{ color: 'rgba(var(--text) / 0.55)' }}>
                <Phone className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#c8a870' }} />
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="flex items-start gap-2.5 text-[13px] transition-colors duration-200" style={{ color: 'rgba(var(--text) / 0.55)' }}>
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#c8a870' }} />
                {email}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-start gap-2.5 text-[13px] transition-colors duration-200" style={{ color: 'rgba(var(--text) / 0.55)' }}>
                <MessageCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#c8a870' }} />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=25.5941,85.1376"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 text-[13px] transition-colors duration-200"
                style={{ color: 'rgba(var(--text) / 0.55)' }}
              >
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#c8a870' }} />
                {address}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10" style={{ borderTop: '1px solid rgba(var(--border) / 0.08)' }}>
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px]" style={{ color: 'rgb(var(--text-3))' }}>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <VisitorCounter />
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            {legal.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[12px] transition-colors duration-200"
                  style={{ color: 'rgb(var(--text-3))' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text-3))'; }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-[12px]" style={{ color: 'rgb(var(--text-3))' }}>
            Built in Patna, India
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: 'rgba(var(--text) / 0.5)' }}>
        {title}
      </div>
      <ul className="space-y-3">
        {links.map(item => (
          <li key={item.label}>
            <Link
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className="text-[13px] flex items-center gap-2 group transition-all duration-200"
              style={{ color: 'rgb(var(--text-3))' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text))'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(var(--text-3))'; }}
            >
              <ArrowRight className="w-3 h-3 shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" style={{ color: '#c8a870' }} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
