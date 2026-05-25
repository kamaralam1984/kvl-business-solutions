import Link from 'next/link';
import { LayoutDashboard, Users, Ticket, FileText, Package, Box, UserCog, Mail, Activity, Tag, Calendar, Star, Settings, Megaphone, Globe, Monitor, Cpu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const sections = [
    {
      label: 'Overview',
      links: [
        { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
        { href: '/admin/activity', label: 'Activity', Icon: Activity },
        { href: '/admin/api-usage', label: 'API Usage', Icon: Cpu },
      ],
    },
    {
      label: 'Website Control',
      links: [
        { href: '/admin/site-settings', label: 'Site Settings', Icon: Settings },
        { href: '/admin/banners', label: 'Banners', Icon: Megaphone },
        { href: '/admin/demos', label: 'Website Demos', Icon: Monitor },
      ],
    },
    {
      label: 'Sales',
      links: [
        { href: '/admin/leads', label: 'Leads', Icon: Users },
        { href: '/admin/quotes', label: 'Quotes', Icon: FileText },
        { href: '/admin/bookings', label: 'Bookings', Icon: Calendar },
        { href: '/admin/orders', label: 'Orders', Icon: Package },
      ],
    },
    {
      label: 'Catalog',
      links: [
        { href: '/admin/products', label: 'Products', Icon: Box },
        { href: '/admin/coupons', label: 'Coupons', Icon: Tag },
        { href: '/admin/reviews', label: 'Reviews', Icon: Star },
      ],
    },
    {
      label: 'Support & Users',
      links: [
        { href: '/admin/tickets', label: 'Tickets', Icon: Ticket },
        { href: '/admin/users', label: 'Users', Icon: UserCog },
        { href: '/admin/subscribers', label: 'Subscribers', Icon: Mail },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-[240px_1fr] min-h-[calc(100vh-160px)]">
      <aside className="border-r border-tint bg-app2 p-4 overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 text-xs text-text2 hover:text-primary mb-4 pb-3 border-b border-tint">
          <Globe className="w-3.5 h-3.5" /> View site
        </Link>
        {sections.map(s => (
          <div key={s.label} className="mb-4">
            <h2 className="font-bold text-[10px] uppercase tracking-wider text-text2 mb-1.5 px-3">{s.label}</h2>
            <nav className="space-y-0.5">
              {s.links.map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-all">
                  <l.Icon className="w-4 h-4" /> {l.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </aside>
      <main className="p-8">{children}</main>
    </div>
  );
}
