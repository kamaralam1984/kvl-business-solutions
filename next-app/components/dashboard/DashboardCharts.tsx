'use client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

type Order = {
  orderId: string;
  productName: string;
  amount: number;
  status: string;
  hosting: string;
  createdAt: string;
};

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316', '#06b6d4', '#ec4899', '#eab308'];

function formatINRShort(n: number) {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}k`;
  return `₹${n}`;
}

export function DashboardCharts({ orders }: { orders: Order[] }) {
  const paid = orders.filter(o => o.status === 'paid');

  // Spend by month (last 6 months)
  const now = new Date();
  const months: { month: string; amount: number; orders: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('en-IN', { month: 'short' });
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const inMonth = paid.filter(o => {
      const od = new Date(o.createdAt);
      return od >= d && od < next;
    });
    months.push({
      month: label,
      amount: inMonth.reduce((s, o) => s + o.amount, 0),
      orders: inMonth.length,
    });
  }

  // Spend by product
  const byProduct: Record<string, number> = {};
  paid.forEach(o => { byProduct[o.productName] = (byProduct[o.productName] || 0) + o.amount; });
  const productData = Object.entries(byProduct).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  // License expiry timeline (1 year from order date)
  const upcoming = paid.map(o => {
    const expire = new Date(o.createdAt);
    expire.setFullYear(expire.getFullYear() + 1);
    const days = Math.ceil((expire.getTime() - now.getTime()) / 86_400_000);
    return { product: o.productName, expireDate: expire, days };
  }).filter(x => x.days > 0 && x.days < 365).sort((a, b) => a.days - b.days).slice(0, 5);

  if (paid.length === 0) {
    return (
      <div className="card-base p-10 text-center">
        <p className="text-text2 text-sm">No paid orders yet. Charts will appear once you make your first purchase.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5 mb-8">
      <div className="card-base p-6">
        <h3 className="font-bold mb-1">Spend (last 6 months)</h3>
        <p className="text-xs text-text2 mb-4">{paid.length} paid order{paid.length !== 1 ? 's' : ''}</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={months}>
            <CartesianGrid stroke="rgb(var(--tint))" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="rgb(var(--text-2))" fontSize={11} />
            <YAxis stroke="rgb(var(--text-2))" fontSize={11} tickFormatter={formatINRShort} />
            <Tooltip
              contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgb(var(--tint))', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => formatINRShort(v)}
            />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card-base p-6">
        <h3 className="font-bold mb-1">Spend by product</h3>
        <p className="text-xs text-text2 mb-4">Top {productData.length} of {Object.keys(byProduct).length}</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={(p: any) => formatINRShort(p.value)}>
              {productData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'rgb(var(--bg-2))', border: '1px solid rgb(var(--tint))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatINRShort(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {upcoming.length > 0 && (
        <div className="card-base p-6 lg:col-span-2">
          <h3 className="font-bold mb-1">License renewals coming up</h3>
          <p className="text-xs text-text2 mb-4">Renew before expiry to avoid service interruption</p>
          <div className="space-y-2">
            {upcoming.map((u, i) => (
              <div key={i} className="flex justify-between items-center p-3 surface-tint rounded-lg">
                <div>
                  <div className="font-semibold text-sm">{u.product}</div>
                  <div className="text-xs text-text2">Expires {u.expireDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${u.days < 30 ? 'bg-red-500/20 text-red-500' : u.days < 90 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                  {u.days} days
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
