import { Schema, models, model } from 'mongoose';

// First-party mirror of the events sent to GA4/Meta/etc via trackEvent()
// (components/analytics/track.ts). Lets the internal admin dashboard show
// real CTA/lead-source/landing-page numbers without needing GA4 Data API
// credentials.
const AnalyticsEventSchema = new Schema({
  name: { type: String, required: true, index: true },
  path: { type: String, default: '' },
  params: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const AnalyticsEvent = models.AnalyticsEvent || model('AnalyticsEvent', AnalyticsEventSchema);
