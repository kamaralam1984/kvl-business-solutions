'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Fingerprint, LayoutDashboard, Users, Clock, CalendarCheck, CalendarClock,
  Timer, BarChart2, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  ArrowUpRight, X, UserCheck,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Today', Icon: CalendarCheck },
  { label: 'Employees', Icon: Users },
  { label: 'Shifts', Icon: Clock },
  { label: 'Leaves', Icon: CalendarClock },
  { label: 'Overtime', Icon: Timer },
  { label: 'Reports', Icon: BarChart2 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Present Today', value: '1,142', delta: '+3%', up: true, Icon: UserCheck },
  { label: 'On Leave', value: '38', delta: '-6', up: false, Icon: CalendarClock },
  { label: 'Late Arrivals', value: '24', delta: '+5%', up: false, Icon: Clock },
  { label: 'Avg Work Hours', value: '8.4 hrs', delta: '+0.2', up: true, Icon: Timer },
];

const weekAttendance = [
  { day: 'Mon', v: 96 }, { day: 'Tue', v: 94 }, { day: 'Wed', v: 91 },
  { day: 'Thu', v: 95 }, { day: 'Fri', v: 89 }, { day: 'Sat', v: 78 }, { day: 'Sun', v: 40 },
];

const todaysLog = [
  { id: 'EMP-2041', name: 'Rohit Sharma', shift: 'Morning Shift', status: 'Present', time: '09:02 AM' },
  { id: 'EMP-2042', name: 'Anjali Deshmukh', shift: 'Morning Shift', status: 'Present', time: '08:58 AM' },
  { id: 'EMP-2043', name: 'Farhan Sheikh', shift: 'Afternoon Shift', status: 'Late', time: '02:35 PM' },
  { id: 'EMP-2044', name: 'Meena Pillai', shift: 'Morning Shift', status: 'Present', time: '09:10 AM' },
  { id: 'EMP-2045', name: 'Vikas Chauhan', shift: 'Night Shift', status: 'Absent', time: '—' },
];

const statusStyle: Record<string, string> = {
  Present: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Late: 'bg-amber-50 text-amber-700 border-amber-100',
  Absent: 'bg-rose-50 text-rose-700 border-rose-100',
};

const leaveRequests = [
  { name: 'Neha Kapoor', type: 'Sick Leave', dates: '14–15 Jul' },
  { name: 'Aditya Rane', type: 'Casual Leave', dates: '18 Jul' },
  { name: 'Suman Bala', type: 'Earned Leave', dates: '22–26 Jul' },
  { name: 'Irfan Qureshi', type: 'Sick Leave', dates: '13 Jul' },
  { name: 'Divya Menon', type: 'Casual Leave', dates: '20 Jul' },
];

const shiftCoverage = [
  { name: 'Morning', occ: 92, color: 'bg-emerald-500' },
  { name: 'Afternoon', occ: 85, color: 'bg-slate-700' },
  { name: 'Night', occ: 68, color: 'bg-amber-500' },
  { name: 'Weekend', occ: 54, color: 'bg-rose-500' },
];

export default function AttendanceDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-slate-700 grid place-items-center">
            <Fingerprint className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Time<span className="text-emerald-400">Track</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Meridian Textiles Pvt Ltd</div>
            <div className="text-[11px] text-slate-400 mb-3">Enterprise Plan · 1,240 employees</div>
            <Link href="/demo/attendance" className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
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
              placeholder="Search employees, shifts, records…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 grid place-items-center text-slate-700 text-xs font-bold">PA</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Priya Admin</div>
                <div className="text-[11px] text-slate-400 mt-0.5">HR Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-slate-700 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Fingerprint className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/attendance" className="underline font-semibold hover:text-slate-200">Get this for your team →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-slate-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Priya</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening at Meridian Textiles today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 grid place-items-center">
                    <s.Icon className="w-4.5 h-4.5 text-slate-700" />
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
                <h3 className="font-bold text-sm">Attendance % — This Week</h3>
                <span className="text-[11px] text-slate-400">Mon–Sun</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekAttendance.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-slate-700/90" style={{ height: `${(d.v / 96) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift coverage */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Shift Coverage</h3>
              <div className="space-y-4">
                {shiftCoverage.map(w => (
                  <div key={w.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{w.name}</span>
                      <span className="font-bold">{w.occ}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${w.color}`} style={{ width: `${w.occ}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Today's log table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Today&apos;s Log</h3>
                <span className="text-[11px] font-semibold text-slate-700">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Employee</th>
                      <th className="px-5 py-2.5 font-semibold">Shift</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Check-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysLog.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.id}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{p.shift}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[p.status]}`}>{p.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-xs">{p.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending leave requests */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Pending Leave Requests</h3>
              <div className="space-y-3">
                {leaveRequests.map(l => (
                  <div key={l.name} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <CalendarClock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{l.name} · {l.type}</div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1"><Clock className="w-3 h-3" />{l.dates}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/attendance"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <CalendarClock className="w-3.5 h-3.5" /> Get This For Your Team
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
