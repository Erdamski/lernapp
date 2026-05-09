import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { audio } from '@engine/audio/AudioPlayer';
import { sfx } from '@engine/audio/SoundPlayer';
import { getRandomEncourageKey, getRandomPraiseKey } from '@engine/audio/manifest';
import { recordAttempt } from '@engine/progress/srs';
import { useAppStore } from '@engine/state/store';
import { shuffle } from '@engine/util/shuffle';
import PixelIcon from '@ui/components/PixelIcon';
import IconButton from '@ui/components/IconButton';
import ProgressRoute from '@ui/components/ProgressRoute';
import AnswerButton from '@ui/components/AnswerButton';
import { PixelBlock } from '@ui/components/CountBlocks';
import type { LevelProps } from '@subjects/types';

interface CountTask {
  answer: number;
  options: number[];
}

/**
 * Welt 1, Level 1.5 – Zahlen bis 20
 * Mengen 11-20 erkennen mit dem klassischen Zwanzigerfeld
 * (zwei Reihen à 10 Blöcken). Lehrt strukturiertes Erfassen
 * statt Abzählen.
 */
export default function Level1_5_Numbers_to_20({ onComplete, onExit }: LevelProps) {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.activeProfile);
  const [taskIndex, setTaskIndex] = useState(0);
  const correctRef = useRef(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const attempts = useRef<{ taskKey: string; correct: boolean }[]>([]);
  const tasks = useMemo(() => generateTasks(5), []);
  const current = tasks[taskIndex];

  useEffect(() => {
    audio.speak('Wie viele Blöcke siehst du?');
  }, []);
  useEffect(() => {
    if (current) audio.speak('Wie viele Blöcke siehst du?');
  }, [taskIndex, current]);

  const handleAnswer = async (chosen: number) => {
    if (feedback || !current) return;
    setPicked(chosen);
    const isCorrect = chosen === current.answer;
    const taskKey = `math:count20:${current.answer}`;
    attempts.current.push({ taskKey, correct: isCorrect });
    if (profile) await recordAttempt(profile.id, 'math', taskKey, isCorrect);

    if (isCorrect) {
      correctRef.current += 1;
      setFeedback('correct');
      sfx.correct();
      audio.play(getRandomPraiseKey(), { fallbackToTTS: true });
    } else {
      setFeedback('wrong');
      sfx.wrong();
      audio.play(getRandomEncourageKey(), { fallbackToTTS: true });
    }

    setTimeout(() => {
      setFeedback(null);
      setPicked(null);
      if (taskIndex + 1 >= tasks.length) finalize();
      else setTaskIndex((i) => i + 1);
    }, 1100);
  };

  const finalize = () => {
    const total = tasks.length;
    const correctCount = correctRef.current;
    const accuracy = correctCount / total;
    const durationMs = Date.now() - startedAt;
    let stars: 0 | 1 | 2 | 3 = 0;
    if (accuracy >= 0.6) stars = 1;
    if (accuracy >= 0.8) stars = 2;
    if (accuracy === 1) stars = 3;
    onComplete({
      correct: correctCount,
      total,
      durationMs,
      stars,
      taskKeys: tasks.map((t) => `math:count20:${t.answer}`),
      attempts: attempts.current,
    });
  };

  if (!current) return null;
  const routeStep = feedback ? taskIndex + 1 : taskIndex;

  return (
    <div className="w-full h-full flex flex-col items-center p-6">
      <header className="w-full max-w-4xl flex items-center justify-between mb-2">
        <IconButton onClick={onExit}>
          <PixelIcon name="arrow-left" size={26} tone="white" />
        </IconButton>
        <span className="font-pixel text-[16px] text-white/70">{taskIndex + 1} / {tasks.length}</span>
        <span className="w-12" />
      </header>

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-8">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-5xl font-body font-bold text-white text-center text-outlined">
            Wie viele Blöcke siehst du?
          </div>
          <IconButton onClick={() => audio.speak('Wie viele Blöcke siehst du?')} aria-label="Frage vorlesen">
            <PixelIcon name="speaker" size={26} tone="white" />
          </IconButton>
        </div>

        <TwentyField count={current.answer} />

        <div className="flex justify-center gap-5 mt-2">
          {current.options.map((opt) => (
            <AnswerButton
              key={opt}
              picked={picked === opt}
              isAnswer={opt === current.answer}
              feedback={feedback}
              onClick={() => handleAnswer(opt)}
            >
              {opt}
            </AnswerButton>
          ))}
        </div>
      </div>

      <div className="font-pixel text-[18px] h-8 mb-2">
        {feedback === 'correct' && <span className="text-accent-success">{t('task.correct')}</span>}
        {feedback === 'wrong' && <span className="text-accent-warn">{t('task.wrong')}</span>}
      </div>

      {profile && (
        <ProgressRoute totalSteps={tasks.length + 1} currentStep={routeStep} character={profile.character} lastResult={feedback} />
      )}
    </div>
  );
}

/**
 * Zwanzigerfeld: 2 Reihen à 10 Blöcken. Erste 5 jeder Reihe blau, zweite 5 grün
 * – das hilft Kindern Mengen schneller "auf einen Blick" zu erfassen (Kraft der 5).
 */
function TwentyField({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1].map((row) => (
        <div key={row} className="flex gap-1.5">
          {Array.from({ length: 10 }).map((_, col) => {
            const idx = row * 10 + col;
            const filled = idx < count;
            const isFiveBoundary = col === 5;
            return (
              <div key={col} className={isFiveBoundary ? 'ml-2' : ''}>
                {filled ? (
                  <PixelBlock color={col < 5 ? 'blue' : 'green'} size={42} />
                ) : (
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      border: '3px solid rgba(255,255,255,0.18)',
                      borderRadius: 2,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function generateTasks(count: number): CountTask[] {
  const tasks: CountTask[] = [];
  const used = new Set<number>();
  while (tasks.length < count) {
    const answer = Math.floor(Math.random() * 10) + 11; // 11..20
    if (used.has(answer)) continue;
    used.add(answer);
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const offset = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 2) + 1);
      const candidate = Math.max(10, Math.min(20, answer + offset));
      if (candidate !== answer) distractors.add(candidate);
    }
    tasks.push({ answer, options: shuffle([answer, ...distractors]) });
  }
  return tasks;
}
