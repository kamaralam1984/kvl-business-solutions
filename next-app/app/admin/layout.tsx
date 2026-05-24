import Link from 'next/link';
import { LayoutDashboard, Users, Ticket, FileText, Package, Box, UserCog, Mail, Activity, Tag, Calendar, Star } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/admin/leads', label: 'Leads', Icon: Users },
    { href: '/admin/tickets', label: 'Tickets', Icon: Ticket },
    { href: '/admin/quotes', label: 'Quotes', Icon: FileText },
    { href: '/admin/bookings', label: 'Bookings', Icon: Calendar },
    { href: '/admin/orders', label: 'Orders', Icon: Package },
    { href: '/admin/products', label: 'Products', Icon: Box },
    { href: '/admin/coupons', label: 'Coupons', Icon: Tag },
    { href: '/admin/reviews', label: 'Reviews', Icon: Star },
    { href: '/admin/users', label: 'Users', Icon: UserCog },
    { href: '/admin/subscribers', label: 'Subscribers', Icon: Mail },
    { href: '/admin/activity', label: 'Activity', Icon: Activity },
  ];
  return (
    <div className="grid grid-cols-[220px_1fr] min-h-[calc(100vh-160px)]">
      <aside className="border-r border-tint bg-app2 p-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-text2 mb-4">Admin</h2>
        <nav className="space-y-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-all">
              <l.Icon className="w-4 h-4" /> {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-8">{children}</main>
    </div>
  );
}
