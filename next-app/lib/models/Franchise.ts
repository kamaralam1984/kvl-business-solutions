import { Schema, models, model } from 'mongoose';

const FranchiseSchema = new Schema({
  ownerEmail: { type: String, required: true, unique: true, lowercase: true, index: true },
  name: { type: String, required: true },
  city: String,
  state: String,
  startDate: Date,
  status: { type: String, enum: ['active', 'paused', 'closed'], default: 'active', index: true },
  monthlyTarget: { type: Number, default: 100000 },
  commissionRate: { type: Number, default: 10 }, // percentage
}, { timestamps: true });

export const Franchise = models.Franchise || model('Franchise', FranchiseSchema);
