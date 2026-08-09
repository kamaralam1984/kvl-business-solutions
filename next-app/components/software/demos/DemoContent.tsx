'use client';
import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingBag, AlertTriangle, CheckCircle2, Clock, Phone, Mail, MapPin, Star, Plus, Filter, Download, Eye, Edit2, Trash2, Check, X } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const s = (n: number, v = 20) => MONTHS.map(m => ({ m, v: Math.max(10, n + Math.round((Math.random() - 0.5) * v * 2)) }));

function StatCard({ label, value, sub, trend, color = '#3b82f6' }: { label: string; value: string; sub?: string; trend?: 'up' | 'down'; color?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      {sub && (
        <div className={`text-[11px] mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
          {sub}
        </div>
      )}
    </div>
  );
}

function Table({ cols, rows, color }: { cols: string[]; rows: (string | JSX.Element)[][]; color: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <span className="text-sm font-semibold text-slate-200">Records</span>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg"><Filter className="w-3 h-3" /> Filter</button>
          <button className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg"><Download className="w-3 h-3" /> Export</button>
          <button className="flex items-center gap-1.5 text-[11px] text-white px-3 py-1.5 rounded-lg font-semibold" style={{ background: color }}><Plus className="w-3 h-3" /> Add New</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-slate-800">
              {cols.map(c => <th key={c} className="text-left px-4 py-2.5 text-slate-400 font-medium whitespace-nowrap">{c}</th>)}
              <th className="text-left px-4 py-2.5 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                {row.map((cell, j) => <td key={j} className="px-4 py-3 text-slate-300 whitespace-nowrap">{cell}</td>)}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button aria-label="View" className="text-slate-500 hover:text-blue-400"><Eye className="w-3.5 h-3.5" /></button>
                    <button aria-label="Edit" className="text-slate-500 hover:text-yellow-400"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button aria-label="Delete" className="text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Badge({ label, type }: { label: string; type: 'green' | 'yellow' | 'red' | 'blue' | 'purple' }) {
  const cls = { green: 'bg-green-500/15 text-green-400 border-green-500/30', yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', red: 'bg-red-500/15 text-red-400 border-red-500/30', blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30', purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
  return <span className={`border px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls[type]}`}>{label}</span>;
}

function ChartCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="text-[13px] font-semibold text-slate-200 mb-3">{title}</div>
      {children}
    </div>
  );
}

// =================== CRM DEMO ===================
function CrmDashboard({ c }: { c: string }) {
  const data = s(45, 20);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value="1,284" sub="+18% this month" trend="up" color={c} />
        <StatCard label="Converted" value="312" sub="24.3% rate" trend="up" color="#22c55e" />
        <StatCard label="Pipeline Value" value="₹42L" sub="+8.1% vs last month" trend="up" color="#f97316" />
        <StatCard label="Follow-ups Today" value="28" sub="5 overdue" trend="down" color="#ef4444" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Lead Trend — Last 6 Months" color={c}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="m" tick={{ fill: '#94a3b8', fontSize: 11 }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} /><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} /><Area type="monotone" dataKey="v" stroke={c} fill={c + '22'} strokeWidth={2} /></AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <ChartCard title="Leads by Source" color={c}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={[{ name: 'WhatsApp', value: 38 }, { name: 'Website', value: 28 }, { name: 'Referral', value: 20 }, { name: 'Instagram', value: 14 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={9}>
              {['#ec4899', '#8b5cf6', '#3b82f6', '#22c55e'].map((c, i) => <Cell key={i} fill={c} />)}
            </Pie><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} /></PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function CrmLeads({ c }: { c: string }) {
  return (
    <Table
      cols={['#', 'Name', 'Phone', 'Source', 'Stage', 'Value', 'Follow-up']}
      color={c}
      rows={[
        ['001', 'Ramesh Sharma', '9876543210', 'WhatsApp', <Badge key="b-114-59" label="Qualified" type="blue" />, '₹45,000', '29 May'],
        ['002', 'Priya Gupta', '9812345678', 'Website', <Badge key="b-115-56" label="Proposal" type="purple" />, '₹1,20,000', '30 May'],
        ['003', 'Suresh Kumar', '9988776655', 'Instagram', <Badge key="b-116-59" label="New" type="yellow" />, '₹18,000', '31 May'],
        ['004', 'Anita Verma', '9765432109', 'Referral', <Badge key="b-117-57" label="Closed Won" type="green" />, '₹2,50,000', '—'],
        ['005', 'Vikram Singh', '9654321098', 'Facebook', <Badge key="b-118-58" label="Cold" type="red" />, '₹30,000', '2 Jun'],
      ]}
    />
  );
}

// =================== BILLING DEMO ===================
function BillingDashboard({ c }: { c: string }) {
  const data = s(120000, 30000);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Invoices This Month" value="847" sub="+12% vs last" trend="up" color={c} />
        <StatCard label="Revenue" value="₹18.4L" sub="+9.2% growth" trend="up" color="#22c55e" />
        <StatCard label="Pending Payments" value="₹2.1L" sub="23 invoices" trend="down" color="#f97316" />
        <StatCard label="GST Collected" value="₹3.3L" sub="18% GST" color="#8b5cf6" />
      </div>
      <ChartCard title="Revenue — Last 6 Months (₹)" color={c}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={s(150000, 40000)}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="m" tick={{ fill: '#94a3b8', fontSize: 11 }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} /><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} /><Bar dataKey="v" fill={c} radius={[6, 6, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function BillingInvoices({ c }: { c: string }) {
  return (
    <Table
      cols={['Invoice #', 'Client', 'Amount', 'GST', 'Status', 'Date']}
      color={c}
      rows={[
        ['INV-2405001', 'Sharma Traders', '₹45,000', '₹8,100', <Badge key="b-150-63" label="Paid" type="green" />, '15 May 2025'],
        ['INV-2405002', 'Gupta Enterprises', '₹1,20,000', '₹21,600', <Badge key="b-151-69" label="Pending" type="yellow" />, '18 May 2025'],
        ['INV-2405003', 'Kumar & Sons', '₹18,500', '₹3,330', <Badge key="b-152-61" label="Paid" type="green" />, '20 May 2025'],
        ['INV-2405004', 'ABC Industries', '₹2,50,000', '₹45,000', <Badge key="b-153-66" label="Overdue" type="red" />, '10 May 2025'],
        ['INV-2405005', 'Tech Solutions', '₹75,000', '₹13,500', <Badge key="b-154-64" label="Paid" type="green" />, '22 May 2025'],
      ]}
    />
  );
}

// =================== GPS DEMO ===================
function GpsDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Vehicles" value="48" sub="Fleet size" color={c} />
        <StatCard label="Active Now" value="31" sub="64.5% on route" trend="up" color="#22c55e" />
        <StatCard label="Alerts Today" value="7" sub="3 overspeeding" trend="down" color="#ef4444" />
        <StatCard label="Distance Today" value="4,280 km" sub="Entire fleet" color="#8b5cf6" />
      </div>
      {/* Fake map */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-slate-200">Live Fleet Map</span>
          <div className="flex gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Moving (31)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Idle (9)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500 inline-block" /> Parked (8)</span>
          </div>
        </div>
        <div className="relative h-64 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          {/* Road lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 256">
            <path d="M0 128 Q150 80 300 128 Q450 176 600 128" stroke="#374151" strokeWidth="6" fill="none" strokeDasharray="12 6" />
            <path d="M0 64 Q200 100 400 64 Q500 40 600 80" stroke="#374151" strokeWidth="4" fill="none" strokeDasharray="8 4" />
            <path d="M100 0 Q130 128 100 256" stroke="#374151" strokeWidth="4" fill="none" />
            <path d="M350 0 Q380 128 360 256" stroke="#374151" strokeWidth="4" fill="none" />
          </svg>
          {/* Vehicle pins */}
          {[{ x: 120, y: 100, color: '#22c55e', label: 'MH-12-AB-1234' }, { x: 280, y: 130, color: '#22c55e', label: 'UP-16-CD-5678' }, { x: 400, y: 90, color: '#eab308', label: 'DL-01-EF-9012' }, { x: 500, y: 150, color: '#22c55e', label: 'KA-03-GH-3456' }, { x: 60, y: 50, color: '#64748b', label: 'TN-09-IJ-7890' }].map((v, i) => (
            <div key={i} className="absolute group" style={{ left: v.x, top: v.y }}>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg cursor-pointer" style={{ backgroundColor: v.color }} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition z-10">{v.label}</div>
            </div>
          ))}
          <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-[10px] text-slate-400">📍 Live tracking active • Updated 3s ago</div>
        </div>
      </div>
    </div>
  );
}

function GpsVehicles({ c }: { c: string }) {
  return (
    <Table
      cols={['Vehicle No.', 'Driver', 'Status', 'Speed', 'Location', 'Last Update']}
      color={c}
      rows={[
        ['MH-12-AB-1234', 'Raju Yadav', <Badge key="b-209-40" label="Moving" type="green" />, '62 km/h', 'Pune-Mumbai Highway', '2 sec ago'],
        ['UP-16-CD-5678', 'Sunil Kumar', <Badge key="b-210-41" label="Moving" type="green" />, '48 km/h', 'NH-19, Agra', '5 sec ago'],
        ['DL-01-EF-9012', 'Deepak Singh', <Badge key="b-211-42" label="Idle" type="yellow" />, '0 km/h', 'Delhi NCR', '1 min ago'],
        ['KA-03-GH-3456', 'Ramesh B', <Badge key="b-212-38" label="Moving" type="green" />, '71 km/h', 'Bengaluru Outer Ring', '8 sec ago'],
        ['TN-09-IJ-7890', 'Murugan P', <Badge key="b-213-39" label="Parked" type="blue" />, '0 km/h', 'Chennai Port', '25 min ago'],
      ]}
    />
  );
}

// =================== INVENTORY DEMO ===================
function InventoryDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value="3,241" sub="Across 4 warehouses" color={c} />
        <StatCard label="Low Stock Alerts" value="47" sub="Needs reorder" trend="down" color="#ef4444" />
        <StatCard label="Stock Value" value="₹84.2L" sub="+3.1% this month" trend="up" color="#22c55e" />
        <StatCard label="Pending Orders" value="23" sub="Auto PO triggered: 8" color="#8b5cf6" />
      </div>
      <ChartCard title="Stock Movement — Last 6 Months" color={c}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={MONTHS.map(m => ({ m, in: Math.round(300 + Math.random() * 200), out: Math.round(250 + Math.random() * 150) }))}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="m" tick={{ fill: '#94a3b8', fontSize: 11 }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} /><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} /><Line type="monotone" dataKey="in" stroke={c} strokeWidth={2} name="Stock In" /><Line type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={2} name="Stock Out" /></LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function InventoryProducts({ c }: { c: string }) {
  return (
    <Table
      cols={['SKU', 'Product Name', 'Category', 'Qty', 'Reorder Level', 'Status']}
      color={c}
      rows={[
        ['SKU-001', 'Bearing 6205', 'Spare Parts', '1,240', '200', <Badge key="b-244-67" label="In Stock" type="green" />],
        ['SKU-002', 'Motor Oil 5W30', 'Lubricants', '89', '150', <Badge key="b-245-65" label="Low Stock" type="red" />],
        ['SKU-003', 'LED Strip Light', 'Electrical', '450', '100', <Badge key="b-246-67" label="In Stock" type="green" />],
        ['SKU-004', 'PVC Pipe 1"', 'Plumbing', '12', '50', <Badge key="b-247-59" label="Critical" type="red" />],
        ['SKU-005', 'Drill Bit Set', 'Tools', '230', '30', <Badge key="b-248-59" label="In Stock" type="green" />],
      ]}
    />
  );
}

// =================== SCHOOL DEMO ===================
function SchoolDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="2,847" sub="All classes" color={c} />
        <StatCard label="Attendance Today" value="94.2%" sub="2,682 present" trend="up" color="#22c55e" />
        <StatCard label="Fee Collected" value="₹32.4L" sub="May 2025" trend="up" color="#f97316" />
        <StatCard label="Pending Fees" value="₹4.8L" sub="148 students" trend="down" color="#ef4444" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Class-wise Strength" color={c}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={['6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(g => ({ g, v: Math.round(200 + Math.random() * 200) }))}><XAxis dataKey="g" tick={{ fill: '#94a3b8', fontSize: 11 }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} /><Bar dataKey="v" fill={c} radius={[4, 4, 0, 0]} /><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} /></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Fee Collection — 2025" color={c}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHS.map(m => ({ m, v: Math.round(30 + Math.random() * 15) }))}><XAxis dataKey="m" tick={{ fill: '#94a3b8', fontSize: 11 }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${v}L`} /><Area type="monotone" dataKey="v" stroke={c} fill={c + '22'} strokeWidth={2} /><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} formatter={v => [`₹${v}L`, 'Collected']} /></AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function SchoolStudents({ c }: { c: string }) {
  return (
    <Table
      cols={['Roll No.', 'Student Name', 'Class', 'Parent Phone', 'Fee Status', 'Attendance']}
      color={c}
      rows={[
        ['2401', 'Aarav Sharma', 'Class 9-A', '9876543210', <Badge key="b-286-60" label="Paid" type="green" />, '96%'],
        ['2402', 'Priya Gupta', 'Class 10-B', '9812345678', <Badge key="b-287-60" label="Paid" type="green" />, '92%'],
        ['2403', 'Rohan Verma', 'Class 8-C', '9988776655', <Badge key="b-288-59" label="Pending" type="yellow" />, '88%'],
        ['2404', 'Sneha Patel', 'Class 11-A', '9765432109', <Badge key="b-289-60" label="Paid" type="green" />, '98%'],
        ['2405', 'Arjun Singh', 'Class 7-B', '9654321098', <Badge key="b-290-59" label="Overdue" type="red" />, '74%'],
      ]}
    />
  );
}

// =================== HOSPITAL DEMO ===================
function HospitalDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="OPD Today" value="284" sub="18 waiting" color={c} />
        <StatCard label="IPD Beds" value="78/120" sub="65% occupancy" trend="up" color="#f97316" />
        <StatCard label="Lab Tests" value="143" sub="12 critical" color="#8b5cf6" />
        <StatCard label="Revenue Today" value="₹1.84L" sub="+11% vs yesterday" trend="up" color="#22c55e" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="text-[13px] font-semibold text-slate-200 mb-3">OPD Queue — Today</div>
        <div className="space-y-2">
          {[{ token: 'T-001', name: 'Rajesh Kumar, 45M', doctor: 'Dr. Sharma (General)', status: 'consulting', time: '10:30 AM' }, { token: 'T-002', name: 'Sunita Devi, 32F', doctor: 'Dr. Gupta (Gynec)', status: 'waiting', time: '10:45 AM' }, { token: 'T-003', name: 'Vinod Pal, 67M', doctor: 'Dr. Verma (Cardio)', status: 'waiting', time: '11:00 AM' }, { token: 'T-004', name: 'Rani Bai, 28F', doctor: 'Dr. Sharma (General)', status: 'done', time: '9:45 AM' }].map(p => (
            <div key={p.token} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-400 w-12">{p.token}</span>
                <div>
                  <div className="text-[12px] font-medium text-slate-200">{p.name}</div>
                  <div className="text-[10px] text-slate-400">{p.doctor}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">{p.time}</span>
                <Badge label={p.status === 'consulting' ? 'In Progress' : p.status === 'done' ? 'Done' : 'Waiting'} type={p.status === 'consulting' ? 'blue' : p.status === 'done' ? 'green' : 'yellow'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =================== PAYROLL DEMO ===================
function PayrollDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value="248" sub="8 on leave" color={c} />
        <StatCard label="May 2025 Payroll" value="₹28.4L" sub="Gross salary" trend="up" color="#22c55e" />
        <StatCard label="PF Deducted" value="₹2.4L" sub="12% employer + employee" color="#8b5cf6" />
        <StatCard label="TDS Deducted" value="₹84,200" sub="Auto calculated" color="#f97316" />
      </div>
      <Table
        cols={['Emp ID', 'Name', 'Department', 'Basic', 'HRA', 'Net Salary', 'Status']}
        color={c}
        rows={[
          ['E001', 'Anil Kumar', 'Sales', '₹35,000', '₹14,000', '₹44,200', <Badge key="b-344-75" label="Processed" type="green" />],
          ['E002', 'Meena Sharma', 'HR', '₹42,000', '₹16,800', '₹52,800', <Badge key="b-345-74" label="Processed" type="green" />],
          ['E003', 'Raj Patel', 'IT', '₹65,000', '₹26,000', '₹81,400', <Badge key="b-346-71" label="Pending" type="yellow" />],
          ['E004', 'Sunita Rao', 'Accounts', '₹38,000', '₹15,200', '₹47,600', <Badge key="b-347-78" label="Processed" type="green" />],
          ['E005', 'Deepak Singh', 'Operations', '₹28,000', '₹11,200', '₹34,400', <Badge key="b-348-82" label="Pending" type="yellow" />],
        ]}
      />
    </div>
  );
}

// =================== ATTENDANCE DEMO ===================
function AttendanceDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Present Today" value="231" sub="93.1% of staff" trend="up" color="#22c55e" />
        <StatCard label="Absent" value="12" sub="4.8% absence" trend="down" color="#ef4444" />
        <StatCard label="Late Arrivals" value="9" sub=">10 min late" color="#f97316" />
        <StatCard label="Leave Requests" value="6" sub="3 pending approval" color={c} />
      </div>
      <Table
        cols={['Emp ID', 'Name', 'Punch In', 'Punch Out', 'Hours', 'Status']}
        color={c}
        rows={[
          ['E001', 'Anil Kumar', '09:02 AM', '06:05 PM', '9h 3m', <Badge key="b-369-66" label="Present" type="green" />],
          ['E002', 'Meena Sharma', '09:18 AM', 'Working...', '—', <Badge key="b-370-66" label="Late" type="yellow" />],
          ['E003', 'Raj Patel', '—', '—', '—', <Badge key="b-371-47" label="Absent" type="red" />],
          ['E004', 'Sunita Rao', '08:58 AM', '05:58 PM', '9h 0m', <Badge key="b-372-66" label="Present" type="green" />],
          ['E005', 'Deepak Singh', '—', '—', '—', <Badge key="b-373-50" label="Leave" type="blue" />],
        ]}
      />
    </div>
  );
}

// =================== CONSTRUCTION DEMO ===================
function ConstructionDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value="14" sub="3 finishing this month" color={c} />
        <StatCard label="Budget Utilized" value="67.4%" sub="₹4.2Cr of ₹6.2Cr" trend="up" color="#f97316" />
        <StatCard label="Labour Strength" value="842" sub="Today on site" color="#22c55e" />
        <StatCard label="Material Pending" value="23" sub="PO awaiting delivery" trend="down" color="#ef4444" />
      </div>
      <Table
        cols={['Project', 'Client', 'Budget', 'Progress', 'Deadline', 'Status']}
        color={c}
        rows={[
          ['Skyline Tower A', 'DLF Builders', '₹2.4Cr', '78%', '30 Jun 2025', <Badge key="b-394-78" label="On Track" type="green" />],
          ['NH-48 Bridge', 'NHAI', '₹8.6Cr', '45%', '31 Dec 2025', <Badge key="b-395-67" label="On Track" type="green" />],
          ['Green City Phase 2', 'Godrej', '₹14Cr', '22%', '30 Mar 2026', <Badge key="b-396-74" label="Planning" type="blue" />],
          ['Metro Station', 'DMRC', '₹3.2Cr', '91%', '15 Jun 2025', <Badge key="b-397-68" label="Delayed" type="red" />],
          ['Commercial Complex', 'Prestige', '₹6.8Cr', '55%', '30 Sep 2025', <Badge key="b-398-77" label="On Track" type="green" />],
        ]}
      />
    </div>
  );
}

// =================== WORKSHOP DEMO ===================
function WorkshopDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Jobs" value="34" sub="12 in progress" color={c} />
        <StatCard label="Completed Today" value="18" sub="+3 vs yesterday" trend="up" color="#22c55e" />
        <StatCard label="Parts Low Stock" value="9" sub="Need reorder" trend="down" color="#ef4444" />
        <StatCard label="Revenue Today" value="₹42,800" sub="+15%" trend="up" color="#f97316" />
      </div>
      <Table
        cols={['Job #', 'Vehicle', 'Customer', 'Work Type', 'Mechanic', 'Status']}
        color={c}
        rows={[
          ['JC-2405-001', 'MH-12 AB 1234', 'Ramesh Sharma', 'Engine Overhaul', 'Suresh K', <Badge key="b-419-91" label="In Progress" type="blue" />],
          ['JC-2405-002', 'DL-01 CD 5678', 'Priya Gupta', 'AC Service', 'Ravi M', <Badge key="b-420-82" label="Completed" type="green" />],
          ['JC-2405-003', 'UP-16 EF 9012', 'Anil Verma', 'Denting & Paint', 'Mohan L', <Badge key="b-421-87" label="Waiting Parts" type="yellow" />],
          ['JC-2405-004', 'KA-03 GH 3456', 'Sunita Roy', 'Tyre Change', 'Suresh K', <Badge key="b-422-84" label="Completed" type="green" />],
          ['JC-2405-005', 'TN-09 IJ 7890', 'Vikram Das', 'Oil Change', 'Ravi M', <Badge key="b-423-81" label="Pending" type="yellow" />],
        ]}
      />
    </div>
  );
}

// =================== ERP DEMO ===================
function ErpDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue (May)" value="₹1.84Cr" sub="+14.2% YoY" trend="up" color={c} />
        <StatCard label="Expenses" value="₹1.12Cr" sub="61% of revenue" color="#ef4444" />
        <StatCard label="Net Profit" value="₹72L" sub="39.1% margin" trend="up" color="#22c55e" />
        <StatCard label="Open POs" value="38" sub="₹24L value" color="#f97316" />
      </div>
      <ChartCard title="P&L — Last 6 Months (₹ Lakh)" color={c}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHS.map(m => ({ m, Revenue: Math.round(140 + Math.random() * 60), Expense: Math.round(90 + Math.random() * 30) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="m" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${v}L`} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            <Bar dataKey="Revenue" fill={c} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

// =================== RESTAURANT DEMO ===================
function RestaurantDashboard({ c }: { c: string }) {
  const tables = [
    { no: 1, status: 'occupied', guests: 4, amount: 1240, time: '25m' },
    { no: 2, status: 'free', guests: 0, amount: 0, time: '' },
    { no: 3, status: 'occupied', guests: 2, amount: 680, time: '12m' },
    { no: 4, status: 'occupied', guests: 6, amount: 2100, time: '48m' },
    { no: 5, status: 'reserved', guests: 4, amount: 0, time: '' },
    { no: 6, status: 'free', guests: 0, amount: 0, time: '' },
    { no: 7, status: 'occupied', guests: 3, amount: 890, time: '8m' },
    { no: 8, status: 'cleaning', guests: 0, amount: 0, time: '' },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tables" value="5/8" sub="Occupied now" color={c} />
        <StatCard label="Orders Today" value="247" sub="₹94,800 revenue" trend="up" color="#22c55e" />
        <StatCard label="Avg Order Value" value="₹384" sub="+12% vs yesterday" trend="up" color="#f97316" />
        <StatCard label="KOT Pending" value="8" sub="In kitchen" color="#8b5cf6" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="text-[13px] font-semibold text-slate-200 mb-4">Table Layout — Live Status</div>
        <div className="grid grid-cols-4 gap-3">
          {tables.map(t => (
            <div key={t.no} className={`rounded-xl p-3 border cursor-pointer transition-all ${t.status === 'occupied' ? 'border-orange-500/40 bg-orange-500/10' : t.status === 'reserved' ? 'border-blue-500/40 bg-blue-500/10' : t.status === 'cleaning' ? 'border-yellow-500/40 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/40'}`}>
              <div className="text-[11px] font-bold text-slate-300">Table {t.no}</div>
              {t.status === 'occupied' && <><div className="text-[10px] text-slate-400 mt-1">{t.guests} guests • {t.time}</div><div className="text-[12px] font-bold text-orange-400 mt-1">₹{t.amount}</div></>}
              {t.status === 'free' && <div className="text-[10px] text-green-400 mt-1">Available</div>}
              {t.status === 'reserved' && <div className="text-[10px] text-blue-400 mt-1">Reserved</div>}
              {t.status === 'cleaning' && <div className="text-[10px] text-yellow-400 mt-1">Cleaning</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =================== HOTEL DEMO ===================
function HotelDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Occupancy" value="78%" sub="94 of 120 rooms" trend="up" color={c} />
        <StatCard label="Check-ins Today" value="18" sub="12 more expected" color="#22c55e" />
        <StatCard label="Check-outs" value="14" sub="3 still pending" color="#f97316" />
        <StatCard label="Revenue Today" value="₹2.4L" sub="+8% vs yesterday" trend="up" color="#8b5cf6" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="text-[13px] font-semibold text-slate-200 mb-4">Room Status</div>
        <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5">
          {Array.from({ length: 48 }, (_, i) => {
            const status = i < 36 ? 'occupied' : i < 42 ? 'vacant' : i < 45 ? 'reserved' : 'maintenance';
            const colors = { occupied: 'bg-orange-500/40 border-orange-500/60', vacant: 'bg-green-500/20 border-green-500/40', reserved: 'bg-blue-500/20 border-blue-500/40', maintenance: 'bg-slate-700 border-slate-600' };
            return <div key={i} title={`Room ${101 + i} — ${status}`} className={`h-7 rounded border text-[8px] flex items-center justify-center text-white/60 cursor-pointer ${colors[status as keyof typeof colors]}`}>{101 + i}</div>;
          })}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500/40 border border-orange-500/60" /> Occupied (36)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-500/20 border border-green-500/40" /> Vacant (6)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/20 border border-blue-500/40" /> Reserved (3)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-700 border border-slate-600" /> Maintenance (3)</span>
        </div>
      </div>
    </div>
  );
}

// =================== REAL ESTATE DEMO ===================
function RealEstateDashboard({ c }: { c: string }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Listings" value="284" sub="Residential + Commercial" color={c} />
        <StatCard label="Site Visits (May)" value="147" sub="+22% vs April" trend="up" color="#22c55e" />
        <StatCard label="Deals Closed" value="34" sub="₹18.6Cr total value" trend="up" color="#f97316" />
        <StatCard label="Commission Earned" value="₹93L" sub="2% avg commission" color="#8b5cf6" />
      </div>
      <Table
        cols={['Property', 'Type', 'Location', 'Price', 'Agent', 'Status']}
        color={c}
        rows={[
          ['Sunrise Heights 3BHK', 'Residential', 'Bandra West, Mumbai', '₹2.8Cr', 'Amit Shah', <Badge key="b-538-96" label="Available" type="green" />],
          ['Commercial Space 2000sqft', 'Commercial', 'Connaught Place, Delhi', '₹4.5Cr', 'Priya Verma', <Badge key="b-539-105" label="Negotiation" type="yellow" />],
          ['Green Villa Plot 1200sqyd', 'Plot', 'Whitefield, Bangalore', '₹85L', 'Ravi Kumar', <Badge key="b-540-95" label="Available" type="green" />],
          ['Lake View Apartment 2BHK', 'Residential', 'Powai, Mumbai', '₹1.2Cr', 'Amit Shah', <Badge key="b-541-94" label="Sold" type="blue" />],
          ['IT Park Office Floor', 'Commercial', 'Hinjewadi, Pune', '₹6.2Cr', 'Sneha Das', <Badge key="b-542-91" label="Available" type="green" />],
        ]}
      />
    </div>
  );
}

// =================== AI BUSINESS DEMO ===================
function AiDashboard({ c }: { c: string }) {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([
    { role: 'ai', text: 'Hello! I\'m your AI Business Assistant. I can analyze your sales data, predict trends, generate reports, and automate workflows. What would you like to know?' },
  ]);

  function sendMsg() {
    if (!input.trim()) return;
    const responses: Record<string, string> = {
      'default': 'Based on your data analysis, I recommend focusing on the top 20% of clients who generate 80% of revenue. Shall I generate a detailed report?',
      'sales': 'Your sales are trending up 14.2% YoY. June 2025 forecast: ₹2.1Cr with 89% confidence. Top product: ERP Software (₹42L pipeline).',
      'report': 'Generating report... ✅ P&L Summary, Customer Analysis, and Sales Forecast report is ready. Download PDF?',
      'leads': 'AI scoring: 48 hot leads need immediate follow-up. Predicted conversion: 23 leads (48%). Estimated pipeline value: ₹8.4L.',
    };
    const lower = input.toLowerCase();
    const reply = lower.includes('sales') ? responses.sales : lower.includes('report') ? responses.report : lower.includes('lead') ? responses.leads : responses.default;
    setChat(p => [...p, { role: 'user', text: input }, { role: 'ai', text: reply }]);
    setInput('');
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="AI Insights" value="142" sub="Auto-generated today" color={c} />
        <StatCard label="Predictions" value="94.3%" sub="Accuracy score" trend="up" color="#22c55e" />
        <StatCard label="Automation Runs" value="2,847" sub="This month" color="#f97316" />
        <StatCard label="Time Saved" value="184 hrs" sub="This month" trend="up" color="#8b5cf6" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[13px] font-semibold text-slate-200">AI Business Assistant</span>
          <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full ml-auto">GPT-4o Powered</span>
        </div>
        <div className="h-60 overflow-y-auto p-4 space-y-3">
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs text-[12px] px-3 py-2 rounded-xl ${m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 p-3 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500" placeholder="Ask AI: 'Show sales forecast' / 'Generate report' / 'Score leads'..." />
          <button onClick={sendMsg} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: c }}>Send</button>
        </div>
      </div>
    </div>
  );
}

// =================== MAIN EXPORT ===================
const demoMap: Record<string, { dash: (c: string) => JSX.Element; list?: (c: string) => JSX.Element }> = {
  crm: { dash: c => <CrmDashboard c={c} />, list: c => <CrmLeads c={c} /> },
  billing: { dash: c => <BillingDashboard c={c} />, list: c => <BillingInvoices c={c} /> },
  erp: { dash: c => <ErpDashboard c={c} /> },
  inventory: { dash: c => <InventoryDashboard c={c} />, list: c => <InventoryProducts c={c} /> },
  'gps-tracking': { dash: c => <GpsDashboard c={c} />, list: c => <GpsVehicles c={c} /> },
  school: { dash: c => <SchoolDashboard c={c} />, list: c => <SchoolStudents c={c} /> },
  hospital: { dash: c => <HospitalDashboard c={c} /> },
  construction: { dash: c => <ConstructionDashboard c={c} /> },
  workshop: { dash: c => <WorkshopDashboard c={c} /> },
  payroll: { dash: c => <PayrollDashboard c={c} /> },
  attendance: { dash: c => <AttendanceDashboard c={c} /> },
  'ai-business': { dash: c => <AiDashboard c={c} /> },
  restaurant: { dash: c => <RestaurantDashboard c={c} /> },
  hotel: { dash: c => <HotelDashboard c={c} /> },
  'real-estate': { dash: c => <RealEstateDashboard c={c} /> },
};

export function DemoContent({ slug, navIndex, color }: { slug: string; navIndex: number; color: string }) {
  const demo = demoMap[slug];
  if (!demo) return <div className="text-slate-400 text-center py-12">Demo not available for this product yet.</div>;
  if (navIndex === 0) return demo.dash(color);
  if (navIndex === 1 && demo.list) return demo.list(color);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
      <div className="text-4xl mb-3">🚧</div>
      <div className="text-slate-200 font-semibold mb-1">This section is fully functional in the purchased version</div>
      <div className="text-slate-400 text-sm">The complete product includes all modules with real data, user management, and full configuration.</div>
    </div>
  );
}
