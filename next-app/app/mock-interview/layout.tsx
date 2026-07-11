import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Mock Interview Practice — Free Interview Preparation Tool',
  description: "Practice job interviews with KVL's AI-powered mock interview tool — realistic questions and instant feedback, free to use while you prepare for your next role.",
};

export default function MockInterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
