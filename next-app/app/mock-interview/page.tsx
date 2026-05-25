'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, Send, RotateCcw, CheckCircle2, Loader2, Briefcase, Award } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';

type Msg = { role: 'user' | 'assistant'; content: string };

const ROLES = ['Software Engineer', 'Frontend Developer', 'Sales Executive', 'Marketing Manager', 'Customer Support', 'Product Manager', 'Data Analyst', 'HR Recruiter', 'Project Manager', 'Designer'];

export default function MockInterviewPage() {
  const [step, setStep] = useState<'setup' | 'interview' | 'feedback'>('setup');
  const [role, setRole] = useState('Software Engineer');
  const [level, setLevel] = useState<'Junior' | 'Mid' | 'Senior'>('Mid');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('Hinglish');
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const questionCount = history.filter(m => m.role === 'assistant').length;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history, feedback]);

  const start = async () => {
    setStep('interview');
    setLoading(true);
    const r = await fetch('/api/interview', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, level, language, history: [], finish: false }),
    });
    const d = await r.json();
    if (d.ok) setHistory([{ role: 'assistant', content: d.reply }]);
    setLoading(false);
  };

  const submit = async () => {
    if (!input.trim() || loading) return;
    const newHistory = [...history, { role: 'user' as const, content: input.trim() }];
    setHistory(newHistory);
    setInput('');
    setLoading(true);

    const r = await fetch('/api/interview', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, level, language, history: newHistory, finish: false }),
    });
    const d = await r.json();
    if (d.ok) setHistory(h => [...h, { role: 'assistant', content: d.reply }]);
    setLoading(false);
  };

  const finish = async () => {
    setLoading(true);
    const r = await fetch('/api/interview', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, level, language, history, finish: true }),
    });
    const d = await r.json();
    if (d.ok) { setFeedback(d.reply); setStep('feedback'); }
    setLoading(false);
  };

  const reset = () => { setStep('setup'); setHistory([]); setFeedback(''); setInput(''); };

  return (
    <>
      <PageHero eyebrow="AI MOCK INTERVIEWS" title="Practice with" accent="AI" description="Real interview simulation. 6 questions per session. Detailed feedback at the end." breadcrumb="Mock Interview" />

      <section className="section">
        <div className="container max-w-3xl">
          {step === 'setup' && (
            <div className="card-base p-7">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Setup your mock interview</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text2 mb-1 block">Job role</label>
                  <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                    <option value="Custom">Custom (type below)</option>
                  </select>
                  {role === 'Custom' && (
                    <input className="form-control mt-2" placeholder="e.g., DevOps Engineer" onChange={e => setRole(e.target.value)} />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text2 mb-1 block">Experience level</label>
                    <select className="form-control" value={level} onChange={e => setLevel(e.target.value as any)}>
                      <option>Junior</option><option>Mid</option><option>Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text2 mb-1 block">Language</label>
                    <select className="form-control" value={language} onChange={e => setLanguage(e.target.value as any)}>
                      <option>English</option><option>Hindi</option><option>Hinglish</option>
                    </select>
                  </div>
                </div>
                <button onClick={start} disabled={loading} className="btn btn-primary w-full justify-center">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  Start Mock Interview
                </button>
              </div>
            </div>
          )}

          {step === 'interview' && (
            <>
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs text-text2">{role} · {level} · Question {questionCount}/~6</div>
                <button onClick={reset} className="btn btn-ghost text-xs"><RotateCcw className="w-3 h-3" /> Restart</button>
              </div>

              <div className="card-base p-5 mb-4 max-h-[60vh] overflow-y-auto space-y-3">
                {history.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'surface-tint rounded-bl-sm'}`}>
                      {m.role === 'assistant' && <div className="text-[10px] font-bold text-primary mb-1">🤖 INTERVIEWER</div>}
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && <div className="flex"><div className="surface-tint p-3 rounded-2xl"><Loader2 className="w-4 h-4 animate-spin" /></div></div>}
                <div ref={endRef} />
              </div>

              <div className="flex gap-2">
                <input
                  className="form-control flex-1"
                  placeholder="Type your answer..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  disabled={loading}
                />
                <button onClick={submit} disabled={loading || !input.trim()} className="btn btn-primary">
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {questionCount >= 6 && (
                <button onClick={finish} disabled={loading} className="btn btn-primary w-full justify-center mt-4">
                  <CheckCircle2 className="w-4 h-4" /> Finish & Get AI Feedback
                </button>
              )}
              {questionCount < 6 && questionCount > 2 && (
                <button onClick={finish} disabled={loading} className="btn btn-ghost w-full justify-center mt-4 text-xs">
                  End early & get feedback
                </button>
              )}
            </>
          )}

          {step === 'feedback' && (
            <div className="card-base p-7">
              <h2 className="text-xl font-extrabold flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-yellow-500" /> Interview Feedback
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{feedback}</pre>
              </div>
              <div className="mt-6 pt-4 border-t border-tint flex gap-3">
                <button onClick={reset} className="btn btn-primary"><RotateCcw className="w-4 h-4" /> Try Another</button>
                <a href="/careers" className="btn btn-ghost">Browse Jobs</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
