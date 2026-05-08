import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { audio } from '@engine/audio/AudioPlayer';
import { useAppStore } from '@engine/state/store';
import { recordAttempt } from '@engine/progress/srs';
import { shuffle } from '@engine/util/shuffle';

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
  { id: 'count_3', prompt: '🍎🍎🍎', question: 'Wie viele Äpfel?', options: [2, 3, 4], answer: 3, difficulty: 1 },
  { id: 'count_5', prompt: '⭐⭐⭐⭐⭐', question: 'Wie viele Sterne?', options: [4, 5, 6], answer: 5, difficulty: 1 },
  { id: 'count_7', prompt: '🍓🍓🍓🍓🍓🍓🍓', question: 'Wie viele Erdbeeren?', options: [6, 7, 8], answer: 7, difficulty: 2 },
  { id: 'add_2_3', prompt: '🟦🟦  +  🟦🟦🟦', question: '2 + 3 = ?', options: [4, 5, 6], answer: 5, difficulty: 2 },
  { id: 'add_4_5', prompt: '4 + 5', question: 'Wie viel ist das?', options: [8, 9, 10], answer: 9, difficulty: 3 },
  { id: 'sub_8_3', prompt: '8 − 3', question: 'Wie viel bleibt?', options: [4, 5, 6], answer: 5, difficulty: 3 },
  { id: 'add_zo_7_5', prompt: '7 + 5', question: 'Wie viel ist das?', options: [11, 12, 13], answer: 12, difficulty: 4 },
  { id: 'sub_zo_13_5', prompt: '13 − 5', question: 'Wie viel bleibt?', options: [7, 8, 9], answer: 8, difficulty: 5 },
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
  // Optionen pro Aufgabe einmalig shuffeln (stabil bis Aufgabe wechselt),
  // damit die richtige Antwort nicht immer in der Mitte steht.
  const current = useMemo(
    () => (baseTask ? { ...baseTask, options: shuffle(baseTask.options) } : baseTask),
    [baseTask],
  );

  const handleAnswer = async (chosen: number) => {
    if (feedback) return;
    const correct = chosen === current.answer;
    setFeedback(correct ? 'correct' : 'wrong');

    if (profile) await recordAttempt(profile.id, 'math', `math:diag:${current.id}`, correct);

    if (correct) {
      setHighestPassed((d) => (current.difficulty > d ? current.difficulty : d));
    }

    setTimeout(() => {
      setFeedback(null);
      // Adaptive Logik: bei 2 falschen in Folge → abbrechen
      if (taskIndex + 1 >= TASKS.length) {
        finalize();
      } else if (!correct && taskIndex >= 2) {
        // Nach mehreren Fehlern abbrechen
        finalize();
      } else {
        setTaskIndex((i) => i + 1);
      }
    }, 1200);
  };

  const finalize = async () => {
    setStage('done');
    audio.play('onboarding/done', { fallbackToTTS: true });
    setTimeout(async () => {
      await setOnboardingDone();
      onDone();
    }, 2000);
  };

  if (stage === 'intro') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-9xl mb-6 animate-bounce-slow">🐉</div>
        <h1 className="text-5xl font-display mb-3">{t('onboarding.title')}</h1>
        <p className="text-xl text-white/70 mb-10 max-w-lg">{t('onboarding.intro')}</p>
        <button
          onClick={() => setStage('tasks')}
          className="px-10 py-5 rounded-full bg-primary-500 hover:bg-primary-400 text-2xl font-display btn-pop"
        >
          {t('onboarding.start')} 🚀
        </button>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-9xl mb-6 animate-pop">🎉</div>
        <h1 className="text-5xl font-display mb-3">{t('onboarding.done_title')}</h1>
        <p className="text-xl text-white/70">{t('onboarding.done_text')}</p>
        <p className="text-sm text-white/40 mt-4">Stufe erkannt: {highestPassed}/5</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-6">
      <header className="w-full flex items-center justify-between max-w-4xl">
        <span className="text-xl font-display">{taskIndex + 1} / {TASKS.length}</span>
        <button onClick={() => audio.speak(current.question)} className="text-3xl btn-pop" aria-label="Vorlesen">🔊</button>
      </header>

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-8">
        <div className="text-2xl font-display text-white/80">{current.question}</div>
        <div className="text-7xl text-center font-display tracking-wider">{current.prompt}</div>

        <div className="grid grid-cols-3 gap-4">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null}
              className={`w-24 h-24 rounded-3xl text-5xl font-display btn-pop card-tile ${
                feedback && opt === current.answer ? 'bg-green-500' : 'bg-primary-500 hover:bg-primary-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
