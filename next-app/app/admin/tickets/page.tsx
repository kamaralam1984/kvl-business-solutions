import { connectDB } from '@/lib/mongodb';
import { Ticket } from '@/lib/models/Ticket';
import { ExportButton } from '@/components/admin/ExportButton';

export const dynamic = 'force-dynamic';

const priorityColor: Record<string, string> = {
  low: 'bg-slate-500/20 text-slate-500',
  medium: 'bg-yellow-500/20 text-yellow-500',
  high: 'bg-orange-500/20 text-orange-500',
  critical: 'bg-red-500/20 text-red-500',
};

export default async function AdminTickets() {
  await connectDB();
  const tickets = await Ticket.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Tickets ({tickets.length})</h1>
        <ExportButton type="tickets" />
      </div>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Product</th><th className="p-3">Priority</th><th className="p-3">Status</th><th className="p-3">Description</th></tr>
          </thead>
          <tbody>
            {tickets.map((t: any) => (
              <tr key={t._id} className="border-b border-tint hover:bg-primary/5">
                <td className="p-3 text-xs text-text2">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3"><div className="font-semibold">{t.name}</div><div className="text-xs text-text2">{t.email}</div></td>
                <td className="p-3 text-text2 text-xs">{t.product || '—'}</td>
                <td className="p-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor[t.priority] || ''}`}>{t.priority.toUpperCase()}</span></td>
                <td className="p-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">{t.status.toUpperCase()}</span></td>
                <td className="p-3 text-xs text-text2 max-w-xs truncate">{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
