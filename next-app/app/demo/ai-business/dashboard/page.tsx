'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Brain, LayoutDashboard, MessageSquare, TrendingUp, Target, Zap, BarChart3,
  Settings, Search, Bell, ChevronDown, TrendingDown, Clock, ArrowUpRight,
  Sparkles, X, Bot, User, CheckCircle2,
} from 'lucide-react';

const navItems = [
  { label: 'AI Dashboard', Icon: LayoutDashboard, active: true },
  { label: 'AI Chat', Icon: MessageSquare },
  { label: 'Predictions', Icon: TrendingUp },
  { label: 'Lead Scoring', Icon: Target },
  { label: 'Automations', Icon: Zap },
  { label: 'Reports', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
];

const stats = [
  { label: 'AI Conversations Today', value: '1,842', delta: '+18%', up: true, Icon: MessageSquare },
  { label: 'Leads Auto-Scored', value: '356', delta: '+9%', up: true, Icon: Target },
  { label: 'Automations Run', value: '128', delta: '+22%', up: true, Icon: Zap },
  { label: 'Time Saved (hrs)', value: '64.5', delta: '+11%', up: true, Icon: Clock },
];

const weekAutomations = [
  { day: 'Mon', v: 58 }, { day: 'Tue', v: 74 }, { day: 'Wed', v: 69 },
  { day: 'Thu', v: 88 }, { day: 'Fri', v: 95 }, { day: 'Sat', v: 81 }, { day: 'Sun', v: 46 },
];

const leadDistribution = [
  { name: 'Hot', pct: 28, color: 'bg-fuchsia-600' },
  { name: 'Warm', pct: 34, color: 'bg-purple-500' },
  { name: 'Cold', pct: 24, color: 'bg-sky-400' },
  { name: 'Unqualified', pct: 14, color: 'bg-slate-300' },
];

const insights = [
  { type: 'Lead Scoring', text: 'Rohit Sharma (Mumbai) shows 82% conversion probability — recommend priority follow-up within 2 hours.', confidence: 91, time: '10 min ago' },
  { type: 'Churn Risk', text: "Enterprise account 'Kridha Textiles' inactive 14 days — flagged for retention outreach.", confidence: 87, time: '38 min ago' },
  { type: 'Sales Forecast', text: 'Q3 revenue trending 12% above forecast, driven by festive-season automation campaigns.', confidence: 94, time: '1 hr ago' },
  { type: 'Document AI', text: 'Invoice #INV-2291 auto-extracted and matched to PO-1187 with zero discrepancies.', confidence: 99, time: '2 hr ago' },
  { type: 'Auto Report', text: 'Weekly sales summary generated and emailed to leadership — no manual compilation needed.', confidence: 100, time: 'This morning' },
];

const automations = [
  { name: 'Lead Scoring Engine', status: 'Active', last: 'Last run: 2 min ago' },
  { name: 'WhatsApp AI Responder', status: 'Active', last: 'Last run: 6 min ago' },
  { name: 'Weekly Report Generator', status: 'Scheduled', last: 'Next run: Mon 6:00 AM' },
  { name: 'Churn Risk Alerts', status: 'Active', last: 'Last run: 24 min ago' },
  { name: 'Invoice Document AI', status: 'Paused', last: 'Last run: Yesterday' },
];

const statusStyle: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Scheduled: 'bg-amber-50 text-amber-700 border-amber-100',
  Paused: 'bg-slate-100 text-slate-500 border-slate-200',
};

const chatThread = [
  { from: 'customer', text: 'Hi, do you have the Diwali festive bundle in stock for Mumbai delivery?' },
  { from: 'ai', text: "Yes! The Diwali Festive Bundle is in stock and ships to Mumbai in 2-3 days. Want me to apply the DIWALI15 coupon and send you a checkout link?" },
  { from: 'customer', text: 'Yes please, and can I pay via UPI?' },
  { from: 'ai', text: "Done — UPI checkout link sent to your WhatsApp. I'll also send a reminder if it's not used within 24 hours." },
];

export default function AIBusinessDemoDashboard() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const maxV = Math.max(...weekAutomations.map(d => d.v));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-slate-900 text-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-700 grid place-items-center">
            <Brain className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-extrabold tracking-tight">Neura<span className="text-fuchsia-400">Ops</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.Icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="text-xs font-semibold text-white mb-1">Orbit Commerce Pvt. Ltd.</div>
            <div className="text-[11px] text-slate-400 mb-3">Scale Plan · 12,400 leads/mo</div>
            <Link href="/demo/ai-business" className="text-[11px] font-semibold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1">
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
              placeholder="Search leads, automations, reports…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-fuchsia-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-fuchsia-100 grid place-items-center text-fuchsia-700 text-xs font-bold">RA</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none">Rhea Admin</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Demo banner */}
        {bannerOpen && (
          <div className="bg-fuchsia-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              You&apos;re viewing a live product demo. Like what you see?
              <Link href="/software/ai-business" className="underline font-semibold hover:text-fuchsia-100">Get this for your business →</Link>
            </span>
            <button onClick={() => setBannerOpen(false)} className="shrink-0 text-fuchsia-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold">Good morning, Rhea</h1>
            <p className="text-sm text-slate-500">Here&apos;s what NeuraOps automated for Orbit Commerce today — Saturday, 11 July</p>
          </div>

          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-fuchsia-50 grid place-items-center">
                    <s.Icon className="w-[18px] h-[18px] text-fuchsia-600" />
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
            {/* Weekly automation volume chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">Automation Volume — This Week</h3>
                <span className="text-[11px] text-slate-400">Last 7 days</span>
              </div>
              <div className="flex items-end justify-between gap-3" style={{ height: 168 }}>
                {weekAutomations.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: 168 }}>
                    <div className="w-full rounded-t-md bg-gradient-to-t from-fuchsia-600 to-purple-500" style={{ height: `${(d.v / maxV) * 130}px` }} />
                    <span className="text-[11px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead score distribution */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-5">Lead Score Distribution</h3>
              <div className="space-y-4">
                {leadDistribution.map(l => (
                  <div key={l.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-600">{l.name}</span>
                      <span className="font-bold">{l.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${l.color}`} style={{ width: `${l.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4 mb-4">
            {/* Recent AI insights */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-sm">Recent AI Insights</h3>
                <span className="text-[11px] font-semibold text-fuchsia-600">View all</span>
              </div>
              <div className="divide-y divide-slate-50 mt-3">
                {insights.map(i => (
                  <div key={i.text} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-50 grid place-items-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-fuchsia-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-bold text-slate-700">{i.type}</span>
                        <span className={`inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                          i.confidence >= 95 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100'
                        }`}>{i.confidence}% confidence</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{i.text}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">{i.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Automations running */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-sm mb-4">Automations Running</h3>
              <div className="space-y-3">
                {automations.map(a => (
                  <div key={a.name} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center shrink-0">
                      <Zap className="w-4 h-4 text-fuchsia-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-800 truncate">{a.name}</span>
                        <span className={`inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${statusStyle[a.status]}`}>{a.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{a.last}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/software/ai-business"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-semibold transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Get This For Your Business
              </Link>
            </div>
          </div>

          {/* AI Chat preview */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">AI Chat — Live Conversation Preview</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> AI Agent Online
              </span>
            </div>
            <div className="max-w-xl space-y-3">
              {chatThread.map((m, idx) => (
                <div key={idx} className={`flex items-end gap-2 ${m.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  {m.from === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-700 grid place-items-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed max-w-xs sm:max-w-sm ${
                      m.from === 'ai'
                        ? 'bg-fuchsia-50 text-fuchsia-900 rounded-bl-sm'
                        : 'bg-slate-900 text-white rounded-br-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.from === 'customer' && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 grid place-items-center shrink-0">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
