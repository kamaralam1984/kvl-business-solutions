# KVL Business Solutions

India's next-generation business technology platform — websites, ERP/CRM software, and AI-powered automation for growing businesses.

**Live site:** [kvlbusinesssolutions.com](https://kvlbusinesssolutions.com) · deployed from [`next-app/`](./next-app)

## Repository Structure

```
.
├── next-app/     # Production website — Next.js 14, TypeScript, MongoDB, NextAuth, Razorpay, Claude AI
└── *.html, styles.css, partials.js, script.js
                  # Legacy static site (kept for reference, not deployed)
```

The active, deployed codebase lives entirely in [`next-app/`](./next-app). See its [README](./next-app/README.md) for setup, environment variables, database seeding, and deployment instructions.

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** MongoDB + Mongoose, NextAuth (JWT sessions), Zod validation
- **Payments:** Razorpay
- **AI:** Claude (Anthropic API) — chatbot with product-catalog knowledge
- **Email:** Resend

## Getting Started

```bash
cd next-app
npm install
cp .env.example .env.local   # fill in your credentials
npm run seed                 # create admin user + seed products
npm run dev
```

Full instructions: [`next-app/README.md`](./next-app/README.md)

## License

MIT — see [LICENSE](./LICENSE).
