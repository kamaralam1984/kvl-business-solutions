'use client';
import { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';

export function NewsletterForm({ source = 'footer' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading'); setMsg('');
    try {
      const r = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source }) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Subscribe failed');
      setState('ok');
      setMsg(d.already ? 'You\'re already subscribed — thanks!' : 'Subscribed! Check your inbox for updates.');
      setEmail('');
    } catch (e: any) { setState('error'); setMsg(e.message); }
  };

  const inputId = `newsletter-email-${source}`;
  const msgId = `${inputId}-msg`;

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor={inputId} className="sr-only">Email address</label>
          <Mail className="absolute left-3 top-3 w-4 h-4 text-text2" />
          <input
            id={inputId}
            name="email"
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Your email"
            autoComplete="email"
            aria-invalid={state === 'error'}
            aria-describedby={msg ? msgId : undefined}
            className="form-control pl-10 text-sm"
            disabled={state === 'loading' || state === 'ok'}
          />
        </div>
        <button disabled={state === 'loading' || state === 'ok'} className="btn btn-primary px-4">
          {state === 'ok' ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
      {msg && <p id={msgId} role="status" className={`text-xs ${state === 'error' ? 'text-red-500' : 'text-green-500'}`}>{msg}</p>}
      <p className="text-[10px] text-text2">Get product updates, deals & tips. Unsubscribe anytime.</p>
    </form>
  );
}
