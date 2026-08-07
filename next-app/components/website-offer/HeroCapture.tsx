'use client';
import { useSearchParams } from 'next/navigation';
import { QuoteForm, ThankYouCard } from './QuoteForm';

// Isolated in its own leaf component (rather than living in the page's main
// client component) so only THIS small subtree opts into Suspense/dynamic
// rendering for useSearchParams — the rest of the landing page still
// server-renders normally instead of the whole page falling back to blank
// static HTML until hydration.
export function HeroCapture() {
  const sp = useSearchParams();
  const lead = sp.get('lead');
  const name = sp.get('name') || '';

  if (lead) return <ThankYouCard name={name} />;
  return <QuoteForm />;
}
