'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { AdminSkeleton } from '@/components/admin/AdminSkeleton';

type Daily = { date: string; count: number };

export default function VisitorStatsPage() {
  const [total, setTotal] = useState(0);
  const [daily, setDaily] = useState<Daily[]>([]);
  const [last7, setLast7] = useState(0);
  const [last30, setLast30] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/visitor-stats')
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setTotal(d.total); setDaily(d.daily); setLast7(d.last7); setLast30(d.last30); }
      })
      .finally(() => setLoading(false));
  }, []);

  const chartData = daily.map(d => ({
    label: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    count: d.count,
  }));

  const kpis = [
    { label: 'All-Time Visits', val: total.toLocaleString('en-IN'), Icon: Users, color: '#c8a96e' },
    { label: 'Last 7 Days', val: last7.toLocaleString('en-IN'), Icon: TrendingUp, color: '#4ade80' },
    { label: 'Last 30 Days', val: last30.toLocaleString('en-IN'), Icon: Calendar, color: '#60a5fa' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display font-black text-[1.8rem] tracking-tight leading-none" style={{ color: 'rgb(var(--text))' }}>
          Visitor Stats
        </h1>
        <p className="text-[13px] mt-2" style={{ color: 'rgba(var(--text) / 0.3)' }}>
          Every page load counts once per browser tab session (a refresh doesn't inflate the number).
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
              <AdminSkeleton rows={2} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 stagger-children">
            {kpis.map(k => (
              <div key={k.label} className="admin-card-hover kpi-enter rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <k.Icon className="w-4 h-4" style={{ color: k.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: 'rgba(var(--text) / 0.4)' }}>{k.label}</span>
                </div>
                <div className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{k.val}</div>
              </div>
            ))}
          </div>

          <div className="kpi-enter rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgb(var(--bg-2)) 0%, rgb(var(--bg-3)) 100%)', border: '1px solid rgba(var(--border) / 0.06)' }}>
            <h2 className="text-[13px] font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>Last 30 Days</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border) / 0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} interval={2} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(var(--text) / 0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgba(var(--border) / 0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'rgb(var(--text))' }} />
                <Bar dataKey="count" name="Visits" fill="#c8a96e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
