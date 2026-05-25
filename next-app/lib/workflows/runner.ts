import { connectDB } from '../mongodb';
import { Workflow } from '../models/Workflow';
import { sendNotification } from '../email';
import { notify } from '../models/Notification';
import { Deal } from '../models/Deal';
import { logActivity } from '../activity';

type TriggerContext = Record<string, any>;

// Template variable replacement: "{{name}}" → context.name
function fill(template: string, ctx: TriggerContext): string {
  if (!template) return '';
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const parts = path.split('.');
    let v: any = ctx;
    for (const p of parts) v = v?.[p];
    return v != null ? String(v) : '';
  });
}

// Action handlers
async function actionSendEmail(workflow: any, ctx: TriggerContext) {
  const subject = fill(workflow.config?.emailSubject || 'KVL notification', ctx);
  const body = fill(workflow.config?.emailTemplate || 'Hi {{name}}, this is an automated message from KVL.', ctx);
  const to = ctx.email || ctx.customerEmail;
  if (!to) throw new Error('No recipient email in context');
  await sendNotification(subject, body, to);
}

async function actionCreateNotification(workflow: any, ctx: TriggerContext) {
  const title = fill(workflow.config?.notificationTitle || 'New activity', ctx);
  const message = fill(workflow.config?.notificationMessage || '', ctx);
  const userEmail = ctx.email || ctx.customerEmail;
  if (!userEmail) throw new Error('No user email in context');
  await notify(userEmail, { title, message, type: 'info', link: ctx.link });
}

async function actionAddToCrm(workflow: any, ctx: TriggerContext) {
  const ownerEmail = process.env.EMAIL_TO_SALES || 'sales@kvlsolutions.in';
  await connectDB();
  await Deal.create({
    ownerEmail: ownerEmail.toLowerCase(),
    title: `Auto: ${ctx.name || ctx.title || 'New lead'}`,
    contactName: ctx.name,
    value: ctx.amount || 0,
    stage: 'lead',
    probability: 20,
    source: ctx.source || 'workflow',
    notes: `Auto-created by workflow "${workflow.name}". Context: ${JSON.stringify(ctx).slice(0, 200)}`,
  });
}

async function actionWhatsApp(workflow: any, ctx: TriggerContext) {
  // For now — just log. Real WhatsApp Business API requires Gupshup/Twilio integration (paid).
  const message = fill(workflow.config?.whatsappMessage || '', ctx);
  console.log(`[workflow] WhatsApp to ${ctx.phone || 'no-phone'}: ${message}`);
  // TODO: integrate with WhatsApp Business API
}

async function actionWebhook(workflow: any, ctx: TriggerContext) {
  const url = workflow.config?.webhookUrl;
  if (!url) throw new Error('No webhook URL configured');
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-KVL-Workflow': workflow._id.toString() },
    body: JSON.stringify({ trigger: workflow.trigger, context: ctx, timestamp: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`Webhook ${r.status}`);
}

const actionHandlers: Record<string, (w: any, c: TriggerContext) => Promise<void>> = {
  send_email: actionSendEmail,
  create_notification: actionCreateNotification,
  add_to_crm: actionAddToCrm,
  whatsapp_message: actionWhatsApp,
  webhook: actionWebhook,
};

// Main entry point — fire a trigger
export async function runWorkflows(trigger: string, ctx: TriggerContext) {
  try {
    await connectDB();
    const workflows = await Workflow.find({ trigger, active: true }).lean();
    if (workflows.length === 0) return { ran: 0 };

    let ok = 0, failed = 0;
    for (const w of workflows) {
      try {
        const handler = actionHandlers[(w as any).action];
        if (!handler) throw new Error(`Unknown action: ${(w as any).action}`);
        await handler(w, ctx);
        await Workflow.updateOne({ _id: (w as any)._id }, { $inc: { runCount: 1 }, $set: { lastRunAt: new Date(), lastError: undefined } });
        ok++;
        logActivity({
          action: 'workflow.run',
          target: 'Workflow',
          targetId: (w as any)._id.toString(),
          details: { name: (w as any).name, trigger, action: (w as any).action, status: 'success' },
        });
      } catch (e: any) {
        failed++;
        await Workflow.updateOne({ _id: (w as any)._id }, { $set: { lastError: e.message, lastRunAt: new Date() } });
        console.error(`[workflow] "${(w as any).name}" failed:`, e.message);
        logActivity({
          action: 'workflow.fail',
          target: 'Workflow',
          targetId: (w as any)._id.toString(),
          details: { name: (w as any).name, trigger, error: e.message },
        });
      }
    }

    return { ran: ok, failed, total: workflows.length };
  } catch (e: any) {
    console.error('[workflows] runner error:', e.message);
    return { ran: 0, error: e.message };
  }
}

// Don't await this in route handlers — fire and forget
export function fireTrigger(trigger: string, ctx: TriggerContext): void {
  runWorkflows(trigger, ctx).catch(e => console.error('[fireTrigger]', e));
}
