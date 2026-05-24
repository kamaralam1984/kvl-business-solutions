import { LegalLayout } from '@/components/shared/LegalLayout';

export const metadata = { title: 'Refund & Cancellation Policy — KVL' };

export default function RefundPage() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" updated="May 2026">
      <p>We want you to be completely satisfied with your KVL purchase. This policy explains when and how you can request a refund.</p>

      <h2>1. 30-day money-back guarantee</h2>
      <p>If you are not satisfied with any software product, you may request a full refund within <b>30 days</b> of purchase. No questions asked.</p>

      <h2>2. How to request a refund</h2>
      <ul>
        <li>Email <a href="mailto:billing@kvlsolutions.in">billing@kvlsolutions.in</a> with your order ID.</li>
        <li>Or raise a ticket from your <a href="/support">support page</a>.</li>
        <li>Refunds are processed within <b>5–7 business days</b> back to the original payment method.</li>
      </ul>

      <h2>3. Non-refundable items</h2>
      <ul>
        <li>Custom development work after milestone sign-off.</li>
        <li>Setup/installation fees once work has begun.</li>
        <li>Hardware (GPS devices, CCTV equipment) once shipped and activated.</li>
        <li>Services consumed in part (e.g., consulting hours).</li>
      </ul>

      <h2>4. Cancellation</h2>
      <p>You can cancel auto-renewal anytime from your dashboard. Cancellation takes effect at the end of your current billing cycle. You will continue to have access until then.</p>

      <h2>5. Subscription downgrades</h2>
      <p>Downgrades take effect at the next billing cycle. Pro-rated refunds are not provided for downgrades.</p>

      <h2>6. Failed payments</h2>
      <p>If a payment fails, we will retry after 3 days. After 7 days of failed payments, your subscription may be suspended.</p>

      <h2>7. Disputes</h2>
      <p>If you disagree with a refund decision, email <a href="mailto:legal@kvlsolutions.in">legal@kvlsolutions.in</a>. We will respond within 5 business days.</p>
    </LegalLayout>
  );
}
