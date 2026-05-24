import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { formatINR } from '@/lib/utils';
import { ArrowLeft, Download, Copy, Cloud, Server } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  await connectDB();
  const order: any = await Order.findOne({ orderId: params.id }).lean();
  if (!order) notFound();
  if (order.email !== session?.user?.email && (session?.user as any)?.role !== 'admin') notFound();

  const statusColor: Record<string, string> = {
    created: 'bg-yellow-500/20 text-yellow-500',
    paid: 'bg-green-500/20 text-green-500',
    failed: 'bg-red-500/20 text-red-500',
    refunded: 'bg-slate-500/20 text-slate-500',
  };

  return (
    <div className="container py-10 max-w-3xl">
      <Link href="/dashboard" className="text-sm text-text2 hover:text-primary inline-flex items-center gap-1 mb-4"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
      <div className="card-base p-7">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs uppercase text-text2">Order ID</div>
            <div className="text-2xl font-extrabold font-mono">{order.orderId}</div>
            <div className="text-xs text-text2 mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[order.status] || ''}`}>{order.status.toUpperCase()}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="surface-tint p-4 rounded-lg">
            <div className="text-xs text-text2 mb-1">Product</div>
            <div className="font-bold">{order.productName}</div>
            <div className="text-xs text-text2 mt-1 flex gap-1 items-center">
              {order.hosting === 'cloud' ? <Cloud className="w-3 h-3" /> : <Server className="w-3 h-3" />} {order.hosting}
            </div>
          </div>
          <div className="surface-tint p-4 rounded-lg">
            <div className="text-xs text-text2 mb-1">Amount Paid</div>
            <div className="font-bold text-primary">{formatINR(order.amount)}</div>
            {order.gstAmount > 0 && <div className="text-xs text-text2 mt-1">incl. {formatINR(order.gstAmount)} GST</div>}
          </div>
        </div>

        {order.licenseKey && (
          <div className="border border-primary/30 bg-primary/5 p-4 rounded-lg mb-6">
            <div className="text-xs text-text2 mb-1">License Key</div>
            <div className="flex items-center gap-2 justify-between">
              <code className="font-mono text-sm font-bold">{order.licenseKey}</code>
              <button className="btn btn-ghost btn-sm" title="Copy"><Copy className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {order.razorpayPaymentId && (
          <div className="text-xs text-text2 mb-6">
            Payment ID: <code className="font-mono">{order.razorpayPaymentId}</code>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          {order.status === 'paid' && (
            <a href={`/api/invoice/${order.orderId}`} target="_blank" rel="noopener" className="btn btn-primary">
              <Download className="w-4 h-4" /> Download Invoice
            </a>
          )}
          <Link href="/support" className="btn btn-ghost">Need Help?</Link>
        </div>
      </div>
    </div>
  );
}
