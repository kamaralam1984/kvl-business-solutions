import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';

export const dynamic = 'force-dynamic';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  confirmed: 'bg-blue-500/20 text-blue-500',
  completed: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-slate-500/20 text-slate-500',
};

export default async function AdminBookingsPage() {
  await connectDB();
  const bookings: any[] = await Booking.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4">Demo Bookings ({bookings.length})</h1>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Contact</th><th className="p-3">Product</th><th className="p-3">Preferred</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-b border-tint hover:bg-primary/5">
                <td className="p-3 text-xs text-text2">{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-3"><div className="font-semibold">{b.name}</div>{b.company && <div className="text-xs text-text2">{b.company}</div>}</td>
                <td className="p-3 text-xs"><div>{b.email}</div><div className="text-text2">{b.phone}</div></td>
                <td className="p-3 text-xs">{b.product || '—'}</td>
                <td className="p-3 text-xs">{b.preferredDate ? `${new Date(b.preferredDate).toLocaleDateString('en-IN')} ${b.preferredTime || ''}` : 'Flexible'}</td>
                <td className="p-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[b.status] || ''}`}>{b.status.toUpperCase()}</span></td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-text2">No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
