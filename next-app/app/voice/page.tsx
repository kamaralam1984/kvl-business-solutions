'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function VoiceAssistantPage() {
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [history, setHistory] = useState<Msg[]>([
    { role: 'assistant', content: 'Namaste! Main KVL AI hoon. Mic dabaiye aur boliye — main madad karunga.' },
  ]);
  const [transcript, setTranscript] = useState('');
  const recRef = useRef<any>(null);

  const speak = (text: string) => {
    if (muted || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = /[ऀ-ॿ]/.test(text) ? 'hi-IN' : 'en-IN';
    u.rate = 1.0;
    u.pitch = 1.0;
    synth.speak(u);
  };

  const sendToAI = async (text: string) => {
    setThinking(true);
    setHistory(h => [...h, { role: 'user', content: text }]);
    try {
      const r = await fetch('/api/chatbot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: [...history, { role: 'user', content: text }] }),
      });
      const data = await r.json();
      const reply = data.reply || 'Maaf kijiye, kuch problem hui.';
      setHistory(h => [...h, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch {
      const err = 'Network issue. Please try again.';
      setHistory(h => [...h, { role: 'assistant', content: err }]);
      speak(err);
    } finally { setThinking(false); }
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice input is not supported in this browser. Try Chrome.'); return; }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text);
    };
    rec.onend = () => {
      setListening(false);
      if (transcript.trim()) sendToAI(transcript.trim());
      setTranscript('');
    };
    rec.onerror = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

  const stopListening = () => { recRef.current?.stop(); setListening(false); };

  useEffect(() => () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); }, []);

  return (
    <>
      <PageHero eyebrow="AI VOICE ASSISTANT" title="Talk to" accent="KVL AI" description="Ask about software, pricing or demos by voice, in Hindi or English — a preview of the same voice automation we build for client call centers and support lines." breadcrumb="Voice" />

      <section className="section">
        <div className="container max-w-2xl">
          {/* Conversation */}
          <div className="card-base p-6 mb-6 max-h-[400px] overflow-y-auto space-y-3">
            {history.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-violet-600 text-white rounded-br-sm' : 'surface-tint rounded-bl-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {transcript && <div className="text-xs text-text2 italic px-3">🎙 {transcript}</div>}
            {thinking && <div className="flex justify-start"><div className="surface-tint p-3 rounded-2xl"><Loader2 className="w-4 h-4 animate-spin" /></div></div>}
          </div>

          {/* Mic + controls */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={listening ? stopListening : startListening}
              disabled={thinking}
              className="relative w-28 h-28 rounded-full grid place-items-center text-white shadow-card-hover transition-all disabled:opacity-50"
              style={{ background: listening ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
            >
              {listening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
              {listening && <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-pulse-ring" />}
            </button>
            <div className="text-sm font-semibold">{listening ? '🎙 Listening...' : thinking ? '🤔 Thinking...' : 'Tap to talk'}</div>

            <button onClick={() => setMuted(!muted)} className="btn btn-ghost text-xs">
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {muted ? 'Voice OFF' : 'Voice ON'}
            </button>
          </div>

          <div className="card-base p-4 mt-6 text-xs text-text2">
            <div className="font-bold mb-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-primary" /> Try saying:</div>
            <ul className="space-y-1 list-disc pl-5">
              <li>"What software do you have?"</li>
              <li>"ERP ka price kya hai?"</li>
              <li>"How do I book a demo?"</li>
              <li>"Mujhe GPS tracking chahiye"</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
