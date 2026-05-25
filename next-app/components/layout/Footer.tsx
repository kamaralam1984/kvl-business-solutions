import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { NewsletterForm } from '@/components/widgets/NewsletterForm';

export function Footer({ settings }: { settings?: any }) {
  const brandName = settings?.brandName || 'KVL Business Solutions';
  const phone = settings?.phone || '+91 90000 00000';
  const email = settings?.email || 'info@kvlsolutions.in';
  const address = [settings?.addressLine1, settings?.addressLine2].filter(Boolean).join(', ') || 'Pune, India';
  const tagline = settings?.tagline || "India's next-generation business solutions company offering software, GPS, civil, automation and enterprise services.";
  const showNewsletter = settings?.features?.newsletter !== false;

  const socials = [
    { Icon: Facebook, url: settings?.social?.facebook, label: 'Facebook' },
    { Icon: Instagram, url: settings?.social?.instagram, label: 'Instagram' },
    { Icon: Linkedin, url: settings?.social?.linkedin, label: 'LinkedIn' },
    { Icon: Youtube, url: settings?.social?.youtube, label: 'YouTube' },
    { Icon: Twitter, url: settings?.social?.twitter, label: 'Twitter' },
  ];

  return (
    <footer className="bg-app2 border-t border-tint pt-16 pb-6">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        <div>
          <div className="font-display font-black text-2xl tracking-[2px] flex items-center gap-0.5 gradient-text">
            K<span className="w-1.5 h-1.5 bg-primary rounded-full inline-block" />V<span className="w-1.5 h-1.5 bg-primary rounded-full inline-block" />L
          </div>
          <div className="text-[9px] tracking-[3px] text-text2 mt-1 font-semibold">BUSINESS SOLUTIONS</div>
          <p className="text-sm text-text2 my-4">{tagline}</p>
          <div className="flex gap-2">
            {socials.map((s, i) => (
              <Link key={i} href={s.url || '#'} target={s.url ? '_blank' : undefined} rel="noopener noreferrer" aria-label={s.label} className="w-9 h-9 rounded-full border border-tint grid place-items-center text-text2 hover:bg-primary hover:text-white transition-all">
                <s.Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-bold mb-4">Services</h5>
          <ul className="space-y-2 text-sm text-text2">
            <li><Link href="/services">Software Development</Link></li>
            <li><Link href="/services">Website Development</Link></li>
            <li><Link href="/services">GPS Tracking</Link></li>
            <li><Link href="/services">Civil Work</Link></li>
            <li><Link href="/services">Industrial Automation</Link></li>
            <li><Link href="/services">CCTV &amp; Security</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-4">Company</h5>
          <ul className="space-y-2 text-sm text-text2">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/book-demo">Book a Demo</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/industries">Industries</Link></li>
            <li><Link href="/clients">Clients</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/support">Support</Link></li>
            <li><Link href="/docs">Knowledge Base</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-4">Contact</h5>
          <ul className="space-y-2 text-sm text-text2 mb-5">
            <li className="flex gap-2"><Phone className="w-4 h-4 text-primary" /> {phone}</li>
            <li className="flex gap-2"><Mail className="w-4 h-4 text-primary" /> {email}</li>
            <li className="flex gap-2"><MapPin className="w-4 h-4 text-primary" /> {address}</li>
          </ul>
          {showNewsletter && (
            <>
              <h5 className="font-bold mb-2 text-sm">Newsletter</h5>
              <NewsletterForm />
            </>
          )}
        </div>
      </div>

      <div className="container border-t border-tint pt-5 flex flex-col gap-3">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-text2 justify-center">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          <Link href="/refund-policy" className="hover:text-primary">Refund Policy</Link>
          <Link href="/shipping-policy" className="hover:text-primary">Shipping Policy</Link>
          <Link href="/faq" className="hover:text-primary">FAQ</Link>
          <Link href="/search" className="hover:text-primary">Search</Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-between text-xs text-text2 gap-2">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <p>Crafted with ❤ in India</p>
        </div>
      </div>
    </footer>
  );
}
