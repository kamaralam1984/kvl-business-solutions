import { connectDB } from '@/lib/mongodb';
import { Referral } from '@/lib/models/Referral';
import { syncConversionCounts } from '@/lib/referrals';

export const dynamic = 'force-dynamic';

export default async function AdminReferralsPage() {
  await connectDB();
  const rows: any[] = await Referral.find({}).sort({ createdAt: -1 }).limit(500).lean();
  const referrals = await syncConversionCounts(rows);

  const totals = referrals.reduce(
    (acc, r) => ({
      clicks: acc.clicks + (r.clicksCount || 0),
      signups: acc.signups + (r.signupsCount || 0),
      conversions: acc.conversions + (r.conversionsCount || 0),
    }),
    { clicks: 0, signups: 0, conversions: 0 }
  );

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Referral Codes ({referrals.length})</h1>
        <div className="flex items-end gap-5">
          <div className="text-right">
            <div className="text-xs text-text2">Total Clicks</div>
            <div className="text-2xl font-extrabold">{totals.clicks}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text2">Total Signups</div>
            <div className="text-2xl font-extrabold text-blue-500">{totals.signups}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text2">Won Deals</div>
            <div className="text-2xl font-extrabold text-green-500">{totals.conversions}</div>
          </div>
        </div>
      </div>
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Referrer</th>
              <th className="p-3">Code</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Signups</th>
              <th className="p-3">Won Deals</th>
              <th className="p-3">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((r: any) => {
              const rate = r.signupsCount > 0 ? Math.round((r.conversionsCount / r.signupsCount) * 100) : 0;
              return (
                <tr key={r._id} className="border-b border-tint hover:bg-primary/5">
                  <td className="p-3 text-xs text-text2">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-3 font-semibold">{r.referrerEmail}</td>
                  <td className="p-3 font-mono text-xs">{r.code}</td>
                  <td className="p-3">{r.clicksCount}</td>
                  <td className="p-3">{r.signupsCount}</td>
                  <td className="p-3 text-green-500 font-semibold">{r.conversionsCount}</td>
                  <td className="p-3 text-text2 text-xs">{rate}%</td>
                </tr>
              );
            })}
            {referrals.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-text2">No referral codes yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
