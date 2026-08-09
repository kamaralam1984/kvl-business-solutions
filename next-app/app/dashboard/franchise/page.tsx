import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Franchise } from '@/lib/models/Franchise';
import { Order } from '@/lib/models/Order';
import { Lead } from '@/lib/models/Lead';
import { Deal } from '@/lib/models/Deal';
import { getOrCreateReferral } from '@/lib/referrals';
import { formatINR } from '@/lib/utils';
import Link from 'next/link';
import { Building2, TrendingUp, Target, Users, MapPin, IndianRupee, Mail, Link2 } from 'lucide-react';
import { CopyReferralLink } from '@/components/dashboard/CopyReferralLink';

export const dynamic = 'force-dynamic';

export default async function FranchisePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  await connectDB();
  let franchise: any = await Franchise.findOne({ ownerEmail: session.user.email }).lean();

  if (!franchise) {
    return (
      <div className="py-10 max-w-3xl mx-auto">
        <div className="card-base p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto text-primary mb-3" />
          <h1 className="text-2xl font-extrabold mb-2">Franchise Dashboard</h1>
          <p className="text-text2 text-sm mb-6">
            You&apos;re not registered as a franchise yet. Apply to become a KVL franchise partner — get exclusive territory, commissions, and full software support.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: '💰', title: '10% commission', desc: 'on every sale' },
              { icon: '🏆', title: 'Exclusive city', desc: 'territory rights' },
              { icon: '📚', title: 'Free training', desc: '+ marketing support' },
            ].map(p => (
              <div key={p.title} className="surface-tint p-4 rounded-lg">
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="font-bold text-sm">{p.title}</div>
                <div className="text-xs text-text2 mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
          <Link href="/contact?topic=franchise" className="btn btn-primary"><Mail className="w-4 h-4" /> Apply for Franchise</Link>
        </div>
      </div>
    );
  }

  // Franchise stats — scoped to leads/orders this partner actually referred,
  // via the same referral-code mechanism the standalone referral program
  // uses (lib/referrals.ts). Reusing it here means a franchise partner's
  // link is the same one their /dashboard/referrals page shows — one code,
  // one attribution trail — instead of every franchise partner seeing every
  // order sitewide (the previous, incorrect behavior).
  const referral = await getOrCreateReferral(session.user.email);
  const leads: any[] = await Lead.find({ referralCode: referral.code }).lean();
  const leadIds = leads.map((l: any) => l._id);
  const dealIds = leads.map((l: any) => l.dealId).filter(Boolean);
  const [orders, deals]: [any[], any[]] = await Promise.all([
    Order.find({ status: 'paid', lead: { $in: leadIds } }).lean(),
    Deal.find({ _id: { $in: dealIds } }).lean(),
  ]);

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
  const referralLink = `${SITE}/?ref=${referral.code}`;

  const revenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
  const commission = Math.round(revenue * (franchise.commissionRate / 100));
  const progress = Math.min(100, (revenue / franchise.monthlyTarget) * 100);

  return (
    <div className="py-10">
      <div className="flex justify-between items-end mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2"><Building2 className="w-7 h-7 text-primary" /> {franchise.name}</h1>
          <p className="text-text2 text-sm mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {franchise.city}, {franchise.state} · {franchise.status === 'active' ? '🟢 Active' : '⏸ Paused'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/crm" className="btn btn-ghost text-xs"><Users className="w-3.5 h-3.5" /> CRM</Link>
          <Link href="/dashboard/analytics" className="btn btn-ghost text-xs"><TrendingUp className="w-3.5 h-3.5" /> Analytics</Link>
        </div>
      </div>

      {/* Referral link — every lead/order that comes through this link is what "revenue" below is scoped to */}
      <div className="card-base p-4 mb-6 flex items-center gap-3 flex-wrap">
        <Link2 className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold">Your franchise link</div>
          <div className="text-xs text-text2 font-mono truncate">{referralLink}</div>
        </div>
        <CopyReferralLink link={referralLink} />
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <div className="card-base p-5">
          <IndianRupee className="w-5 h-5 text-primary mb-2" />
          <div className="text-2xl font-extrabold">{formatINR(revenue)}</div>
          <div className="text-xs text-text2">Total revenue</div>
        </div>
        <div className="card-base p-5">
          <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
          <div className="text-2xl font-extrabold text-green-500">{formatINR(commission)}</div>
          <div className="text-xs text-text2">Your commission ({franchise.commissionRate}%)</div>
        </div>
        <div className="card-base p-5">
          <Users className="w-5 h-5 text-orange-500 mb-2" />
          <div className="text-2xl font-extrabold text-orange-500">{leads.length}</div>
          <div className="text-xs text-text2">Total leads</div>
        </div>
        <div className="card-base p-5">
          <Target className="w-5 h-5 text-blue-500 mb-2" />
          <div className="text-2xl font-extrabold text-blue-500">{deals.length}</div>
          <div className="text-xs text-text2">Active deals</div>
        </div>
      </div>

      {/* Monthly target progress */}
      <div className="card-base p-5 mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="font-bold">Monthly target</h3>
            <p className="text-xs text-text2">Target: {formatINR(franchise.monthlyTarget)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-primary">{Math.round(progress)}%</div>
            <div className="text-xs text-text2">{formatINR(revenue)} / {formatINR(franchise.monthlyTarget)}</div>
          </div>
        </div>
        <div className="h-3 surface-tint rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-text2 mt-2">
          {progress >= 100 ? '🎉 Target achieved! Bonus eligible.' : `${formatINR(franchise.monthlyTarget - revenue)} to go this month`}
        </div>
      </div>

      {/* Recent orders */}
      <h2 className="text-lg font-bold mb-3">Recent orders ({orders.length})</h2>
      <div className="card-base overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-text2 text-sm">No orders yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
              <tr><th className="p-3">Date</th><th className="p-3">Product</th><th className="p-3">Customer</th><th className="p-3 text-right">Amount</th><th className="p-3 text-right">Your share</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((o: any) => (
                <tr key={o.orderId} className="border-b border-tint last:border-b-0 hover:bg-primary/5">
                  <td className="p-3 text-xs text-text2">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-3 font-semibold">{o.productName}</td>
                  <td className="p-3 text-text2 text-xs">{o.email}</td>
                  <td className="p-3 text-right font-bold">{formatINR(o.amount)}</td>
                  <td className="p-3 text-right text-green-500 font-bold">{formatINR(Math.round(o.amount * franchise.commissionRate / 100))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
