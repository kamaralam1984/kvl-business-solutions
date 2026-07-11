'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Receipt, LayoutDashboard, Users, CreditCard, Package, FileText, BarChart2,
  Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Activity, Clock, ArrowUpRight, ShieldCheck, Wallet, X,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Invoices', Icon: FileText },
  { label: 'Customers', Icon: Users },
  { label: 'Payments', Icon: CreditCard },
  { label: 'Inventory', Icon: Package },
  { label: 'GST Reports', Icon: BarChart2 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Invoices Today', value: '47', delta: '+15%', up: true, Icon: FileText },
  { label: 'Revenue Collected', value: '₹2.84L', delta: '+9%', up: true, Icon: Wallet },
  { label: 'Pending Payments', value: '₹68,400', delta: '-12%', up: false, Icon: Clock },
  { label: 'GST to File', value: '₹41,200', delta: 'Due in 6 days', up: false, Icon: Receipt },
];

const salesWeek = [
  { day: 'Mon', v: 58 }, { day: 'Tue', v: 72 }, { day: 'Wed', v: 65 },
  { day: 'Thu', v: 80 }, { day: 'Fri', v: 74 }, { day: 'Sat', v: 92 }, { day: 'Sun', v: 38 },
];

const recentInvoices = [
  { id: 'INV-2451', name: 'Ramesh Traders', amount: '₹12,480', status: 'Paid', date: '11 Jul' },
  { id: 'INV-2452', name: 'Priya Textiles', amount: '₹34,200', status: 'Pending', date: '11 Jul' },
  { id: 'INV-2453', name: 'Kumar Hardware', amount: '₹8,750', status: 'Paid', date: '10 Jul' },
  { id: 'INV-2454', name: 'Sharma Electronics', amount: '₹56,900', status: 'Overdue', date: '08 Jul' },
  { id: 'INV-2455', name: 'Verma Traders', amount: '₹19,300', status: 'Paid', date: '10 Jul' },
];

const statusStyle: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
  Overdue: 'bg-rose-50 text-rose-700 border-rose-100',
};

const paymentsDue = [
  { name: 'Anita Distributors', amount: '₹22,500', due: 'Due 14 Jul' },
  { name: 'Kunal Enterprises', amount: '₹9,800', due: 'Due 15 Jul' },
  { name: 'Om Sai Traders', amount: '₹41,000', due: 'Due 16 Jul' },
  { name: 'Ganesh Hardware', amount: '₹6,250', due: 'Due 18 Jul' },
  { name: 'Deepak & Sons', amount: '₹15,700', due: 'Due 20 Jul' },
];

const paymentModes = [
  { name: 'UPI', pct: 45, color: 'bg-green-500' },
  { name: 'Cash', pct: 28, color: 'bg-sky-500' },
  { name: 'Card', pct: 18, color: 'bg-amber-500' },
  { name: 'Credit', pct: 9, color: 'bg-slate-400' },
];

export default function BillingDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-green-500 grid place-items-center">
            <Receipt className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Invoice<span className="text-green-400">Hero</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Mehta Electronics</div>
            <div className="text-[11px] text-slate-400 mb-3">Standard Plan · GST Registered</div>
            <Link href="/demo/billing" className="text-[11px] font-semibold text-green-400 hover:text-green-300 flex items-center gap-1">
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
              placeholder="Search invoices, customers, items…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 grid place-items-center text-green-700 text-xs font-bold">RM</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rakesh Mehta</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Owner</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-green-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/billing" className="underline font-semibold hover:text-green-100">Get this for your business →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-green-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rakesh</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening at Mehta Electronics today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-green-50 grid place-items-center">
                    <s.Icon className="w-4.5 h-4.5 text-green-600" />
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
            {/* Weekly sales chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Sales This Week</h3>
                <span className="text-[11px] text-slate-400">Last 7 days</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {salesWeek.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-green-500/90" style={{ height: `${(d.v / 92) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment modes split */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Payment Modes Split</h3>
              <div className="space-y-4">
                {paymentModes.map(m => (
                  <div key={m.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{m.name}</span>
                      <span className="font-bold">{m.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Recent invoices table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Recent Invoices</h3>
                <span className="text-[11px] font-semibold text-green-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Invoice</th>
                      <th className="px-5 py-2.5 font-semibold">Amount</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map(inv => (
                      <tr key={inv.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{inv.name}</div>
                          <div className="text-[11px] text-slate-400">{inv.id}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{inv.amount}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[inv.status]}`}>{inv.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-xs">{inv.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payments due */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Payments Due</h3>
              <div className="space-y-3">
                {paymentsDue.map(p => (
                  <div key={p.name} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.amount} · {p.due}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/billing"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Get This For Your Business
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
