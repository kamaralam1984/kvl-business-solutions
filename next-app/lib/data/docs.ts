export type DocArticle = {
  slug: string;
  category: string;
  title: string;
  description: string;
  content: string; // markdown-ish
  updated: string;
  tags: string[];
};

export const docCategories = [
  { slug: 'getting-started', name: 'Getting Started', icon: 'Rocket', desc: 'Set up your KVL account and first product' },
  { slug: 'billing-payments', name: 'Billing & Payments', icon: 'CreditCard', desc: 'Invoices, GST, refunds, coupons' },
  { slug: 'software-products', name: 'Software Products', icon: 'Box', desc: 'Setup guides for each product' },
  { slug: 'integrations', name: 'Integrations', icon: 'Plug', desc: 'Connect Tally, WhatsApp, payment gateways' },
  { slug: 'troubleshooting', name: 'Troubleshooting', icon: 'AlertCircle', desc: 'Common issues and fixes' },
  { slug: 'admin-guide', name: 'Admin Guide', icon: 'Shield', desc: 'For business owners managing teams' },
];

export const docArticles: DocArticle[] = [
  {
    slug: 'create-account',
    category: 'getting-started',
    title: 'How to create your KVL account',
    description: 'Sign up, verify email, and log in for the first time.',
    updated: '2026-05',
    tags: ['signup', 'login', 'email verification'],
    content: `## Step 1: Sign up
Go to **/register** and fill in your name, email, phone, and a strong password (6+ characters).

## Step 2: Verify email
Check your inbox — we send a verification link instantly. Click it to confirm your email. Link expires in 24 hours.

## Step 3: Log in
After verifying, go to **/login** and sign in with your email + password. You can also use **"Continue with Google"** for one-click sign-in.

## Step 4: Complete your profile
Go to **/dashboard/settings** and add:
- Phone & company name
- **GSTIN** (mandatory for tax invoices)
- Billing address (used on invoices)

## Trouble?
- Didn't receive verification email? Check spam, or request a new link from /login.
- Forgot password? Use **/forgot-password** to reset.`,
  },
  {
    slug: 'buying-software',
    category: 'getting-started',
    title: 'How to buy a software product',
    description: 'Purchase, payment, and license activation.',
    updated: '2026-05',
    tags: ['checkout', 'razorpay', 'payment', 'license'],
    content: `## Step 1: Choose a product
Browse **/software** or **/pricing**. Click any product to see details, features, and a demo option.

## Step 2: Pick hosting
On the checkout page, choose:
- **Cloud** (₹standard price) — we host & maintain
- **On-Premise** (₹+50%) — installed on your server

## Step 3: Apply coupon (optional)
Enter a coupon code in the order summary. Discount appears instantly before tax.

## Step 4: Pay
Click **Pay Now** — Razorpay opens. Use UPI, cards, netbanking, or wallets. All payments are 256-bit encrypted.

## Step 5: License activation
Once payment succeeds:
- License key is generated instantly
- Email sent with key + GST invoice link
- Available in **/dashboard/orders/[id]**
- Installation team contacts you within 24 hours`,
  },
  {
    slug: 'gst-invoice',
    category: 'billing-payments',
    title: 'Download GST invoice',
    description: 'Generate, view, and download tax invoices.',
    updated: '2026-05',
    tags: ['gst', 'invoice', 'tax'],
    content: `## Where to find invoices
Every paid order has a downloadable GST invoice. Go to:
- **/dashboard** → click any paid order → **Download Invoice** button
- Or directly: **/api/invoice/{orderId}**

## What's included
- KVL GSTIN: 27AAAAA0000A1Z5
- Your GSTIN (from profile)
- HSN code: 998314 (software services)
- 18% GST (split CGST+SGST for Maharashtra customers, IGST for inter-state)
- Invoice number format: KVL/INV/{year}/{order-suffix}

## To get GST input credit
Add your **GSTIN** in **/dashboard/settings** BEFORE making the purchase. We cannot edit invoices after they're generated.

## Need a correction?
Contact billing@kvlsolutions.in within 7 days. We can issue a credit note + revised invoice.`,
  },
  {
    slug: 'refund-policy',
    category: 'billing-payments',
    title: 'Request a refund',
    description: 'How to get your money back within 30 days.',
    updated: '2026-05',
    tags: ['refund', 'cancel', 'money-back'],
    content: `## 30-day money-back guarantee
Any software product can be refunded within **30 days** of purchase. No questions asked.

## How to request
1. Email **billing@kvlsolutions.in** with your order ID, OR
2. Raise a ticket from **/support**

## Processing time
- Approval: within 24 hours
- Money in your bank: **5–7 business days** (refunded to original payment method via Razorpay)

## What's non-refundable
- Custom development after milestone sign-off
- Hardware (GPS, CCTV) once shipped & activated
- Setup/installation services already delivered
- Consulting hours already consumed

## Subscription cancellation
You can stop auto-renewal anytime from settings. Access continues until current billing period ends.`,
  },
  {
    slug: 'tally-integration',
    category: 'integrations',
    title: 'Connect KVL Billing to Tally',
    description: 'Export sales data to Tally ERP 9 / Prime.',
    updated: '2026-05',
    tags: ['tally', 'export', 'accounting'],
    content: `## Supported Tally versions
- Tally ERP 9 (Release 6.4+)
- Tally Prime (3.0+)

## One-time setup
1. In KVL Billing → **Settings** → **Integrations** → **Tally**
2. Enter your Tally Company name (exactly as shown in Tally)
3. Choose voucher type mapping (Sales = Sales, Receipt = Receipt)
4. Click **Test connection**

## Daily export
- Manual: Sales → Export → "Send to Tally"
- Auto: enable nightly sync (10 PM IST) in Tally Integration settings
- File format: XML (TallyXML schema)

## Troubleshooting
- **"Company not found"** → Tally is closed, or company name has extra spaces
- **"Voucher rejected"** → GSTIN mismatch in master data
- **Need help?** Raise a ticket with "Tally" priority — our integration team responds within 2 hours.`,
  },
  {
    slug: 'whatsapp-integration',
    category: 'integrations',
    title: 'WhatsApp notifications for customers',
    description: 'Send invoices and updates via WhatsApp.',
    updated: '2026-05',
    tags: ['whatsapp', 'sms', 'notifications'],
    content: `## What you can send
Once configured, KVL software can auto-send these via WhatsApp to your customers:
- Order/invoice PDFs
- Payment reminders
- Delivery updates
- Service appointment reminders

## Setup (one-time)
1. Apply for a **WhatsApp Business API** account (we recommend Gupshup or Twilio)
2. Get your Business Solution Provider (BSP) API key
3. In KVL → **Settings** → **WhatsApp** → paste key
4. Verify by sending a test message to your phone

## Templates
We provide pre-approved templates for:
- Invoice notification
- Payment reminder
- Welcome message

All templates are GST/RBI compliant for Indian businesses.

## Costs
- WhatsApp charges ~₹0.34 per business-initiated message
- KVL charges ₹0 for the integration itself`,
  },
  {
    slug: 'login-issues',
    category: 'troubleshooting',
    title: "Can't log in — common fixes",
    description: 'Forgot password, account locked, 2FA, etc.',
    updated: '2026-05',
    tags: ['login', 'password', 'reset'],
    content: `## Forgot password
1. Go to **/forgot-password**
2. Enter your registered email
3. Check inbox for reset link (expires in 1 hour)
4. Click link → set new password (6+ chars)

## "Invalid email or password" but you're sure they're right
- Check Caps Lock
- Try in incognito mode (rule out cached extensions)
- Did you sign up with Google? Click **"Continue with Google"** instead

## Email not verified
We need email verification before login.
- Check inbox (and spam) for the verification email
- Didn't get it? Sign up again with the same email — we'll resend

## Account suspended
Contact support@kvlsolutions.in with your registered email.

## Still stuck?
WhatsApp our support: **+91 99420 00413**`,
  },
  {
    slug: 'admin-roles',
    category: 'admin-guide',
    title: 'Managing admin users',
    description: 'Add, promote, or remove admin team members.',
    updated: '2026-05',
    tags: ['admin', 'roles', 'permissions'],
    content: `## Promoting a user to admin
Only existing admins can do this:
1. Go to **/admin/users**
2. Find the user (search by email or name)
3. Click their **ROLE** badge to toggle USER ↔ ADMIN
4. Confirm — they get admin access immediately

## What admins can do
- View all orders, leads, tickets, quotes, bookings
- Create/edit/delete products and coupons
- Issue refunds (logged in activity log)
- Approve/feature/delete reviews
- Export all data to CSV
- See activity log of all admin actions

## Removing admin access
Same flow — click ADMIN badge to demote to USER.

## Security best practices
- Use strong unique passwords
- Don't share admin credentials
- Change default admin password immediately after setup
- Review **/admin/activity** weekly for unexpected actions`,
  },
];

export function searchDocs(query: string): DocArticle[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return docArticles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.content.toLowerCase().includes(q) ||
    a.tags.some(t => t.toLowerCase().includes(q))
  );
}
