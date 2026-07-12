'use client';
import { useEffect, useState } from 'react';
import { Zap, TrendingDown, Cpu, Database, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';

export default function ApiUsagePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/api-usage');
    const d = await r.json();
    setData(d);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000); // refresh every 30s
    return () => clearInterval(t);
  }, []);

  if (loading && !data) return <div className="p-8 text-text2">Loading…</div>;
  if (!data?.ok) return <div className="p-8 text-red-500">Failed to load usage stats.</div>;

  const s = data.summary;

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2"><Cpu className="w-6 h-6 text-primary" /> AI API Usage</h1>
          <p className="text-text2 text-sm mt-1">Smart router — free providers first, paid fallback. Real-time savings.</p>
        </div>
        <button onClick={load} className="btn btn-ghost text-xs"><RefreshCcw className="w-3.5 h-3.5" /> Refresh</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card-base p-5">
          <div className="flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-primary" /><span className="text-[10px] uppercase tracking-wider text-text2">Providers</span></div>
          <div className="text-3xl font-extrabold">{s.totalProvidersAvailable} / {s.totalProvidersKnown}</div>
          <div className="text-xs text-text2 mt-1">configured & active</div>
        </div>
        <div className="card-base p-5">
          <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-green-500" /><span className="text-[10px] uppercase tracking-wider text-text2">Free Tier %</span></div>
          <div className="text-3xl font-extrabold text-green-500">{s.freePercentage}%</div>
          <div className="text-xs text-text2 mt-1">{s.freeCalls} / {s.totalCalls} calls</div>
        </div>
        <div className="card-base p-5">
          <div className="flex items-center gap-2 mb-2"><Database className="w-4 h-4 text-blue-500" /><span className="text-[10px] uppercase tracking-wider text-text2">Cache Hits</span></div>
          <div className="text-3xl font-extrabold text-blue-500">{s.cacheHits}</div>
          <div className="text-xs text-text2 mt-1">{s.cachedQueries} unique queries</div>
        </div>
        <div className="card-base p-5">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-orange-500" /><span className="text-[10px] uppercase tracking-wider text-text2">Saved</span></div>
          <div className="text-3xl font-extrabold text-orange-500">${s.saved}</div>
          <div className="text-xs text-text2 mt-1">{s.savedPercentage}% vs Anthropic-only</div>
        </div>
      </div>

      {/* Cost comparison bar */}
      <div className="card-base p-5 mb-6">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-green-500" /> Cost comparison</h3>
        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between mb-1"><span className="text-text2">Actual spend (smart routing)</span><span className="font-bold text-green-500">${s.actualSpend}</span></div>
            <div className="h-2 surface-tint rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${Math.min(100, parseFloat(s.actualSpend) / Math.max(0.0001, parseFloat(s.wouldHaveSpent)) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1"><span className="text-text2">Without smart routing (all Anthropic)</span><span className="font-bold text-red-500">${s.wouldHaveSpent}</span></div>
            <div className="h-2 surface-tint rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Provider details */}
      <h2 className="text-lg font-bold mb-3">Provider chain (priority order)</h2>
      <div className="card-base overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">#</th><th className="p-3">Provider</th><th className="p-3">Model</th><th className="p-3">Cost / 1M tokens</th><th className="p-3 text-right">Calls</th><th className="p-3 text-right">Failures</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {data.providers.map((p: any, i: number) => (
              <tr key={p.name} className={`border-b border-tint last:border-b-0 hover:bg-primary/5 ${!p.configured ? 'opacity-50' : ''}`}>
                <td className="p-3 text-text2 text-xs font-mono">{i + 1}</td>
                <td className="p-3 font-semibold">
                  {p.name}
                  {p.free && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-500">FREE</span>}
                </td>
                <td className="p-3 text-text2 text-xs font-mono">{p.model}</td>
                <td className="p-3 text-xs">
                  {p.free ? <span className="text-green-500 font-bold">FREE</span> : <>${p.costPer1MInput} in · ${p.costPer1MOutput} out</>}
                </td>
                <td className="p-3 text-right font-bold">{p.calls}</td>
                <td className="p-3 text-right text-xs">{p.failures > 0 ? <span className="text-red-500">{p.failures}</span> : '0'}</td>
                <td className="p-3">
                  {!p.configured ? (
                    <span className="text-[10px] text-text2 inline-flex items-center gap-1" title={`Set ${p.envKey} to enable`}><XCircle className="w-3 h-3" /> not configured</span>
                  ) : p.lastError ? (
                    <span className="text-[10px] text-red-500 inline-flex items-center gap-1"><XCircle className="w-3 h-3" /> error</span>
                  ) : (
                    <span className="text-[10px] text-green-500 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> ready</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top cached queries */}
      {data.topCachedQueries && data.topCachedQueries.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-3">Top cached queries (saving repeat API calls)</h2>
          <div className="card-base p-5">
            <div className="space-y-2">
              {data.topCachedQueries.map((q: any, i: number) => (
                <div key={i} className="flex gap-3 items-center text-sm">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">{q.hits} hits</span>
                  <span className="text-text2 truncate flex-1">{q.reply}…</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="text-[10px] text-text2 mt-4">Stats refresh every 30s. Calls counter resets on server restart (in-memory).</div>
    </div>
  );
}
