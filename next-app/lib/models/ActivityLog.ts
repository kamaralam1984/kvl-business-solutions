import { Schema, models, model } from 'mongoose';

const ActivityLogSchema = new Schema({
  action: { type: String, required: true, index: true },
  actorEmail: { type: String, index: true },
  actorRole: String,
  target: String,
  targetId: String,
  details: Schema.Types.Mixed,
  ip: String,
}, { timestamps: { createdAt: true, updatedAt: false } });

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog = models.ActivityLog || model('ActivityLog', ActivityLogSchema);
