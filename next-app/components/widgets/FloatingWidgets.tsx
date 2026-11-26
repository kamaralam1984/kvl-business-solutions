'use client';
import { Chatbot } from './Chatbot';
import { QuoteModal } from './QuoteModal';
import { ExitIntentPopup } from './ExitIntentPopup';
import { CallBackWidget } from './CallBackWidget';
import { ContactLauncher } from './ContactLauncher';
import { LeadMagnetModal } from './LeadMagnetModal';

export function FloatingWidgets({ chatbotEnabled = true }: { chatbotEnabled?: boolean }) {
  return (
    <>
      {/* Exit popup: at most once a week, never while scrolling */}
      <ExitIntentPopup />

      {/* One contact button -> WhatsApp / Call Back / Chat. Panels open only on click. */}
      <ContactLauncher chatbotEnabled={chatbotEnabled} />
      <CallBackWidget />
      {chatbotEnabled && <Chatbot />}

      <QuoteModal />
      <LeadMagnetModal />
    </>
  );
}
