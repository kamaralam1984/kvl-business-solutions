'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  HeartPulse, LayoutDashboard, Users, Bed, Pill, FlaskConical, Receipt,
  Stethoscope, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Activity, Clock, ArrowUpRight, CalendarClock, X,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Patients', Icon: Users },
  { label: 'OPD Queue', Icon: Activity },
  { label: 'IPD / Beds', Icon: Bed },
  { label: 'Pharmacy', Icon: Pill },
  { label: 'Lab Reports', Icon: FlaskConical },
  { label: 'Billing', Icon: Receipt },
  { label: 'Doctors', Icon: Stethoscope },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Patients Today', value: '284', delta: '+12%', up: true, Icon: Users },
  { label: 'Bed Occupancy', value: '82%', delta: '+4%', up: true, Icon: Bed },
  { label: "Today's Revenue", value: '₹4.8L', delta: '+8%', up: true, Icon: Receipt },
  { label: 'Pending Lab Reports', value: '17', delta: '-5', up: false, Icon: FlaskConical },
];

const weekInflow = [
  { day: 'Mon', v: 62 }, { day: 'Tue', v: 78 }, { day: 'Wed', v: 71 },
  { day: 'Thu', v: 90 }, { day: 'Fri', v: 84 }, { day: 'Sat', v: 96 }, { day: 'Sun', v: 55 },
];

const recentPatients = [
  { id: 'PT-4821', name: 'Ramesh Kumar', dept: 'Cardiology', status: 'Admitted', time: '09:12 AM' },
  { id: 'PT-4822', name: 'Sunita Devi', dept: 'Orthopedics', status: 'OPD', time: '09:24 AM' },
  { id: 'PT-4823', name: 'Aarav Mehta', dept: 'Pediatrics', status: 'Discharged', time: '09:31 AM' },
  { id: 'PT-4824', name: 'Fatima Sheikh', dept: 'Gynecology', status: 'OPD', time: '09:45 AM' },
  { id: 'PT-4825', name: 'Vikram Singh', dept: 'Neurology', status: 'Admitted', time: '10:02 AM' },
];

const statusStyle: Record<string, string> = {
  Admitted: 'bg-blue-50 text-blue-700 border-blue-100',
  OPD: 'bg-amber-50 text-amber-700 border-amber-100',
  Discharged: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const appointments = [
  { time: '11:00 AM', patient: 'Deepak Yadav', doctor: 'Dr. Nair — Cardiology' },
  { time: '11:30 AM', patient: 'Priya Sharma', doctor: 'Dr. Iyer — Dermatology' },
  { time: '12:15 PM', patient: 'Mohammed Aslam', doctor: 'Dr. Verma — Orthopedics' },
  { time: '01:00 PM', patient: 'Kavita Joshi', doctor: 'Dr. Rao — Pediatrics' },
];

const wards = [
  { name: 'General Ward', occ: 88 },
  { name: 'ICU', occ: 95 },
  { name: 'Maternity', occ: 64 },
  { name: 'Pediatric', occ: 52 },
];

export default function HospitalDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-teal-500 grid place-items-center">
            <HeartPulse className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight">VitalCare<span className="text-teal-400">HMS</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">City Care Hospital</div>
            <div className="text-[11px] text-slate-400 mb-3">Enterprise Plan · 340 beds</div>
            <Link href="/demo/hospital" className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1">
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
              placeholder="Search patients, doctors, records…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 grid place-items-center text-teal-700 text-xs font-bold">DA</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Dr. Admin</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-teal-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/hospital" className="underline font-semibold hover:text-teal-100">Get this for your hospital →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-teal-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Dr. Admin</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening at City Care Hospital today — Monday, 14 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 grid place-items-center">
                    <s.Icon className="w-4.5 h-4.5 text-teal-600" />
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
            {/* Weekly inflow chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Patient Inflow — This Week</h3>
                <span className="text-[11px] text-slate-400">Last 7 days</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekInflow.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-teal-500/90" style={{ height: `${(d.v / 96) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ward occupancy */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Ward Occupancy</h3>
              <div className="space-y-4">
                {wards.map(w => (
                  <div key={w.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{w.name}</span>
                      <span className="font-bold">{w.occ}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${w.occ > 90 ? 'bg-rose-500' : w.occ > 75 ? 'bg-amber-500' : 'bg-teal-500'}`}
                        style={{ width: `${w.occ}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Recent patients table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Recent Patients</h3>
                <span className="text-[11px] font-semibold text-teal-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Patient</th>
                      <th className="px-5 py-2.5 font-semibold">Department</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.id}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{p.dept}</td>
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

            {/* Upcoming appointments */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                {appointments.map(a => (
                  <div key={a.time} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{a.time} · {a.patient}</div>
                      <div className="text-[11px] text-slate-500 truncate">{a.doctor}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/hospital"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
              >
                <CalendarClock className="w-3.5 h-3.5" /> Get This For Your Hospital
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
