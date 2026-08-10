'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Boxes, LayoutDashboard, Package, PackagePlus, PackageMinus, Warehouse, Truck,
  BarChart3, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  ScanBarcode, Clock, ArrowUpRight, ShieldCheck, X,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Products', Icon: Package },
  { label: 'Stock In', Icon: PackagePlus },
  { label: 'Stock Out', Icon: PackageMinus },
  { label: 'Warehouses', Icon: Warehouse },
  { label: 'Suppliers', Icon: Truck },
  { label: 'Reports', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Total SKUs', value: '12,486', delta: '+3.1%', up: true, Icon: Package },
  { label: 'Stock Value', value: '₹4.62Cr', delta: '+6%', up: true, Icon: Boxes },
  { label: 'Low Stock Alerts', value: '23', delta: '+5', up: false, Icon: Bell },
  { label: 'Orders Fulfilled Today', value: '318', delta: '+11%', up: true, Icon: ScanBarcode },
];

const weekMovement = [
  { day: 'Mon', v: 540 }, { day: 'Tue', v: 610 }, { day: 'Wed', v: 480 },
  { day: 'Thu', v: 720 }, { day: 'Fri', v: 690 }, { day: 'Sat', v: 810 }, { day: 'Sun', v: 320 },
];

const lowStockItems = [
  { sku: 'SKU-10241', name: 'Corrugated Boxes (Medium)', category: 'Packaging', qty: 42, urgency: 'critical', reorder: 'PO Raised' },
  { sku: 'SKU-30587', name: 'M8 Hex Bolts (Pack of 100)', category: 'Hardware', qty: 88, urgency: 'low', reorder: 'Pending' },
  { sku: 'SKU-20194', name: 'Stretch Wrap Film 500mm', category: 'Packaging', qty: 15, urgency: 'critical', reorder: 'PO Raised' },
  { sku: 'SKU-40862', name: 'Cotton Work Gloves (L)', category: 'Safety Gear', qty: 130, urgency: 'moderate', reorder: 'Pending' },
  { sku: 'SKU-50319', name: 'Industrial Label Rolls', category: 'Consumables', qty: 60, urgency: 'moderate', reorder: 'Scheduled' },
];

const urgencyStyle: Record<string, string> = {
  critical: 'bg-rose-50 text-rose-700 border-rose-100',
  low: 'bg-amber-50 text-amber-700 border-amber-100',
  moderate: 'bg-cyan-50 text-cyan-700 border-cyan-100',
};

const reorderStyle: Record<string, string> = {
  'PO Raised': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Pending: 'bg-slate-50 text-slate-600 border-slate-200',
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-100',
};

const purchaseOrders = [
  { supplier: 'Anand Packaging Co.', item: 'Corrugated Boxes (Medium)', qty: '5,000 units' },
  { supplier: 'Precision Fasteners Ltd.', item: 'M8 Hex Bolts', qty: '20,000 pcs' },
  { supplier: 'Wraptech Industries', item: 'Stretch Wrap Film', qty: '1,200 rolls' },
  { supplier: 'SafeHands Supplies', item: 'Cotton Work Gloves (L)', qty: '2,500 pairs' },
  { supplier: 'LabelPro Print Solutions', item: 'Industrial Label Rolls', qty: '800 rolls' },
];

const warehouses = [
  { name: 'Warehouse A — Bhiwandi', occ: 91 },
  { name: 'Warehouse B — Hosur', occ: 76 },
  { name: 'Warehouse C — Ludhiana', occ: 58 },
  { name: 'Warehouse D — Guwahati', occ: 40 },
];

export default function InventoryDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 grid place-items-center">
            <Boxes className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Stock<span className="text-cyan-400">Pilot</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Suryansh Distributors</div>
            <div className="text-[11px] text-slate-400 mb-3">Enterprise Plan · 6 warehouses</div>
            <Link href="/demo/inventory" className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
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
              placeholder="Search SKUs, suppliers, orders…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-100 grid place-items-center text-cyan-700 text-xs font-bold">RA</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rakesh Admin</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Inventory Manager</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-cyan-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <ScanBarcode className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/inventory" className="underline font-semibold hover:text-cyan-100">Get this for your warehouse →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-cyan-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rakesh</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across Suryansh Distributors today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 grid place-items-center">
                    <s.Icon className="w-[18px] h-[18px] text-cyan-600" />
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
            {/* Weekly stock movement chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Stock Movement — This Week</h3>
                <span className="text-[11px] text-slate-400">Units moved / day</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekMovement.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-cyan-500/90" style={{ height: `${(d.v / 810) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warehouse capacity */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Warehouse Capacity</h3>
              <div className="space-y-4">
                {warehouses.map(w => (
                  <div key={w.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{w.name}</span>
                      <span className="font-bold">{w.occ}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${w.occ > 90 ? 'bg-rose-500' : w.occ > 75 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                        style={{ width: `${w.occ}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Low stock items table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Low Stock Items</h3>
                <span className="text-[11px] font-semibold text-cyan-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Product</th>
                      <th className="px-5 py-2.5 font-semibold">Category</th>
                      <th className="px-5 py-2.5 font-semibold">Qty Left</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Reorder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map(p => (
                      <tr key={p.sku} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.sku}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{p.category}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${urgencyStyle[p.urgency]}`}>{p.qty} units</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${reorderStyle[p.reorder]}`}>{p.reorder}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent purchase orders */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Recent Purchase Orders</h3>
              <div className="space-y-3">
                {purchaseOrders.map(po => (
                  <div key={po.supplier} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{po.item} · {po.qty}</div>
                      <div className="text-[11px] text-slate-500 truncate">{po.supplier}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/inventory"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Get This For Your Warehouse
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
