import Link from 'next/link';
import { CheckCircle2, Calendar, FileText, Briefcase, BookOpen, ArrowRight } from 'lucide-react';

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
        { title: 'We confirm within 2 business hours', desc: "You'll get an email and WhatsApp with a confirmed slot and meeting link." },
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
          <div
            className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-6"
            style={{ background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.3)' }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: '#c8a870' }} />
          </div>
          <span className="eyebrow">Thank You</span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 mb-4">
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
            <h2 className="text-2xl md:text-3xl font-extrabold my-4">Three Simple Steps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {steps.map((s, i) => (
              <div key={s.title} className="card-base p-6">
                <div
                  className="w-8 h-8 rounded-full grid place-items-center mb-4 font-bold text-[12px]"
                  style={{ background: 'rgba(200,168,112,0.1)', border: '1px solid rgba(200,168,112,0.22)', color: '#a3814f' }}
                >
                  {i + 1}
                </div>
                <h3 className="font-bold text-sm mb-1.5">{s.title}</h3>
                <p className="text-text2 text-[13px] leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="card-premium p-8 text-center mb-14">
            <Calendar className="w-8 h-8 mx-auto mb-3" style={{ color: '#c8a870' }} />
            {type === 'booking' ? (
              <>
                <h3 className="font-bold text-lg mb-2">Need to change your slot?</h3>
                <p className="text-text2 text-sm mb-5">Message us on WhatsApp and we&apos;ll adjust it — no need to fill the form again.</p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-2">Don&apos;t want to wait?</h3>
                <p className="text-text2 text-sm mb-5">Book a free strategy call directly and pick a time that works for you.</p>
              </>
            )}
            <div className="flex flex-wrap gap-3 justify-center">
              {type !== 'booking' && (
                <Link href="/book-demo" className="btn btn-primary">
                  Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi KVL, following up on my request.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="eyebrow">While You Wait</span>
            <h2 className="text-2xl md:text-3xl font-extrabold my-4">Download More About Us</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <a href="/api/downloads/company-profile" target="_blank" rel="noreferrer" className="card-base p-6 hover:shadow-card-hover transition-all block">
              <FileText className="w-6 h-6 mb-3" style={{ color: '#a3814f' }} />
              <h3 className="font-bold text-sm mb-1.5">Company Profile</h3>
              <p className="text-text2 text-[12.5px] leading-[1.6]">Who we are, what we do, and how we work.</p>
            </a>
            <a href="/api/downloads/portfolio" target="_blank" rel="noreferrer" className="card-base p-6 hover:shadow-card-hover transition-all block">
              <Briefcase className="w-6 h-6 mb-3" style={{ color: '#a3814f' }} />
              <h3 className="font-bold text-sm mb-1.5">Portfolio</h3>
              <p className="text-text2 text-[12.5px] leading-[1.6]">Real, live projects we&apos;ve built — with outcomes.</p>
            </a>
            <a href="/api/downloads/service-brochure" target="_blank" rel="noreferrer" className="card-base p-6 hover:shadow-card-hover transition-all block">
              <BookOpen className="w-6 h-6 mb-3" style={{ color: '#a3814f' }} />
              <h3 className="font-bold text-sm mb-1.5">Service Brochure</h3>
              <p className="text-text2 text-[12.5px] leading-[1.6]">Every service we offer, in one place.</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
