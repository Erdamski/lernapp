import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { audio } from '@engine/audio/AudioPlayer';
import { getRandomEncourageKey, getRandomPraiseKey } from '@engine/audio/manifest';
import { recordAttempt } from '@engine/progress/srs';
import { useAppStore } from '@engine/state/store';
import { shuffle } from '@engine/util/shuffle';
import PixelIcon from '@ui/components/PixelIcon';
import ProgressRoute from '@ui/components/ProgressRoute';
import { BlockRow } from '@ui/components/CountBlocks';
import type { LevelProps, LevelResult } from '@subjects/types';

/**
 * Level 1.1: Zahlen 1–10
 * Mengen erfassen → richtige Zahl auswählen.
 * EIS: ikonisch (Pixel-Äpfel) + symbolisch (Zahlen). Touch-First, große Buttons.
 */
export default function Level1_1({ onComplete, onExit }: LevelProps) {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.activeProfile);
  const [taskIndex, setTaskIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const attempts: { taskKey: string; correct: boolean }[] = useMemo(() => [], []);

  const tasks = useMemo(() => generateTasks(5), []);
  const current = tasks[taskIndex];

  useEffect(() => {
    audio.play('math/level_1_1_intro', { fallbackToTTS: true });
  }, []);

  useEffect(() => {
    if (current) audio.speak('Wie viele Blöcke siehst du?');
  }, [taskIndex, current]);

  const handleAnswer = async (chosen: number) => {
    if (feedback) return;
    const isCorrect = chosen === current.answer;
    const taskKey = `math:count:${current.answer}`;
    attempts.push({ taskKey, correct: isCorrect });
    if (profile) await recordAttempt(profile.id, 'math', taskKey, isCorrect);

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setFeedback('correct');
      audio.play(getRandomPraiseKey(), { fallbackToTTS: true });
    } else {
      setFeedback('wrong');
      audio.play(getRandomEncourageKey(), { fallbackToTTS: true });
    }

    setTimeout(() => {
      setFeedback(null);
      if (taskIndex + 1 >= tasks.length) finalize();
      else setTaskIndex((i) => i + 1);
    }, 800);
  };

  const finalize = () => {
    const total = tasks.length;
    const accuracy = correct / total;
    const durationMs = Date.now() - startedAt;
    let stars: 0 | 1 | 2 | 3 = 0;
    if (accuracy >= 0.6) stars = 1;
    if (accuracy >= 0.8) stars = 2;
    if (accuracy === 1) stars = 3;

    const result: LevelResult = {
      correct,
      total,
      durationMs,
      stars,
      taskKeys: tasks.map((t) => `math:count:${t.answer}`),
      attempts,
    };
    onComplete(result);
  };

  if (!current) return null;

  // Aktueller Schritt für die ProgressRoute = Anzahl der bereits abgeschlossenen Aufgaben.
  // Während Feedback gezeigt wird, ist die Aufgabe quasi schon "erledigt" — wir
  // nutzen taskIndex (vor Inkrement). Sobald taskIndex steigt, läuft der Charakter weiter.
  const routeStep = feedback ? taskIndex + 1 : taskIndex;

  return (
    <div className="w-full h-full flex flex-col items-center p-6">
      <header className="w-full max-w-4xl flex items-center justify-between mb-2">
        <button onClick={onExit} className="pixel-btn bg-bg-card border-ink-soft shadow-black shadow-pixel-sm w-14 h-14 p-0" aria-label="Zurück">
          <PixelIcon name="arrow-left" size={26} tone="white" />
        </button>
        <span className="font-pixel text-[16px] text-white/70">{taskIndex + 1} / {tasks.length}</span>
        <button
          onClick={() => audio.speak('Wie viele Blöcke siehst du?')}
          className="pixel-btn bg-bg-card border-ink-soft shadow-black shadow-pixel-sm w-14 h-14 p-0"
          aria-label="Vorlesen"
        >
          <PixelIcon name="speaker" size={26} tone="white" />
        </button>
      </header>

      {profile && (
        <ProgressRoute totalSteps={tasks.length + 1} currentStep={routeStep} character={profile.character} lastResult={feedback} />
      )}

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-10">
        <div className="text-4xl sm:text-5xl font-body font-bold text-white/90 text-center">
          Wie viele Blöcke siehst du?
        </div>

        <BlockRow count={current.answer} color="red" />

        <div className="flex justify-center gap-5 mt-4">
          {current.options.map((opt) => {
            const isCorrectFeedback = feedback === 'correct' && opt === current.answer;
            const revealAnswer = feedback === 'wrong' && opt === current.answer;
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className={`pixel-btn border-ink rounded-chunk shadow-pixel-lg w-32 h-32 sm:w-36 sm:h-36 text-[44px] sm:text-[52px] font-pixel text-white transition-colors
                  ${isCorrectFeedback || revealAnswer
                    ? 'bg-accent-success shadow-emerald-900'
                    : 'bg-primary-500 active:bg-primary-600 shadow-ink-soft'}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <footer className="font-pixel text-[18px] h-10">
        {feedback === 'correct' && <span className="text-accent-success">{t('task.correct')}</span>}
        {feedback === 'wrong' && <span className="text-accent-warn">{t('task.wrong')}</span>}
      </footer>
    </div>
  );
}

/**
 * Zeigt 1–10 Items in EINER Zeile. Größe schrumpft dynamisch
 * mit Anzahl, sodass alles ohne Umbruch reinpasst.
 */
export function CountRow({ count, icon }: { count: number; icon: 'apple' | 'star' }) {
  const baseSize = count <= 4 ? 110 : count <= 6 ? 92 : count <= 8 ? 76 : 64;
  return (
    <div className="flex flex-row items-center justify-center gap-3 max-w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pop shrink-0" style={{ animationDelay: `${i * 50}ms` }}>
          <PixelIcon name={icon} size={baseSize} />
        </div>
      ))}
    </div>
  );
}

interface CountTask {
  answer: number;
  options: number[];
}

function generateTasks(count: number): CountTask[] {
  const tasks: CountTask[] = [];
  const used = new Set<number>();
  while (tasks.length < count) {
    const answer = Math.floor(Math.random() * 9) + 2; // 2..10
    if (used.has(answer)) continue;
    used.add(answer);
    const distractorPool = new Set<number>();
    while (distractorPool.size < 2) {
      const offset = pickFrom([-2, -1, 1, 2]);
      const candidate = clamp(answer + offset, 1, 10);
      if (candidate !== answer) distractorPool.add(candidate);
    }
    const options = shuffle([answer, ...distractorPool]);
    tasks.push({ answer, options });
  }
  return tasks;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
