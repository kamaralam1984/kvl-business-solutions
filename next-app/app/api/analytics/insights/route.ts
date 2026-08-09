import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { Deal } from '@/lib/models/Deal';
import { Lead } from '@/lib/models/Lead';
import { chatRouted } from '@/lib/ai/router';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  try {
  await connectDB();
  const email = session.user.email;
  const isAdmin = (session.user as any).role === 'admin';

  // Aggregate data — admin sees all, user sees their own
  const orderFilter = isAdmin ? {} : { email };
  const dealFilter = { ownerEmail: email };

  const [orders, deals, leads] = await Promise.all([
    Order.find(orderFilter).sort({ createdAt: -1 }).limit(100).lean(),
    Deal.find(dealFilter).limit(100).lean(),
    isAdmin ? Lead.find({}).sort({ createdAt: -1 }).limit(50).lean() : [],
  ]);

  const paidOrders = orders.filter((o: any) => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((s: number, o: any) => s + (o.amount || 0), 0);

  // Build a compact data digest
  const productCounts: Record<string, number> = {};
  paidOrders.forEach((o: any) => { productCounts[o.productName] = (productCounts[o.productName] || 0) + 1; });
  const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stageCounts: Record<string, number> = {};
  let pipelineValue = 0;
  deals.forEach((d: any) => {
    stageCounts[d.stage] = (stageCounts[d.stage] || 0) + 1;
    if (d.stage !== 'lost') pipelineValue += d.value || 0;
  });

  const digest = `
Data summary for ${isAdmin ? 'admin (all data)' : email}:
- Total paid orders: ${paidOrders.length}
- Total revenue: ₹${totalRevenue.toLocaleString('en-IN')}
- Top products: ${topProducts.map(([n, c]) => `${n} (${c})`).join(', ') || 'none'}
- CRM deals: ${deals.length} total, pipeline value ₹${pipelineValue.toLocaleString('en-IN')}
- Deal stages: ${Object.entries(stageCounts).map(([s, c]) => `${s}=${c}`).join(', ') || 'none'}
${isAdmin ? `- New leads (last 50): ${leads.length}` : ''}
- Last 5 orders: ${paidOrders.slice(0, 5).map((o: any) => `${o.productName} ₹${o.amount}`).join('; ') || 'none'}
`.trim();

  const sys = `You are a data analyst. Given KVL business data, give 4-6 SPECIFIC and ACTIONABLE insights in bullet points.
Be brief. Focus on patterns, opportunities, warnings, and next-best-actions.
Format: just bullet points, no headers, no preamble.`;

  const result = await chatRouted({
    messages: [{ role: 'user', content: digest }],
    system: sys,
    maxTokens: 400,
    cacheKey: `analytics:${email}:${paidOrders.length}:${deals.length}`,
  });

  return NextResponse.json({
    ok: true,
    insights: result.reply,
    provider: result.provider,
    stats: {
      orders: paidOrders.length,
      revenue: totalRevenue,
      pipelineDeals: deals.length,
      pipelineValue,
      topProducts: topProducts.map(([name, count]) => ({ name, count })),
      stageCounts,
    },
  });
  } catch (e) {
    return apiError(e);
  }
}
