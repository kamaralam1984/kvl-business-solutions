import { Schema, models, model } from 'mongoose';

const SubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  source: { type: String, default: 'footer' },
  active: { type: Boolean, default: true, index: true },
  unsubscribedAt: Date,
}, { timestamps: true });

export const Subscriber = models.Subscriber || model('Subscriber', SubscriberSchema);
