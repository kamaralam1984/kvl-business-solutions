import { chatRouted } from './router';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  service?: string;
  message?: string;
  chatMessages?: { role: string; content: string }[];
}

export interface LeadInsights {
  aiScore: number;
  intent: 'hot' | 'warm' | 'cold' | 'unknown';
  aiInsights: {
    budget: string;
    timeline: string;
    companyType: string;
    urgency: string;
    nextAction: string;
    summary: string;
  };
}

const SCORER_SYSTEM = `You are a B2B sales lead scoring AI for KVL Business Solutions, an Indian enterprise software company.
Analyze the lead and return a JSON object ONLY — no explanation, no markdown.

Score criteria:
- aiScore (0-100): based on purchase intent, urgency, budget signals, specificity
  - 80-100: Ready to buy, specific requirement, urgent need
  - 50-79: Interested, exploring options, medium urgency
  - 20-49: General inquiry, low urgency, just browsing
  - 0-19: Spam, test, or completely irrelevant

- intent: "hot" (score≥75), "warm" (40-74), "cold" (<40), "unknown" (no clear signal)

- budget: Extracted budget range or "Not mentioned"
- timeline: Extracted timeline or "Not mentioned"
- companyType: Type of business/industry (e.g. "Manufacturing SME", "School", "Hospital") or "Unknown"
- urgency: Why urgent or "Low urgency"
- nextAction: Single best next action for sales team (e.g. "Call within 2 hours", "Send product demo link", "Schedule online demo")
- summary: One-line summary of what this lead wants

Return ONLY this JSON:
{"aiScore":85,"intent":"hot","aiInsights":{"budget":"₹50,000","timeline":"This month","companyType":"Retail","urgency":"Mentioned urgent","nextAction":"Call within 1 hour","summary":"Wants billing software for retail shop, ready to buy"}}`;

export async function scoreLead(lead: LeadData): Promise<LeadInsights> {
  const context = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    lead.service ? `Service interest: ${lead.service}` : '',
    lead.message ? `Message: ${lead.message}` : '',
    lead.chatMessages?.length
      ? `Chat conversation:\n${lead.chatMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
      : '',
  ].filter(Boolean).join('\n');

  try {
    const result = await chatRouted({
      messages: [{ role: 'user', content: `Score this lead:\n\n${context}` }],
      system: SCORER_SYSTEM,
      maxTokens: 300,
      temperature: 0.2,
    });

    const jsonMatch = result.reply.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      aiScore: Math.min(100, Math.max(0, Number(parsed.aiScore) || 0)),
      intent: ['hot', 'warm', 'cold', 'unknown'].includes(parsed.intent) ? parsed.intent : 'unknown',
      aiInsights: {
        budget: parsed.aiInsights?.budget || 'Not mentioned',
        timeline: parsed.aiInsights?.timeline || 'Not mentioned',
        companyType: parsed.aiInsights?.companyType || 'Unknown',
        urgency: parsed.aiInsights?.urgency || 'Low urgency',
        nextAction: parsed.aiInsights?.nextAction || 'Follow up within 24 hours',
        summary: parsed.aiInsights?.summary || '',
      },
    };
  } catch {
    // Fallback: rule-based scoring
    return ruleBasedScore(lead);
  }
}

function ruleBasedScore(lead: LeadData): LeadInsights {
  const text = `${lead.message || ''} ${lead.service || ''}`.toLowerCase();
  let score = 20;
  if (/urgent|asap|today|immediately|jaldi|abhi/.test(text)) score += 25;
  if (/buy|purchase|order|kharidna|lena hai|chahiye/.test(text)) score += 20;
  if (/budget|price|cost|kitna|rate/.test(text)) score += 15;
  if (/demo|trial|dekh|dikhao/.test(text)) score += 10;
  if (lead.service) score += 10;
  if (lead.message && lead.message.length > 50) score += 10;
  score = Math.min(100, score);
  const intent = score >= 75 ? 'hot' : score >= 40 ? 'warm' : 'cold';
  return {
    aiScore: score,
    intent,
    aiInsights: {
      budget: 'Not mentioned',
      timeline: 'Not mentioned',
      companyType: 'Unknown',
      urgency: score >= 75 ? 'High' : score >= 40 ? 'Medium' : 'Low',
      nextAction: score >= 75 ? 'Call within 1 hour' : score >= 40 ? 'Follow up within 4 hours' : 'Send brochure email',
      summary: lead.service ? `Interested in ${lead.service}` : 'General inquiry',
    },
  };
}

// Fire-and-forget: score lead in background after creation
export async function scoreLeadAsync(leadId: string, data: LeadData) {
  try {
    const insights = await scoreLead(data);
    await connectDB();
    await Lead.findByIdAndUpdate(leadId, {
      $set: { ...insights, aiScoredAt: new Date() },
    });
    console.log(`[lead-scorer] Scored ${leadId}: ${insights.aiScore} (${insights.intent})`);
  } catch (e) {
    console.error('[lead-scorer] Error:', e);
  }
}

// Extract lead info from chatbot conversation using AI
const EXTRACTOR_SYSTEM = `You are a contact info extractor. From the conversation, extract contact details.
Return ONLY JSON or null if not enough info.
{"name":"...","phone":"...","email":"...","service":"...","confidence":0.9}
- confidence: 0-1, how sure you are (only return if ≥ 0.7)
- phone must be a valid Indian mobile number (10 digits)
- name must be a real person name
- service: what product/service they want`;

export async function extractLeadFromChat(
  messages: { role: string; content: string }[]
): Promise<{ name: string; phone: string; email: string; service: string; confidence: number } | null> {
  if (messages.length < 4) return null;

  const conversation = messages.map(m => `${m.role === 'user' ? 'Customer' : 'AI'}: ${m.content}`).join('\n');

  try {
    const result = await chatRouted({
      messages: [{ role: 'user', content: `Extract contact info from this conversation:\n\n${conversation}` }],
      system: EXTRACTOR_SYSTEM,
      maxTokens: 150,
      temperature: 0.1,
    });

    const jsonMatch = result.reply.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.confidence || parsed.confidence < 0.7) return null;
    if (!parsed.phone || !/[6-9]\d{9}/.test(parsed.phone.replace(/\D/g, ''))) return null;
    if (!parsed.name || parsed.name.length < 2) return null;
    return parsed;
  } catch {
    return null;
  }
}
