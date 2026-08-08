import { Schema, models, model } from 'mongoose';

export const WORKFLOW_TRIGGERS = [
  'new_lead', 'new_order', 'new_ticket', 'order_paid', 'lead_inactive_3d', 'cart_abandoned',
  'call_back_requested', 'hot_lead',
  // Added: deal-lifecycle + service-lifecycle triggers. See lib/workflows/runner.ts,
  // app/api/crm/deals/[id]/route.ts, and app/api/admin/tickets/[id]/route.ts (support_closed)
  // for which of these have a real fireTrigger() call site wired up vs. which are
  // registered-only (selectable in the admin UI, no backing event yet).
  'meeting_scheduled', 'proposal_sent', 'proposal_viewed', 'proposal_accepted',
  'deal_won', 'deal_lost', 'amc_expiring', 'invoice_overdue', 'support_closed', 'payment_received',
] as const;
export const WORKFLOW_ACTIONS = ['send_email', 'create_notification', 'add_to_crm', 'whatsapp_message', 'webhook'] as const;

const WorkflowSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  trigger: { type: String, enum: WORKFLOW_TRIGGERS, required: true, index: true },
  action: { type: String, enum: WORKFLOW_ACTIONS, required: true },
  // Configuration for the action (email subject, webhook URL, etc.)
  config: {
    emailSubject: String,
    emailTemplate: String,
    notificationTitle: String,
    notificationMessage: String,
    webhookUrl: String,
    whatsappMessage: String,
  },
  active: { type: Boolean, default: true, index: true },
  runCount: { type: Number, default: 0 },
  lastRunAt: Date,
  lastError: String,
}, { timestamps: true });

export const Workflow = models.Workflow || model('Workflow', WorkflowSchema);
