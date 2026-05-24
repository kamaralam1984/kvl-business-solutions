import { LegalLayout } from '@/components/shared/LegalLayout';

export const metadata = { title: 'Terms of Service — KVL Business Solutions' };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="May 2026">
      <p>By accessing or using KVL Business Solutions ("the Service"), you agree to these terms. Please read them carefully.</p>

      <h2>1. Account</h2>
      <p>You must provide accurate information when registering and keep your password confidential. You are responsible for all activity on your account.</p>

      <h2>2. License</h2>
      <p>Software purchased through KVL is licensed (not sold) to you for use on the number of users/devices specified in your plan. Reselling, sublicensing, or reverse-engineering is prohibited.</p>

      <h2>3. Payments</h2>
      <p>All prices are in INR and exclusive of 18% GST unless stated. Payments are processed by Razorpay. Renewals are billed annually unless cancelled.</p>

      <h2>4. Service availability</h2>
      <p>We aim for 99.5% uptime on cloud-hosted products. Scheduled maintenance will be communicated at least 24 hours in advance. We are not liable for losses caused by downtime.</p>

      <h2>5. Acceptable use</h2>
      <ul>
        <li>Do not use the Service for illegal activities or to harm others.</li>
        <li>Do not attempt to breach security or interfere with other users.</li>
        <li>Do not spam, scrape, or send abusive content through our communication features.</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>All software, code, designs, and content remain the property of KVL Business Solutions. You retain ownership of your data.</p>

      <h2>7. Termination</h2>
      <p>We may suspend accounts that violate these terms. You may cancel anytime — see our <a href="/refund-policy">Refund Policy</a>.</p>

      <h2>8. Liability</h2>
      <p>Our maximum liability is limited to the amount you paid in the 12 months prior to the claim. We are not liable for indirect, consequential, or incidental damages.</p>

      <h2>9. Governing law</h2>
      <p>These terms are governed by Indian law. Disputes are subject to the exclusive jurisdiction of courts in Pune, Maharashtra.</p>

      <h2>10. Changes</h2>
      <p>We may update these terms; material changes will be emailed 30 days in advance.</p>

      <h2>11. Contact</h2>
      <p>Email <a href="mailto:legal@kvlsolutions.in">legal@kvlsolutions.in</a> for any questions.</p>
    </LegalLayout>
  );
}
