import Link from 'next/link';
import { MapPin, RouteIcon, Shield, LineChart } from 'lucide-react';

export function GpsTracking() {
  return (
    <section className="section">
      <div className="container grid lg:grid-cols-[1.4fr_1fr_1fr] gap-7 card-base p-7 shadow-card items-center">
        <div className="rounded-xl overflow-hidden border border-tint bg-[#0a1124]">
          <div className="px-3 py-2.5 bg-[#060b1a] border-b border-white/5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] text-slate-400 ml-auto">KVL Dashboard</span>
          </div>
          <div className="grid grid-cols-[40px_1fr_70px] h-48">
            <div className="bg-[#060b1a] p-2 space-y-1.5">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-1.5 bg-blue-400/15 rounded" />)}
            </div>
            <div className="relative bg-gradient-to-br from-[#0c1740] to-[#040713]">
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(96,165,250,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.08) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute top-[30%] left-[10%] w-[70%] h-[40%] border-2 border-dashed border-blue-500 rounded-[50%] -rotate-12 opacity-80" />
              <MapPin className="absolute top-[25%] left-[20%] text-blue-400 drop-shadow-[0_0_8px_#3b82f6] w-4 h-4" />
              <MapPin className="absolute top-[55%] left-[50%] text-orange-400 drop-shadow-[0_0_8px_#f97316] w-4 h-4" />
              <MapPin className="absolute top-[35%] right-[18%] text-red-400 drop-shadow-[0_0_8px_#ef4444] w-4 h-4" />
            </div>
            <div className="bg-[#060b1a] p-2 space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-blue-500 grid place-items-center mx-auto text-white text-[10px] shadow-[0_0_16px_rgba(59,130,246,0.6)]">▶</div>
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-1.5 bg-slate-400/20 rounded" />)}
            </div>
          </div>
        </div>

        <div>
          <span className="eyebrow">LIVE GPS TRACKING</span>
          <h2 className="text-2xl font-extrabold my-3">Real-time Tracking<br />Complete Control</h2>
          <p className="text-text2 text-sm mb-5">Monitor your vehicles, assets and operations in real-time from anywhere in the world.</p>
          <Link href="/services" className="btn btn-primary">View GPS Demo</Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-blue-500" /> <MapPin className="w-4 h-4 text-primary" /> Real-time Location</div>
          <div className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-orange-500" /> <RouteIcon className="w-4 h-4 text-primary" /> Route History</div>
          <div className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-green-500" /> <Shield className="w-4 h-4 text-primary" /> Geofence Alerts</div>
          <div className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-cyan-500" /> <LineChart className="w-4 h-4 text-primary" /> Live Reports</div>
        </div>
      </div>
    </section>
  );
}
