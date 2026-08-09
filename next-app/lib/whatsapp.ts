// WhatsApp auto-messaging via WATI (wati.io) — most popular WhatsApp API in India
// Set WATI_API_ENDPOINT and WATI_API_KEY in .env.local to enable
// Example: WATI_API_ENDPOINT=https://live-server-12345.wati.io
//          WATI_API_KEY=your_wati_bearer_token

const WATI_ENDPOINT = process.env.WATI_API_ENDPOINT || '';
const WATI_KEY = process.env.WATI_API_KEY || '';

// wa.me links require digits only — NEXT_PUBLIC_WHATSAPP may be set with a leading
// "+" (e.g. "+919942000413"), so every consumer building a wa.me URL must go through
// this helper rather than reading the env var directly.
export function getWhatsAppDigits() {
  return (process.env.NEXT_PUBLIC_WHATSAPP || '919942000413').replace(/\D/g, '');
}

export interface WAMessage {
  phone: string;   // 10-digit Indian mobile, no +91
  message: string;
}

async function sendWATI({ phone, message }: WAMessage) {
  const mobile = phone.replace(/\D/g, '').replace(/^91/, '').slice(-10);
  const to = `91${mobile}`;
  // WATI reads messageText from the query string, not the JSON body — sending
  // it as a body param gets "message text can not be empty" back. It also
  // returns HTTP 200 for logical failures (e.g. unknown contact, expired
  // session), with the real outcome in `result`/`info` — checking res.ok
  // alone lets those fail silently.
  const url = `${WATI_ENDPOINT}/api/v1/sendSessionMessage/${to}?messageText=${encodeURIComponent(message)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WATI_KEY}` },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.result) throw new Error(`WATI error ${res.status}: ${data?.info || 'unknown response'}`);
}

// Send an arbitrary, already-composed message — used by the admin-configurable Workflow engine
export async function sendCustomWhatsApp({ phone, message }: WAMessage) {
  if (!WATI_ENDPOINT || !WATI_KEY) {
    console.log(`[whatsapp] Not configured — would message ${phone}: ${message}`);
    return;
  }
  await sendWATI({ phone, message });
}

// Send WhatsApp to customer after lead submission
export async function sendLeadWhatsApp(data: {
  name: string; phone: string; service?: string;
}) {
  if (!WATI_ENDPOINT || !WATI_KEY) {
    console.log(`[whatsapp] Not configured — would message ${data.phone}`);
    return;
  }
  const service = data.service ? `\n\nService interest: *${data.service}*` : '';
  const message = `Namaste *${data.name}* ji! 🙏\n\nAapki query humein mili — shukriya!${service}\n\nMain *Priya* hoon, KVL Business Solutions ki taraf se. Hamaari team aapko jald hi contact karegi.\n\nAbhi baat karni ho:\n📞 +91 99420 00413\n💬 wa.me/${getWhatsAppDigits()}\n\n_KVL Business Solutions — Aapka Tech Partner_ ✨`;
  await sendWATI({ phone: data.phone, message });
}

// Send WhatsApp follow-up (1 hour later)
export async function sendFollowUpWhatsApp(data: {
  name: string; phone: string; service?: string;
}) {
  if (!WATI_ENDPOINT || !WATI_KEY) return;
  const service = data.service ? ` (${data.service})` : '';
  const message = `Namaste *${data.name}* ji! 😊\n\nKya aapko abhi KVL software${service} ke baare mein aur information chahiye?\n\nHum *free demo* arrange kar sakte hain — sirf 30 minute mein aap dekhenge ki yeh aapke business ke liye perfect hai!\n\nDemo book karein: 📞 +91 99420 00413\n\n_KVL Business Solutions_`;
  await sendWATI({ phone: data.phone, message });
}

// Send WhatsApp to admin on new lead
export async function notifyAdminWhatsApp(data: {
  name: string; phone: string; email: string; service?: string; source?: string;
}) {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || '';
  if (!WATI_ENDPOINT || !WATI_KEY || !adminPhone) return;
  const message = `🔔 *New Lead!*\n\n👤 Name: ${data.name}\n📞 Phone: ${data.phone}\n📧 Email: ${data.email}\n🛠 Service: ${data.service || 'Not specified'}\n📍 Source: ${data.source || 'website'}\n\n_Reply to this chat to contact them directly_`;
  await sendWATI({ phone: adminPhone, message });
}
