import { Schema, models, model } from 'mongoose';

export const WORKFLOW_TRIGGERS = ['new_lead', 'new_order', 'new_ticket', 'order_paid', 'lead_inactive_3d', 'cart_abandoned'] as const;
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
