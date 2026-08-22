import { Provider, getAvailableProviders } from './providers';
import { getCached, setCached } from './cache';
import { fetchWithTimeout } from '../fetch-timeout';

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export type ChatResult = {
  reply: string;
  provider: string;
  cached: boolean;
  fallbackChain: string[];   // ['groq-llama', 'gemini-flash'] — providers that were tried
  cost: number;              // estimated USD cost
};

type ChatOpts = {
  messages: ChatMessage[];
  system?: string;
  maxTokens?: number;
  temperature?: number;
  cacheKey?: string;         // if provided, cache lookup/store
};

// Provider-specific request builders
async function callProvider(p: Provider, opts: ChatOpts): Promise<string> {
  const key = process.env[p.envKey]!;
  const sys = opts.system || '';
  const msgs = opts.messages;
  const max = opts.maxTokens ?? 400;
  const temp = opts.temperature ?? 0.7;

  // Gemini has a different shape
  if (p.name.startsWith('gemini')) {
    const contents = msgs.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const body = {
      contents: sys ? [{ role: 'user', parts: [{ text: sys }] }, ...contents] : contents,
      generationConfig: { maxOutputTokens: max, temperature: temp },
    };
    const r = await fetchWithTimeout(`${p.endpoint}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`${p.name}: ${r.status}`);
    const data = await r.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // Cohere
  if (p.name.startsWith('cohere')) {
    const r = await fetchWithTimeout(p.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: p.model,
        message: msgs[msgs.length - 1].content,
        chat_history: msgs.slice(0, -1).map(m => ({ role: m.role === 'assistant' ? 'CHATBOT' : 'USER', message: m.content })),
        preamble: sys || undefined,
        max_tokens: max, temperature: temp,
      }),
    });
    if (!r.ok) throw new Error(`${p.name}: ${r.status}`);
    const data = await r.json();
    return data.text || '';
  }

  // Anthropic
  if (p.name.startsWith('anthropic')) {
    const r = await fetchWithTimeout(p.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: p.model,
        max_tokens: max,
        system: sys ? [{ type: 'text', text: sys, cache_control: { type: 'ephemeral' } }] : undefined,
        messages: msgs.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
      }),
    });
    if (!r.ok) throw new Error(`${p.name}: ${r.status}`);
    const data = await r.json();
    return data.content?.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n') || '';
  }

  // OpenAI-compatible (Groq, Mistral, DeepSeek, OpenRouter, Together, OpenAI)
  const body: any = {
    model: p.model,
    messages: sys ? [{ role: 'system', content: sys }, ...msgs] : msgs,
    max_tokens: max,
    temperature: temp,
  };
  const r = await fetchWithTimeout(p.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(p.name.startsWith('openrouter') ? { 'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com', 'X-Title': 'KVL Business Solutions' } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    throw new Error(`${p.name}: ${r.status} ${t.slice(0, 100)}`);
  }
  const data = await r.json();
  return data.choices?.[0]?.message?.content || '';
}

// Track usage stats in memory (last 100 calls per provider)
const usageStats: Record<string, { calls: number; failures: number; lastError?: string }> = {};

export function getUsageStats() {
  return { ...usageStats };
}

// Main router — tries providers in priority order
export async function chatRouted(opts: ChatOpts): Promise<ChatResult> {
  // Cache check
  if (opts.cacheKey) {
    const cached = await getCached(opts.cacheKey);
    if (cached) {
      return { reply: cached, provider: 'cache', cached: true, fallbackChain: [], cost: 0 };
    }
  }

  const available = getAvailableProviders();
  if (available.length === 0) {
    return { reply: 'AI is offline. Please WhatsApp +91 99420 00413 for instant help.', provider: 'none', cached: false, fallbackChain: [], cost: 0 };
  }

  const chain: string[] = [];

  for (const p of available) {
    chain.push(p.name);
    try {
      const start = Date.now();
      const reply = await callProvider(p, opts);
      const dur = Date.now() - start;

      if (!reply || reply.length < 2) throw new Error('Empty response');

      usageStats[p.name] = { calls: (usageStats[p.name]?.calls || 0) + 1, failures: usageStats[p.name]?.failures || 0 };

      // Estimate cost (very rough — assumes 500 in + 200 out tokens average)
      const cost = (500 * p.costPer1MInput + 200 * p.costPer1MOutput) / 1_000_000;

      console.log(`[ai-router] ✓ ${p.name} (${dur}ms, ~$${cost.toFixed(6)})`);

      if (opts.cacheKey) await setCached(opts.cacheKey, reply);

      return { reply, provider: p.name, cached: false, fallbackChain: chain, cost };
    } catch (e: any) {
      console.warn(`[ai-router] ✗ ${p.name} failed: ${e.message}`);
      usageStats[p.name] = {
        calls: usageStats[p.name]?.calls || 0,
        failures: (usageStats[p.name]?.failures || 0) + 1,
        lastError: e.message,
      };
      continue;
    }
  }

  // All providers failed
  return {
    reply: 'Sorry, our AI is overloaded right now. Please WhatsApp +91 99420 00413 for instant help.',
    provider: 'all-failed',
    cached: false,
    fallbackChain: chain,
    cost: 0,
  };
}
