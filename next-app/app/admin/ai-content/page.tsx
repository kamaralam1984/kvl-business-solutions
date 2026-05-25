'use client';
import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2, FileText, Share2, Search, Package } from 'lucide-react';

type ContentType = 'blog' | 'social' | 'meta' | 'product';
type SocialPlatform = 'facebook' | 'instagram' | 'whatsapp';

const TOPICS = {
  blog: ['ERP software ke fayde', 'GPS tracking se fleet manage karo', 'School management software', 'GST billing software', 'AI se business kaise grow kare'],
  social: ['New product launch', 'Customer success story', 'Free demo offer', 'Festival offer', 'Business tip of the week'],
  meta: ['ERP Software India', 'Billing Software SME', 'GPS Vehicle Tracking', 'School Management System', 'Hospital HMS Software'],
  product: ['ERP Software', 'Billing & Invoicing', 'GPS Tracking', 'School ERP', 'AI Business Suite'],
};

export default function AIContentPage() {
  const [type, setType] = useState<ContentType>('blog');
  const [platform, setPlatform] = useState<SocialPlatform>('facebook');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState('');

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setResult(''); setCopied(false);
    try {
      const r = await fetch('/api/admin/ai-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic, platform }),
      }).then(x => x.json());
      if (r.ok) { setResult(r.content); setProvider(r.provider || ''); }
      else setResult(`Error: ${r.error}`);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: ContentType; label: string; icon: any; desc: string }[] = [
    { id: 'blog', label: 'Blog Post', icon: FileText, desc: 'SEO blog post for website' },
    { id: 'social', label: 'Social Media', icon: Share2, desc: 'Facebook / Instagram / WhatsApp' },
    { id: 'meta', label: 'Meta Tags', icon: Search, desc: 'SEO title, description, keywords' },
    { id: 'product', label: 'Product Desc', icon: Package, desc: 'Product page description' },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 grid place-items-center">
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI Content Generator</h1>
          <p className="text-sm text-text2">SEO blogs, social posts, meta tags — AI se seconds mein</p>
        </div>
      </div>

      {/* Type tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setType(t.id); setResult(''); setTopic(''); }}
            className={`p-3 rounded-xl border text-left transition-all ${type === t.id ? 'border-primary bg-primary/10' : 'border-tint surface-tint hover:border-primary/40'}`}>
            <t.icon className={`w-4 h-4 mb-1 ${type === t.id ? 'text-primary' : 'text-text2'}`} />
            <p className={`text-sm font-bold ${type === t.id ? 'text-primary' : ''}`}>{t.label}</p>
            <p className="text-[10px] text-text2">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Social platform picker */}
      {type === 'social' && (
        <div className="flex gap-2">
          {(['facebook', 'instagram', 'whatsapp'] as SocialPlatform[]).map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${platform === p ? 'bg-primary text-white' : 'surface-tint text-text2 hover:text-text'}`}>
              {p === 'facebook' ? '👍 Facebook' : p === 'instagram' ? '📸 Instagram' : '💬 WhatsApp'}
            </button>
          ))}
        </div>
      )}

      {/* Topic input + suggestions */}
      <div className="card-base p-4 space-y-3">
        <label className="text-sm font-semibold">Topic / Subject</label>
        <input value={topic} onChange={e => setTopic(e.target.value)}
          placeholder={type === 'blog' ? 'e.g. ERP software ke fayde' : type === 'meta' ? 'e.g. Billing Software India' : 'Topic likhein...'}
          className="form-control w-full"
          onKeyDown={e => e.key === 'Enter' && generate()}
        />
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-text2 self-center">Quick:</span>
          {TOPICS[type].map(s => (
            <button key={s} onClick={() => setTopic(s)}
              className="text-[10px] px-2 py-1 rounded-full surface-tint border border-tint hover:bg-primary hover:text-white transition-all">
              {s}
            </button>
          ))}
        </div>
        <button onClick={generate} disabled={loading || !topic.trim()}
          className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate Content</>}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card-base p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Generated Content</p>
              {provider && <p className="text-[10px] text-text2">by {provider}</p>}
            </div>
            <button onClick={copy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-green-500/20 text-green-500' : 'surface-tint hover:bg-primary/10 hover:text-primary'}`}>
              {copied ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
            </button>
          </div>
          <pre className="text-sm text-text leading-relaxed whitespace-pre-wrap bg-app rounded-xl p-4 border border-tint max-h-[500px] overflow-y-auto">
            {result}
          </pre>
          <div className="flex gap-2">
            <button onClick={generate}
              className="text-xs px-4 py-2 rounded-lg surface-tint hover:bg-primary/10 hover:text-primary font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Regenerate
            </button>
            <button onClick={() => { const a = document.createElement('a'); a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(result)}`; a.download = `kvl-content-${type}-${Date.now()}.txt`; a.click(); }}
              className="text-xs px-4 py-2 rounded-lg surface-tint font-semibold">
              ⬇ Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
