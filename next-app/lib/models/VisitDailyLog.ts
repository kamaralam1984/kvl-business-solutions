import { Schema, models, model } from 'mongoose';

const VisitDailyLogSchema = new Schema({
  date: { type: String, required: true, unique: true, index: true }, // YYYY-MM-DD
  count: { type: Number, default: 0 },
});

export const VisitDailyLog = models.VisitDailyLog || model('VisitDailyLog', VisitDailyLogSchema);
