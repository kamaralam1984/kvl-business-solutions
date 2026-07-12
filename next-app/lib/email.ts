import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || 'KVL <onboarding@resend.dev>';
const SALES = process.env.EMAIL_TO_SALES || 'sales@kvlbusinesssolutions.com';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function sendNotification(subject: string, html: string, to = SALES) {
  if (!resend) { console.log('[email skipped]', subject, '→', to); return; }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (e) { console.error('email error', e); }
}

const wrap = (title: string, body: string) => `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#0f172a">
  <div style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;padding:24px;border-radius:12px 12px 0 0">
    <h1 style="margin:0;font-size:22px">KVL Business Solutions</h1>
    <p style="margin:6px 0 0;opacity:.9;font-size:13px">${title}</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 12px 12px">
    ${body}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
    <p style="font-size:11px;color:#64748b;margin:0">KVL Business Solutions · Patna, India · info@kvlbusinesssolutions.com</p>
  </div>
</div>`;

export function leadEmail(lead: any) {
  return wrap('New Lead', `<h2>New Lead — ${lead.name}</h2>
    <p><b>Email:</b> ${lead.email}<br/><b>Phone:</b> ${lead.phone}<br/><b>Service:</b> ${lead.service || '—'}</p>
    <p><b>Message:</b><br/>${lead.message || ''}</p>`);
}

export function callBackEmail(data: { name: string; phone: string }) {
  return wrap('Call Me Back Requested', `<h2>📞 Call Back Requested — ${data.name}</h2>
    <p><b>Phone:</b> ${data.phone}</p>
    <p>Customer asked for an immediate callback via the website widget — they're expecting to hear from us within 30 seconds.</p>`);
}

export function ticketEmail(t: any) {
  return wrap('New Support Ticket', `<h2>New Support Ticket [${(t.priority || 'medium').toUpperCase()}]</h2>
    <p><b>From:</b> ${t.name} (${t.email})<br/><b>Product:</b> ${t.product || '—'}</p>
    <p><b>Issue:</b><br/>${t.description}</p>`);
}

export function ticketReplyEmail(t: any, message: string) {
  return wrap('Reply to Your Support Ticket', `<h2>Hi ${t.name} 👋</h2>
    <p>We've replied to your support ticket${t.product ? ` about <b>${t.product}</b>` : ''}:</p>
    <p style="background:#f1f5f9;padding:14px;border-radius:8px;white-space:pre-wrap">${message}</p>
    <p style="font-size:12px;color:#64748b">Your original issue: "${t.description}"</p>
    <p style="font-size:12px;color:#64748b">Reply to this email if you need further help, or WhatsApp +91 99420 00413.</p>`);
}

export function quoteEmail(q: any) {
  return wrap('New Quote Request', `<h2>New Quote Request</h2>
    <p><b>Type:</b> ${q.type}<br/><b>Scope:</b> ${q.scope}<br/><b>Timeline:</b> ${q.timeline}</p>
    <p><b>Estimate:</b> ₹${q.estimateLow?.toLocaleString('en-IN')} – ₹${q.estimateHigh?.toLocaleString('en-IN')}</p>
    <p><b>Contact:</b> ${q.contact?.name} · ${q.contact?.email} · ${q.contact?.phone}</p>`);
}

export function orderEmail(o: any) {
  return wrap('Payment Confirmation', `<h2>🎉 Order ${o.orderId}</h2>
    <p>Thank you for purchasing <b>${o.productName}</b>.</p>
    <p><b>Amount:</b> ₹${o.amount.toLocaleString('en-IN')}<br/>
       <b>License Key:</b> <code style="background:#f1f5f9;padding:4px 8px;border-radius:4px">${o.licenseKey}</code><br/>
       <b>Hosting:</b> ${o.hosting}</p>
    <p>Download invoice: <a href="${SITE}/api/invoice/${o.orderId}" style="color:#1d4ed8">${SITE}/api/invoice/${o.orderId}</a></p>
    <p>Our installation team will reach out within 24 hours to deploy your software.</p>`);
}

export function verifyEmail(name: string, link: string) {
  return wrap('Verify your email', `<h2>Welcome ${name || 'to KVL'} 👋</h2>
    <p>Please verify your email address by clicking the button below. This link expires in 24 hours.</p>
    <p style="text-align:center;margin:24px 0">
      <a href="${link}" style="background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Verify Email</a>
    </p>
    <p style="font-size:12px;color:#64748b">Or copy this link: ${link}</p>`);
}

export function resetEmail(name: string, link: string) {
  return wrap('Password Reset', `<h2>Reset your password</h2>
    <p>Hi ${name || 'there'}, we got a request to reset your password. This link expires in 1 hour.</p>
    <p style="text-align:center;margin:24px 0">
      <a href="${link}" style="background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
    </p>
    <p style="font-size:12px;color:#64748b">If you didn't request this, ignore this email. Link: ${link}</p>`);
}
