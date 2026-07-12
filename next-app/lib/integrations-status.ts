export const INTEGRATION_GROUPS: { category: string; keys: { key: string; label: string }[] }[] = [
  {
    category: 'Email',
    keys: [
      { key: 'RESEND_API_KEY', label: 'Resend API Key' },
      { key: 'EMAIL_FROM', label: 'From Address' },
      { key: 'EMAIL_TO_SALES', label: 'Admin Notification Email' },
    ],
  },
  {
    category: 'WhatsApp (WATI)',
    keys: [
      { key: 'WATI_API_KEY', label: 'WATI API Key' },
      { key: 'WATI_API_ENDPOINT', label: 'WATI Endpoint' },
      { key: 'ADMIN_WHATSAPP_PHONE', label: 'Admin WhatsApp Number' },
    ],
  },
  {
    category: 'AI Voice Calling (Vapi)',
    keys: [
      { key: 'VAPI_API_KEY', label: 'Vapi API Key' },
      { key: 'VAPI_PHONE_NUMBER_ID', label: 'Vapi Phone Number ID' },
    ],
  },
  {
    category: 'AI Providers (lead scoring, chatbot, nurture content)',
    keys: [
      { key: 'ANTHROPIC_API_KEY', label: 'Anthropic (Claude)' },
      { key: 'GROQ_API_KEY', label: 'Groq' },
      { key: 'GEMINI_API_KEY', label: 'Google Gemini' },
      { key: 'MISTRAL_API_KEY', label: 'Mistral' },
      { key: 'DEEPSEEK_API_KEY', label: 'DeepSeek' },
      { key: 'OPENROUTER_API_KEY', label: 'OpenRouter' },
      { key: 'TOGETHER_API_KEY', label: 'Together AI' },
      { key: 'COHERE_API_KEY', label: 'Cohere' },
      { key: 'OPENAI_API_KEY', label: 'OpenAI' },
    ],
  },
  {
    category: 'Payments (Razorpay)',
    keys: [
      { key: 'RAZORPAY_KEY_ID', label: 'Key ID' },
      { key: 'RAZORPAY_KEY_SECRET', label: 'Key Secret' },
      { key: 'RAZORPAY_WEBHOOK_SECRET', label: 'Webhook Secret' },
    ],
  },
  {
    category: 'File Uploads (Cloudinary)',
    keys: [
      { key: 'CLOUDINARY_CLOUD_NAME', label: 'Cloud Name' },
      { key: 'CLOUDINARY_API_KEY', label: 'API Key' },
      { key: 'CLOUDINARY_API_SECRET', label: 'API Secret' },
    ],
  },
  {
    category: 'Core System',
    keys: [
      { key: 'MONGODB_URI', label: 'Database Connection' },
      { key: 'NEXTAUTH_SECRET', label: 'Auth Secret' },
      { key: 'CRON_SECRET', label: 'Cron Job Secret' },
    ],
  },
  {
    category: 'Marketing Pixels & Search Console',
    keys: [
      { key: 'NEXT_PUBLIC_GA_ID', label: 'Google Analytics' },
      { key: 'NEXT_PUBLIC_GTM_ID', label: 'Google Tag Manager' },
      { key: 'NEXT_PUBLIC_META_PIXEL_ID', label: 'Meta Pixel' },
      { key: 'NEXT_PUBLIC_LINKEDIN_PARTNER_ID', label: 'LinkedIn Insight' },
      { key: 'NEXT_PUBLIC_CLARITY_ID', label: 'Microsoft Clarity' },
      { key: 'NEXT_PUBLIC_GSC_VERIFICATION', label: 'Google Search Console' },
    ],
  },
];

export function getIntegrationsSummary() {
  const allKeys = INTEGRATION_GROUPS.flatMap(g => g.keys);
  const configuredCount = allKeys.filter(({ key }) => Boolean(process.env[key]?.trim())).length;
  return { configuredCount, total: allKeys.length };
}
