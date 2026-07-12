import { Schema, models, model } from 'mongoose';

const VisitCounterSchema = new Schema({
  key: { type: String, required: true, unique: true, default: 'total' },
  count: { type: Number, default: 0 },
});

export const VisitCounter = models.VisitCounter || model('VisitCounter', VisitCounterSchema);
