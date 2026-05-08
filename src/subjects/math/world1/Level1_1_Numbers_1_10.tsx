import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { audio } from '@engine/audio/AudioPlayer';
import { getRandomEncourageKey, getRandomPraiseKey } from '@engine/audio/manifest';
import { recordAttempt } from '@engine/progress/srs';
import { useAppStore } from '@engine/state/store';
import type { LevelProps, LevelResult } from '@subjects/types';

/**
 * Level 1.1: Zahlen 1–10
 * Mengen erfassen → richtige Zahl auswählen.
 * EIS: ikonisch (Äpfel) + symbolisch (Zahlen). Touch-First, große Buttons.
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
    if (current) {
      const text = `Wie viele Äpfel siehst du?`;
      audio.speak(text);
    }
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
      if (taskIndex + 1 >= tasks.length) {
        finalize();
      } else {
        setTaskIndex((i) => i + 1);
      }
    }, 1400);
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6">
      <header className="w-full flex items-center justify-between">
        <button onClick={onExit} className="text-3xl btn-pop" aria-label="Zurück">⬅️</button>
        <div className="flex items-center gap-3">
          <span className="text-xl font-display">{taskIndex + 1} / {tasks.length}</span>
        </div>
        <button onClick={() => audio.speak('Wie viele Äpfel siehst du?')} className="text-3xl btn-pop" aria-label="Vorlesen">🔊</button>
      </header>

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-8">
        <div className="text-2xl font-display text-white/80">Wie viele Äpfel siehst du?</div>

        <div className="grid grid-cols-5 gap-3 max-w-2xl">
          {Array.from({ length: current.answer }).map((_, i) => (
            <div key={i} className="text-6xl text-center animate-pop" style={{ animationDelay: `${i * 50}ms` }}>🍎</div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null}
              className={`w-24 h-24 rounded-3xl text-5xl font-display btn-pop card-tile ${
                feedback === 'correct' && opt === current.answer
                  ? 'bg-green-500'
                  : feedback === 'wrong' && opt === current.answer
                    ? 'bg-green-500'
                    : 'bg-primary-500 hover:bg-primary-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <footer className="text-white/60 text-sm">
        {feedback === 'correct' && <span className="text-green-400 text-2xl font-display">{t('task.correct')}</span>}
        {feedback === 'wrong' && <span className="text-amber-300 text-2xl font-display">{t('task.wrong')}</span>}
      </footer>
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
    const options = shuffle([
      answer,
      clamp(answer + (Math.random() > 0.5 ? 1 : -1), 1, 10),
      clamp(answer + (Math.random() > 0.5 ? 2 : -2), 1, 10),
    ]);
    tasks.push({ answer, options });
  }
  return tasks;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...new Set(arr)];
  while (a.length < 3) a.push(Math.floor(Math.random() * 10) + 1 as unknown as T);
  return a.sort(() => Math.random() - 0.5);
}
