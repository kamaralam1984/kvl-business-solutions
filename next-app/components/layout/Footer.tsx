'use client';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Phone, Mail, MapPin, ArrowUpRight, ArrowRight } from 'lucide-react';
import { NewsletterForm } from '@/components/widgets/NewsletterForm';

export function Footer({ settings }: { settings?: any }) {
  const brandName = settings?.brandName || 'KVL Business Solutions';
  const phone     = settings?.phone     || '+91 99420 00413';
  const email     = settings?.email     || 'info@kvlsolutions.in';
  const address   = [settings?.addressLine1, settings?.addressLine2].filter(Boolean).join(', ') || 'Pune, Maharashtra, India';
  const tagline   = settings?.tagline   || "India's next-generation enterprise solutions — Software, GPS, Civil & AI Business Technology.";
  const showNewsletter = settings?.features?.newsletter !== false;

  const socials = [
    { Icon: Facebook,  url: settings?.social?.facebook,  label: 'Facebook' },
    { Icon: Instagram, url: settings?.social?.instagram, label: 'Instagram' },
    { Icon: Linkedin,  url: settings?.social?.linkedin,  label: 'LinkedIn' },
    { Icon: Youtube,   url: settings?.social?.youtube,   label: 'YouTube' },
    { Icon: Twitter,   url: settings?.social?.twitter,   label: 'Twitter' },
  ];

  const services = [
    { label: 'Software Development', href: '/services' },
    { label: 'Website Development',  href: '/services' },
    { label: 'GPS Fleet Tracking',   href: '/services' },
    { label: 'Civil & Construction', href: '/services' },
    { label: 'Industrial Automation',href: '/services' },
    { label: 'CCTV & Security',      href: '/services' },
  ];

  const company = [
    { label: 'About Us',      href: '/about' },
    { label: 'Pricing',       href: '/pricing' },
    { label: 'Book a Demo',   href: '/book-demo' },
    { label: 'Industries',    href: '/industries' },
    { label: 'Careers',       href: '/careers' },
    { label: 'Contact',       href: '/contact' },
    { label: 'Support',       href: '/support' },
    { label: 'Knowledge Base',href: '/docs' },
  ];

  const legal = [
    { label: 'Privacy Policy',  href: '/privacy' },
    { label: 'Terms of Use',    href: '/terms' },
    { label: 'Refund Policy',   href: '/refund-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'FAQ',             href: '/faq' },
  ];

  return (
    <footer style={{ background: '#f4f3f1', position: 'relative', overflow: 'hidden' }}>

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
      <div className="relative z-10 border-b" style={{ borderColor: 'rgba(0,0,0,0.07)', background: '#ffffff' }}>
        <div className="container py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="eyebrow mb-2" style={{ color: 'rgba(0,0,0,0.45)' }}>Ready to grow?</div>
            <h3 className="font-display font-black text-[1.6rem] tracking-tight leading-none" style={{ color: '#0a0a0a' }}>
              Let&apos;s build something<br />
              <span style={{ color: '#c8a870' }}>extraordinary together.</span>
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
              style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'rgba(0,0,0,0.6)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.25)'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.6)'; }}
            >
              Book Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container relative z-10 py-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

        {/* Column 1: Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex flex-col leading-none mb-5 group">
            <span className="font-display font-black flex items-center" style={{ letterSpacing: '3px', fontSize: '20px', color: '#0a0a0a' }}>
              K
              <span style={{ color: '#c8a870', margin: '0 1px', fontSize: '7px', lineHeight: 1 }}>◆</span>
              V
              <span style={{ color: '#c8a870', margin: '0 1px', fontSize: '7px', lineHeight: 1 }}>◆</span>
              L
            </span>
            <span className="text-[6.5px] tracking-[3.5px] font-semibold uppercase mt-1" style={{ color: 'rgba(0,0,0,0.3)' }}>
              BUSINESS SOLUTIONS
            </span>
          </Link>

          <p className="text-[13px] leading-[1.8] mb-7" style={{ color: 'rgba(0,0,0,0.45)', maxWidth: 280 }}>
            {tagline}
          </p>

          {/* Contact items */}
          <div className="space-y-3 mb-7">
            {[
              { Icon: Phone,  text: phone },
              { Icon: Mail,   text: email },
              { Icon: MapPin, text: address },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#c8a870' }} />
                <span className="text-[12px] leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-wrap gap-2">
            {socials.map((s, i) => (
              <Link
                key={i}
                href={s.url || '#'}
                target={s.url ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-xl grid place-items-center border transition-all duration-200"
                style={{ borderColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,168,112,0.5)'; (e.currentTarget as HTMLElement).style.color = '#c8a870'; (e.currentTarget as HTMLElement).style.background = 'rgba(200,168,112,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <s.Icon className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Services */}
        <FooterCol title="Services" links={services} />

        {/* Column 3: Company */}
        <FooterCol title="Company" links={company} />

        {/* Column 4: Newsletter + Legal */}
        <div>
          {showNewsletter && (
            <div className="rounded-xl p-5 mb-7"
              style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' }}>
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: '#0a0a0a' }}>Stay Updated</div>
              <p className="text-[12px] mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.45)' }}>
                Get the latest business insights from KVL.
              </p>
              <NewsletterForm />
            </div>
          )}

          <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: 'rgba(0,0,0,0.5)' }}>
            Legal
          </div>
          <ul className="space-y-2.5">
            {legal.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[12px] transition-colors duration-200"
                  style={{ color: 'rgba(0,0,0,0.4)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'; }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px]" style={{ color: 'rgba(0,0,0,0.3)' }}>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-[12px]" style={{ color: 'rgba(0,0,0,0.3)' }}>
            Crafted with precision in India&nbsp;&nbsp;·&nbsp;&nbsp;
            <span style={{ color: '#c8a870', fontWeight: 600 }}>Made for Excellence</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: 'rgba(0,0,0,0.5)' }}>
        {title}
      </div>
      <ul className="space-y-3">
        {links.map(item => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-[13px] flex items-center gap-2 group transition-all duration-200"
              style={{ color: 'rgba(0,0,0,0.4)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'; }}
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
