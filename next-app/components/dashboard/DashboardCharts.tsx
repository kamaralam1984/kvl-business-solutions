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

const COLORS = ['#c8a96e', 'rgba(255,255,255,0.6)', '#4ade80', '#60a5fa', '#fbbf24', 'rgba(255,255,255,0.4)', '#f87171'];

export function DashboardCharts({ orders }: { orders: Order[] }) {
  const paid = orders.filter(o => o.status === 'paid');

  // Orders by month (last 6 months)
  const now = new Date();
  const months: { month: string; orders: number }[] = [];
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
      orders: inMonth.length,
    });
  }

  // Orders by product
  const byProduct: Record<string, number> = {};
  paid.forEach(o => { byProduct[o.productName] = (byProduct[o.productName] || 0) + 1; });
  const productData = Object.entries(byProduct).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  // License expiry timeline (1 year from order date)
  const upcoming = paid.map(o => {
    const expire = new Date(o.createdAt);
    expire.setFullYear(expire.getFullYear() + 1);
    const days = Math.ceil((expire.getTime() - now.getTime()) / 86_400_000);
    return { product: o.productName, expireDate: expire, days };
  }).filter(x => x.days > 0 && x.days < 365).sort((a, b) => a.days - b.days).slice(0, 5);

  const tooltipStyle = {
    background: '#111111',
    border: '1px solid rgba(200,169,110,0.3)',
    borderRadius: 10,
    fontSize: 12,
    color: '#f5f5f0',
  };
  const axisColor = 'rgba(136,136,136,0.8)';
  const gridColor = 'rgba(255,255,255,0.04)';

  if (paid.length === 0) {
    return (
      <div className="p-10 text-center" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
        <p className="text-sm" style={{ color: 'rgba(148,163,184,0.5)' }}>No paid orders yet. Charts will appear once you make your first purchase.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5 mb-8">
      <div className="p-6" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
        <h3 className="font-bold mb-1 text-white">Orders (last 6 months)</h3>
        <p className="text-xs text-text2 mb-4">{paid.length} paid order{paid.length !== 1 ? 's' : ''}</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={months}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={axisColor} fontSize={11} tick={{ fill: axisColor }} />
            <YAxis stroke={axisColor} fontSize={11} allowDecimals={false} tick={{ fill: axisColor }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="orders" stroke="#c8a96e" strokeWidth={2.5} dot={{ fill: '#c8a96e', r: 4 }} activeDot={{ r: 6, fill: '#f5f5f0' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
        <h3 className="font-bold mb-1 text-white">Orders by product</h3>
        <p className="text-xs text-text2 mb-4">Top {productData.length} of {Object.keys(byProduct).length}</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={(p: any) => p.value}>
              {productData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(148,163,184,0.7)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {upcoming.length > 0 && (
        <div className="p-6 lg:col-span-2" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
          <h3 className="font-bold mb-1 text-white">License renewals coming up</h3>
          <p className="text-xs text-text2 mb-4">Renew before expiry to avoid service interruption</p>
          <div className="space-y-2">
            {upcoming.map((u, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="font-semibold text-sm text-white">{u.product}</div>
                  <div className="text-xs text-text2">Expires {u.expireDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${u.days < 30 ? 'bg-red-500/20 text-red-400' : u.days < 90 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
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
