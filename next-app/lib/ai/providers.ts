// Provider priority — FREE FIRST → CHEAP → EXPENSIVE
// Sorted by cost-per-1M-tokens (input). Free tiers prioritized.

export type Provider = {
  name: string;
  envKey: string;
  endpoint: string;
  model: string;
  costPer1MInput: number;  // USD per 1M input tokens (0 = free)
  costPer1MOutput: number;
  rateLimit: { rpm: number; tpm: number };  // requests/tokens per minute
  available: () => boolean;
};

export const providers: Provider[] = [
  {
    name: 'groq-llama-3.1-8b',
    envKey: 'GROQ_API_KEY',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant',
    costPer1MInput: 0,           // FREE tier (30 RPM, 14400 RPD)
    costPer1MOutput: 0,
    rateLimit: { rpm: 30, tpm: 30000 },
    available: () => !!process.env.GROQ_API_KEY,
  },
  {
    name: 'gemini-1.5-flash',
    envKey: 'GEMINI_API_KEY',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    costPer1MInput: 0,           // FREE tier (15 RPM, 1M TPM, 1500 RPD)
    costPer1MOutput: 0,
    rateLimit: { rpm: 15, tpm: 1_000_000 },
    available: () => !!process.env.GEMINI_API_KEY,
  },
  {
    name: 'mistral-small',
    envKey: 'MISTRAL_API_KEY',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-small-latest',
    costPer1MInput: 0.20,        // Very cheap paid tier
    costPer1MOutput: 0.60,
    rateLimit: { rpm: 60, tpm: 500_000 },
    available: () => !!process.env.MISTRAL_API_KEY,
  },
  {
    name: 'deepseek-chat',
    envKey: 'DEEPSEEK_API_KEY',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    costPer1MInput: 0.27,        // Cheapest paid
    costPer1MOutput: 1.10,
    rateLimit: { rpm: 60, tpm: 500_000 },
    available: () => !!process.env.DEEPSEEK_API_KEY,
  },
  {
    name: 'openrouter-free',
    envKey: 'OPENROUTER_API_KEY',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    costPer1MInput: 0,           // Free routing through OpenRouter
    costPer1MOutput: 0,
    rateLimit: { rpm: 20, tpm: 100_000 },
    available: () => !!process.env.OPENROUTER_API_KEY,
  },
  {
    name: 'together-llama-3.1',
    envKey: 'TOGETHER_API_KEY',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.1-8B-Instruct-Turbo',
    costPer1MInput: 0.18,
    costPer1MOutput: 0.18,
    rateLimit: { rpm: 60, tpm: 300_000 },
    available: () => !!process.env.TOGETHER_API_KEY,
  },
  {
    name: 'cohere-command-r',
    envKey: 'COHERE_API_KEY',
    endpoint: 'https://api.cohere.com/v1/chat',
    model: 'command-r',
    costPer1MInput: 0.50,
    costPer1MOutput: 1.50,
    rateLimit: { rpm: 60, tpm: 200_000 },
    available: () => !!process.env.COHERE_API_KEY,
  },
  {
    name: 'openai-gpt-4o-mini',
    envKey: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    costPer1MInput: 0.15,
    costPer1MOutput: 0.60,
    rateLimit: { rpm: 500, tpm: 200_000 },
    available: () => !!process.env.OPENAI_API_KEY,
  },
  {
    name: 'anthropic-haiku',
    envKey: 'ANTHROPIC_API_KEY',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-haiku-4-5-20251001',
    costPer1MInput: 1.00,       // PAID, premium quality — last resort
    costPer1MOutput: 5.00,
    rateLimit: { rpm: 50, tpm: 50_000 },
    available: () => !!process.env.ANTHROPIC_API_KEY,
  },
];

export function getAvailableProviders(): Provider[] {
  return providers.filter(p => p.available());
}
