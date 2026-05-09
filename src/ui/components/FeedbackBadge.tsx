import PixelIcon from './PixelIcon';

interface Props {
  feedback: 'correct' | 'wrong' | null;
  correctText?: string;
  wrongText?: string;
}

/**
 * Großer, gut sichtbarer Feedback-Hinweis – mit farbigem Bg + Border,
 * sodass auch über dem hellen Sky-Hintergrund alles klar lesbar ist.
 */
export default function FeedbackBadge({ feedback, correctText = 'RICHTIG!', wrongText = 'PROBIER\'S NOCHMAL' }: Props) {
  if (!feedback) return <div className="h-12" />; // Spacer um Layout-Sprung zu vermeiden

  if (feedback === 'correct') {
    return (
      <div className="flex items-center gap-2 px-5 py-2 rounded-chunk border-4 border-ink shadow-pixel-md shadow-emerald-900 animate-pop"
        style={{ background: '#10b981' }}>
        <PixelIcon name="check" size={28} tone="white" />
        <span className="font-pixel text-[16px] text-white">{correctText}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-5 py-2 rounded-chunk border-4 border-ink shadow-pixel-md shadow-red-900 animate-shake"
      style={{ background: '#ef4444' }}>
      <PixelIcon name="cross" size={28} tone="white" />
      <span className="font-pixel text-[14px] text-white">{wrongText}</span>
    </div>
  );
}
