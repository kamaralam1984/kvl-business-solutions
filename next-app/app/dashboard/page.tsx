import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { formatINR } from '@/lib/utils';
import Link from 'next/link';
import { Package, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const orders = await Order.find({ email: session?.user?.email }).sort({ createdAt: -1 }).lean();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-extrabold mb-1">Welcome, {session?.user?.name || session?.user?.email}</h1>
      <p className="text-text2 mb-8">Your KVL dashboard</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card-base p-5"><Package className="w-6 h-6 text-primary mb-2" /><div className="text-2xl font-extrabold">{orders.length}</div><div className="text-xs text-text2">Orders</div></div>
        <div className="card-base p-5"><ShoppingBag className="w-6 h-6 text-green-500 mb-2" /><div className="text-2xl font-extrabold">{orders.filter((o: any) => o.status === 'paid').length}</div><div className="text-xs text-text2">Active Licenses</div></div>
        <div className="card-base p-5"><div className="text-2xl font-extrabold">{formatINR(orders.filter((o: any) => o.status === 'paid').reduce((s: number, o: any) => s + (o.amount || 0), 0))}</div><div className="text-xs text-text2">Total Spent</div></div>
      </div>

      <h2 className="text-xl font-bold mb-3">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="card-base p-8 text-center">
          <p className="text-text2 mb-4">No orders yet. Browse our software catalog.</p>
          <Link href="/software" className="btn btn-primary">View Software</Link>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
              <tr><th className="p-3">Product</th><th className="p-3">Order ID</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">License</th></tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.orderId} className="border-b border-tint">
                  <td className="p-3 font-semibold">{o.productName}</td>
                  <td className="p-3 text-text2">{o.orderId}</td>
                  <td className="p-3">{formatINR(o.amount)}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{o.status.toUpperCase()}</span></td>
                  <td className="p-3 text-text2 text-xs font-mono">{o.licenseKey || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
