'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Hotel, LayoutDashboard, BedDouble, CalendarDays, Sparkles, Receipt, Users,
  BarChart3, Settings, Search, Bell, ChevronDown, TrendingUp, TrendingDown,
  Star, Clock, ArrowUpRight, ShieldCheck, X,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', Icon: LayoutDashboard, active: true },
  { label: 'Rooms', Icon: BedDouble },
  { label: 'Reservations', Icon: CalendarDays },
  { label: 'Housekeeping', Icon: Sparkles },
  { label: 'Billing', Icon: Receipt },
  { label: 'Guests', Icon: Users },
  { label: 'Reports', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'Occupancy Rate', value: '87.4%', delta: '+4.2%', up: true, Icon: BedDouble },
  { label: 'Check-ins Today', value: '34', delta: '+9', up: true, Icon: CalendarDays },
  { label: 'Revenue Today', value: '₹4.86L', delta: '+12%', up: true, Icon: Receipt },
  { label: 'Avg Guest Rating', value: '4.7', delta: '-0.1', up: false, Icon: Star },
];

const weekOccupancy = [
  { day: 'Mon', v: 72 }, { day: 'Tue', v: 68 }, { day: 'Wed', v: 75 },
  { day: 'Thu', v: 81 }, { day: 'Fri', v: 94 }, { day: 'Sat', v: 98 }, { day: 'Sun', v: 87 },
];

const roomTypeOccupancy = [
  { type: 'Deluxe Room', occ: 92, color: 'bg-amber-700' },
  { type: 'Suite', occ: 78, color: 'bg-amber-500' },
  { type: 'Standard Room', occ: 85, color: 'bg-yellow-600' },
  { type: 'Executive Room', occ: 64, color: 'bg-orange-500' },
];

const reservations = [
  { guest: 'Ananya Rao', bookingId: 'BK-88421', room: 'Deluxe Room · 204', status: 'Checked-in', dates: '11 Jul – 13 Jul' },
  { guest: 'Vikram Sethi', bookingId: 'BK-88433', room: 'Suite · 501', status: 'Arriving', dates: '11 Jul – 15 Jul' },
  { guest: 'Meera Nair', bookingId: 'BK-88407', room: 'Standard Room · 118', status: 'Departing', dates: '09 Jul – 11 Jul' },
  { guest: 'Rahul Deshmukh', bookingId: 'BK-88440', room: 'Executive Room · 312', status: 'Arriving', dates: '11 Jul – 14 Jul' },
  { guest: 'Priya & Sanjay Kulkarni', bookingId: 'BK-88398', room: 'Suite · 505', status: 'Checked-in', dates: '10 Jul – 12 Jul' },
];

const statusStyle: Record<string, string> = {
  'Checked-in': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Arriving: 'bg-amber-50 text-amber-800 border-amber-100',
  Departing: 'bg-slate-50 text-slate-600 border-slate-200',
};

const housekeeping = [
  { room: '204', status: 'Clean', color: 'bg-emerald-500' },
  { room: '211', status: 'Cleaning', color: 'bg-amber-500' },
  { room: '308', status: 'Inspection', color: 'bg-blue-500' },
  { room: '312', status: 'Cleaning', color: 'bg-amber-500' },
  { room: '501', status: 'Clean', color: 'bg-emerald-500' },
];

const housekeepingTextStyle: Record<string, string> = {
  Clean: 'text-emerald-700',
  Cleaning: 'text-amber-700',
  Inspection: 'text-blue-700',
};

export default function HotelDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-amber-700 grid place-items-center">
            <Hotel className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Stay<span className="text-amber-500">Manager</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-amber-800 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Meridian Palace, Udaipur</div>
            <div className="text-[11px] text-slate-400 mb-3">Premium Plan · 64 rooms</div>
            <Link href="/demo/hotel" className="text-[11px] font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1">
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
              placeholder="Search guests, bookings, rooms…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 grid place-items-center text-amber-800 text-xs font-bold">SK</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Sunita Kamath</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Front Office Manager</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-amber-800 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Hotel className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/hotel" className="underline font-semibold hover:text-amber-100">Get this for your hotel →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-amber-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Sunita</h1>
            <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across Meridian Palace today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 grid place-items-center">
                    <s.Icon className="w-4.5 h-4.5 text-amber-800" />
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
            {/* Weekly occupancy chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Occupancy This Week</h3>
                <span className="text-[11px] text-slate-400">% rooms occupied / day</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekOccupancy.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-amber-700/90" style={{ height: `${(d.v / 98) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room type occupancy */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Room Type Occupancy</h3>
              <div className="space-y-4">
                {roomTypeOccupancy.map(r => (
                  <div key={r.type}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{r.type}</span>
                      <span className="font-bold">{r.occ}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.occ}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
            {/* Today's reservations table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Today&apos;s Reservations</h3>
                <span className="text-[11px] font-semibold text-amber-800">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Guest</th>
                      <th className="px-5 py-2.5 font-semibold">Room</th>
                      <th className="px-5 py-2.5 font-semibold">Status</th>
                      <th className="px-5 py-2.5 font-semibold text-right">Dates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(r => (
                      <tr key={r.bookingId} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{r.guest}</div>
                          <div className="text-[11px] text-slate-400">{r.bookingId}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{r.room}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[r.status]}`}>{r.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-xs">{r.dates}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Housekeeping status */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Housekeeping Status</h3>
              <div className="space-y-3">
                {housekeeping.map(h => (
                  <div key={h.room} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800">Room {h.room}</div>
                      <div className={`text-[11px] font-medium ${housekeepingTextStyle[h.status]}`}>{h.status}</div>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${h.color}`} />
                  </div>
                ))}
              </div>
              <Link
                href="/software/hotel"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Get This For Your Hotel
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
