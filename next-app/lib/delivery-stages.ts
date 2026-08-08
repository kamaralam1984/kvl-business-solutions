// Shared source of truth for project-delivery progress — used by the admin
// order controls, the customer-facing progress bar, and the Order schema's
// enum, so all three always agree on what stages exist and in what order.
export const DELIVERY_STAGES = [
  { key: 'confirmed', label: 'Order Confirmed', percent: 10 },
  { key: 'requirements', label: 'Requirements Gathering', percent: 25 },
  { key: 'design', label: 'Design', percent: 45 },
  { key: 'development', label: 'Development', percent: 70 },
  { key: 'testing', label: 'Testing & QA', percent: 90 },
  { key: 'delivered', label: 'Delivered', percent: 100 },
] as const;

export type DeliveryStageKey = typeof DELIVERY_STAGES[number]['key'];

export function deliveryStageInfo(key: string) {
  return DELIVERY_STAGES.find(s => s.key === key) || DELIVERY_STAGES[0];
}
