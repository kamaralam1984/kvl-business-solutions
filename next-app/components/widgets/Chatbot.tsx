'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Send, Mic, MicOff } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

const ASSISTANT_NAME = 'Khushi';
const ASSISTANT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop';

const KHUSHI_GREETING = 'Hello! 👋 I\'m Khushi, KVL Business Solutions\' AI assistant. I can help you with software, services, pricing, or a free demo — in any language you prefer!';

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [proactiveDone, setProactiveDone] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi 👋 I\'m Khushi, KVL AI. How can I help you today?' },
    { role: 'assistant', content: 'Ask me anything — pricing, demo, services, GPS tracking, or a quote. I speak your language!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Proactive popup after 30 seconds
  useEffect(() => {
    if (proactiveDone) return;
    const t1 = setTimeout(() => setShowBubble(true), 30_000);
    const t2 = setTimeout(() => {
      if (!open) {
        setOpen(true);
        setShowBubble(false);
        setMessages(m => m[0]?.content === KHUSHI_GREETING ? m : [{ role: 'assistant', content: KHUSHI_GREETING }, ...m]);
      }
      setProactiveDone(true);
    }, 38_000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open, proactiveDone]);

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
        body: JSON.stringify({ history: [...messages, { role: 'user', content: text }] }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.reply || 'Sorry, please try again.' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'A KVL expert will contact you soon!' }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert('Voice not supported in this browser');
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = navigator.language || 'en-IN'; rec.continuous = false;
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start(); setListening(true);
  };

  const quickActions = [
    { q: 'Show me software pricing', label: '💰 Pricing' },
    { q: 'I want a website demo', label: '🌐 Demo' },
    { q: 'GPS tracking info', label: '📍 GPS' },
    { q: 'Get a quote', label: '📝 Quote' },
  ];

  return (
    <>
      {/* Proactive notification bubble */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="absolute bottom-16 right-0 bg-white dark:bg-slate-800 rounded-2xl rounded-br-sm shadow-2xl p-3 w-56 border border-tint cursor-pointer"
            onClick={() => { setOpen(true); setShowBubble(false); setProactiveDone(true); }}
          >
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                <Image src={ASSISTANT_AVATAR} alt={ASSISTANT_NAME} fill sizes="32px" className="object-cover" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-text">{ASSISTANT_NAME} - KVL AI</p>
                <p className="text-[11px] text-text2 leading-relaxed mt-0.5">Hi! Need a free demo? I can help you in any language 🌍</p>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); setShowBubble(false); setProactiveDone(true); }}
              className="absolute top-1 right-1 text-text2 hover:text-text"><X className="w-3 h-3" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => { setOpen(o => !o); setShowBubble(false); setProactiveDone(true); }}
        className="w-14 h-14 rounded-full overflow-hidden relative shadow-card"
        aria-label={`${ASSISTANT_NAME} — AI Assistant`}
      >
        <Image src={ASSISTANT_AVATAR} alt={ASSISTANT_NAME} fill sizes="56px" className="object-cover" />
        <span className="absolute inset-0 rounded-full border-2 border-white/70 opacity-50 animate-pulse-ring" />
        {showBubble && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] text-white font-bold grid place-items-center z-10">1</span>}
      </button>

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
              <button onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
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
                <button key={a.q} onClick={() => send(a.q)} className="text-[11px] px-2.5 py-1 rounded-full surface-tint border border-tint hover:bg-primary hover:text-white transition-all">{a.label}</button>
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
