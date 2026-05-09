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
import MathItems, { pickItemPair } from '@ui/components/MathItems';
import type { CountItemKind } from '@ui/components/PixelItem';
import { plusNodes } from '@engine/audio/speakable';
import type { LevelProps, LevelResult } from '@subjects/types';

interface PlusTask {
  a: number;
  b: number;
  answer: number;
  options: number[];
  itemA: CountItemKind;
  itemB: CountItemKind;
}

/**
 * Welt 1, Level 1.3 – Plus bis 10
 * Visuelle Addition mit zwei Block-Gruppen, die zusammenzählbar sind.
 */
export default function Level1_3_Plus_10({ onComplete, onExit }: LevelProps) {
  const profile = useAppStore((s) => s.activeProfile);
  const [taskIndex, setTaskIndex] = useState(0);
  const correctRef = useRef(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const attempts = useRef<{ taskKey: string; correct: boolean }[]>([]);

  const tasks = useMemo(() => generatePlusTasks(5), []);
  const current = tasks[taskIndex];

  const voice = current ? plusNodes(current.a, current.b, current.itemA, current.itemB) : null;

  useEffect(() => {
    if (!voice) return;
    const timer = window.setTimeout(() => audio.speak(voice.question), 250);
    return () => window.clearTimeout(timer);
  }, [taskIndex, voice]);

  const handleAnswer = async (chosen: number) => {
    if (feedback || !current) return;
    setPicked(chosen);
    const isCorrect = chosen === current.answer;
    const taskKey = `math:plus:${current.a}+${current.b}`;
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
    const result: LevelResult = {
      correct: correctCount,
      total,
      durationMs,
      stars,
      taskKeys: tasks.map((t) => `math:plus:${t.a}+${t.b}`),
      attempts: attempts.current,
    };
    onComplete(result);
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

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-10">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-5xl font-body font-bold text-white text-center text-outlined">
            {current.a} + {current.b} = ?
          </div>
          <IconButton onClick={() => voice && audio.speak(voice.question)} aria-label="Frage vorlesen">
            <PixelIcon name="speaker" size={26} tone="white" />
          </IconButton>
        </div>

        <MathItems a={current.a} b={current.b} op="+" itemA={current.itemA} itemB={current.itemB} />

        <div className="flex justify-center gap-5 mt-4">
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

function generatePlusTasks(count: number): PlusTask[] {
  const tasks: PlusTask[] = [];
  const seen = new Set<string>();
  while (tasks.length < count) {
    const a = Math.floor(Math.random() * 8) + 1; // 1..8
    const b = Math.floor(Math.random() * (10 - a)) + 1; // sodass a+b <= 10
    const key = `${a}+${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const answer = a + b;
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const candidate = answer + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 2) + 1);
      if (candidate !== answer && candidate >= 0 && candidate <= 10) distractors.add(candidate);
    }
    const { a: itemA, b: itemB } = pickItemPair();
    tasks.push({ a, b, answer, options: shuffle([answer, ...distractors]), itemA, itemB });
  }
  return tasks;
}
