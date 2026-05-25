import mongoose, { Schema, models, model } from 'mongoose';

const LeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  service: String,
  message: String,
  source: { type: String, default: 'contact-form' },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'won', 'lost'], default: 'new', index: true },
  notes: String,

  // AI-generated fields
  aiScore: { type: Number, default: 0, index: true },        // 0-100
  intent: { type: String, enum: ['hot', 'warm', 'cold', 'unknown'], default: 'unknown', index: true },
  aiInsights: {
    budget: String,        // e.g. "₹50,000–₹1,00,000"
    timeline: String,      // e.g. "Within 1 month"
    companyType: String,   // e.g. "Manufacturing SME"
    urgency: String,       // e.g. "High — mentioned 'asap'"
    nextAction: String,    // e.g. "Call within 2 hours"
    summary: String,       // 1-line AI summary
  },
  chatMessages: [{ role: String, content: String }], // for chatbot-sourced leads
  aiScoredAt: Date,

  // AI Call tracking
  callStatus: { type: String, enum: ['not_called', 'calling', 'completed', 'failed', 'no_answer'], default: 'not_called' },
  callId: String,       // Vapi call ID
  callDuration: Number, // seconds
  callRecordingUrl: String,
  calledAt: Date,
}, { timestamps: true });

export const Lead = models.Lead || model('Lead', LeadSchema);
