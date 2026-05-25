'use client';
import { useEffect, useState } from 'react';
import { Search, ExternalLink, IndianRupee, ShoppingCart, TrendingUp, XCircle } from 'lucide-react';
import Link from 'next/link';
import { ExportButton } from '@/components/admin/ExportButton';
import { RefundButton } from '@/components/admin/RefundButton';

const STATUS_COLOR: Record<string, string> = {
  created: 'bg-yellow-500/20 text-yellow-500',
  paid: 'bg-green-500/20 text-green-500',
  failed: 'bg-red-500/20 text-red-500',
  refunded: 'bg-slate-500/20 text-slate-500',
};

const fmt = (n: number) => `₹${(n / 100).toLocaleString('en-IN')}`;

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async (search = q, status = statusFilter) => {
    const p = new URLSearchParams();
    if (search) p.set('q', search);
    if (status) p.set('status', status);
    const d = await fetch(`/api/admin/orders?${p}`).then(r => r.json());
    if (d.ok) { setOrders(d.orders); setStats(d.stats); }
  };

  useEffect(() => { load(); }, []);

  const filterBy = (status: string) => { setStatusFilter(status); load(q, status); };

  const statCards = [
    { label: 'Total Revenue', value: fmt(stats.revenue || 0), icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Today Revenue', value: fmt(stats.todayRevenue || 0), icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Paid Orders', value: stats.paid || 0, icon: ShoppingCart, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending / Failed', value: `${stats.pending || 0} / ${stats.failed || 0}`, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="card-base p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div><div className="text-xl font-extrabold">{s.value}</div><div className="text-xs text-text2">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {['', 'paid', 'created', 'failed', 'refunded'].map(s => (
            <button key={s} onClick={() => filterBy(s)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${statusFilter === s ? 'bg-primary text-white' : 'surface-tint text-text2 hover:text-text'}`}>
              {s ? s.toUpperCase() : `ALL (${stats.total || 0})`}
              {s === 'paid' && stats.paid ? ` (${stats.paid})` : ''}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={e => { e.preventDefault(); load(); }} className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search order ID, email…" className="form-control pl-9 w-64" />
          </form>
          <ExportButton type="orders" />
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint bg-surface">
            <tr>
              <th className="p-3">Date</th><th className="p-3">Order ID</th><th className="p-3">Customer</th>
              <th className="p-3">Product</th><th className="p-3">Amount</th><th className="p-3">Hosting</th>
              <th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.orderId} className="border-b border-tint hover:bg-primary/5 transition-colors">
                <td className="p-3 text-xs text-text2 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3 text-xs font-mono">
                  <Link href={`/dashboard/orders/${o.orderId}`} target="_blank" className="hover:text-primary inline-flex items-center gap-1 text-text2">
                    {o.orderId?.slice(-8)} <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
                <td className="p-3 text-xs">
                  <div className="font-medium">{o.billing?.name || o.email}</div>
                  <div className="text-text2">{o.email}</div>
                </td>
                <td className="p-3 font-semibold text-sm">{o.productName}</td>
                <td className="p-3 font-bold text-green-500 whitespace-nowrap">{fmt(o.amount)}</td>
                <td className="p-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.hosting === 'cloud' ? 'bg-blue-500/20 text-blue-500' : 'bg-orange-500/20 text-orange-500'}`}>
                    {o.hosting?.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status] || ''}`}>
                    {o.status?.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {o.status === 'paid' && <RefundButton orderId={o.orderId} />}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="p-12 text-center">
                <ShoppingCart className="w-10 h-10 text-text2 mx-auto mb-2 opacity-40" />
                <p className="text-text2 font-medium">No orders yet</p>
                <p className="text-xs text-text2 mt-1">Orders will appear here once customers make purchases</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
