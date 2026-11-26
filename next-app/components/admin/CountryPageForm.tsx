'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { slugify } from '@/lib/utils';

export type Faq = { q: string; a: string };
export type CountryFormData = {
  _id?: string;
  slug: string;
  name: string;
  status: 'draft' | 'published';
  pageType: 'hub' | 'standalone';
  heroTitle: string;
  heroDescription: string;
  intro: string;
  businessContext: string[];
  whyChooseReasons: string[];
  industriesIntro: string;
  timezoneOverlap: string;
  processIntro: string;
  ctaBannerDesc: string;
  faq: Faq[];
  gallery: string[];
  relatedServiceSlugs: string[];
  relatedIndustryLandingSlugs: string[];
  relatedCaseStudySlugs: string[];
  seo: {
    title: string; description: string; ogImage: string; primaryKeyword: string; secondaryKeywords: string[];
    canonicalUrl: string; ogTitle: string; ogDescription: string;
    twitterTitle: string; twitterDescription: string; robotsIndex: boolean; robotsFollow: boolean;
    schemaType: string; breadcrumbTitle: string;
  };
};

export const emptyCountry: CountryFormData = {
  slug: '', name: '', status: 'draft', pageType: 'standalone',
  heroTitle: '', heroDescription: '', intro: '',
  businessContext: [''], whyChooseReasons: [''],
  industriesIntro: '', timezoneOverlap: '', processIntro: '', ctaBannerDesc: '', faq: [], gallery: [],
  relatedServiceSlugs: [], relatedIndustryLandingSlugs: [], relatedCaseStudySlugs: [],
  seo: {
    title: '', description: '', ogImage: '', primaryKeyword: '', secondaryKeywords: [],
    canonicalUrl: '', ogTitle: '', ogDescription: '',
    twitterTitle: '', twitterDescription: '', robotsIndex: true, robotsFollow: true,
    schemaType: 'Service', breadcrumbTitle: '',
  },
};

function csv(arr: string[]) { return arr.join(', '); }
function fromCsv(s: string) { return s.split(',').map(v => v.trim()).filter(Boolean); }

export function CountryPageForm({ initial, isNew }: { initial: CountryFormData; isNew: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<CountryFormData>(initial);
  const [tab, setTab] = useState<'content' | 'seo'>('content');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof CountryFormData>(key: K, val: CountryFormData[K]) => setData(d => ({ ...d, [key]: val }));
  const setSeo = <K extends keyof CountryFormData['seo']>(key: K, val: CountryFormData['seo'][K]) =>
    setData(d => ({ ...d, seo: { ...d.seo, [key]: val } }));

  const updateListItem = (key: 'businessContext' | 'whyChooseReasons', i: number, val: string) => {
    const arr = [...data[key]]; arr[i] = val; set(key, arr);
  };
  const addListItem = (key: 'businessContext' | 'whyChooseReasons') => set(key, [...data[key], '']);
  const removeListItem = (key: 'businessContext' | 'whyChooseReasons', i: number) => set(key, data[key].filter((_, idx) => idx !== i));

  const updateFaq = (i: number, k: keyof Faq, val: string) => {
    const faq = [...data.faq]; faq[i] = { ...faq[i], [k]: val }; set('faq', faq);
  };

  const save = async () => {
    setSaving(true); setMsg('');
    const url = isNew ? '/api/admin/countries' : `/api/admin/countries/${data._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const d = await r.json();
    setSaving(false);
    if (d.ok) {
      setMsg('✓ Saved');
      if (isNew) router.push(`/admin/countries/${d.country._id}/edit`);
    } else {
      setMsg(`Error: ${d.error}`);
    }
  };

  const inputCls = 'form-control w-full';
  const labelCls = 'text-[11px] font-semibold uppercase block mb-1.5';
  const labelStyle = { color: 'rgba(var(--text) / 0.4)' };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text))' }}>{isNew ? 'New Country Page' : `Edit — ${data.name || 'Country'}`}</h1>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs" style={{ color: 'rgba(var(--text) / 0.5)' }}>{msg}</span>}
          <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {(['content', 'seo'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold capitalize"
            style={tab === t
              ? { background: 'rgba(200,168,112,0.12)', color: '#c8a96e', border: '1px solid rgba(200,168,112,0.25)' }
              : { color: 'rgba(var(--text) / 0.45)', border: '1px solid rgba(var(--border) / 0.1)' }}
          >
            {t === 'seo' ? 'SEO & Keywords' : 'Content'}
          </button>
        ))}
      </div>

      {tab === 'content' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Country Name</label>
              <input className={inputCls} placeholder="e.g. United States" value={data.name} onChange={e => {
                const name = e.target.value;
                set('name', name);
                if (isNew) set('slug', slugify(name));
              }} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Slug (URL: /{'{slug}'})</label>
              <input className={inputCls} value={data.slug} onChange={e => set('slug', slugify(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Page Type</label>
              <select className={inputCls} value={data.pageType} onChange={e => set('pageType', e.target.value as CountryFormData['pageType'])}>
                <option value="standalone">Standalone (full page — no sub-regions)</option>
                <option value="hub">Hub (lists Location Pages, like India)</option>
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Status</label>
              <select className={inputCls} value={data.status} onChange={e => set('status', e.target.value as CountryFormData['status'])}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Hero Title (H1)</label>
            <input className={inputCls} placeholder="Software Development Company for USA Businesses" value={data.heroTitle} onChange={e => set('heroTitle', e.target.value)} />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Hero Description / Tagline</label>
            <textarea className={inputCls} rows={2} value={data.heroDescription} onChange={e => set('heroDescription', e.target.value)} />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Intro (positioning strip under hero)</label>
            <textarea className={inputCls} rows={2} value={data.intro} onChange={e => set('intro', e.target.value)} />
          </div>

          {(['businessContext', 'whyChooseReasons'] as const).map(key => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold uppercase" style={labelStyle}>
                  {key === 'businessContext' ? 'Business Context Paragraphs' : 'Why Choose KVL — Reasons'}
                </label>
                <button onClick={() => addListItem(key)} className="text-[11px] font-semibold" style={{ color: '#c8a96e' }}>+ Add</button>
              </div>
              <div className="space-y-2">
                {data[key].map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea className={`${inputCls} flex-1`} rows={key === 'businessContext' ? 3 : 2} value={v} onChange={e => updateListItem(key, i, e.target.value)} />
                    <button onClick={() => removeListItem(key, i)} aria-label="Remove" style={{ color: 'rgba(var(--text) / 0.3)' }}><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className={labelCls} style={labelStyle}>Industries Intro (optional)</label>
            <textarea className={inputCls} rows={2} value={data.industriesIntro} onChange={e => set('industriesIntro', e.target.value)} />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Timezone / Remote-Delivery Content</label>
            <textarea className={inputCls} rows={3} value={data.timezoneOverlap} onChange={e => set('timezoneOverlap', e.target.value)} />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Process Intro (optional)</label>
            <textarea className={inputCls} rows={2} value={data.processIntro} onChange={e => set('processIntro', e.target.value)} />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>CTA Banner Description</label>
            <textarea className={inputCls} rows={2} value={data.ctaBannerDesc} onChange={e => set('ctaBannerDesc', e.target.value)} />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Gallery Image URLs (comma-separated — leave blank to auto-use related case study screenshots)</label>
            <textarea className={inputCls} rows={2} value={csv(data.gallery)} onChange={e => set('gallery', fromCsv(e.target.value))} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase" style={labelStyle}>FAQ</label>
              <button onClick={() => set('faq', [...data.faq, { q: '', a: '' }])} className="text-[11px] font-semibold" style={{ color: '#c8a96e' }}>+ Add FAQ</button>
            </div>
            <div className="space-y-2">
              {data.faq.map((f, i) => (
                <div key={i} className="p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(var(--surface) / 0.03)' }}>
                  <div className="flex gap-2">
                    <input className={`${inputCls} flex-1`} placeholder="Question" value={f.q} onChange={e => updateFaq(i, 'q', e.target.value)} />
                    <button onClick={() => set('faq', data.faq.filter((_, idx) => idx !== i))} aria-label="Remove FAQ" style={{ color: 'rgba(var(--text) / 0.3)' }}><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <textarea className={inputCls} rows={2} placeholder="Answer" value={f.a} onChange={e => updateFaq(i, 'a', e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Related Service Slugs (comma-separated)</label>
            <input className={inputCls} value={csv(data.relatedServiceSlugs)} onChange={e => set('relatedServiceSlugs', fromCsv(e.target.value))} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Related Industry Landing Slugs (comma-separated)</label>
            <input className={inputCls} value={csv(data.relatedIndustryLandingSlugs)} onChange={e => set('relatedIndustryLandingSlugs', fromCsv(e.target.value))} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Related Case Study Slugs (comma-separated)</label>
            <input className={inputCls} value={csv(data.relatedCaseStudySlugs)} onChange={e => set('relatedCaseStudySlugs', fromCsv(e.target.value))} />
          </div>
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-4">
          <div>
            <label className={labelCls} style={labelStyle}>SEO Title</label>
            <input className={inputCls} value={data.seo.title} onChange={e => setSeo('title', e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Meta Description</label>
            <textarea className={inputCls} rows={2} value={data.seo.description} onChange={e => setSeo('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Primary Keyword</label>
              <input className={inputCls} placeholder="e.g. software development company USA" value={data.seo.primaryKeyword} onChange={e => setSeo('primaryKeyword', e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Secondary Keywords (comma-separated)</label>
              <input className={inputCls} value={csv(data.seo.secondaryKeywords)} onChange={e => setSeo('secondaryKeywords', fromCsv(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Canonical URL Override (optional)</label>
              <input className={inputCls} value={data.seo.canonicalUrl} onChange={e => setSeo('canonicalUrl', e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>OG Image URL</label>
              <input className={inputCls} value={data.seo.ogImage} onChange={e => setSeo('ogImage', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>OG Title</label>
              <input className={inputCls} value={data.seo.ogTitle} onChange={e => setSeo('ogTitle', e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>OG Description</label>
              <input className={inputCls} value={data.seo.ogDescription} onChange={e => setSeo('ogDescription', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Twitter/X Title</label>
              <input className={inputCls} value={data.seo.twitterTitle} onChange={e => setSeo('twitterTitle', e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Twitter/X Description</label>
              <input className={inputCls} value={data.seo.twitterDescription} onChange={e => setSeo('twitterDescription', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Schema Type</label>
              <input className={inputCls} value={data.seo.schemaType} onChange={e => setSeo('schemaType', e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Breadcrumb Title</label>
              <input className={inputCls} value={data.seo.breadcrumbTitle} onChange={e => setSeo('breadcrumbTitle', e.target.value)} />
            </div>
          </div>
          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 text-[13px]" style={{ color: 'rgba(var(--text) / 0.7)' }}>
              <input type="checkbox" checked={data.seo.robotsIndex} onChange={e => setSeo('robotsIndex', e.target.checked)} /> Robots: Index
            </label>
            <label className="flex items-center gap-2 text-[13px]" style={{ color: 'rgba(var(--text) / 0.7)' }}>
              <input type="checkbox" checked={data.seo.robotsFollow} onChange={e => setSeo('robotsFollow', e.target.checked)} /> Robots: Follow
            </label>
          </div>
          <p className="text-[11.5px] leading-relaxed" style={{ color: 'rgba(var(--text) / 0.3)' }}>
            Primary/secondary keywords are stored for content planning only — they are never rendered as a literal
            meta-keywords tag. Ranking comes from the title, description, headings, and content above.
          </p>
        </div>
      )}
    </div>
  );
}
