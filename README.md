# KVL Business Solutions - Website

A modern, premium multi-service business website built with Next.js, React, and Tailwind CSS.

## Features

- 🎨 Premium corporate design with dark blue/navy, white, and gold accents
- 📱 Fully responsive, mobile-first design
- 🎬 Hero slider with smooth animations
- 🖼️ Image gallery with category filtering
- 💬 GOLU AI chat widget
- 📞 WhatsApp integration
- 📧 Contact form with validation
- 🚀 Fast loading and SEO-friendly
- ✨ Smooth animations and hover effects

## Services

1. Software Development
2. CCTV Installation & Surveillance Solutions
3. GPS Tracking Solutions
4. Civil Work
5. Mechanical Work
6. Manpower Supply
7. Event Organizing

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **Slider:** Swiper
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── about/           # About Us page
│   ├── contact/         # Contact page
│   ├── projects/        # Projects/Gallery page
│   ├── services/        # Service pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── Navigation.tsx
│   ├── HeroSlider.tsx
│   ├── ServiceCards.tsx
│   ├── AboutSection.tsx
│   ├── WhyChooseUs.tsx
│   ├── TrustedBy.tsx
│   ├── Gallery.tsx
│   ├── GoluChat.tsx
│   └── WhatsAppButton.tsx
└── public/              # Static assets
```

## Configuration

### Update Contact Information

Edit the contact details in:
- `app/contact/page.tsx`
- `components/WhatsAppButton.tsx`

### Update WhatsApp Number

Change the WhatsApp number in:
- `components/WhatsAppButton.tsx`
- `components/TrustedBy.tsx`

### GOLU AI Chat

The GOLU chat widget is implemented in `components/GoluChat.tsx`. To integrate with a real AI backend:

1. Update the API endpoint in the component
2. Connect to your OpenAI or custom AI service
3. Implement lead saving to database

## Database Setup (Optional)

For production, set up a database to store:
- Contact form submissions
- Leads from website and WhatsApp
- Chat conversations
- Memory/notes for returning users

Example schema:
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  mobile_no VARCHAR(20),
  source VARCHAR(50), -- 'website' or 'whatsapp'
  message TEXT,
  step VARCHAR(50),
  requirements TEXT,
  service VARCHAR(100),
  status VARCHAR(50),
  created_at TIMESTAMP
);

CREATE TABLE memory (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  notes TEXT,
  lead_chat_share TEXT
);
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:
- Primary colors: `primary-dark`, `primary-navy`, `primary-blue`
- Accent colors: `accent-gold`, `accent-orange`

### Content

All content is in the respective page components. Update text, images, and descriptions as needed.

## Support

For issues or questions, contact the development team.

## License

© 2024 KVL Business Solutions. All rights reserved.
