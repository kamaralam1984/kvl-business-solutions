'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Building2, LayoutDashboard, Home, Users, MapPin, BadgeIndianRupee, FileStack,
  BarChart3, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Flame, Clock, ArrowUpRight, CalendarClock, X,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Properties', Icon: Home },
  { label: 'Leads', Icon: Users },
  { label: 'Site Visits', Icon: MapPin },
  { label: 'Commission', Icon: BadgeIndianRupee },
  { label: 'Documents', Icon: FileStack },
  { label: 'Reports', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Active Listings', value: '312', delta: '+9%', up: true, Icon: Home },
  { label: 'New Leads This Month', value: '186', delta: '+22%', up: true, Icon: Users },
  { label: 'Site Visits Scheduled', value: '47', delta: '+11%', up: true, Icon: MapPin },
  { label: 'Deals Closed', value: '23', delta: '-3', up: false, Icon: BadgeIndianRupee },
];

const weekLeads = [
  { day: 'Mon', v: 24 }, { day: 'Tue', v: 31 }, { day: 'Wed', v: 27 },
  { day: 'Thu', v: 38 }, { day: 'Fri', v: 34 }, { day: 'Sat', v: 42 }, { day: 'Sun', v: 19 },
];

const recentLeads = [
  { name: 'Rohit Bansal', phone: '+91 98110 22341', property: '3BHK, Emerald Heights, Sector 62', status: 'Hot', last: 'Today, 10:20 AM' },
  { name: 'Neha Kapoor', phone: '+91 99530 44127', property: '2BHK, Palm Residency, Wakad', status: 'Warm', last: 'Today, 09:05 AM' },
  { name: 'Arvind Choudhary', phone: '+91 90210 88765', property: 'Villa, Green Meadows, Whitefield', status: 'Hot', last: 'Yesterday, 5:40 PM' },
  { name: 'Priyanka Menon', phone: '+91 98450 33218', property: '4BHK Penthouse, Skyline Towers', status: 'Cold', last: '2 days ago' },
  { name: 'Sandeep Rathi', phone: '+91 97170 65590', property: '1BHK, Sunrise Apartments, Baner', status: 'Warm', last: '3 days ago' },
];

const statusStyle: Record<string, string> = {
  Hot: 'bg-rose-50 text-rose-700 border-rose-100',
  Warm: 'bg-amber-50 text-amber-700 border-amber-100',
  Cold: 'bg-blue-50 text-blue-700 border-blue-100',
};

const siteVisits = [
  { time: '11:00 AM', client: 'Rohit Bansal', property: 'Emerald Heights, Sector 62' },
  { time: '12:30 PM', client: 'Kiran Deshmukh', property: 'Palm Residency, Wakad' },
  { time: '02:15 PM', client: 'Farhan Sheikh', property: 'Green Meadows, Whitefield' },
  { time: '04:00 PM', client: 'Meera Iyer', property: 'Skyline Towers, Powai' },
  { time: '05:30 PM', client: 'Ajay Thakur', property: 'Sunrise Apartments, Baner' },
];

const pipeline = [
  { stage: 'Enquiry', pct: 100, color: 'bg-emerald-500' },
  { stage: 'Site Visit', pct: 68, color: 'bg-teal-500' },
  { stage: 'Negotiation', pct: 41, color: 'bg-amber-500' },
  { stage: 'Booked', pct: 22, color: 'bg-emerald-700' },
];

export default function RealEstateDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 grid place-items-center">
            <Building2 className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Property<span className="text-emerald-400">IQ</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Skyline Realty</div>
            <div className="text-[11px] text-slate-400 mb-3">Growth Plan · 18 agents</div>
            <Link href="/demo/real-estate" className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
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
              placeholder="Search leads, properties, agents…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 grid place-items-center text-emerald-700 text-xs font-bold">RM</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rajeev Malhotra</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Admin</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-emerald-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/real-estate" className="underline font-semibold hover:text-emerald-100">Get this for your agency →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-emerald-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rajeev</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening at Skyline Realty today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 grid place-items-center">
                    <s.Icon className="w-[18px] h-[18px] text-emerald-600" />
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
            {/* Weekly leads chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Leads This Week</h3>
                <span className="text-[11px] text-slate-400">Last 7 days</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekLeads.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-emerald-500/90" style={{ height: `${(d.v / 42) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead pipeline stage */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Lead Pipeline Stage</h3>
              <div className="space-y-4">
                {pipeline.map(p => (
                  <div key={p.stage}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{p.stage}</span>
                      <span className="font-bold">{p.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.color}`}
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Recent leads table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Recent Leads</h3>
                <span className="text-[11px] font-semibold text-emerald-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Lead</th>
                      <th className="px-5 py-2.5 font-semibold">Property Interested</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Last Contacted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map(l => (
                      <tr key={l.name} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{l.name}</div>
                          <div className="text-[11px] text-slate-400">{l.phone}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{l.property}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[l.status]}`}>
                            {l.status === 'Hot' && <Flame className="w-2.5 h-2.5" />} {l.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-xs">{l.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming site visits */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Upcoming Site Visits</h3>
              <div className="space-y-3">
                {siteVisits.map(v => (
                  <div key={v.time + v.client} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{v.time} · {v.client}</div>
                      <div className="text-[11px] text-slate-500 truncate">{v.property}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/real-estate"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              >
                <CalendarClock className="w-3.5 h-3.5" /> Get This For Your Agency
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
