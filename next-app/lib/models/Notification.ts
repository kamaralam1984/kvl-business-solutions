import { Schema, models, model } from 'mongoose';

const NotificationSchema = new Schema({
  userEmail: { type: String, required: true, lowercase: true, index: true },
  type: { type: String, default: 'info' }, // info | success | warning | error | order | ticket
  title: { type: String, required: true },
  message: String,
  link: String,
  read: { type: Boolean, default: false, index: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

NotificationSchema.index({ userEmail: 1, createdAt: -1 });

export const Notification = models.Notification || model('Notification', NotificationSchema);

export async function notify(userEmail: string, input: { type?: string; title: string; message?: string; link?: string }) {
  try {
    const { connectDB } = await import('../mongodb');
    await connectDB();
    await Notification.create({ userEmail: userEmail.toLowerCase(), ...input });
  } catch (e) {
    console.error('notify error', e);
  }
}
