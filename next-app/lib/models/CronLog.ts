import { Schema, models, model } from 'mongoose';

const CronLogSchema = new Schema({
  job: { type: String, required: true, index: true },
  status: { type: String, enum: ['success', 'error'], required: true },
  summary: String,
  error: String,
  ranAt: { type: Date, default: Date.now, index: true },
});

export const CronLog = models.CronLog || model('CronLog', CronLogSchema);
