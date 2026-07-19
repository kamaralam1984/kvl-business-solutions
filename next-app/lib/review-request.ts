import { Deal } from '@/lib/models/Deal';
import { sendNotification, reviewRequestEmail } from '@/lib/email';

// Sends a real review-request email to the deal's contact and stamps
// `reviewRequestedAt` so it's never sent twice for the same deal. No-ops
// (returns false) if the deal has no contactEmail on file — this must never
// fabricate a recipient. Called both from the automatic won/repeat stage
// trigger (app/api/crm/deals/[id]/route.ts) and the manual "Request Review"
// admin action (app/api/crm/deals/[id]/request-review/route.ts).
export async function requestReviewForDeal(deal: any): Promise<{ sent: boolean; reason?: string }> {
  if (!deal.contactEmail) return { sent: false, reason: 'No contact email on file for this deal' };

  await sendNotification(
    'How was your experience with KVL?',
    reviewRequestEmail({ name: deal.contactName || 'there', dealTitle: deal.title }),
    deal.contactEmail
  );

  await Deal.updateOne({ _id: deal._id }, { $set: { reviewRequestedAt: new Date() } });
  return { sent: true };
}
