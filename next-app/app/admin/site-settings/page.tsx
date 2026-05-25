'use client';
import { useEffect, useState } from 'react';
import { Save, Settings, Phone, Globe, Building2, Star, ToggleLeft, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export default function SiteSettingsPage() {
  const [s, setS] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState<'contact' | 'brand' | 'hero' | 'features' | 'seo' | 'maintenance'>('contact');

  useEffect(() => {
    fetch('/api/admin/site-settings').then(r => r.json()).then(d => d.ok && setS(d.settings));
  }, []);

  const save = async () => {
    setLoading(true); setMsg('');
    try {
      const r = await fetch('/api/admin/site-settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s),
      });
      const d = await r.json();
      setMsg(d.ok ? '✓ Saved — live in 30 seconds' : `Error: ${d.error}`);
    } finally { setLoading(false); }
  };

  if (!s) return <div className="p-8 text-text2">Loading…</div>;

  const update = (k: string, v: any) => setS({ ...s, [k]: v });
  const updateNested = (parent: string, k: string, v: any) => setS({ ...s, [parent]: { ...(s[parent] || {}), [k]: v } });

  const tabs = [
    { id: 'contact', label: 'Contact', Icon: Phone },
    { id: 'brand', label: 'Brand', Icon: Globe },
    { id: 'hero', label: 'Homepage', Icon: ImageIcon },
    { id: 'features', label: 'Features', Icon: ToggleLeft },
    { id: 'seo', label: 'SEO', Icon: Star },
    { id: 'maintenance', label: 'Maintenance', Icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2"><Settings className="w-6 h-6 text-primary" /> Site Settings</h1>
          <p className="text-text2 text-sm mt-1">Control your website without code changes. Changes go live in 30 seconds.</p>
        </div>
        <button onClick={save} disabled={loading} className="btn btn-primary"><Save className="w-4 h-4" /> {loading ? 'Saving…' : 'Save Changes'}</button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✓') ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>{msg}</div>}

      <div className="flex flex-wrap gap-1 mb-5 border-b border-tint pb-3">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${tab === t.id ? 'bg-primary text-white' : 'surface-tint text-text2 hover:text-text'}`}>
            <t.Icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="card-base p-6 space-y-4">
        {tab === 'contact' && (
          <>
            <Section title="Contact info" desc="Used in footer, contact page, and structured data" />
            <Grid cols={2}>
              <Field label="Phone" value={s.phone} onChange={v => update('phone', v)} />
              <Field label="WhatsApp (without +)" value={s.whatsapp} onChange={v => update('whatsapp', v)} placeholder="919942000413" />
              <Field label="Primary email" value={s.email} onChange={v => update('email', v)} />
              <Field label="Support email" value={s.supportEmail} onChange={v => update('supportEmail', v)} />
              <Field label="Sales email" value={s.salesEmail} onChange={v => update('salesEmail', v)} />
              <Field label="GSTIN" value={s.gstin} onChange={v => update('gstin', v)} />
              <Field label="Address line 1" value={s.addressLine1} onChange={v => update('addressLine1', v)} />
              <Field label="Address line 2" value={s.addressLine2} onChange={v => update('addressLine2', v)} />
              <Field label="Business hours" value={s.businessHours} onChange={v => update('businessHours', v)} />
              <Field label="Support hours" value={s.supportHours} onChange={v => update('supportHours', v)} />
              <Field label="Avg. response time" value={s.averageResponseTime} onChange={v => update('averageResponseTime', v)} />
            </Grid>

            <Section title="Social links" desc="Footer icons — leave blank to hide" />
            <Grid cols={2}>
              <Field label="Facebook URL" value={s.social?.facebook || ''} onChange={v => updateNested('social', 'facebook', v)} placeholder="https://facebook.com/kvl" />
              <Field label="Instagram URL" value={s.social?.instagram || ''} onChange={v => updateNested('social', 'instagram', v)} />
              <Field label="LinkedIn URL" value={s.social?.linkedin || ''} onChange={v => updateNested('social', 'linkedin', v)} />
              <Field label="YouTube URL" value={s.social?.youtube || ''} onChange={v => updateNested('social', 'youtube', v)} />
              <Field label="Twitter / X URL" value={s.social?.twitter || ''} onChange={v => updateNested('social', 'twitter', v)} />
            </Grid>
          </>
        )}

        {tab === 'brand' && (
          <>
            <Section title="Brand identity" />
            <Field label="Brand name" value={s.brandName} onChange={v => update('brandName', v)} />
            <Field label="Tagline" value={s.tagline} onChange={v => update('tagline', v)} />
          </>
        )}

        {tab === 'hero' && (
          <>
            <Section title="Homepage hero" desc="The first thing visitors see" />
            <Field label="Eyebrow (small text above title)" value={s.heroEyebrow} onChange={v => update('heroEyebrow', v)} />
            <Field label="Title (first part)" value={s.heroTitle} onChange={v => update('heroTitle', v)} />
            <Field label="Title accent (gradient part)" value={s.heroAccent} onChange={v => update('heroAccent', v)} />
            <Field label="Description" value={s.heroDescription} onChange={v => update('heroDescription', v)} textarea />

            <Section title="CTA buttons" />
            <Grid cols={2}>
              <Field label="Primary button text" value={s.heroCtaText} onChange={v => update('heroCtaText', v)} />
              <Field label="Primary button link" value={s.heroCtaLink} onChange={v => update('heroCtaLink', v)} />
              <Field label="Secondary button text" value={s.heroSecondaryCtaText} onChange={v => update('heroSecondaryCtaText', v)} />
              <Field label="Secondary button link" value={s.heroSecondaryCtaLink} onChange={v => update('heroSecondaryCtaLink', v)} />
            </Grid>

            <Section title="Stats counters" />
            <Grid cols={4}>
              <Field label="Customers" value={s.stats?.customers} onChange={v => updateNested('stats', 'customers', v)} />
              <Field label="Projects" value={s.stats?.projects} onChange={v => updateNested('stats', 'projects', v)} />
              <Field label="Rating" value={s.stats?.rating} onChange={v => updateNested('stats', 'rating', v)} />
              <Field label="Uptime" value={s.stats?.uptime} onChange={v => updateNested('stats', 'uptime', v)} />
            </Grid>

            <Section title="Featured products on homepage" desc="Comma-separated slugs" />
            <Field
              label="Slugs (e.g., erp, crm, gps-tracking)"
              value={(s.featuredProductSlugs || []).join(', ')}
              onChange={v => update('featuredProductSlugs', v.split(',').map(x => x.trim()).filter(Boolean))}
            />
          </>
        )}

        {tab === 'features' && (
          <>
            <Section title="Feature toggles" desc="Turn site-wide features on/off" />
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.entries(s.features || {}).map(([k, v]) => (
                <label key={k} className="flex items-center justify-between p-3 surface-tint rounded-lg cursor-pointer hover:bg-primary/5">
                  <span className="text-sm font-semibold">{k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}</span>
                  <input type="checkbox" checked={!!v} onChange={e => updateNested('features', k, e.target.checked)} className="w-4 h-4 accent-primary" />
                </label>
              ))}
            </div>
          </>
        )}

        {tab === 'seo' && (
          <>
            <Section title="Default SEO" desc="Used when pages don't override" />
            <Field label="Meta title" value={s.metaTitle} onChange={v => update('metaTitle', v)} />
            <Field label="Meta description" value={s.metaDescription} onChange={v => update('metaDescription', v)} textarea />
          </>
        )}

        {tab === 'maintenance' && (
          <>
            <Section title="Maintenance mode" desc="When ON, only admins can access the site. Visitors see a maintenance page." />
            <label className="flex items-center justify-between p-3 surface-tint rounded-lg cursor-pointer">
              <span className="font-semibold">Enable maintenance mode</span>
              <input type="checkbox" checked={!!s.maintenanceMode} onChange={e => update('maintenanceMode', e.target.checked)} className="w-4 h-4 accent-red-500" />
            </label>
            <Field label="Message shown to visitors" value={s.maintenanceMessage} onChange={v => update('maintenanceMessage', v)} textarea />
            {s.maintenanceMode && <p className="text-xs text-red-500 font-semibold">⚠️ Maintenance mode is ON — visitors are blocked.</p>}
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="border-b border-tint pb-2 mt-4 first:mt-0">
      <h3 className="font-bold text-sm uppercase tracking-wider text-text2">{title}</h3>
      {desc && <p className="text-xs text-text2 mt-1">{desc}</p>}
    </div>
  );
}

function Grid({ cols, children }: { cols: number; children: React.ReactNode }) {
  const gridCols = cols === 4 ? 'sm:grid-cols-4' : cols === 2 ? 'sm:grid-cols-2' : '';
  return <div className={`grid gap-3 ${gridCols}`}>{children}</div>;
}

function Field({ label, value, onChange, textarea, placeholder }: { label: string; value: any; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-text2 mb-1 block">{label}</label>
      {textarea ? (
        <textarea className="form-control" rows={3} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="form-control" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}
