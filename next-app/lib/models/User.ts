import { Schema, models, model } from 'mongoose';

const AddressSchema = new Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: 'India' },
}, { _id: false });

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  name: String,
  passwordHash: { type: String }, // optional — OAuth users don't have one
  image: String,
  provider: { type: String, default: 'credentials' }, // credentials | google
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  company: String,
  phone: String,
  gstin: String,
  address: { type: AddressSchema, default: () => ({}) },
  emailVerified: { type: Boolean, default: false },
  verifyToken: { type: String, index: true },
  verifyTokenExpires: Date,
  resetToken: { type: String, index: true },
  resetTokenExpires: Date,
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);
