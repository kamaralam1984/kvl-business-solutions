'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Satellite, LayoutDashboard, Map, Truck, Route as RouteIcon, AlertTriangle,
  Users, BarChart2, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Activity, ArrowUpRight, X, Fuel, Gauge, ShieldAlert, MapPin,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Live Map', Icon: Map },
  { label: 'Vehicles', Icon: Truck },
  { label: 'Routes', Icon: RouteIcon },
  { label: 'Alerts', Icon: AlertTriangle },
  { label: 'Drivers', Icon: Users },
  { label: 'Reports', Icon: BarChart2 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Active Vehicles', value: '184', delta: '+9%', up: true, Icon: Truck },
  { label: 'Distance Today (km)', value: '12,406', delta: '+14%', up: true, Icon: RouteIcon },
  { label: 'Fuel Efficiency', value: '6.8 km/l', delta: '+3%', up: true, Icon: Fuel },
  { label: 'Active Alerts', value: '7', delta: '-2', up: false, Icon: ShieldAlert },
];

const weekDistance = [
  { day: 'Mon', v: 9840 }, { day: 'Tue', v: 11250 }, { day: 'Wed', v: 10480 },
  { day: 'Thu', v: 13120 }, { day: 'Fri', v: 12680 }, { day: 'Sat', v: 14200 }, { day: 'Sun', v: 8460 },
];

const fleetStatus = [
  { name: 'Moving', pct: 58, color: 'bg-orange-500' },
  { name: 'Idle', pct: 24, color: 'bg-amber-400' },
  { name: 'Stopped', pct: 12, color: 'bg-slate-400' },
  { name: 'Offline', pct: 6, color: 'bg-rose-500' },
];

const vehicles = [
  { reg: 'BR-01-AB-1234', driver: 'Suresh Yadav', route: 'Patna → Ranchi', status: 'Moving', updated: '2 min ago' },
  { reg: 'DL-1LT-4521', driver: 'Rakesh Kumar', route: 'Delhi → Jaipur', status: 'Moving', updated: '4 min ago' },
  { reg: 'MH-04-CD-7890', driver: 'Vinod Pawar', route: 'Pune Yard', status: 'Idle', updated: '11 min ago' },
  { reg: 'GJ-05-EF-3345', driver: 'Bharat Patel', route: 'Ahmedabad → Surat', status: 'Stopped', updated: '18 min ago' },
  { reg: 'TN-09-GH-6712', driver: 'Murugan S.', route: 'Chennai → Coimbatore', status: 'Moving', updated: '1 min ago' },
];

const statusStyle: Record<string, string> = {
  Moving: 'bg-orange-50 text-orange-700 border-orange-100',
  Idle: 'bg-amber-50 text-amber-700 border-amber-100',
  Stopped: 'bg-slate-100 text-slate-600 border-slate-200',
};

const alerts = [
  { type: 'Geofence exit', vehicle: 'BR-01-AB-1234', time: '2 min ago' },
  { type: 'Overspeeding — 92 km/h', vehicle: 'DL-1LT-4521', time: '9 min ago' },
  { type: 'Fuel drop detected', vehicle: 'MH-04-CD-7890', time: '22 min ago' },
  { type: 'Harsh braking event', vehicle: 'TN-09-GH-6712', time: '35 min ago' },
  { type: 'Vehicle offline > 30 min', vehicle: 'GJ-05-EF-3345', time: '41 min ago' },
];

const pins = [
  { top: '28%', left: '22%', color: 'bg-orange-500', label: 'Truck #204 — Moving' },
  { top: '54%', left: '48%', color: 'bg-amber-400', label: 'Truck #118 — Idle' },
  { top: '38%', left: '68%', color: 'bg-orange-500' },
  { top: '70%', left: '30%', color: 'bg-slate-400' },
  { top: '18%', left: '58%', color: 'bg-orange-500' },
];

export default function GpsTrackingDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-orange-500 grid place-items-center">
            <Satellite className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Fleet<span className="text-orange-400">Pulse</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Malhotra Roadlines</div>
            <div className="text-[11px] text-slate-400 mb-3">Enterprise Plan · 184 vehicles</div>
            <Link href="/demo/gps-tracking" className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1">
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
              placeholder="Search vehicles, drivers, routes…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 grid place-items-center text-orange-700 text-xs font-bold">RA</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rajeev Admin</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Fleet Manager</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-orange-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/gps-tracking" className="underline font-semibold hover:text-orange-100">Get this for your fleet →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-orange-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rajeev</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across Malhotra Roadlines today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 grid place-items-center">
                    <s.Icon className="w-[18px] h-[18px] text-orange-600" />
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
            {/* Live map */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm flex items-center gap-1.5"><Map className="w-4 h-4 text-orange-600" /> Live Map</h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
              <div
                className="relative rounded-xl overflow-hidden border border-slate-100"
                style={{
                  height: 280,
                  backgroundColor: '#fdf6f0',
                  backgroundImage: 'radial-gradient(rgba(234,88,12,0.16) 1px, transparent 1px), radial-gradient(rgba(234,88,12,0.10) 1px, transparent 1px)',
                  backgroundSize: '24px 24px, 24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              >
                {pins.map((p, i) => (
                  <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute w-6 h-6 rounded-full ${p.color} opacity-25 animate-ping`} />
                      <span className={`relative w-3 h-3 rounded-full ${p.color} border-2 border-white shadow`} />
                    </div>
                    {p.label && (
                      <div className="mt-1.5 whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow">
                        {p.label}
                      </div>
                    )}
                  </div>
                ))}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border border-slate-100 text-[10px] font-semibold text-slate-500">
                  <MapPin className="w-3 h-3 text-orange-600" /> 184 vehicles in view
                </div>
              </div>
            </div>

            {/* Fleet status */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Fleet Status</h3>
              <div className="space-y-4">
                {fleetStatus.map(f => (
                  <div key={f.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{f.name}</span>
                      <span className="font-bold">{f.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${f.color}`} style={{ width: `${f.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly distance chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-sm flex items-center gap-1.5"><Gauge className="w-4 h-4 text-orange-600" /> Distance Covered This Week</h3>
              <span className="text-[11px] text-slate-400">Last 7 days · km</span>
            </div>
            <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
              {weekDistance.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                  <div className="w-full rounded-t-md bg-orange-500/90" style={{ height: `${(d.v / 14200) * 130}px` }} />
                  <span className="text-[11px] text-slate-400">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Vehicle list table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Vehicle List</h3>
                <span className="text-[11px] font-semibold text-orange-600">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Vehicle</th>
                      <th className="px-5 py-2.5 font-semibold">Route</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map(v => (
                      <tr key={v.reg} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{v.reg}</div>
                          <div className="text-[11px] text-slate-400">{v.driver}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{v.route}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[v.status]}`}>{v.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-xs">{v.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent alerts */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 grid place-items-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{a.type}</div>
                      <div className="text-[11px] text-slate-500 truncate">{a.vehicle} · {a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/gps-tracking"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors"
              >
                <Truck className="w-3.5 h-3.5" /> Get This For Your Fleet
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
