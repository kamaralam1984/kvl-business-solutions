import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { ExportButton } from '@/components/admin/ExportButton';

export const dynamic = 'force-dynamic';

export default async function AdminLeads() {
  await connectDB();
  const leads = await Lead.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Leads ({leads.length})</h1>
        <ExportButton type="leads" />
      </div>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Service</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {leads.map((l: any) => (
              <tr key={l._id} className="border-b border-tint hover:bg-primary/5">
                <td className="p-3 text-xs text-text2">{new Date(l.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3 font-semibold">{l.name}</td>
                <td className="p-3 text-text2">{l.email}</td>
                <td className="p-3 text-text2">{l.phone}</td>
                <td className="p-3 text-text2 text-xs">{l.service || '—'}</td>
                <td className="p-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">{(l.status || 'new').toUpperCase()}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
