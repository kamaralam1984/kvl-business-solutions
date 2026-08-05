import { connectDB } from '@/lib/mongodb';
import { Subscriber } from '@/lib/models/Subscriber';
import { ExportButton } from '@/components/admin/ExportButton';
import { DeleteSubscriberButton } from '@/components/admin/DeleteSubscriberButton';

export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage() {
  await connectDB();
  const subscribers: any[] = await Subscriber.find({}).sort({ createdAt: -1 }).limit(500).lean();
  const active = subscribers.filter(s => s.active).length;

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Newsletter Subscribers ({subscribers.length})</h1>
        <div className="flex items-end gap-4">
          <ExportButton type="subscribers" />
          <div className="text-right">
            <div className="text-xs text-text2">Active</div>
            <div className="text-2xl font-extrabold text-green-500">{active}</div>
          </div>
        </div>
      </div>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Date</th><th className="p-3">Email</th><th className="p-3">Source</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {subscribers.map(s => (
              <tr key={s._id} className="border-b border-tint hover:bg-primary/5">
                <td className="p-3 text-xs text-text2">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3 font-semibold">{s.email}</td>
                <td className="p-3 text-xs text-text2">{s.source}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.active ? 'bg-green-500/20 text-green-500' : 'bg-slate-500/20 text-slate-500'}`}>
                    {s.active ? 'ACTIVE' : 'UNSUBSCRIBED'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <DeleteSubscriberButton id={s._id.toString()} email={s.email} />
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-text2">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
