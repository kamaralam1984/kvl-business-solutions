import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { Ticket } from '@/lib/models/Ticket';
import { Quote } from '@/lib/models/Quote';
import { Order } from '@/lib/models/Order';
import { formatINR } from '@/lib/utils';
import { Users, Ticket as TicketIcon, FileText, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  await connectDB();
  const [leads, tickets, quotes, orders, revenue] = await Promise.all([
    Lead.countDocuments({}),
    Ticket.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
    Quote.countDocuments({}),
    Order.countDocuments({ status: 'paid' }),
    Order.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);
  const totalRevenue = revenue[0]?.total || 0;
  const stats = [
    { label: 'Total Leads', val: leads, Icon: Users, c: '#3b82f6' },
    { label: 'Open Tickets', val: tickets, Icon: TicketIcon, c: '#ef4444' },
    { label: 'Quote Requests', val: quotes, Icon: FileText, c: '#f97316' },
    { label: 'Paid Orders', val: orders, Icon: Package, c: '#22c55e' },
  ];
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-1">Admin Dashboard</h1>
      <p className="text-text2 mb-8">Overview of KVL operations</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="card-base p-5">
            <div className="flex justify-between mb-2"><span className="text-xs text-text2">{s.label}</span><s.Icon className="w-5 h-5" style={{ color: s.c }} /></div>
            <div className="text-3xl font-extrabold">{s.val}</div>
          </div>
        ))}
      </div>
      <div className="card-base p-6">
        <div className="text-xs text-text2">Total Revenue</div>
        <div className="text-4xl font-extrabold text-green-500">{formatINR(totalRevenue)}</div>
      </div>
    </div>
  );
}
