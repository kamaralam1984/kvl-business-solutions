import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { Button, Panel } from '@/components/ui';

const WHATSAPP_NUMBER = '919942000413';
const WHATSAPP_MESSAGE = "Hi KVL, I'd like to talk about a software project.";

export function CtaBanner({ title, desc }: { title?: string; desc?: string }) {
  return (
    <section className="bg-bg py-[var(--section-y)]">
      <div className="container">
        <Panel className="relative overflow-hidden bg-bg3 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(200,168,112,0.18) 0%, transparent 70%)' }} />
          <div className="relative mx-auto max-w-3xl">
            <p className="eyebrow mb-5">Let&apos;s Talk</p>
            <h2 className="font-display text-section text-text">
              {title || (<>Your next system. <span className="text-gold-text">Ready to build.</span></>)}
            </h2>
            <p className="mx-auto mt-5 max-w-[500px] text-body-lg text-text2">
              {desc || 'No sales pitch — just a straightforward conversation with a solution architect about what you\'re building.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/book-demo" size="lg">Book a Strategy Call</Button>
              <Button
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                variant="secondary"
                size="lg"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> Chat on WhatsApp
              </Button>
            </div>
            <p className="mt-7 flex items-center justify-center gap-2 text-sm text-text2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-text" aria-hidden />
              30-day money-back guarantee. Free training and onboarding on every project.
            </p>
          </div>
        </Panel>
      </div>
    </section>
  );
}
