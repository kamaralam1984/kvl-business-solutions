import { Schema, models, model } from 'mongoose';

const AttachmentSchema = new Schema({
  url: String,
  publicId: String,
  name: String,
  size: Number,
  format: String,
}, { _id: false });

const TicketSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  product: String,
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open', index: true },
  assignedTo: String,
  attachments: { type: [AttachmentSchema], default: [] },
}, { timestamps: true });

export const Ticket = models.Ticket || model('Ticket', TicketSchema);
