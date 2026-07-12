import { Schema, models, model } from 'mongoose';

const ChatLogSchema = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  messages: [{ role: { type: String, enum: ['user', 'assistant'] }, content: String }],
  leadCaptured: { type: Boolean, default: false },
  lastMessageAt: { type: Date, default: Date.now, index: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const ChatLog = models.ChatLog || model('ChatLog', ChatLogSchema);
