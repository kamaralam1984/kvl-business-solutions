import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrCreateReferral, computeConversions } from '@/lib/referrals';
import { getSiteSettings } from '@/lib/models/SiteSettings';
import { MousePointerClick, UserPlus, Trophy, Gift } from 'lucide-react';
import { CopyReferralLink } from '@/components/dashboard/CopyReferralLink';

export const dynamic = 'force-dynamic';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

export default async function ReferralsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return (
      <div className="py-10">
        <p className="text-text2">Please sign in to view your referral link.</p>
      </div>
    );
  }

  const referral = await getOrCreateReferral(email);
  const conversions = await computeConversions([referral.code]);
  const conversionsCount = conversions[referral.code] || 0;
  const settings = await getSiteSettings().catch(() => null);
  const link = `${SITE}/?ref=${referral.code}`;

  return (
    <div className="py-10">
      <h1 className="text-3xl font-extrabold mb-1">Your Referral Program</h1>
      <p className="text-text2 mb-8">Share your link — clicks, signups, and won deals update here in real time.</p>

      <div className="card-base p-5 mb-8">
        <div className="text-xs text-text2 mb-2">Your referral link</div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <code className="flex-1 min-w-0 truncate text-sm font-mono bg-primary/5 px-3 py-2 rounded-lg">{link}</code>
          <CopyReferralLink link={link} />
        </div>
        <div className="text-xs text-text2 mt-3">
          Your code: <span className="font-mono font-bold text-text">{referral.code}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card-base p-5">
          <MousePointerClick className="w-6 h-6 text-primary mb-2" />
          <div className="text-2xl font-extrabold">{referral.clicksCount}</div>
          <div className="text-xs text-text2">Link Clicks</div>
        </div>
        <div className="card-base p-5">
          <UserPlus className="w-6 h-6 text-blue-500 mb-2" />
          <div className="text-2xl font-extrabold">{referral.signupsCount}</div>
          <div className="text-xs text-text2">Signups (Leads)</div>
        </div>
        <div className="card-base p-5">
          <Trophy className="w-6 h-6 text-green-500 mb-2" />
          <div className="text-2xl font-extrabold">{conversionsCount}</div>
          <div className="text-xs text-text2">Won Deals</div>
        </div>
      </div>

      <div className="card-base p-5">
        <h2 className="font-bold text-sm mb-2 flex items-center gap-2"><Gift className="w-4 h-4 text-primary" /> Reward Policy</h2>
        {settings?.referralRewardDescription ? (
          <p className="text-sm text-text2 whitespace-pre-line">{settings.referralRewardDescription}</p>
        ) : (
          <p className="text-sm text-text2">No reward policy has been published yet. Contact us for details.</p>
        )}
      </div>
    </div>
  );
}
