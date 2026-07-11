'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  UtensilsCrossed, LayoutDashboard, Grid3X3, ShoppingCart, ChefHat, BookOpen,
  Truck, BarChart2, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Flame, Clock, ArrowUpRight, X, IndianRupee,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Tables', Icon: Grid3X3 },
  { label: 'Orders', Icon: ShoppingCart },
  { label: 'Kitchen', Icon: ChefHat },
  { label: 'Menu', Icon: BookOpen },
  { label: 'Delivery', Icon: Truck },
  { label: 'Reports', Icon: BarChart2 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Orders Today', value: '186', delta: '+14%', up: true, Icon: ShoppingCart },
  { label: "Revenue Today", value: '₹1.42L', delta: '+9%', up: true, Icon: IndianRupee },
  { label: 'Tables Occupied', value: '9 / 12', delta: '+2', up: true, Icon: Grid3X3 },
  { label: 'Avg Order Value', value: '₹764', delta: '-3%', up: false, Icon: TrendingUp },
];

const weekOrders = [
  { day: 'Mon', v: 142 }, { day: 'Tue', v: 158 }, { day: 'Wed', v: 134 },
  { day: 'Thu', v: 171 }, { day: 'Fri', v: 205 }, { day: 'Sat', v: 238 }, { day: 'Sun', v: 196 },
];

type TableStatus = 'available' | 'occupied' | 'cleaning';
const tables: { no: number; status: TableStatus }[] = [
  { no: 1, status: 'occupied' }, { no: 2, status: 'occupied' }, { no: 3, status: 'available' },
  { no: 4, status: 'cleaning' }, { no: 5, status: 'occupied' }, { no: 6, status: 'available' },
  { no: 7, status: 'occupied' }, { no: 8, status: 'available' }, { no: 9, status: 'occupied' },
  { no: 10, status: 'occupied' }, { no: 11, status: 'cleaning' }, { no: 12, status: 'available' },
];

const tableStyle: Record<TableStatus, string> = {
  available: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  occupied: 'bg-red-50 border-red-200 text-red-700',
  cleaning: 'bg-amber-50 border-amber-200 text-amber-700',
};

const activeOrders = [
  { id: 'ORD-3081', source: 'Table 5 · Dine-in', items: 4, status: 'Preparing', amount: '₹1,240' },
  { id: 'ORD-3082', source: 'Swiggy', items: 2, status: 'Ready', amount: '₹560' },
  { id: 'ORD-3083', source: 'Table 9 · Dine-in', items: 6, status: 'Served', amount: '₹2,180' },
  { id: 'ORD-3084', source: 'Zomato', items: 3, status: 'Preparing', amount: '₹890' },
  { id: 'ORD-3085', source: 'Table 1 · Dine-in', items: 2, status: 'Ready', amount: '₹640' },
];

const statusStyle: Record<string, string> = {
  Preparing: 'bg-amber-50 text-amber-700 border-amber-100',
  Ready: 'bg-blue-50 text-blue-700 border-blue-100',
  Served: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const kitchenQueue = [
  { order: 'ORD-3081', item: 'Butter Chicken + Naan (x2)', prep: '6 min' },
  { order: 'ORD-3084', item: 'Paneer Tikka Wrap', prep: '4 min' },
  { order: 'ORD-3086', item: 'Hyderabadi Biryani (x3)', prep: '11 min' },
  { order: 'ORD-3087', item: 'Masala Dosa', prep: '3 min' },
  { order: 'ORD-3088', item: 'Chocolate Lava Cake (x2)', prep: '5 min' },
];

export default function RestaurantDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-red-500 grid place-items-center">
            <UtensilsCrossed className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Dine<span className="text-red-400">Flow</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Spice Route Kitchen</div>
            <div className="text-[11px] text-slate-400 mb-3">Growth Plan · 12 tables</div>
            <Link href="/demo/restaurant" className="text-[11px] font-semibold text-red-400 hover:text-red-300 flex items-center gap-1">
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
              placeholder="Search orders, tables, menu items…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 grid place-items-center text-red-700 text-xs font-bold">RC</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rakesh Chhabra</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Owner</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-red-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/restaurant" className="underline font-semibold hover:text-red-100">Get this for your restaurant →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-red-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rakesh</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening at Spice Route Kitchen today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 grid place-items-center">
                    <s.Icon className="w-4.5 h-4.5 text-red-600" />
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
            {/* Weekly orders chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Orders This Week</h3>
                <span className="text-[11px] text-slate-400">Last 7 days</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekOrders.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-red-500/90" style={{ height: `${(d.v / 238) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table map */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Table Map</h3>
                <span className="text-[11px] text-slate-400">12 tables</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5 mb-4">
                {tables.map(t => (
                  <div
                    key={t.no}
                    className={`aspect-square rounded-lg border grid place-items-center text-xs font-bold ${tableStyle[t.status]}`}
                  >
                    {t.no}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400" /> Occupied</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Cleaning</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Active orders table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Active Orders</h3>
                <span className="text-[11px] font-semibold text-red-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Order</th>
                      <th className="px-5 py-2.5 font-semibold">Items</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOrders.map(o => (
                      <tr key={o.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{o.id}</div>
                          <div className="text-[11px] text-slate-400">{o.source}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{o.items}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[o.status]}`}>{o.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-700 text-sm font-semibold">{o.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kitchen queue */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Kitchen Queue</h3>
              <div className="space-y-3">
                {kitchenQueue.map(k => (
                  <div key={k.order} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{k.order} · {k.prep}</div>
                      <div className="text-[11px] text-slate-500 truncate">{k.item}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/restaurant"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" /> Get This For Your Restaurant
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
