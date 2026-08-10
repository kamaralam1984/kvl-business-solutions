'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  LayoutDashboard,
  Users,
  GitBranch,
  Bell,
  Contact,
  BarChart3,
  Settings,
  LogOut,
  Search,
  UserPlus,
  Trophy,
  IndianRupee,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  X,
  ArrowRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Leads', icon: Users, active: false },
  { label: 'Pipeline', icon: GitBranch, active: false },
  { label: 'Follow-ups', icon: Bell, active: false },
  { label: 'Contacts', icon: Contact, active: false },
  { label: 'Reports', icon: BarChart3, active: false },
  { label: 'Settings', icon: Settings, active: false },
];

const STATS = [
  {
    label: 'New Leads Today',
    value: '34',
    delta: '+18%',
    up: true,
    icon: UserPlus,
  },
  {
    label: 'Deals Won',
    value: '12',
    delta: '+6%',
    up: true,
    icon: Trophy,
  },
  {
    label: 'Pipeline Value',
    value: '₹42.8L',
    delta: '+9%',
    up: true,
    icon: IndianRupee,
  },
  {
    label: 'Follow-ups Due',
    value: '17',
    delta: '5 overdue',
    up: false,
    icon: Clock,
  },
];

const WEEKLY_LEADS = [
  { day: 'Mon', value: 22 },
  { day: 'Tue', value: 31 },
  { day: 'Wed', value: 18 },
  { day: 'Thu', value: 27 },
  { day: 'Fri', value: 35 },
  { day: 'Sat', value: 29 },
  { day: 'Sun', value: 15 },
];
const WEEKLY_MAX = Math.max(...WEEKLY_LEADS.map((d) => d.value));

const PIPELINE_STAGES = [
  { stage: 'Prospecting', pct: 82, color: 'bg-slate-400' },
  { stage: 'Qualified', pct: 64, color: 'bg-sky-500' },
  { stage: 'Proposal', pct: 47, color: 'bg-amber-500' },
  { stage: 'Negotiation', pct: 33, color: 'bg-rose-500' },
  { stage: 'Won', pct: 21, color: 'bg-emerald-500' },
];

const RECENT_LEADS = [
  {
    name: 'Rahul Mehta',
    id: 'LD-2291',
    company: 'Zenith Textiles Pvt Ltd',
    source: 'Website',
    status: 'New',
    time: '12 min ago',
  },
  {
    name: 'Sneha Iyer',
    id: 'LD-2288',
    company: 'Coastline Logistics',
    source: 'Referral',
    status: 'Qualified',
    time: '45 min ago',
  },
  {
    name: 'Arjun Nair',
    id: 'LD-2285',
    company: 'Northbridge Fintech',
    source: 'WhatsApp',
    status: 'Contacted',
    time: '1 hr ago',
  },
  {
    name: 'Priya Sharma',
    id: 'LD-2279',
    company: 'Meridian Realty Group',
    source: 'Facebook Ads',
    status: 'Won',
    time: '2 hrs ago',
  },
  {
    name: 'Karan Malhotra',
    id: 'LD-2271',
    company: 'Vantage Ceramics',
    source: 'Cold Call',
    status: 'Lost',
    time: '4 hrs ago',
  },
];

const STATUS_STYLES: Record<string, string> = {
  New: 'bg-sky-50 text-sky-700',
  Contacted: 'bg-amber-50 text-amber-700',
  Qualified: 'bg-violet-50 text-violet-700',
  Won: 'bg-emerald-50 text-emerald-700',
  Lost: 'bg-slate-100 text-slate-500',
};

const FOLLOWUPS = [
  { time: '10:30 AM', name: 'Rohit Verma', company: 'Zenith Textiles', note: 'Send updated proposal with GST breakup' },
  { time: '12:00 PM', name: 'Ananya Gupta', company: 'Skyline Developers', note: 'Confirm demo call for Tuesday' },
  { time: '2:15 PM', name: 'Manoj Tiwari', company: 'Coastal Foods', note: 'Follow up on pricing objection' },
  { time: '4:00 PM', name: 'Divya Krishnan', company: 'Northbridge Fintech', note: 'Share case study PDF' },
  { time: '5:30 PM', name: 'Suresh Pillai', company: 'Vantage Ceramics', note: 'Renewal discussion — contract ends this month' },
];

export default function CrmDemoDashboardPage() {
  const [bannerOpen, setBannerOpen] = useState(true);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="flex w-64 flex-shrink-0 flex-col bg-slate-900 text-slate-300">
        <div className="flex items-center gap-2.5 border-b border-slate-800 px-6 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white">
            <Target className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">PulseCRM</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                item.active
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="rounded-xl bg-slate-800/60 p-3.5">
            <p className="text-sm font-semibold text-white">Northbridge Sales Co.</p>
            <p className="mt-0.5 text-xs text-slate-400">Enterprise Plan</p>
          </div>
          <Link
            href="/demo/crm"
            className="mt-3 flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Exit demo
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads, deals, contacts…"
              className="w-full rounded-full bg-slate-100 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-rose-200"
            />
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                AK
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-tight">Aman Kapoor</p>
                <p className="text-xs leading-tight text-slate-400">Sales Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="flex flex-shrink-0 items-center justify-between gap-3 bg-rose-600 px-6 py-3 text-sm text-white">
            <p>
              You&rsquo;re viewing a live product demo. Like what you see?{' '}
              <Link href="/software/crm" className="font-semibold underline underline-offset-2">
                Get this for your sales team →
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setBannerOpen(false)}
              className="flex-shrink-0 rounded-full p-1 hover:bg-white/20"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {greeting}, Aman
            </h1>
            <p className="mt-1 text-sm text-slate-500">{dateStr}</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.delta}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-extrabold text-slate-900">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Chart + Pipeline */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Leads This Week</h2>
                <span className="text-xs font-medium text-slate-400">Mon &ndash; Sun</span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-3" style={{ height: 168 }}>
                {WEEKLY_LEADS.map((d) => (
                  <div
                    key={d.day}
                    className="flex flex-1 flex-col items-center justify-end"
                    style={{ height: 168 }}
                  >
                    <span className="mb-1 text-xs font-semibold text-slate-700">{d.value}</span>
                    <div
                      className="w-full rounded-t-lg bg-rose-500"
                      style={{ height: `${(d.value / WEEKLY_MAX) * 130}px` }}
                    />
                    <span className="mt-2 text-xs text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Pipeline by Stage</h2>
              <div className="mt-5 space-y-4">
                {PIPELINE_STAGES.map((s) => (
                  <div key={s.stage}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">{s.stage}</span>
                      <span className="font-semibold text-slate-900">{s.pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table + Followups */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Recent Leads</h2>
                <Link href="/demo/crm/dashboard" className="text-sm font-semibold text-rose-600 hover:text-rose-700">
                  View all →
                </Link>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <th className="pb-3 pr-4 font-semibold">Lead</th>
                      <th className="pb-3 pr-4 font-semibold">Source / Company</th>
                      <th className="pb-3 pr-4 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {RECENT_LEADS.map((lead) => (
                      <tr key={lead.id}>
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-slate-900">{lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.id}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-slate-700">{lead.company}</p>
                          <p className="text-xs text-slate-400">{lead.source}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[lead.status]}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{lead.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Follow-ups Due</h2>
              <div className="mt-4 flex-1 space-y-4">
                {FOLLOWUPS.map((f) => (
                  <div key={f.time + f.name} className="flex gap-3 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <span className="mt-0.5 flex-shrink-0 text-xs font-semibold text-rose-600">{f.time}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {f.name} <span className="font-normal text-slate-400">&middot; {f.company}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{f.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/crm"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
              >
                Get This For Your Sales Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
