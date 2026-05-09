import type { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  picked: boolean;
  isAnswer: boolean;
  feedback: 'correct' | 'wrong' | null;
  onClick: () => void;
}

/**
 * Antwort-Button mit klarem Farb-Feedback.
 * Inline-Styles statt Tailwind-Color-Klassen, damit die Farben garantiert
 * applied werden (kein JIT-Caching-Glück).
 *
 * - Klick auf RICHTIGE Antwort  → grüner Bg + dunkelgrüner Rahmen
 * - Klick auf FALSCHE Antwort   → roter Bg + dunkelroter Rahmen
 * - Reveal richtige bei falsch  → grüner Bg + dunkelgrüner Rahmen
 * - Sonst neutral blau
 */
export default function AnswerButton({ children, picked, isAnswer, feedback, onClick }: Props) {
  const state = pickState(picked, isAnswer, feedback);
  const PALETTE = {
    correct: { bg: '#10b981', border: '#047857', shadow: '#065f46' },
    wrong:   { bg: '#ef4444', border: '#b91c1c', shadow: '#7f1d1d' },
    neutral: { bg: '#6366f1', border: '#312e81', shadow: '#1e1b4b' },
  } as const;
  const c = PALETTE[state];
  const style: CSSProperties = {
    background: c.bg,
    borderColor: c.border,
    borderStyle: 'solid',
    borderWidth: 4,
    boxShadow: `0 7px 0 0 ${c.shadow}`,
    color: 'white',
  };

  return (
    <button
      onClick={onClick}
      disabled={feedback !== null}
      style={style}
      className="rounded-chunk w-32 h-32 sm:w-36 sm:h-36 text-[44px] sm:text-[52px] font-pixel transition-colors active:translate-y-1"
    >
      {children}
    </button>
  );
}

function pickState(picked: boolean, isAnswer: boolean, feedback: 'correct' | 'wrong' | null): 'correct' | 'wrong' | 'neutral' {
  if (feedback === 'correct' && picked) return 'correct';
  if (feedback === 'wrong' && picked) return 'wrong';
  if (feedback === 'wrong' && isAnswer) return 'correct'; // reveal richtige
  return 'neutral';
}
