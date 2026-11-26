import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export type InboundReply = { uid: number; from: string; text: string };

// Polls the shared reply-monitoring inbox (OUTREACH_IMAP_* env vars — a
// Gmail address with an app password works, since Resend has no inbound
// email support) for messages newer than `lastUid`, and returns the new
// high-water mark to persist. On the very first run (lastUid === 0) it only
// establishes a baseline and returns no messages, so the cron never treats a
// pre-existing mailbox backlog as prospect replies.
export async function fetchNewReplies(lastUid: number): Promise<{ messages: InboundReply[]; newLastUid: number }> {
  const host = process.env.OUTREACH_IMAP_HOST || 'imap.gmail.com';
  const user = process.env.OUTREACH_IMAP_USER;
  const pass = process.env.OUTREACH_IMAP_PASSWORD;
  if (!user || !pass) return { messages: [], newLastUid: lastUid };

  const client = new ImapFlow({ host, port: 993, secure: true, auth: { user, pass }, logger: false });
  await client.connect();

  try {
    const lock = await client.getMailboxLock('INBOX');
    try {
      const status = await client.status('INBOX', { uidNext: true });
      const highestExisting = (status.uidNext || 1) - 1;

      if (lastUid === 0) {
        return { messages: [], newLastUid: highestExisting };
      }
      if (highestExisting <= lastUid) {
        return { messages: [], newLastUid: lastUid };
      }

      const messages: InboundReply[] = [];
      let newLastUid = lastUid;
      for await (const msg of client.fetch(`${lastUid + 1}:*`, { source: true }, { uid: true })) {
        if (msg.uid <= lastUid) continue; // IMAP range quirk: "X:*" with no new mail can re-return the last existing UID
        const parsed = await simpleParser(msg.source as Buffer);
        const from = parsed.from?.value?.[0]?.address || '';
        messages.push({ uid: msg.uid, from, text: (parsed.text || '').trim() });
        newLastUid = Math.max(newLastUid, msg.uid);
      }
      return { messages, newLastUid };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}
