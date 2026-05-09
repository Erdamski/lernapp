import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  picked: boolean;
  isAnswer: boolean;
  feedback: 'correct' | 'wrong' | null;
  onClick: () => void;
}

/**
 * Antwort-Button mit klarem Farb-Feedback und ohne irritierendes Ausblenden:
 *  - Klick auf RICHTIGE Antwort → grün
 *  - Klick auf FALSCHE Antwort → rot, danach wird die richtige Antwort grün hervorgehoben
 *  - Sonst neutral blau
 *  - Andere Buttons während der Feedback-Phase bleiben voll sichtbar (nur klick-blockiert)
 */
export default function AnswerButton({ children, picked, isAnswer, feedback, onClick }: Props) {
  let bg = 'bg-primary-500 active:bg-primary-600 shadow-ink-soft';
  if (feedback === 'correct' && picked) {
    bg = 'bg-accent-success shadow-emerald-900';
  } else if (feedback === 'wrong' && picked) {
    bg = 'bg-accent-danger shadow-red-900';
  } else if (feedback === 'wrong' && isAnswer) {
    bg = 'bg-accent-success shadow-emerald-900';
  }

  return (
    <button
      onClick={onClick}
      disabled={feedback !== null}
      className={`pixel-btn border-ink rounded-chunk shadow-pixel-lg w-32 h-32 sm:w-36 sm:h-36 text-[44px] sm:text-[52px] font-pixel text-white transition-colors ${bg}`}
    >
      {children}
    </button>
  );
}
