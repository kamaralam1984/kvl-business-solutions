'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  HardHat, LayoutDashboard, FolderKanban, Boxes, Users2, Truck, GanttChartSquare,
  BarChart3, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Activity, Clock, ArrowUpRight, CalendarClock, X, Wallet,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Projects', Icon: FolderKanban },
  { label: 'Materials', Icon: Boxes },
  { label: 'Labour', Icon: Users2 },
  { label: 'Vendors', Icon: Truck },
  { label: 'Timeline', Icon: GanttChartSquare },
  { label: 'Reports', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Active Projects', value: '18', delta: '+3', up: true, Icon: FolderKanban },
  { label: 'Budget Utilized', value: '68%', delta: '+5%', up: true, Icon: Wallet },
  { label: 'Labour On Site Today', value: '412', delta: '+21', up: true, Icon: Users2 },
  { label: 'Materials Pending', value: '9', delta: '-4', up: false, Icon: Boxes },
];

const weekAttendance = [
  { day: 'Mon', v: 340 }, { day: 'Tue', v: 368 }, { day: 'Wed', v: 355 },
  { day: 'Thu', v: 390 }, { day: 'Fri', v: 412 }, { day: 'Sat', v: 421 }, { day: 'Sun', v: 180 },
];

const siteProgress = [
  { name: 'Riverside Residency, Pune', location: 'Riverside Residency, Pune', phase: 'Structure — 8th Floor', status: 'On Track', pct: 62 },
  { name: 'Greenfield IT Park, Hinjewadi', location: 'Greenfield IT Park, Hinjewadi', phase: 'Finishing — Block B', status: 'Delayed', pct: 74 },
  { name: 'Sunrise Villas, Lonavala', location: 'Sunrise Villas, Lonavala', phase: 'Foundation', status: 'On Track', pct: 21 },
  { name: 'Metro Business Bay, Nagpur', location: 'Metro Business Bay, Nagpur', phase: 'MEP Works', status: 'Ahead', pct: 88 },
  { name: 'Orchid Heights, Nashik', location: 'Orchid Heights, Nashik', phase: 'Structure — 4th Floor', status: 'On Track', pct: 45 },
];

const statusStyle: Record<string, string> = {
  'On Track': 'bg-blue-50 text-blue-700 border-blue-100',
  'Delayed': 'bg-rose-50 text-rose-700 border-rose-100',
  'Ahead': 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const vendorPayments = [
  { vendor: 'Shree Cement Suppliers', amount: '₹4,82,000', due: 'Due in 2 days' },
  { vendor: 'Balaji Steel & TMT', amount: '₹7,15,500', due: 'Due in 4 days' },
  { vendor: 'Om Electricals & MEP', amount: '₹1,94,200', due: 'Due in 5 days' },
  { vendor: 'Kunal Ready-Mix Concrete', amount: '₹3,60,000', due: 'Due in 6 days' },
  { vendor: 'Deshmukh Labour Contractors', amount: '₹9,20,750', due: 'Due in 8 days' },
];

const projectProgressList = [
  { name: 'Site A — Riverside Residency', pct: 62, color: 'bg-amber-500' },
  { name: 'Site B — Greenfield IT Park', pct: 74, color: 'bg-blue-500' },
  { name: 'Site C — Sunrise Villas', pct: 21, color: 'bg-rose-500' },
  { name: 'Site D — Metro Business Bay', pct: 88, color: 'bg-emerald-500' },
];

export default function ConstructionDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const maxAttendance = Math.max(...weekAttendance.map(d => d.v));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-amber-500 grid place-items-center">
            <HardHat className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Site<span className="text-amber-400">Control</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Patil Constructions</div>
            <div className="text-[11px] text-slate-400 mb-3">Enterprise Plan · 18 active sites</div>
            <Link href="/demo/construction" className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Exit demo <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 gap-4">
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search projects, vendors, materials…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 grid place-items-center text-amber-700 text-xs font-bold">RP</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rajendra Patil</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Project Manager</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-amber-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/construction" className="underline font-semibold hover:text-amber-100">Get this for your project →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-amber-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rajendra</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across your sites today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 grid place-items-center">
                    <s.Icon className="w-[18px] h-[18px] text-amber-600" />
                  </div>
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${s.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {s.delta}
                  </span>
                </div>
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4 mb-4">
            {/* Weekly attendance chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Labour Attendance — This Week</h3>
                <span className="text-[11px] text-slate-400">Last 7 days</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekAttendance.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-amber-500/90" style={{ height: `${(d.v / maxAttendance) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project progress */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Project Progress</h3>
              <div className="space-y-4">
                {projectProgressList.map(p => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{p.name}</span>
                      <span className="font-bold">{p.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Site progress table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Site Progress</h3>
                <span className="text-[11px] font-semibold text-amber-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Project</th>
                      <th className="px-5 py-2.5 font-semibold">Phase</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">% Complete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteProgress.map(p => (
                      <tr key={p.name} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{p.name.split(',')[0]}</div>
                          <div className="text-[11px] text-slate-400">{p.location}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{p.phase}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[p.status]}`}>{p.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-xs font-semibold">{p.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendor payments due */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Vendor Payments Due</h3>
              <div className="space-y-3">
                {vendorPayments.map(v => (
                  <div key={v.vendor} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800 truncate">{v.vendor}</div>
                      <div className="text-[11px] text-slate-500">{v.amount} · {v.due}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/construction"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
              >
                <CalendarClock className="w-3.5 h-3.5" /> Get This For Your Project
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
