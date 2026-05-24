import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { formatINR } from '@/lib/utils';
import { ExportButton } from '@/components/admin/ExportButton';
import { RefundButton } from '@/components/admin/RefundButton';
import { ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusColor: Record<string, string> = {
  created: 'bg-yellow-500/20 text-yellow-500',
  paid: 'bg-green-500/20 text-green-500',
  failed: 'bg-red-500/20 text-red-500',
  refunded: 'bg-slate-500/20 text-slate-500',
};

export default async function AdminOrders() {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(200).lean();
  const total = orders.filter((o: any) => o.status === 'paid').reduce((s: number, o: any) => s + (o.amount || 0), 0);
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-extrabold">Orders ({orders.length})</h1>
        </div>
        <div className="flex items-end gap-4">
          <ExportButton type="orders" />
          <div className="text-right"><div className="text-xs text-text2">Total Revenue</div><div className="text-2xl font-extrabold text-green-500">{formatINR(total)}</div></div>
        </div>
      </div>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Date</th><th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Product</th><th className="p-3">Amount</th><th className="p-3">Hosting</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.orderId} className="border-b border-tint hover:bg-primary/5">
                <td className="p-3 text-xs text-text2">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3 text-xs font-mono text-text2"><Link href={`/dashboard/orders/${o.orderId}`} className="hover:text-primary inline-flex items-center gap-1">{o.orderId} <ExternalLink className="w-3 h-3" /></Link></td>
                <td className="p-3 text-text2">{o.email}</td>
                <td className="p-3 font-semibold">{o.productName}</td>
                <td className="p-3 font-bold">{formatINR(o.amount)}</td>
                <td className="p-3 text-xs">{o.hosting}</td>
                <td className="p-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[o.status] || ''}`}>{o.status.toUpperCase()}</span></td>
                <td className="p-3 text-right">
                  {o.status === 'paid' && <RefundButton orderId={o.orderId} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
