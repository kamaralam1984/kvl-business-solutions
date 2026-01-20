import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import WhatsAppButton from '@/components/WhatsAppButton'
import GoluChat from '@/components/GoluChat'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'KVL Business Solution - Multi-Service Professional Business',
  description: 'KVL Business Solution offers Software Development, CCTV Installation, GPS Tracking, Civil Work, Mechanical Work, Manpower Supply, and Event Organizing services.',
  keywords: 'business solutions, software development, CCTV installation, GPS tracking, civil work, mechanical work, manpower supply, event organizing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Navigation />
          {children}
          <WhatsAppButton />
          <GoluChat />
        </AuthProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const revealElements = document.querySelectorAll('.reveal');
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('active');
                    }
                  });
                }, { threshold: 0.1 });
                revealElements.forEach((el) => observer.observe(el));
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
