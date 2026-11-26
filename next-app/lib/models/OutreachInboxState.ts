import { Schema, models, model } from 'mongoose';

// Singleton — tracks the last IMAP UID the outreach-check-replies cron has
// already processed in the shared reply-monitoring inbox (OUTREACH_IMAP_*),
// so each run only fetches messages newer than the last one it saw instead
// of re-scanning (and re-answering) the whole mailbox every time.
const OutreachInboxStateSchema = new Schema({
  _id: { type: String, default: 'main' },
  lastUid: { type: Number, default: 0 },
}, { timestamps: true });

export const OutreachInboxState = models.OutreachInboxState || model('OutreachInboxState', OutreachInboxStateSchema);
