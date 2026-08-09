import { redirect } from 'next/navigation';

// Folded into the unified Landing Page Analytics dashboard (its daily-total
// chart is now sourced from real VIP session data, not just the simple
// counter this page used to read). Kept as a redirect so old bookmarks/links
// still land somewhere useful instead of 404ing.
export default function VisitorStatsRedirect() {
  redirect('/admin/vip');
}
