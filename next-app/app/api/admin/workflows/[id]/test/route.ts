import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Workflow } from '@/lib/models/Workflow';
import { runWorkflows } from '@/lib/workflows/runner';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity';

// Mock contexts per trigger type — for testing without real events
const mockContexts: Record<string, any> = {
  new_lead: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+91 9999999999',
    service: 'Software Development',
    message: 'This is a test workflow execution',
    source: 'test',
  },
  new_order: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+91 9999999999',
    amount: 49999,
    productName: 'ERP Software',
    orderId: 'TEST-ORD-001',
    hosting: 'cloud',
  },
  new_ticket: {
    name: 'Test Customer',
    email: 'test@example.com',
    priority: 'high',
    product: 'ERP Software',
    description: 'Test ticket — workflow execution check',
  },
  order_paid: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+91 9999999999',
    amount: 49999,
    productName: 'ERP Software',
    orderId: 'TEST-ORD-001',
    licenseKey: 'KVL-TEST-XXXX-YYYY-ZZZZ',
    link: '/dashboard/orders/TEST-ORD-001',
  },
  lead_inactive_3d: {
    name: 'Stale Lead',
    email: 'old-lead@example.com',
    phone: '+91 9999999999',
    daysOld: 3,
  },
  cart_abandoned: {
    name: 'Abandoner',
    email: 'test@example.com',
    amount: 24999,
    productName: 'CRM Software',
    orderId: 'TEST-CART-001',
    link: '/checkout?product=crm&host=cloud',
  },
};

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin(); if (!g.ok) return g.response;
  await connectDB();
  const w: any = await Workflow.findById(params.id).lean();
  if (!w) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const ctx = mockContexts[w.trigger] || { name: 'Test', email: 'test@example.com' };
  const result = await runWorkflows(w.trigger, ctx);

  logActivity({
    action: 'workflow.test',
    actorEmail: g.session?.user?.email || undefined,
    actorRole: 'admin',
    target: 'Workflow',
    targetId: params.id,
    details: { name: w.name, trigger: w.trigger, result },
    req,
  });

  return NextResponse.json({ ok: true, result, mockContext: ctx });
}
