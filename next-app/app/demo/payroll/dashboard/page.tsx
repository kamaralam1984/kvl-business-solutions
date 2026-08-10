'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Wallet, LayoutDashboard, Users, IndianRupee, CalendarOff, FileText, ShieldCheck,
  FileBarChart2, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Activity, Banknote, ClipboardCheck, ArrowUpRight, CalendarClock, X, CalendarDays,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Employees', Icon: Users },
  { label: 'Salary', Icon: IndianRupee },
  { label: 'Leaves', Icon: CalendarOff },
  { label: 'Payslips', Icon: FileText },
  { label: 'Compliance', Icon: ShieldCheck },
  { label: 'Reports', Icon: FileBarChart2 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Total Employees', value: '618', delta: '+14', up: true, Icon: Users },
  { label: 'Payroll Processed', value: '₹1.42Cr', delta: '+6.8%', up: true, Icon: Banknote },
  { label: 'Pending Approvals', value: '9', delta: '-4', up: false, Icon: ClipboardCheck },
  { label: 'Compliance Status', value: '100%', delta: 'On Track', up: true, Icon: ShieldCheck },
];

const payrollCost = [
  { period: 'Jan', v: 118 }, { period: 'Feb', v: 121 }, { period: 'Mar', v: 126 },
  { period: 'Apr', v: 124 }, { period: 'May', v: 131 }, { period: 'Jun', v: 138 }, { period: 'Jul', v: 142 },
];

const headcount = [
  { name: 'Sales', pct: 32, color: 'bg-sky-500' },
  { name: 'Engineering', pct: 41, color: 'bg-indigo-500' },
  { name: 'Operations', pct: 18, color: 'bg-emerald-500' },
  { name: 'Support', pct: 9, color: 'bg-amber-500' },
];

const recentPayslips = [
  { name: 'Rohit Sharma', id: 'EMP-2231', dept: 'Sales', net: '₹68,400', status: 'Paid' },
  { name: 'Ananya Iyer', id: 'EMP-2244', dept: 'Engineering', net: '₹94,200', status: 'Paid' },
  { name: 'Vikram Singh Rathore', id: 'EMP-2198', dept: 'Operations', net: '₹52,750', status: 'Processing' },
  { name: 'Farah Sheikh', id: 'EMP-2267', dept: 'Support', net: '₹41,300', status: 'Paid' },
  { name: 'Karthik Balasubramanian', id: 'EMP-2211', dept: 'Engineering', net: '₹1,02,600', status: 'Processing' },
];

const statusStyle: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Processing: 'bg-amber-50 text-amber-700 border-amber-100',
};

const leaveRequests = [
  { name: 'Priya Ramanathan', type: 'Sick Leave', dates: '14 – 15 Jul' },
  { name: 'Devansh Oberoi', type: 'Earned Leave', dates: '18 – 22 Jul' },
  { name: 'Sana Qureshi', type: 'Casual Leave', dates: '16 Jul' },
  { name: 'Mohit Chauhan', type: 'Comp Off', dates: '17 Jul' },
  { name: 'Lakshmi Narayanan', type: 'Earned Leave', dates: '21 – 25 Jul' },
];

export default function PayrollDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-sky-500 grid place-items-center">
            <Wallet className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Pay<span className="text-sky-400">Sure</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Kavya Textiles Pvt Ltd</div>
            <div className="text-[11px] text-slate-400 mb-3">Growth Plan · 618 employees</div>
            <Link href="/demo/payroll" className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1">
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
              placeholder="Search employees, payslips, filings…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-100 grid place-items-center text-sky-700 text-xs font-bold">PR</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Priya Ramanathan</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-sky-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/payroll" className="underline font-semibold hover:text-sky-100">Get this for your company →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-sky-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Priya</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across Kavya Textiles Pvt Ltd today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 grid place-items-center">
                    <s.Icon className="w-[18px] h-[18px] text-sky-600" />
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
            {/* Payroll cost chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Payroll Cost — Last 7 Months</h3>
                <span className="text-[11px] text-slate-400">₹ Lakh</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {payrollCost.map(d => (
                  <div key={d.period} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-sky-500/90" style={{ height: `${(d.v / 142) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.period}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department headcount */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Department Headcount</h3>
              <div className="space-y-4">
                {headcount.map(h => (
                  <div key={h.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{h.name}</span>
                      <span className="font-bold">{h.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${h.color}`} style={{ width: `${h.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Recent payslips table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Recent Payslips</h3>
                <span className="text-[11px] font-semibold text-sky-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Employee</th>
                      <th className="px-5 py-2.5 font-semibold">Department</th>
                      <th className="px-5 py-2.5 font-semibold">Net Pay</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayslips.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.id}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{p.dept}</td>
                        <td className="px-5 py-3 text-slate-600">{p.net}</td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[p.status]}`}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leave requests */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Leave Requests</h3>
              <div className="space-y-3">
                {leaveRequests.map(l => (
                  <div key={l.name + l.dates} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{l.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{l.type} · {l.dates}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/payroll"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
              >
                <CalendarClock className="w-3.5 h-3.5" /> Get This For Your Company
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
