'use client';
import { Chatbot } from './Chatbot';
import { QuoteModal } from './QuoteModal';
import { WhatsAppButton } from './WhatsAppButton';
import { ExitIntentPopup } from './ExitIntentPopup';
import { CallBackWidget } from './CallBackWidget';

export function FloatingWidgets() {
  return (
    <>
      {/* Exit intent popup — triggers on mouse leave or 45s on mobile */}
      <ExitIntentPopup />

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99] flex flex-col gap-3 items-end">
        <Chatbot />
        <CallBackWidget />
        <div className="relative">
          <WhatsAppButton />
        </div>
      </div>
      <QuoteModal />
    </>
  );
}
