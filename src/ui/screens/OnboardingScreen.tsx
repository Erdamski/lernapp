import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { audio } from '@engine/audio/AudioPlayer';
import { useAppStore } from '@engine/state/store';
import { recordAttempt } from '@engine/progress/srs';
import { shuffle } from '@engine/util/shuffle';
import PixelButton from '@ui/components/PixelButton';
import PixelIcon from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
import IconButton from '@ui/components/IconButton';
import ProgressRoute from '@ui/components/ProgressRoute';
import { BlockRow, MathBlocks } from '@ui/components/CountBlocks';

interface Props {
  onDone: () => void;
}

interface DiagTask {
  id: string;
  prompt: string;
  question: string;
  options: number[];
  answer: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

const TASKS: DiagTask[] = [
  { id: 'count_3', prompt: 'apple:3', question: 'Wie viele Äpfel?', options: [2, 3, 4], answer: 3, difficulty: 1 },
  { id: 'count_5', prompt: 'star:5', question: 'Wie viele Sterne?', options: [4, 5, 6], answer: 5, difficulty: 1 },
  { id: 'count_7', prompt: 'apple:7', question: 'Wie viele Äpfel?', options: [6, 7, 8], answer: 7, difficulty: 2 },
  { id: 'add_2_3', prompt: '2+3', question: '2 + 3 = ?', options: [4, 5, 6], answer: 5, difficulty: 2 },
  { id: 'add_4_5', prompt: '4+5', question: 'Wie viel ist das?', options: [8, 9, 10], answer: 9, difficulty: 3 },
  { id: 'sub_8_3', prompt: '8-3', question: 'Wie viel bleibt?', options: [4, 5, 6], answer: 5, difficulty: 3 },
  { id: 'add_zo_7_5', prompt: '7+5', question: 'Wie viel ist das?', options: [11, 12, 13], answer: 12, difficulty: 4 },
  { id: 'sub_zo_13_5', prompt: '13-5', question: 'Wie viel bleibt?', options: [7, 8, 9], answer: 8, difficulty: 5 },
];

export default function OnboardingScreen({ onDone }: Props) {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.activeProfile);
  const setOnboardingDone = useAppStore((s) => s.setOnboardingDone);
  const [stage, setStage] = useState<'intro' | 'tasks' | 'done'>('intro');
  const [taskIndex, setTaskIndex] = useState(0);
  const [highestPassed, setHighestPassed] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (stage === 'intro') audio.play('onboarding/dragon_intro', { fallbackToTTS: true });
  }, [stage]);

  const baseTask = TASKS[taskIndex];
  const current = useMemo(
    () => (baseTask ? { ...baseTask, options: shuffle(baseTask.options) } : baseTask),
    [baseTask],
  );

  const handleAnswer = async (chosen: number) => {
    if (feedback || !current) return;
    const correct = chosen === current.answer;
    setFeedback(correct ? 'correct' : 'wrong');

    if (profile) await recordAttempt(profile.id, 'math', `math:diag:${current.id}`, correct);
    if (correct) {
      setHighestPassed((d) => (current.difficulty > d ? current.difficulty : d));
    }

    setTimeout(() => {
      setFeedback(null);
      if (taskIndex + 1 >= TASKS.length || (!correct && taskIndex >= 2)) {
        finalize();
      } else {
        setTaskIndex((i) => i + 1);
      }
    }, 700);
  };

  const finalize = async () => {
    setStage('done');
    audio.play('onboarding/done', { fallbackToTTS: true });
    setTimeout(async () => {
      await setOnboardingDone();
      onDone();
    }, 1500);
  };

  if (stage === 'intro') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 animate-bounce-slow">
          <PixelIcon name="dragon" size={160} />
        </div>
        <PixelTitle size="lg" color="success" className="mb-3">{t('onboarding.title')}</PixelTitle>
        <p className="text-xl font-body text-white/70 mb-10 max-w-lg">{t('onboarding.intro')}</p>
        <PixelButton size="lg" variant="primary" onClick={() => setStage('tasks')} iconRight={<PixelIcon name="arrow-right" size={20} tone="white" />}>
          {t('onboarding.start')}
        </PixelButton>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 animate-pop">
          <PixelIcon name="trophy" size={160} />
        </div>
        <PixelTitle size="lg" color="gold" className="mb-3">{t('onboarding.done_title')}</PixelTitle>
        <p className="text-xl font-body text-white/70">{t('onboarding.done_text')}</p>
        <p className="text-sm text-white/40 mt-4">Stufe erkannt: {highestPassed}/5</p>
      </div>
    );
  }

  const routeStep = feedback ? taskIndex + 1 : taskIndex;

  return (
    <div className="w-full h-full flex flex-col items-center p-6">
      <header className="w-full flex items-center justify-between max-w-4xl mb-2">
        <span className="font-pixel text-[16px] text-white/70">{taskIndex + 1} / {TASKS.length}</span>
        <IconButton onClick={() => current && audio.speak(current.question)} aria-label="Vorlesen">
          <PixelIcon name="speaker" size={26} tone="white" />
        </IconButton>
      </header>

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-10">
        <div className="text-4xl sm:text-5xl font-body font-bold text-white/90 text-center">{current?.question}</div>
        <PromptDisplay prompt={current?.prompt ?? ''} />

        <div className="flex justify-center gap-5 mt-4">
          {current?.options.map((opt) => {
            const showAsCorrect = feedback && opt === current.answer;
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className={`pixel-btn border-ink rounded-chunk shadow-pixel-lg w-32 h-32 sm:w-36 sm:h-36 text-[44px] sm:text-[52px] font-pixel text-white transition-colors
                  ${showAsCorrect
                    ? 'bg-accent-success shadow-emerald-900'
                    : 'bg-primary-500 active:bg-primary-600 shadow-ink-soft'}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {profile && (
        <ProgressRoute totalSteps={TASKS.length + 1} currentStep={routeStep} character={profile.character} lastResult={feedback} />
      )}
    </div>
  );
}

function PromptDisplay({ prompt }: { prompt: string }) {
  // Format: "apple:N", "star:N" → echte Pixel-Icons (kein Block)
  if (prompt.includes(':')) {
    const [type, n] = prompt.split(':');
    const count = parseInt(n);
    if (type === 'apple' || type === 'star') {
      const size = count <= 4 ? 96 : count <= 6 ? 80 : count <= 8 ? 68 : 56;
      return (
        <div className="flex flex-row items-center justify-center gap-3 max-w-full">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pop shrink-0" style={{ animationDelay: `${i * 40}ms` }}>
              <PixelIcon name={type as 'apple' | 'star'} size={size} />
            </div>
          ))}
        </div>
      );
    }
    return <BlockRow count={count} color="blue" />;
  }
  // Math expressions: 2+3 → 2 blaue + 3 grüne Blöcke (zum Zusammenzählen)
  const m = prompt.match(/^(\d+)\s*([+\-])\s*(\d+)$/);
  if (m) {
    const [, a, op, b] = m;
    return <MathBlocks a={parseInt(a)} b={parseInt(b)} op={op as '+' | '-'} />;
  }
  return <div className="font-pixel text-[48px]">{prompt}</div>;
}
