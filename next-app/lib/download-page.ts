export function renderDownloadShell(opts: { title: string; tag: string; bodyHtml: string; settings: any }) {
  const s = opts.settings || {};
  const phone = s.phone || '+91 99420 00413';
  const email = s.email || 'info@kvlbusinesssolutions.com';
  const address = [s.addressLine1, s.addressLine2].filter(Boolean).join(', ') || 'Patna, Sultanganj, Bihar, India';
  const generatedOn = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${opts.title}</title>
<style>
  *{box-sizing:border-box} body{font-family:Inter,Arial,sans-serif;color:#0f172a;max-width:860px;margin:24px auto;padding:24px;line-height:1.6}
  .h{display:flex;justify-content:space-between;align-items:start;border-bottom:3px solid #c8a870;padding-bottom:18px;margin-bottom:28px}
  .brand{font-size:26px;font-weight:900;color:#0a0a0a;letter-spacing:2px}
  .muted{color:#64748b;font-size:12px}
  .tag{background:#0a0a0a;color:#c8a870;padding:6px 14px;border-radius:6px;font-weight:700;font-size:11px;letter-spacing:1.5px;text-transform:uppercase}
  h2{font-size:20px;margin:28px 0 12px;color:#0a0a0a}
  h3{font-size:15px;margin:18px 0 6px;color:#0a0a0a}
  p{font-size:13.5px;color:#334155}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:16px 0}
  .box{border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#f8fafc}
  .pill{display:inline-block;font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;background:#f1e9da;color:#8a6d3b;margin:2px 4px 2px 0}
  .foot{margin-top:40px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:16px}
  .print{position:fixed;top:12px;right:12px}
  img.shot{width:100%;border-radius:8px;border:1px solid #e2e8f0;margin-top:8px}
  @media print{.print{display:none}}
</style></head><body>
<button class="print" onclick="window.print()" style="padding:8px 16px;background:#0a0a0a;color:#c8a870;border:0;border-radius:6px;cursor:pointer;font-weight:600">Print / Save PDF</button>
<div class="h">
  <div>
    <div class="brand">K · V · L</div>
    <div style="font-size:10px;letter-spacing:3px;color:#64748b;font-weight:600">BUSINESS SOLUTIONS</div>
    <div class="muted" style="margin-top:8px">${address}<br/>${email} · ${phone}</div>
  </div>
  <div style="text-align:right">
    <div class="tag">${opts.tag}</div>
    <div class="muted" style="margin-top:10px">Generated ${generatedOn}</div>
  </div>
</div>
${opts.bodyHtml}
<div class="foot">
  KVL Business Solutions · Founded 2019 · Patna, India · ISO 27001 &amp; MSME Certified<br/>
  kvlbusinesssolutions.com · ${email} · ${phone}
</div>
</body></html>`;
}
