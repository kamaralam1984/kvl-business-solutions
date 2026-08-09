'use client';
import { Chatbot } from './Chatbot';
import { QuoteModal } from './QuoteModal';
import { WhatsAppButton } from './WhatsAppButton';
import { ExitIntentPopup } from './ExitIntentPopup';
import { CallBackWidget } from './CallBackWidget';
import { MobileStickyBar } from './MobileStickyBar';
import { LeadMagnetModal } from './LeadMagnetModal';

export function FloatingWidgets({ chatbotEnabled = true }: { chatbotEnabled?: boolean }) {
  return (
    <>
      {/* Exit intent popup — triggers on mouse leave or 45s on mobile */}
      <ExitIntentPopup />

      {/* Desktop: chat bubble on the right, call-back + WhatsApp stacked on the left. */}
      {chatbotEnabled && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99] hidden md:flex flex-col gap-3 items-end">
          <Chatbot />
        </div>
      )}

      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[99] hidden md:flex flex-col gap-3 items-start">
        <CallBackWidget />
        <div className="relative">
          <WhatsAppButton />
        </div>
      </div>

      {/* Mobile: Call + WhatsApp move into the sticky bottom bar; chat stays as a bubble above it. */}
      {chatbotEnabled && (
        <div className="fixed bottom-16 right-4 z-[99] flex md:hidden">
          <Chatbot />
        </div>
      )}
      <MobileStickyBar />

      <QuoteModal />
      <LeadMagnetModal />
    </>
  );
}
