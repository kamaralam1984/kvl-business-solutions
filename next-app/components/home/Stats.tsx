import { LayoutGrid, Users, Zap, Headphones } from 'lucide-react';
import { Counter } from '@/components/shared/Counter';

const stats = [
  { num: 500, label: 'Projects Completed', Icon: LayoutGrid, color: '#3b82f6' },
  { num: 1000, label: 'Happy Clients', Icon: Users, color: '#22c55e' },
  { num: 250, label: 'Running Systems', Icon: Zap, color: '#eab308' },
];

export function Stats() {
  return (
    <section className="pb-10">
      <div className="container">
        <div className="card-base p-7 grid grid-cols-2 lg:grid-cols-4 gap-6 shadow-card">
          {stats.map(s => (
            <div key={s.label} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl grid place-items-center border" style={{ background: `${s.color}25`, color: s.color, borderColor: `${s.color}50` }}>
                <s.Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold"><Counter to={s.num} /></h3>
                <p className="text-xs text-text2">{s.label}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grid place-items-center border" style={{ background: '#f9731625', color: '#f97316', borderColor: '#f9731650' }}>
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold">24/7</h3>
              <p className="text-xs text-text2">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
