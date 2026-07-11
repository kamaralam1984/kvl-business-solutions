import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';

const inr = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export async function GET(_: Request, { params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions);
  await connectDB();
  const order: any = await Order.findOne({ orderId: params.orderId }).lean();
  if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
  if (order.email !== session?.user?.email && (session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }
  if (order.status !== 'paid') return NextResponse.json({ ok: false, error: 'Invoice available only for paid orders' }, { status: 400 });

  const invoiceNo = order.invoiceNo || `KVL/INV/${new Date(order.createdAt).getFullYear()}/${order.orderId.slice(-6)}`;
  if (!order.invoiceNo) { await Order.updateOne({ _id: order._id }, { $set: { invoiceNo } }); }

  const b = order.billing || {};
  const addr = b.address || {};
  const subtotal = order.subtotal || Math.round(order.amount / (1 + (order.gstRate || 18) / 100));
  const gstAmount = order.gstAmount || (order.amount - subtotal);
  const sellerState = 'Maharashtra';
  const buyerState = addr.state || sellerState;
  const isInterState = buyerState && buyerState.toLowerCase() !== sellerState.toLowerCase();
  const half = Math.round(gstAmount / 2);

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Invoice ${invoiceNo}</title>
<style>
  *{box-sizing:border-box} body{font-family:Inter,Arial,sans-serif;color:#0f172a;max-width:820px;margin:24px auto;padding:24px;line-height:1.5}
  .h{display:flex;justify-content:space-between;align-items:start;border-bottom:3px solid #1d4ed8;padding-bottom:16px;margin-bottom:24px}
  .brand{font-size:26px;font-weight:900;color:#1d4ed8;letter-spacing:2px}
  .muted{color:#64748b;font-size:12px}
  .tag{background:#1d4ed8;color:#fff;padding:6px 14px;border-radius:6px;font-weight:700;font-size:12px;letter-spacing:1px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0}
  .box{border:1px solid #e2e8f0;border-radius:8px;padding:14px;background:#f8fafc}
  table{width:100%;border-collapse:collapse;margin-top:20px}
  th{text-align:left;background:#1d4ed8;color:#fff;padding:10px;font-size:12px;text-transform:uppercase}
  td{padding:10px;border-bottom:1px solid #e2e8f0;font-size:13px}
  .totals{width:300px;margin-left:auto;margin-top:12px}
  .totals tr td{border:none;padding:6px 0}
  .totals .grand td{font-size:16px;font-weight:900;border-top:2px solid #1d4ed8;padding-top:10px;color:#1d4ed8}
  .foot{margin-top:36px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:14px}
  .print{position:fixed;top:12px;right:12px}
  @media print{.print{display:none}}
</style></head><body>
<button class="print" onclick="window.print()" style="padding:8px 16px;background:#1d4ed8;color:#fff;border:0;border-radius:6px;cursor:pointer">Print / Save PDF</button>
<div class="h">
  <div>
    <div class="brand">K·V·L</div>
    <div style="font-size:10px;letter-spacing:3px;color:#64748b;font-weight:600">BUSINESS SOLUTIONS</div>
    <div class="muted" style="margin-top:8px">Patna, Sultanganj, Bihar, India<br/>info@kvlbusinesssolutions.com · +91 99420 00413</div>
  </div>
  <div style="text-align:right">
    <div class="tag">TAX INVOICE</div>
    <div style="margin-top:10px"><b>Invoice #:</b> ${invoiceNo}</div>
    <div><b>Order ID:</b> ${order.orderId}</div>
    <div><b>Date:</b> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
    <div><b>Payment ID:</b> ${order.razorpayPaymentId || '—'}</div>
  </div>
</div>

<div class="grid">
  <div class="box">
    <div class="muted">BILL TO</div>
    <div style="font-weight:700;margin-top:4px">${b.name || '—'}</div>
    ${b.company ? `<div>${b.company}</div>` : ''}
    <div>${b.email || order.email}</div>
    ${b.phone ? `<div>${b.phone}</div>` : ''}
    ${addr.line1 ? `<div>${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}</div>` : ''}
    ${addr.city || addr.state || addr.pincode ? `<div>${[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</div>` : ''}
    ${b.gstin ? `<div style="margin-top:4px"><b>GSTIN:</b> ${b.gstin}</div>` : ''}
  </div>
  <div class="box">
    <div class="muted">PAYMENT</div>
    <div style="margin-top:4px"><b>Status:</b> <span style="color:#16a34a;font-weight:700">PAID</span></div>
    <div><b>Method:</b> Razorpay (Online)</div>
    <div><b>Hosting:</b> ${order.hosting === 'cloud' ? 'Cloud' : 'On-Premise'}</div>
    ${order.licenseKey ? `<div><b>License:</b> <code>${order.licenseKey}</code></div>` : ''}
  </div>
</div>

<table>
  <thead><tr><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>Rate</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    <tr>
      <td><b>${order.productName}</b><br/><span class="muted">Software license — ${order.hosting} · 1 year</span></td>
      <td>998314</td>
      <td>1</td>
      <td>${inr(subtotal)}</td>
      <td style="text-align:right"><b>${inr(subtotal)}</b></td>
    </tr>
  </tbody>
</table>

<table class="totals">
  <tr><td class="muted">Subtotal</td><td style="text-align:right">${inr(subtotal)}</td></tr>
  ${isInterState
    ? `<tr><td class="muted">IGST (${order.gstRate || 18}%)</td><td style="text-align:right">${inr(gstAmount)}</td></tr>`
    : `<tr><td class="muted">CGST (${(order.gstRate || 18) / 2}%)</td><td style="text-align:right">${inr(half)}</td></tr>
       <tr><td class="muted">SGST (${(order.gstRate || 18) / 2}%)</td><td style="text-align:right">${inr(gstAmount - half)}</td></tr>`}
  <tr class="grand"><td>Total</td><td style="text-align:right">${inr(order.amount)}</td></tr>
</table>

<div class="foot">
  <p><b>Terms:</b> Payment received in full. This is a computer-generated invoice; no signature required.</p>
  <p>Thank you for your business with KVL Business Solutions. For support, contact support@kvlbusinesssolutions.com or visit /support.</p>
</div>
</body></html>`;

  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
