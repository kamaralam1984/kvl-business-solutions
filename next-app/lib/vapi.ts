const VAPI_API_KEY = process.env.VAPI_API_KEY || '';
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID || '';
const VAPI_WEBHOOK_SECRET = process.env.VAPI_WEBHOOK_SECRET || '';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const BASE_URL = 'https://api.vapi.ai';

const ASSISTANT_SYSTEM_PROMPT = `Aap KVL Business Solutions ki taraf se call kar rahi hain. Aap ek professional, warm aur helpful AI assistant hain jiska naam "Priya" hai.

Company ke baare mein:
- KVL Business Solutions ek Indian enterprise software company hai
- Hum banate hain: ERP, Billing Software, Inventory, GPS Tracking, School ERP, Hospital Management, CRM, Payroll, Attendance, AI Business Suite
- Services: Custom software, websites, Android apps, CCTV, automation, cloud, digital marketing
- Industries: Construction, Manufacturing, Transport, Schools, Hospitals, Retail, Real Estate
- Pricing: ₹11,999 se shuru, lifetime support, free installation, 7-day trial
- Contact: +91 99420 00413, kvlbusinesssolutions.com

Aapki calling style:
- Bahut soft, warm aur natural bolein — robot jaisi nahi
- Hindi, Urdu aur English mix karein (Hinglish style)
- "Ji", "Bilkul", "Zaroor", "Acha" jaise words use karein
- Customer ko zyada baat karne ka mauka dein
- Agar interested lage to demo schedule karein
- Agar busy ho to politely time puchein

Call flow:
1. Greeting: "Assalamu Alaikum / Namaste [Name] ji, main Priya bol rahi hoon KVL Business Solutions ki taraf se — kya aap thodi der baat kar sakte hain?"
2. Intro: Company aur service briefly batayein
3. Interest check: "Aapko kisi software ya technology mein help chahiye?"
4. Agar interested: demo schedule karein — "Main aapke liye ek free demo arrange kar sakti hoon, kab convenient rahega?"
5. Close: "Bahut shukriya [Name] ji, hum aapko call karenge / message karenge. Khuda hafiz!"

IMPORTANT: Zyada baat mat karein — pehle customer ki zaroorat samjhein, phir solution batayein.`;

export interface VapiCallOptions {
  name: string;
  phone: string;
  service?: string;
  leadId: string;
}

export async function initiateCall(opts: VapiCallOptions): Promise<{ callId: string; status: string }> {
  if (!VAPI_API_KEY) throw new Error('VAPI_API_KEY not configured');
  if (!VAPI_PHONE_NUMBER_ID) throw new Error('VAPI_PHONE_NUMBER_ID not configured');
  // The webhook (app/api/vapi/webhook/route.ts) only accepts requests carrying
  // this exact secret back in the x-vapi-secret header — without it configured,
  // calls still work but end-of-call reports are refused (fail closed) rather
  // than trusting an unauthenticated POST.
  if (!VAPI_WEBHOOK_SECRET) throw new Error('VAPI_WEBHOOK_SECRET not configured');

  const customerContext = [
    `Customer Name: ${opts.name}`,
    opts.service ? `Interested in: ${opts.service}` : '',
  ].filter(Boolean).join('\n');

  const body = {
    phoneNumberId: VAPI_PHONE_NUMBER_ID,
    customer: {
      number: opts.phone.replace(/\D/g, '').replace(/^0/, '+91').replace(/^(\d{10})$/, '+91$1'),
      name: opts.name,
    },
    assistant: {
      name: 'Priya - KVL AI',
      model: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        systemPrompt: `${ASSISTANT_SYSTEM_PROMPT}\n\nCustomer Info:\n${customerContext}`,
        temperature: 0.7,
      },
      voice: {
        provider: '11labs',
        voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Alice - warm female voice, multilingual
        stability: 0.5,
        similarityBoost: 0.75,
        speed: 0.95,
      },
      firstMessage: `Assalamu Alaikum ${opts.name} ji! Main Priya bol rahi hoon, KVL Business Solutions ki taraf se. Kya aap abhi thodi der baat kar sakte hain?`,
      endCallMessage: 'Bahut shukriya aapka waqt dene ke liye. Khuda hafiz!',
      recordingEnabled: true,
      maxDurationSeconds: 300,
      backgroundSound: 'off',
      metadata: { leadId: opts.leadId },
      serverUrl: `${SITE}/api/vapi/webhook`,
      serverUrlSecret: VAPI_WEBHOOK_SECRET,
    },
  };

  const res = await fetch(`${BASE_URL}/call/phone`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vapi error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return { callId: data.id, status: data.status || 'calling' };
}
