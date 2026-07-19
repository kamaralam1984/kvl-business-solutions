import { Schema, models, model } from 'mongoose';

// Module 4 (Website Behaviour) — the highest-volume collection in the VIP
// system. Raw events auto-expire after 90 days (TTL index below) — that's a
// deliberate data-minimization choice (PHASE22-VIP-ARCHITECTURE.md §2.5/§2.8),
// not a storage-cost afterthought. Rolled-up summaries (VipSession,
// VipPageView, VipLeadScore) outlive the raw events that produced them.
export const VIP_EVENT_TYPES = [
  'page_view', 'click', 'dead_click', 'rage_click',
  'hover_start', 'hover_end', 'scroll_milestone', 'focus', 'blur',
  'form_start', 'form_submit', 'copy', 'paste', 'download',
  'cta_click', 'link_click', 'chatbot_open', 'whatsapp_click', 'call_click',
  'proposal_download', 'book_meeting_start', 'book_meeting_complete',
  'js_error', 'console_error', 'network_error',
] as const;
export type VipEventType = typeof VIP_EVENT_TYPES[number];

const VipEventSchema = new Schema({
  sessionId: { type: String, required: true, index: true },
  vid: { type: String, required: true, index: true },
  ts: { type: Date, default: Date.now },
  type: { type: String, enum: VIP_EVENT_TYPES, required: true, index: true },
  path: { type: String, index: true },
  // Shape depends on `type` — e.g. { x, y } for click/rage_click, { pct } for
  // scroll_milestone, { selector, label } for cta_click. Never contains
  // masked field values (passwords/OTP/payment/API keys are stripped in the
  // browser before the event is even queued — see components/vip/VipTracker.tsx).
  payload: Schema.Types.Mixed,
});

VipEventSchema.index({ sessionId: 1, ts: 1 });
VipEventSchema.index({ ts: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const VipEvent = models.VipEvent || model('VipEvent', VipEventSchema);
