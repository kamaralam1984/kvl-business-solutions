import { Schema, models, model } from 'mongoose';
import { DELIVERY_STAGES } from '../delivery-stages';

const BillingSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  gstin: String,
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
  },
}, { _id: false });

const OrderSchema = new Schema({
  orderId: { type: String, unique: true, index: true },
  invoiceNo: { type: String, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  // Most recent Lead with a matching email/phone at the time this order was
  // created, if any — lets admin trace ad-driven leads through to revenue
  // instead of Leads and Orders sitting as two disconnected collections.
  lead: { type: Schema.Types.ObjectId, ref: 'Lead', index: true },
  email: { type: String, required: true, index: true },
  productSlug: { type: String, required: true },
  productName: String,
  amount: { type: Number, required: true },
  subtotal: Number,
  gstAmount: Number,
  gstRate: { type: Number, default: 18 },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: { type: String, index: true },
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created', index: true },
  licenseKey: String,
  hosting: { type: String, enum: ['cloud', 'on-premise'], default: 'cloud' },
  billing: { type: BillingSchema, default: () => ({}) },
  couponCode: String,
  discount: { type: Number, default: 0 },
  refundedAt: Date,
  refundReason: String,

  // Project build/delivery tracking — shown to the customer as a progress
  // bar (see components/shared/DeliveryProgress.tsx) and set by admin from
  // /admin/orders. Percent complete is derived from the stage, not stored
  // separately, so the two can never drift out of sync.
  deliveryStage: { type: String, enum: DELIVERY_STAGES.map(s => s.key), default: 'confirmed', index: true },
  deliveryNotes: String,
  deliveredAt: Date,
}, { timestamps: true });

export const Order = models.Order || model('Order', OrderSchema);
