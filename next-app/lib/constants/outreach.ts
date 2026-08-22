// Split out of lib/models/OutreachProspect.ts (which imports mongoose) so a
// client component (app/admin/outreach/[id]/page.tsx) can use the status
// list without pulling the entire mongoose package into the browser bundle.
export const PROSPECT_STATUSES = ['pending', 'drafted', 'sent', 'opened', 'replied', 'meeting_booked', 'bounced', 'unsubscribed'] as const;
export type ProspectStatus = typeof PROSPECT_STATUSES[number];
