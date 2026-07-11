'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Wrench, LayoutDashboard, ClipboardList, Package, Users, UserCog, Receipt,
  BarChart3, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Activity, ArrowUpRight, CalendarClock, X, IndianRupee, Gauge, AlertTriangle,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Job Cards', Icon: ClipboardList },
  { label: 'Spare Parts', Icon: Package },
  { label: 'Customers', Icon: Users },
  { label: 'Mechanics', Icon: UserCog },
  { label: 'Invoices', Icon: Receipt },
  { label: 'Reports', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Jobs In Progress', value: '38', delta: '+9%', up: true, Icon: ClipboardList },
  { label: 'Revenue Today', value: '₹2.4L', delta: '+14%', up: true, Icon: IndianRupee },
  { label: 'Parts Low Stock', value: '9', delta: '-3', up: false, Icon: AlertTriangle },
  { label: 'Avg Turnaround', value: '1.8 days', delta: '-0.3d', up: false, Icon: Gauge },
];

const weekJobs = [
  { day: 'Mon', v: 22 }, { day: 'Tue', v: 28 }, { day: 'Wed', v: 25 },
  { day: 'Thu', v: 31 }, { day: 'Fri', v: 35 }, { day: 'Sat', v: 40 }, { day: 'Sun', v: 14 },
];

const jobCards = [
  { id: 'JOB-2291', vehicle: 'Maruti Swift · MH12AB4521', customer: 'Rohit Sharma', status: 'In Progress', eta: 'Today, 4:30 PM' },
  { id: 'JOB-2292', vehicle: 'Hyundai Creta · KA05MZ7788', customer: 'Neha Kapoor', status: 'Awaiting Parts', eta: 'Tomorrow' },
  { id: 'JOB-2293', vehicle: 'Honda City · DL8CAF3345', customer: 'Arjun Verma', status: 'Ready', eta: 'Ready for pickup' },
  { id: 'JOB-2294', vehicle: 'Tata Nexon · TN09BZ9081', customer: 'Priya Nair', status: 'In Progress', eta: 'Today, 6:00 PM' },
  { id: 'JOB-2295', vehicle: 'Mahindra XUV700 · GJ01XY2210', customer: 'Karan Mehta', status: 'Awaiting Parts', eta: 'In 2 days' },
];

const statusStyle: Record<string, string> = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
  'Awaiting Parts': 'bg-amber-50 text-amber-700 border-amber-100',
  Ready: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const lowStockParts = [
  { name: 'Brake Pads (Maruti)', qty: '4 left', reorder: true },
  { name: 'Engine Oil 5W-30', qty: '12 left', reorder: false },
  { name: 'Air Filter (Hyundai)', qty: '3 left', reorder: true },
  { name: 'Clutch Plate (Honda)', qty: '6 left', reorder: false },
  { name: 'Wiper Blades', qty: '8 left', reorder: false },
];

const mechanics = [
  { name: 'Suresh Pawar', load: 92 },
  { name: 'Devendra Rao', load: 88 },
  { name: 'Iqbal Sheikh', load: 78 },
  { name: 'Ramu Naik', load: 65 },
  { name: 'Farhan Ali', load: 54 },
];

export default function WorkshopDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 grid place-items-center">
            <Wrench className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Garage<span className="text-indigo-400">OS</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Malhotra Auto Care</div>
            <div className="text-[11px] text-slate-400 mb-3">Enterprise Plan · 12 bays</div>
            <Link href="/demo/workshop" className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
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
              placeholder="Search job cards, customers, parts…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 grid place-items-center text-indigo-700 text-xs font-bold">RA</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rajeev Admin</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-indigo-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/workshop" className="underline font-semibold hover:text-indigo-100">Get this for your workshop →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-indigo-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rajeev</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening at Malhotra Auto Care today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 grid place-items-center">
                    <s.Icon className="w-4.5 h-4.5 text-indigo-600" />
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
            {/* Weekly jobs chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Jobs Completed This Week</h3>
                <span className="text-[11px] text-slate-400">Last 7 days</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekJobs.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-indigo-500/90" style={{ height: `${(d.v / 40) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mechanic workload */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Mechanic Workload</h3>
              <div className="space-y-4">
                {mechanics.map(m => (
                  <div key={m.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{m.name}</span>
                      <span className="font-bold">{m.load}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.load > 90 ? 'bg-rose-500' : m.load > 75 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                        style={{ width: `${m.load}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Active job cards table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Active Job Cards</h3>
                <span className="text-[11px] font-semibold text-indigo-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Job / Vehicle</th>
                      <th className="px-5 py-2.5 font-semibold">Customer</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Est. Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobCards.map(j => (
                      <tr key={j.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{j.vehicle}</div>
                          <div className="text-[11px] text-slate-400">{j.id}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{j.customer}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[j.status]}`}>{j.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-xs">{j.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Parts running low */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Parts Running Low</h3>
              <div className="space-y-3">
                {lowStockParts.map(p => (
                  <div key={p.name} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${p.reorder ? 'bg-rose-50' : 'bg-slate-50'}`}>
                      <Package className={`w-4 h-4 ${p.reorder ? 'text-rose-500' : 'text-slate-400'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800 truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.qty}{p.reorder ? ' · Reorder now' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/workshop"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
              >
                <CalendarClock className="w-3.5 h-3.5" /> Get This For Your Workshop
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
