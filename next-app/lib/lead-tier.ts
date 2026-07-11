export type LeadTier = 'high' | 'medium' | 'low';

// First key in each map is the form's default selection, deliberately the lowest-signal
// option — so a lead that never touches these dropdowns doesn't get inflated by default.
const BUDGET_POINTS: Record<string, number> = {
  'Not sure yet': 0,
  'Under ₹1,00,000': 0,
  '₹1,00,000 – ₹5,00,000': 1,
  '₹5,00,000 – ₹15,00,000': 2,
  '₹15,00,000+': 3,
};

const TIMELINE_POINTS: Record<string, number> = {
  'Just exploring': 0,
  '3–6 months': 0,
  '1–3 months': 1,
  'Within 1 month': 2,
  'Immediately': 2,
};

const BUSINESS_TYPE_POINTS: Record<string, number> = {
  'Not sure / Other': 0,
  'Individual': 0,
  'Startup': 1,
  'SME': 1,
  'Enterprise': 2,
  'Government': 2,
};

export const BUDGET_OPTIONS = Object.keys(BUDGET_POINTS);
export const TIMELINE_OPTIONS = Object.keys(TIMELINE_POINTS);
export const BUSINESS_TYPE_OPTIONS = Object.keys(BUSINESS_TYPE_POINTS);
export const COUNTRY_OPTIONS = ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Canada', 'Australia', 'Other'];

// Transparent, deterministic rubric based on explicit form fields — separate from
// the async AI intent score, which reads free-text signal instead.
export function computeLeadTier(input: { budget?: string; timeline?: string; businessType?: string; companyName?: string }): LeadTier {
  let score = 0;
  score += BUDGET_POINTS[input.budget || ''] ?? 0;
  score += TIMELINE_POINTS[input.timeline || ''] ?? 0;
  score += BUSINESS_TYPE_POINTS[input.businessType || ''] ?? 0;
  if (input.companyName?.trim()) score += 1;

  if (score >= 5) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}
