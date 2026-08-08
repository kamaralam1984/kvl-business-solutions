import { connectDB } from '../mongodb';
import { Workflow } from '../models/Workflow';
import { sendNotification } from '../email';
import { notify } from '../models/Notification';
import { Deal } from '../models/Deal';
import { logActivity } from '../activity';
import { sendCustomWhatsApp } from '../whatsapp';

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
  // sendNotification() silently no-ops when RESEND_API_KEY isn't set (by
  // design, for its other fire-and-forget callers) — check here instead, so
  // the workflow run is honestly reported as failed rather than a false
  // "success" that masks total delivery failure.
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured — email was not sent');
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
  await connectDB();
  // If this trigger's context carries a dealId (e.g. new_order fired for a
  // buyer who already has a Lead → Deal from before they paid — see
  // app/api/payments/create-order/route.ts), advance that same deal instead
  // of creating a second, disconnected "Auto: ..." entry for the same person.
  if (ctx.dealId) {
    const updated = await Deal.findByIdAndUpdate(ctx.dealId, {
      $set: { stage: 'won', probability: 100, value: ctx.amount || 0 },
      $push: { tags: `order:${ctx.orderId || 'unknown'}` },
    });
    if (updated) return;
    // Deal was deleted/missing — fall through and create a fresh one below.
  }
  const ownerEmail = process.env.EMAIL_TO_SALES || 'kvlbusinesssolution@gmail.com';
  await Deal.create({
    ownerEmail: ownerEmail.toLowerCase(),
    title: `Auto: ${ctx.name || ctx.title || 'New lead'}`,
    contactName: ctx.name,
    contactEmail: ctx.email,
    value: ctx.amount || 0,
    stage: ctx.orderId ? 'won' : 'lead',
    probability: ctx.orderId ? 100 : 20,
    source: ctx.source || 'workflow',
    notes: `Auto-created by workflow "${workflow.name}". Context: ${JSON.stringify(ctx).slice(0, 200)}`,
  });
}

async function actionWhatsApp(workflow: any, ctx: TriggerContext) {
  // Same reasoning as actionSendEmail — sendCustomWhatsApp() silently no-ops
  // without WATI credentials, so check here to report an honest failure.
  if (!process.env.WATI_API_ENDPOINT || !process.env.WATI_API_KEY) {
    throw new Error('WATI_API_ENDPOINT/WATI_API_KEY not configured — WhatsApp message was not sent');
  }
  const phone = ctx.phone;
  if (!phone) throw new Error('No phone in context');
  const message = fill(workflow.config?.whatsappMessage || '', ctx);
  await sendCustomWhatsApp({ phone, message });
}

const WEBHOOK_TIMEOUT_MS = 8000;

async function actionWebhook(workflow: any, ctx: TriggerContext) {
  const url = workflow.config?.webhookUrl;
  if (!url) throw new Error('No webhook URL configured');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-KVL-Workflow': workflow._id.toString() },
      body: JSON.stringify({ trigger: workflow.trigger, context: ctx, timestamp: new Date().toISOString() }),
      signal: controller.signal,
    });
    if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
  } catch (e: any) {
    if (e.name === 'AbortError') throw new Error(`Webhook timed out after ${WEBHOOK_TIMEOUT_MS}ms`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
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
