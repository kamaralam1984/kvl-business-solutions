'use client';
import { Chatbot } from './Chatbot';
import { QuoteModal } from './QuoteModal';
import { WhatsAppButton } from './WhatsAppButton';

export function FloatingWidgets() {
  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99] flex flex-col gap-3 items-end">
        <Chatbot />
        <div className="relative">
          <WhatsAppButton />
        </div>
      </div>
      <QuoteModal />
    </>
  );
}
