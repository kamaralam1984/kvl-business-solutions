import { LegalLayout } from '@/components/shared/LegalLayout';

export const metadata = { title: 'Privacy Policy — KVL Business Solutions' };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="May 2026">
      <p>KVL Business Solutions ("we", "us", "our") respects your privacy. This policy explains what data we collect, how we use it, and your rights.</p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><b>Account data:</b> name, email, phone, company, password (hashed).</li>
        <li><b>Billing data:</b> GSTIN, address (collected only when you make a purchase).</li>
        <li><b>Payment data:</b> processed by Razorpay; we never store full card details.</li>
        <li><b>Usage data:</b> pages visited, IP address, browser type (for analytics).</li>
        <li><b>Support data:</b> messages, tickets, and chatbot conversations.</li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To deliver software and services you purchase.</li>
        <li>To send transactional emails (invoices, license keys, support replies).</li>
        <li>To improve our products and respond to inquiries.</li>
        <li>To comply with legal obligations (GST records, tax filings).</li>
      </ul>

      <h2>3. Sharing</h2>
      <p>We do <b>not</b> sell your data. We share data only with: (a) Razorpay (payments), (b) Resend (email delivery), (c) MongoDB Atlas (database hosting), (d) law enforcement when legally required.</p>

      <h2>4. Data retention</h2>
      <p>We retain account and order data for at least 8 years to comply with Indian tax law (CGST Act §36). You may request deletion of non-mandatory data anytime.</p>

      <h2>5. Cookies</h2>
      <p>We use essential cookies for authentication and session management. We do not use third-party advertising cookies.</p>

      <h2>6. Your rights</h2>
      <ul>
        <li>Access, correct, or delete your personal data.</li>
        <li>Export your data in a portable format.</li>
        <li>Opt out of marketing emails (transactional emails cannot be opted out).</li>
        <li>File a complaint with the Indian Data Protection Authority.</li>
      </ul>

      <h2>7. Security</h2>
      <p>Passwords are hashed with bcrypt. All data is transmitted over TLS 1.2+. We follow industry best practices.</p>

      <h2>8. Contact</h2>
      <p>For privacy questions, email <a href="mailto:privacy@kvlbusinesssolutions.com">privacy@kvlbusinesssolutions.com</a> or write to KVL Business Solutions, Patna, Sultanganj, Bihar, India.</p>
    </LegalLayout>
  );
}
