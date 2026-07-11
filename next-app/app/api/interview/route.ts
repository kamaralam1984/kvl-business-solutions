import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';
import { chatRouted, ChatMessage } from '@/lib/ai/router';

const schema = z.object({
  role: z.string().min(2),
  level: z.enum(['Junior', 'Mid', 'Senior']).default('Mid'),
  language: z.enum(['English', 'Hindi', 'Hinglish']).default('Hinglish'),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })),
  finish: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    const { role, level, language, history, finish } = schema.parse(await req.json());

    const interviewerSys = `You are a friendly but professional ${level}-level interviewer for the role of "${role}". Reply in ${language}.
Ask ONE thoughtful question at a time. Mix behavioral + technical questions.
Keep questions concise (1-2 sentences). After the candidate's answer, react briefly (1 line) then ask the next question.
Do NOT give feedback yet — that comes at the end.
This is question ${history.filter(m => m.role === 'assistant').length + 1} of ~6.`;

    const feedbackSys = `You are a kind but honest interview coach. Reply in ${language}.
Based on this mock interview transcript for the role of "${role}" (${level} level), give the candidate:
1. **Overall score** (0-100)
2. **Top 3 strengths** (bullet points)
3. **Top 3 areas to improve** (bullet points)
4. **Final advice** (1-2 sentences)

Be specific and constructive. Use markdown formatting (## headings, - bullets, **bold**).`;

    const messages: ChatMessage[] = history.map(m => ({ role: m.role, content: m.content }));

    if (finish) {
      // Generate final feedback
      messages.push({ role: 'user', content: 'The interview is over. Please give me feedback now.' });
      const result = await chatRouted({
        messages,
        system: feedbackSys,
        maxTokens: 600,
      });
      return NextResponse.json({ ok: true, type: 'feedback', reply: result.reply, provider: result.provider });
    }

    // Continue interview — ask next question
    if (messages.length === 0) {
      messages.push({ role: 'user', content: `Start the interview for ${role} (${level}).` });
    }

    const result = await chatRouted({
      messages,
      system: interviewerSys,
      maxTokens: 200,
      temperature: 0.8,
    });

    return NextResponse.json({ ok: true, type: 'question', reply: result.reply, provider: result.provider });
  } catch (e) {
    return apiError(e);
  }
}
