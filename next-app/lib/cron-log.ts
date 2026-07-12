import { connectDB } from './mongodb';
import { CronLog } from './models/CronLog';

// Fire-and-forget — a logging failure must never break the cron job itself.
export async function logCronRun(job: string, status: 'success' | 'error', summary: string, error?: string) {
  try {
    await connectDB();
    await CronLog.create({ job, status, summary, error });
  } catch (e) {
    console.error('[cron-log] failed to record run:', e);
  }
}
