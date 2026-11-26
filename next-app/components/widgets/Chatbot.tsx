'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { speakNatural, cancelSpeaking } from '@/lib/voice-speak';

type Msg = { role: 'user' | 'assistant'; content: string };

const ASSISTANT_NAME = 'Khushi';
const ASSISTANT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop';

const KHUSHI_GREETING = 'Hello! 👋 I\'m Khushi, KVL Business Solutions\' AI assistant. I can help you with software, services, pricing, or a free demo — in any language you prefer!';

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi 👋 I\'m Khushi, KVL AI. How can I help you today?' },
    { role: 'assistant', content: 'Ask me anything — pricing, demo, services, or a quote. I speak your language!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const recRef = useRef<any>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  const speak = (text: string) => {
    if (muted) return;
    speakNatural(text);
  };

  useEffect(() => () => cancelSpeaking(), []);

  // Opens only on an explicit click (the unified contact button dispatches this event).
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setMessages(m => m[0]?.content === KHUSHI_GREETING ? m : [{ role: 'assistant', content: KHUSHI_GREETING }, ...m]);
    };
    window.addEventListener('kvl:open-chat', onOpen);
    return () => window.removeEventListener('kvl:open-chat', onOpen);
  }, []);

  useEffect(() => { bodyRef.current?.scrollTo(0, 9e9); }, [messages, loading]);

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: [...messages, { role: 'user', content: text }], sessionId: sessionIdRef.current }),
      });
      const data = await res.json();
      const reply = data.reply || 'Sorry, please try again.';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch {
      const err = 'A KVL expert will contact you soon!';
      setMessages(m => [...m, { role: 'assistant', content: err }]);
      speak(err);
    } finally {
      setLoading(false);
    }
  };

  const MIC_BLOCKED_MSG = 'Microphone is blocked for this site in your browser. Click the 🔒 lock icon next to the address bar → Site settings/Permissions → set Microphone to Allow → then reload the page and tap the mic again.';

  const VOICE_ERROR_MESSAGES: Record<string, string> = {
    'not-allowed': MIC_BLOCKED_MSG,
    'permission-denied': MIC_BLOCKED_MSG,
    'no-speech': "I didn't catch that — tap the mic and try speaking again.",
    'audio-capture': 'No microphone found on this device — please type your message instead.',
    network: 'Voice recognition needs an internet connection — please check your connection and try again.',
  };

  const toggleVoice = async () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages(m => [...m, { role: 'assistant', content: 'Voice input isn\'t supported in this browser yet — please type your message, or try Chrome/Edge.' }]);
      return;
    }
    if (listening) { recRef.current?.stop(); return; }

    // Ask for the real mic permission first — this is what actually triggers the
    // browser's Allow/Block prompt reliably (SpeechRecognition alone doesn't
    // always surface it consistently across browsers), and lets us tell the user
    // exactly what went wrong instead of a silent, unexplained failure.
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
      } catch (e: any) {
        const msg = e?.name === 'NotFoundError'
          ? VOICE_ERROR_MESSAGES['audio-capture']
          : MIC_BLOCKED_MSG;
        setMessages(m => [...m, { role: 'assistant', content: msg }]);
        return;
      }
    }

    const rec = new SR();
    rec.lang = navigator.language || 'en-IN'; rec.continuous = false;
    rec.onresult = (e: any) => {
      const heard = e.results[0][0].transcript;
      setListening(false);
      send(heard);
    };
    rec.onend = () => setListening(false);
    rec.onerror = (e: any) => {
      setListening(false);
      const msg = VOICE_ERROR_MESSAGES[e?.error] || 'Voice input hit a snag — please try again or type your message.';
      setMessages(m => [...m, { role: 'assistant', content: msg }]);
    };
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Voice input hit a snag — please try again or type your message.' }]);
    }
  };

  const quickActions: { label: string; q?: string; href?: string }[] = [
    { href: '/projects', label: '📁 View All Portfolio' },
    { href: '/website-demos', label: '🌐 Demo' },
    { q: 'Get a quote', label: '📝 Quote' },
  ];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: .95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: .95 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[340px] h-[480px] rounded-2xl border border-tint bg-app2 shadow-2xl z-[100] flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-br from-primary to-primary-600 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                <Image src={ASSISTANT_AVATAR} alt={ASSISTANT_NAME} fill sizes="40px" className="object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-primary-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{ASSISTANT_NAME} - KVL AI Assistant</h4>
                <p className="text-[11px] opacity-80">Powered by Claude · Online</p>
              </div>
              <button onClick={() => setMuted(v => !v)} aria-label={muted ? 'Turn voice replies on' : 'Turn voice replies off'} className="opacity-80 hover:opacity-100">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={() => { cancelSpeaking(); setOpen(false); }} aria-label="Close chat"><X className="w-5 h-5" /></button>
            </div>

            <div ref={bodyRef} className="flex-1 p-4 overflow-y-auto bg-app flex flex-col gap-2">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === 'user' ? 'self-end bg-primary text-white rounded-br-sm' : 'self-start surface2-tint rounded-bl-sm'
                }`}>{m.content}</div>
              ))}
              {loading && (
                <div className="self-start surface2-tint px-3 py-2 rounded-2xl text-[13px]">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-text2 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-text2 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-text2 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              )}
            </div>

            <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-app2 border-t border-tint">
              {quickActions.map(a => (
                a.href ? (
                  <Link key={a.label} href={a.href} className="text-[11px] px-2.5 py-1 rounded-full surface-tint border border-tint hover:bg-primary hover:text-white transition-all">{a.label}</Link>
                ) : (
                  <button key={a.label} onClick={() => send(a.q)} className="text-[11px] px-2.5 py-1 rounded-full surface-tint border border-tint hover:bg-primary hover:text-white transition-all">{a.label}</button>
                )
              ))}
            </div>

            <div className="p-3 bg-app2 border-t border-tint flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type or speak..."
                className="flex-1 form-control rounded-full text-[13px]"
              />
              <button onClick={toggleVoice} className={`w-10 h-10 rounded-full grid place-items-center ${listening ? 'bg-red-500 text-white animate-pulse' : 'surface2-tint'}`} aria-label="Voice">
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button onClick={() => send()} className="w-10 h-10 rounded-full bg-primary text-white grid place-items-center"><Send className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
