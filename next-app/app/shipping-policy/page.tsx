import { LegalLayout } from '@/components/shared/LegalLayout';

export const metadata = { title: 'Shipping & Delivery Policy — KVL' };

export default function ShippingPage() {
  return (
    <LegalLayout title="Shipping & Delivery Policy" updated="May 2026">
      <p>This policy applies to physical hardware (GPS devices, CCTV equipment) and digital products (software licenses).</p>

      <h2>1. Software & licenses</h2>
      <p>Digital products (software licenses, downloads) are delivered <b>instantly</b> via email after successful payment. The license key and download link will appear in your dashboard.</p>

      <h2>2. Hardware shipping (GPS, CCTV)</h2>
      <ul>
        <li>Orders are dispatched within <b>1–3 business days</b> from our Patna warehouse.</li>
        <li>Standard delivery: <b>4–7 business days</b> across India via Bluedart / DTDC / India Post.</li>
        <li>Express delivery available for an additional fee (1–3 business days).</li>
        <li>Free shipping on orders above ₹10,000.</li>
      </ul>

      <h2>3. Installation services</h2>
      <p>Our installation team will contact you within 24 hours of delivery to schedule on-site setup (additional charges may apply outside Maharashtra).</p>

      <h2>4. Tracking</h2>
      <p>You will receive an email with tracking details once your order is dispatched.</p>

      <h2>5. International shipping</h2>
      <p>We currently ship hardware only within India. For international software licenses, email <a href="mailto:kvlbusinesssolution@gmail.com">kvlbusinesssolution@gmail.com</a>.</p>

      <h2>6. Damaged or wrong items</h2>
      <p>If you receive a damaged or incorrect item, raise a ticket within 48 hours of delivery. We will arrange a free replacement.</p>

      <h2>7. Contact</h2>
      <p>For shipping queries: <a href="mailto:shipping@kvlbusinesssolutions.com">shipping@kvlbusinesssolutions.com</a> · +91 99420 00413</p>
    </LegalLayout>
  );
}
