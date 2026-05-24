# KVL Business Solutions — Full-Stack Next.js App

India's next-generation business technology platform. Complete production-ready stack: **Next.js 14 + TypeScript + Tailwind + Framer Motion + Three.js + MongoDB + NextAuth + Razorpay + Claude AI**.

## ✨ Features

### Frontend
- 10 fully-built pages (Home, Software, Demos, Services, Industries, About, Projects, Clients, Contact, Support)
- Premium dark/light theme with glassmorphism + gradients
- Framer Motion page transitions + scroll animations
- Three.js 3D hero scene (interactive globe + floating icons)
- Animated particles network background
- 3D tilt cards, before/after slider, animated KPI dashboard
- Live chart visualizations (bar + donut)
- Mobile responsive (640px / 1024px breakpoints)

### Backend
- MongoDB Atlas with Mongoose models (User, Lead, Quote, Ticket, Product, Order)
- API routes with Zod validation
- NextAuth credentials auth with JWT sessions
- Role-based access control (user/admin)
- Resend transactional emails (lead/ticket/quote/order notifications)

### AI Chatbot
- Real **Claude AI** (Anthropic API) powered assistant
- Voice input via Web Speech API
- Quick reply buttons + multi-turn conversation
- System prompt with full product catalog knowledge

### Commerce
- Razorpay payment integration (UPI, cards, netbanking)
- License key auto-generation on payment success
- Cloud / On-Premise pricing toggle
- Order history in user dashboard
- Email receipt with license key

### Admin Panel
- Dashboard with KPIs (leads, tickets, quotes, orders, revenue)
- Leads management
- Tickets management with priority
- Quote requests overview
- Orders & revenue reporting

### User Dashboard
- Order history
- Active licenses
- Total spend
- Quick re-purchase

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Fill in your credentials in .env.local
#    - MongoDB Atlas (free tier OK)
#    - Anthropic API key (https://console.anthropic.com)
#    - Razorpay test keys (https://dashboard.razorpay.com)
#    - Resend API key (https://resend.com)

# 4. Seed admin + products
npm run seed

# 5. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔑 Environment Variables

See `.env.example`. Critical:

| Key | Where | Required? |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas dashboard | ✅ |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | ✅ |
| `ANTHROPIC_API_KEY` | console.anthropic.com | ✅ for chatbot |
| `RAZORPAY_KEY_ID` + `SECRET` | dashboard.razorpay.com | ✅ for payments |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same key as `RAZORPAY_KEY_ID` | ✅ |
| `RESEND_API_KEY` | resend.com | optional |
| `ADMIN_EMAIL` + `ADMIN_PASSWORD` | choose your own | ✅ |

## 🗄️ Database

MongoDB Atlas (free 512 MB tier works). Models auto-create indexes on first save. Run `npm run seed` to:
- Create admin user
- Seed 12 software products

## 💳 Razorpay Setup

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Settings → API Keys → Generate Test Key
3. Paste into `.env.local`
4. For production: complete KYC and switch to live keys

Test card: `4111 1111 1111 1111` · any future expiry · any CVV.

## 🤖 Claude API Setup

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

Default model: `claude-haiku-4-5-20251001` (fast + cheap). Change in `app/api/chatbot/route.ts`.

## 📁 Project Structure

```
next-app/
├── app/
│   ├── (10 routes)/page.tsx
│   ├── admin/          # Admin panel (role-protected)
│   ├── api/            # Route handlers (REST)
│   ├── dashboard/      # User dashboard
│   ├── login/ register/ checkout/
│   ├── layout.tsx · globals.css · page.tsx
├── components/
│   ├── layout/         # Header, Footer
│   ├── home/           # Home page sections
│   ├── shared/         # PageHero, Counter, Tilt, Particles, BA Slider
│   ├── widgets/        # Chatbot, QuoteModal, ThemeToggle, FloatingWidgets
│   ├── software/       # SoftwareCard
│   ├── three/          # HeroScene (R3F)
│   └── providers/      # SessionProvider
├── lib/
│   ├── data/           # Static content (services, software, etc.)
│   ├── models/         # Mongoose schemas
│   ├── auth.ts · email.ts · razorpay.ts · license.ts · mongodb.ts · utils.ts
├── scripts/seed.ts
├── middleware.ts       # Route protection
└── tailwind.config.ts
```

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add env vars in Vercel dashboard
# Re-deploy
vercel --prod
```

Don't forget:
- Set `NEXTAUTH_URL` to your production domain
- Switch Razorpay to live keys
- Add Vercel domain to MongoDB Atlas IP whitelist (or use `0.0.0.0/0`)

## 🔐 Admin Access

After seeding:
- URL: `/admin`
- Login: value of `ADMIN_EMAIL` from `.env.local`
- Password: value of `ADMIN_PASSWORD`

Change password from MongoDB or extend the `/admin/users` route.

## 🧪 Test Flow

1. Open `/software` → choose a product → click **Buy**
2. Login or register
3. Razorpay popup → use test card `4111 1111 1111 1111`
4. On success → redirected to `/dashboard` with license key
5. Email sent to customer + sales
6. Order visible in `/admin/orders`

## 📜 License

Proprietary — KVL Business Solutions. All rights reserved.
