import { CheckCircle2, Calendar, FileText, Briefcase, BookOpen, ArrowRight } from 'lucide-react';
import { Card, Panel, Button } from '@/components/ui';

export const metadata = {
  title: 'Thank You — KVL Business Solutions',
  description: "Thanks for reaching out to KVL Business Solutions. Here's what happens next.",
  robots: { index: false, follow: false },
};

const WA_NUMBER = '919942000413';

export default function ThankYouPage({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams?.type === 'booking' ? 'booking' : 'contact';

  const steps = type === 'booking'
    ? [
        { title: 'We review your request', desc: 'Our team checks your preferred date, time and product interest.' },
        { title: 'We confirm within 1 hour', desc: "You'll get an email and WhatsApp with a confirmed slot and meeting link." },
        { title: 'We meet and talk it through', desc: 'A 30-minute walkthrough, live Q&A, and a custom quote — no pressure.' },
      ]
    : [
        { title: 'We review your message', desc: 'A solution architect reads your requirement — not a generic sales script.' },
        { title: "We're in touch shortly", desc: "You'll hear from us by phone, email or WhatsApp within our usual response time." },
        { title: 'We schedule a strategy call', desc: "If it's a fit, we book a free call to scope the project properly." },
      ];

  return (
    <>
      <section className="relative pt-24 pb-16 text-center bg-app2 border-b border-tint overflow-hidden">
        <div className="container relative z-10">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-gold/30 bg-gold/10">
            <CheckCircle2 aria-hidden className="h-8 w-8 text-gold-text" />
          </div>
          <span className="eyebrow">Thank You</span>
          <h1 className="mb-4 mt-4 font-display text-hero text-text">
            {type === 'booking' ? "Your demo request is in." : "We've got your message."}
          </h1>
          <p className="text-text2 max-w-xl mx-auto">
            {type === 'booking'
              ? "Thanks for booking — our team will confirm a slot and send you a meeting link shortly."
              : "Thanks for reaching out — a solution architect will get back to you shortly."}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">What Happens Next</span>
            <h2 className="my-4 font-display text-section text-text">Three Simple Steps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {steps.map((s, i) => (
              <Card key={s.title} className="p-6">
                <div className="mb-4 grid h-9 w-9 place-items-center rounded-full border border-gold/30 bg-gold/10 text-sm font-bold text-gold-text">
                  {i + 1}
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-text">{s.title}</h3>
                <p className="text-sm leading-relaxed text-text2">{s.desc}</p>
              </Card>
            ))}
          </div>

          <Panel className="mb-14 p-8 text-center">
            <Calendar aria-hidden className="mx-auto mb-3 h-8 w-8 text-gold-text" />
            {type === 'booking' ? (
              <>
                <h3 className="mb-2 font-display text-card-title text-text">Need to change your slot?</h3>
                <p className="text-text2 text-sm mb-5">Message us on WhatsApp and we&apos;ll adjust it — no need to fill the form again.</p>
              </>
            ) : (
              <>
                <h3 className="mb-2 font-display text-card-title text-text">Don&apos;t want to wait?</h3>
                <p className="text-text2 text-sm mb-5">Book a free strategy call directly and pick a time that works for you.</p>
              </>
            )}
            <div className="flex flex-wrap gap-3 justify-center">
              {type !== 'booking' && (
                <Button href="/book-demo">
                  Book a Free Strategy Call <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              )}
              <Button
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi KVL, following up on my request.')}`}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
              >
                Chat on WhatsApp
              </Button>
            </div>
          </Panel>

          <div className="text-center mb-8">
            <span className="eyebrow">While You Wait</span>
            <h2 className="my-4 font-display text-section text-text">Download More About Us</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <a href="/api/downloads/company-profile" target="_blank" rel="noreferrer" className="block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"><Card interactive className="h-full p-6">
              <FileText aria-hidden className="mb-3 h-6 w-6 text-gold-text" />
              <h3 className="mb-1.5 text-base font-semibold text-text">Company Profile</h3>
              <p className="text-sm leading-relaxed text-text2">Who we are, what we do, and how we work.</p>
            </Card></a>
            <a href="/api/downloads/portfolio" target="_blank" rel="noreferrer" className="block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"><Card interactive className="h-full p-6">
              <Briefcase aria-hidden className="mb-3 h-6 w-6 text-gold-text" />
              <h3 className="mb-1.5 text-base font-semibold text-text">Portfolio</h3>
              <p className="text-sm leading-relaxed text-text2">Real, live projects we&apos;ve built — with outcomes.</p>
            </Card></a>
            <a href="/api/downloads/service-brochure" target="_blank" rel="noreferrer" className="block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"><Card interactive className="h-full p-6">
              <BookOpen aria-hidden className="mb-3 h-6 w-6 text-gold-text" />
              <h3 className="mb-1.5 text-base font-semibold text-text">Service Brochure</h3>
              <p className="text-sm leading-relaxed text-text2">Every service we offer, in one place.</p>
            </Card></a>
          </div>
        </div>
      </section>
    </>
  );
}
