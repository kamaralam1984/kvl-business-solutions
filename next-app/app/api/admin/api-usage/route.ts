import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { providers as allProviders, getAvailableProviders } from '@/lib/ai/providers';
import { getUsageStats } from '@/lib/ai/router';
import { getCacheStats } from '@/lib/ai/cache';

export async function GET() {
  const g = await requireAdmin(); if (!g.ok) return g.response;

  const stats = getUsageStats();
  const cache = await getCacheStats();

  // Show every known provider (not just configured ones) so the admin can
  // see what's available to add, instead of a blank table when nothing is set up.
  const providers = allProviders.map(p => {
    const s = stats[p.name] || { calls: 0, failures: 0 };
    return {
      name: p.name,
      model: p.model,
      free: p.costPer1MInput === 0,
      costPer1MInput: p.costPer1MInput,
      costPer1MOutput: p.costPer1MOutput,
      calls: s.calls,
      failures: s.failures,
      lastError: (s as any).lastError,
      configured: p.available(),
      envKey: p.envKey,
    };
  });

  const totalCalls = providers.reduce((sum, p) => sum + p.calls, 0);
  const freeCalls = providers.filter(p => p.free).reduce((sum, p) => sum + p.calls, 0);

  // Estimated savings — assume each call = 500 in + 200 out tokens
  // If all went to Anthropic (most expensive): 500×$1 + 200×$5 per 1M
  const anthroPer = (500 * 1.0 + 200 * 5.0) / 1_000_000;
  const actualSpend = providers.reduce((sum, p) => sum + p.calls * (500 * p.costPer1MInput + 200 * p.costPer1MOutput) / 1_000_000, 0);
  const wouldHaveSpent = totalCalls * anthroPer;
  const saved = wouldHaveSpent - actualSpend;

  return NextResponse.json({
    ok: true,
    providers,
    summary: {
      totalProvidersAvailable: getAvailableProviders().length,
      totalProvidersKnown: providers.length,
      totalCalls,
      freeCalls,
      freePercentage: totalCalls > 0 ? Math.round((freeCalls / totalCalls) * 100) : 0,
      cachedQueries: cache.cachedQueries,
      cacheHits: cache.totalHits,
      actualSpend: actualSpend.toFixed(4),
      wouldHaveSpent: wouldHaveSpent.toFixed(4),
      saved: saved.toFixed(4),
      savedPercentage: wouldHaveSpent > 0 ? Math.round((saved / wouldHaveSpent) * 100) : 0,
    },
    topCachedQueries: cache.topQueries,
  });
}
