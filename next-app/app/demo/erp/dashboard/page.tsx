'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Network, LayoutDashboard, Landmark, ShoppingCart, BarChart3, Warehouse, Users,
  FileBarChart2, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Activity, Wallet, Boxes, ArrowUpRight, CalendarClock, X, Clock,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Accounting', Icon: Landmark },
  { label: 'Purchase', Icon: ShoppingCart },
  { label: 'Sales', Icon: BarChart3 },
  { label: 'Inventory', Icon: Warehouse },
  { label: 'HR', Icon: Users },
  { label: 'Reports', Icon: FileBarChart2 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Monthly Revenue', value: '₹1.86Cr', delta: '+9.2%', up: true, Icon: Wallet },
  { label: 'Open Purchase Orders', value: '42', delta: '+6', up: true, Icon: ShoppingCart },
  { label: 'Active Employees', value: '618', delta: '+14', up: true, Icon: Users },
  { label: 'Low Stock Items', value: '23', delta: '-7', up: false, Icon: Boxes },
];

const revenueTrend = [
  { period: 'Jan', v: 142 }, { period: 'Feb', v: 158 }, { period: 'Mar', v: 151 },
  { period: 'Apr', v: 171 }, { period: 'May', v: 165 }, { period: 'Jun', v: 182 }, { period: 'Jul', v: 186 },
];

const recentPOs = [
  { po: 'PO-8841', vendor: 'Shree Balaji Steel Traders', amount: '₹12,40,000', status: 'Approved', date: '09 Jul 2026' },
  { po: 'PO-8842', vendor: 'Anand Packaging Pvt Ltd', amount: '₹2,85,500', status: 'Pending', date: '09 Jul 2026' },
  { po: 'PO-8843', vendor: 'Vishal Electricals & Co.', amount: '₹6,10,200', status: 'Approved', date: '10 Jul 2026' },
  { po: 'PO-8844', vendor: 'Nirmal Logistics Services', amount: '₹95,000', status: 'Rejected', date: '10 Jul 2026' },
  { po: 'PO-8845', vendor: 'Prakash Raw Materials LLP', amount: '₹18,75,000', status: 'Pending', date: '11 Jul 2026' },
];

const statusStyle: Record<string, string> = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-100',
};

const approvals = [
  { type: 'Purchase Order', amount: '₹18,75,000', requester: 'Kavita Menon — Procurement' },
  { type: 'Expense Claim', amount: '₹42,300', requester: 'Rohan Desai — Sales' },
  { type: 'Leave Request', amount: '5 days', requester: 'Ayesha Khan — HR' },
  { type: 'Vendor Payment', amount: '₹6,10,200', requester: 'Suresh Pillai — Finance' },
  { type: 'Stock Transfer', amount: '340 units', requester: 'Manoj Tiwari — Warehouse' },
];

const budgets = [
  { name: 'Sales', pct: 84, color: 'bg-blue-500' },
  { name: 'Operations', pct: 91, color: 'bg-rose-500' },
  { name: 'HR', pct: 58, color: 'bg-amber-500' },
  { name: 'IT', pct: 67, color: 'bg-emerald-500' },
];

export default function ErpDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-blue-500 grid place-items-center">
            <Network className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-extrabold tracking-tight">CoreStack<span className="text-blue-400">ERP</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Meridian Industrial Group</div>
            <div className="text-[11px] text-slate-400 mb-3">Enterprise Plan · 14 branches</div>
            <Link href="/demo/erp" className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
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
              placeholder="Search vendors, invoices, employees…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 grid place-items-center text-blue-700 text-xs font-bold">RA</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rakesh Aggarwal</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-blue-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/erp" className="underline font-semibold hover:text-blue-100">Get this for your business →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-blue-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rakesh</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across Meridian Industrial Group today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 grid place-items-center">
                    <s.Icon className="w-[18px] h-[18px] text-blue-600" />
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
            {/* Revenue trend chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Revenue Trend</h3>
                <span className="text-[11px] text-slate-400">Last 7 months, ₹ Lakh</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {revenueTrend.map(d => (
                  <div key={d.period} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-blue-500/90" style={{ height: `${(d.v / 186) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.period}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department budget utilization */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Department Budget Utilization</h3>
              <div className="space-y-4">
                {budgets.map(b => (
                  <div key={b.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{b.name}</span>
                      <span className="font-bold">{b.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Recent purchase orders table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Recent Purchase Orders</h3>
                <span className="text-[11px] font-semibold text-blue-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">PO / Vendor</th>
                      <th className="px-5 py-2.5 font-semibold">Amount</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPOs.map(p => (
                      <tr key={p.po} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{p.vendor}</div>
                          <div className="text-[11px] text-slate-400">{p.po}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{p.amount}</td>
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

            {/* Pending approvals */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Pending Approvals</h3>
              <div className="space-y-3">
                {approvals.map(a => (
                  <div key={a.type + a.requester} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{a.type} · {a.amount}</div>
                      <div className="text-[11px] text-slate-500 truncate">{a.requester}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/erp"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                <CalendarClock className="w-3.5 h-3.5" /> Get This For Your Business
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
