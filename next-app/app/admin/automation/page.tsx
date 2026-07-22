'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

type LogEntry = { status: 'success' | 'error'; summary?: string; error?: string; ranAt: string };
type JobHealth = { job: string; schedule: string; lastRun: LogEntry | null; history: LogEntry[] };

const LABELS: Record<string, string> = {
  'lead-followup': 'Lead Follow-up Sequence',
  'lead-nurture': 'AI Nurture Emails',
  'review-request': 'Google Review Requests',
  'abandoned-orders': 'Abandoned Checkout Recovery',
  'renewal-reminders': 'License Renewal Reminders',
  'workflow-triggers': 'Time-Based Workflow Triggers',
  'expire-coupons': 'Coupon Expiry Cleanup',
  'vip-lead-scoring': 'VIP Lead Scoring Recompute',
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function AutomationHealthPage() {
  const [jobs, setJobs] = useState<JobHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cron-health').then(r => r.json()).then(d => { if (d.ok) setJobs(d.jobs); }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>
          Automation Health
        </h1>
        <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
          Last run status for every scheduled marketing automation job.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
              <AdminSkeleton rows={2} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {jobs.map(j => {
            const last = j.lastRun;
            const neverRun = !last;
            const ok = last?.status === 'success';
            return (
              <div
                key={j.job}
                className="admin-card-hover kpi-enter rounded-2xl p-5"
                style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-[14px] font-bold" style={{ color: 'rgb(var(--text))' }}>{LABELS[j.job] || j.job}</h2>
                      {neverRun ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#fbbf24' }}>
                          <AlertTriangle className="w-3.5 h-3.5" /> Never run yet
                        </span>
                      ) : ok ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#4ade80' }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#f87171' }}>
                          <XCircle className="w-3.5 h-3.5" /> Last run failed
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] font-mono mt-1" style={{ color: 'rgba(var(--text) / 0.25)' }}>{j.job} · {j.schedule}</div>
                  </div>
                  {last && (
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium justify-end" style={{ color: 'rgba(var(--text) / 0.4)' }}>
                        <Clock className="w-3 h-3" /> {timeAgo(last.ranAt)}
                      </div>
                      <div className="text-[11.5px] mt-1" style={{ color: ok ? 'rgba(var(--text) / 0.5)' : '#f87171' }}>
                        {ok ? last.summary : (last.error || last.summary)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
