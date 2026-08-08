// Shared by every place that auto-creates/updates a CRM Deal from a Lead
// (lead creation, qualification, and the payment workflow) so the pipeline
// value estimate is computed the same way everywhere.

// Best-effort numeric estimate from a free-text budget string (e.g. "₹5,00,000 – ₹15,00,000").
// Uses the upper end of the range when one is present. Returns 0 if nothing parseable.
export function parseBudgetToValue(budget?: string | null): number {
  if (!budget) return 0;
  const matches = budget.match(/[\d,]+/g);
  if (!matches) return 0;
  const nums = matches.map(m => parseInt(m.replace(/,/g, ''), 10)).filter(n => !isNaN(n) && n > 0);
  return nums.length ? Math.max(...nums) : 0;
}
