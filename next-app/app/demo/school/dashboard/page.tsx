'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  GraduationCap, LayoutDashboard, Users, BadgeIndianRupee, CalendarCheck, BookOpen, Bus,
  UserCog, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Sparkles, CalendarDays, ArrowUpRight, X,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Students', Icon: Users },
  { label: 'Fees', Icon: BadgeIndianRupee },
  { label: 'Attendance', Icon: CalendarCheck },
  { label: 'Exams', Icon: BookOpen },
  { label: 'Transport', Icon: Bus },
  { label: 'Staff', Icon: UserCog },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Total Students', value: '2,412', delta: '+3.2%', up: true, Icon: Users },
  { label: 'Fee Collected This Month', value: '₹18.6L', delta: '+11%', up: true, Icon: BadgeIndianRupee },
  { label: 'Attendance Today', value: '94.1%', delta: '+1.4%', up: true, Icon: CalendarCheck },
  { label: 'Upcoming Exams', value: '6', delta: '+2', up: true, Icon: BookOpen },
];

const weekAttendance = [
  { day: 'Mon', v: 96 }, { day: 'Tue', v: 94 }, { day: 'Wed', v: 95 },
  { day: 'Thu', v: 91 }, { day: 'Fri', v: 93 }, { day: 'Sat', v: 97 }, { day: 'Sun', v: 0 },
];

const classFees = [
  { name: 'Class 8', pct: 92 },
  { name: 'Class 9', pct: 88 },
  { name: 'Class 10', pct: 97 },
  { name: 'Class 11', pct: 81 },
  { name: 'Class 12', pct: 95 },
];

const classFeeColor: Record<string, string> = {
  'Class 8': 'bg-violet-500',
  'Class 9': 'bg-blue-500',
  'Class 10': 'bg-emerald-500',
  'Class 11': 'bg-amber-500',
  'Class 12': 'bg-rose-500',
};

const recentPayments = [
  { id: 'STU-2231', name: 'Aditya Rane', cls: '10-B', status: 'Paid', date: '11 Jul' },
  { id: 'STU-2244', name: 'Meera Krishnan', cls: '9-A', status: 'Paid', date: '11 Jul' },
  { id: 'STU-2256', name: 'Farhan Sheikh', cls: '11-C', status: 'Pending', date: '10 Jul' },
  { id: 'STU-2268', name: 'Ishita Bhattacharya', cls: '8-A', status: 'Paid', date: '10 Jul' },
  { id: 'STU-2279', name: 'Rohan Deshpande', cls: '12-B', status: 'Pending', date: '09 Jul' },
];

const statusStyle: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
};

const events = [
  { date: '14 Jul', label: 'PTA Meeting — Classes 6 to 8' },
  { date: '17 Jul', label: 'Unit Test 1 begins (All Classes)' },
  { date: '21 Jul', label: 'Independence Day rehearsal' },
  { date: '26 Jul', label: 'School closed — Local Holiday' },
  { date: '02 Aug', label: 'Annual Sports Day trials' },
];

export default function SchoolDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-violet-500 grid place-items-center">
            <GraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Campus<span className="text-violet-400">360</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Sunrise Public School</div>
            <div className="text-[11px] text-slate-400 mb-3">Premium Plan · 2,412 students</div>
            <Link href="/demo/school" className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1">
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
              placeholder="Search students, staff, records…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 grid place-items-center text-violet-700 text-xs font-bold">RA</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Mrs. Radhika Apte</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-violet-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/school" className="underline font-semibold hover:text-violet-100">Get this for your school →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-violet-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Mrs. Apte</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening at Sunrise Public School today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 grid place-items-center">
                    <s.Icon className="w-4.5 h-4.5 text-violet-600" />
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
                <h3 className="font-bold text-sm">Attendance This Week</h3>
                <span className="text-[11px] text-slate-400">Mon – Sun</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekAttendance.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-violet-500/90" style={{ height: `${(d.v / 97) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Class-wise fee collection */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Class-wise Fee Collection</h3>
              <div className="space-y-4">
                {classFees.map(c => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{c.name}</span>
                      <span className="font-bold">{c.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${classFeeColor[c.name]}`}
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Recent admissions / fee payments table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Recent Admissions / Fee Payments</h3>
                <span className="text-[11px] font-semibold text-violet-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Student</th>
                      <th className="px-5 py-2.5 font-semibold">Class / Section</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.id}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{p.cls}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[p.status]}`}>{p.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-xs">{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming events */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events.map(e => (
                  <div key={e.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{e.date}</div>
                      <div className="text-[11px] text-slate-500 truncate">{e.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/school"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5" /> Get This For Your School
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
