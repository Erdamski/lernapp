import { useEffect, useMemo, useRef, useState } from 'react';
import { audio } from '@engine/audio/AudioPlayer';
import { sfx } from '@engine/audio/SoundPlayer';
import { getRandomEncourageKey, getRandomPraiseKey } from '@engine/audio/manifest';
import { recordAttempt } from '@engine/progress/srs';
import { useAppStore } from '@engine/state/store';
import { shuffle } from '@engine/util/shuffle';
import PixelIcon from '@ui/components/PixelIcon';
import IconButton from '@ui/components/IconButton';
import ProgressRoute from '@ui/components/ProgressRoute';
import AnswerButton from "@ui/components/AnswerButton";
import FeedbackBadge from "@ui/components/FeedbackBadge";
import PixelItem, { COUNT_ITEMS_POOL, ITEM_LABELS_DE, type CountItemKind } from '@ui/components/PixelItem';
import { countNodes } from '@engine/audio/speakable';
import type { LevelProps, LevelResult } from '@subjects/types';

interface CountTask {
  answer: number;
  options: number[];
  item: CountItemKind;
}

/**
 * Level 1.1 – Zahlen 1-10
 * Pro Aufgabe wechselt das gezeigte Item (Apfel, Katze, Hund, Blume, …),
 * der Fragetext und die Audio-Ansage matchen genau das gezeigte Item.
 */
export default function Level1_1({ onComplete, onExit }: LevelProps) {
  const profile = useAppStore((s) => s.activeProfile);
  const [taskIndex, setTaskIndex] = useState(0);
  const correctRef = useRef(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const attempts = useRef<{ taskKey: string; correct: boolean }[]>([]);
  const tasks = useMemo(() => generateTasks(5), []);
  const current = tasks[taskIndex];
  const labelPl = current ? ITEM_LABELS_DE[current.item].pl : '';
  const visualQuestion = `Wie viele ${labelPl} siehst du?`;
  const voice = current ? countNodes(current.item, current.answer) : null;

  // Auto-Play der Frage bei jeder neuen Aufgabe (mit kleinem Delay damit
  // die Animation kurz Platz hat)
  useEffect(() => {
    if (!current || !voice) return;
    const timer = window.setTimeout(() => audio.speak(voice.question), 250);
    return () => window.clearTimeout(timer);
  }, [taskIndex, current, voice]);

  const handleAnswer = async (chosen: number) => {
    if (feedback || !current) return;
    setPicked(chosen);
    const isCorrect = chosen === current.answer;
    const taskKey = `math:count:${current.answer}:${current.item}`;
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
      taskKeys: tasks.map((tk) => `math:count:${tk.answer}:${tk.item}`),
      attempts: attempts.current,
    } satisfies LevelResult);
  };

  if (!current) return null;
  const routeStep = feedback ? taskIndex + 1 : taskIndex;
  const itemSize = current.answer <= 4 ? 96 : current.answer <= 6 ? 80 : current.answer <= 8 ? 68 : 56;

  return (
    <div className="w-full h-full flex flex-col items-center p-6">
      <header className="w-full max-w-4xl flex items-center justify-between mb-2">
        <IconButton onClick={onExit} aria-label="Zurück">
          <PixelIcon name="arrow-left" size={26} tone="white" />
        </IconButton>
        <span className="font-pixel text-[16px] text-white/70">{taskIndex + 1} / {tasks.length}</span>
        <span className="w-12" />
      </header>

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-10">
        <div className="flex items-center gap-3 max-w-4xl">
          <div className="text-3xl sm:text-5xl font-body font-bold text-white text-center text-outlined">
            {visualQuestion}
          </div>
          <IconButton onClick={() => voice && audio.speak(voice.question)} aria-label="Frage vorlesen" size={56}>
            <PixelIcon name="speaker" size={28} tone="white" />
          </IconButton>
        </div>

        <div className="flex flex-row items-center justify-center gap-3 max-w-full">
          {Array.from({ length: current.answer }).map((_, i) => (
            <div key={i} className="animate-pop shrink-0" style={{ animationDelay: `${i * 40}ms` }}>
              <PixelItem kind={current.item} size={itemSize} />
            </div>
          ))}
        </div>

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

      <div className="mb-2 flex items-center justify-center min-h-[56px]">
        <FeedbackBadge feedback={feedback} />
      </div>

      {profile && (
        <ProgressRoute totalSteps={tasks.length + 1} currentStep={routeStep} character={profile.character} lastResult={feedback} />
      )}
    </div>
  );
}

function generateTasks(count: number): CountTask[] {
  const tasks: CountTask[] = [];
  const used = new Set<number>();
  const itemPool = shuffle([...COUNT_ITEMS_POOL]);
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
    const item = itemPool[tasks.length % itemPool.length];
    tasks.push({ answer, options, item });
  }
  return tasks;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
