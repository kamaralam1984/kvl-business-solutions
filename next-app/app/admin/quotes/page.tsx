import { connectDB } from '@/lib/mongodb';
import { Quote } from '@/lib/models/Quote';
import { formatINR } from '@/lib/utils';
import { ExportButton } from '@/components/admin/ExportButton';

export const dynamic = 'force-dynamic';

export default async function AdminQuotes() {
  await connectDB();
  const quotes = await Quote.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Quote Requests ({quotes.length})</h1>
        <ExportButton type="quotes" />
      </div>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Date</th><th className="p-3">Contact</th><th className="p-3">Type</th><th className="p-3">Scope</th><th className="p-3">Timeline</th><th className="p-3">Estimate</th></tr>
          </thead>
          <tbody>
            {quotes.map((q: any) => (
              <tr key={q._id} className="border-b border-tint hover:bg-primary/5">
                <td className="p-3 text-xs text-text2">{new Date(q.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3"><div className="font-semibold">{q.contact?.name}</div><div className="text-xs text-text2">{q.contact?.email}</div></td>
                <td className="p-3 text-text2">{q.type}</td>
                <td className="p-3 text-text2">{q.scope}</td>
                <td className="p-3 text-text2">{q.timeline}</td>
                <td className="p-3 font-semibold text-primary">{formatINR(q.estimateLow)} – {formatINR(q.estimateHigh)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
