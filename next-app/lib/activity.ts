import { connectDB } from './mongodb';
import { ActivityLog } from './models/ActivityLog';
import { clientIp } from './rate-limit';

type LogInput = {
  action: string;
  actorEmail?: string;
  actorRole?: string;
  target?: string;
  targetId?: string;
  details?: any;
  req?: Request;
};

export async function logActivity(input: LogInput) {
  try {
    await connectDB();
    await ActivityLog.create({
      action: input.action,
      actorEmail: input.actorEmail,
      actorRole: input.actorRole,
      target: input.target,
      targetId: input.targetId,
      details: input.details,
      ip: input.req ? clientIp(input.req) : undefined,
    });
  } catch (e) {
    console.error('activity log error', e);
  }
}
