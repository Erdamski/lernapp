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
import MathItems, { pickSingleItem } from '@ui/components/MathItems';
import type { CountItemKind } from '@ui/components/PixelItem';
import type { LevelProps } from '@subjects/types';

interface MinusTask {
  a: number;
  b: number;
  answer: number;
  options: number[];
  item: CountItemKind;
}

export default function Level1_4_Minus_10({ onComplete, onExit }: LevelProps) {
  const profile = useAppStore((s) => s.activeProfile);
  const [taskIndex, setTaskIndex] = useState(0);
  const correctRef = useRef(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const attempts = useRef<{ taskKey: string; correct: boolean }[]>([]);

  const tasks = useMemo(() => generateMinusTasks(5), []);
  const current = tasks[taskIndex];

  useEffect(() => {
    audio.speak('Wie viel ist minus?');
  }, []);

  useEffect(() => {
    if (current) audio.speak(`${current.a} minus ${current.b}`);
  }, [taskIndex, current]);

  const handleAnswer = async (chosen: number) => {
    if (feedback || !current) return;
    setPicked(chosen);
    const isCorrect = chosen === current.answer;
    const taskKey = `math:minus:${current.a}-${current.b}`;
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
      taskKeys: tasks.map((t) => `math:minus:${t.a}-${t.b}`),
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

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-10">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-5xl font-body font-bold text-white text-center text-outlined">
            {current.a} − {current.b} = ?
          </div>
          <IconButton onClick={() => audio.speak(`${current.a} minus ${current.b}`)} aria-label="Frage vorlesen">
            <PixelIcon name="speaker" size={26} tone="white" />
          </IconButton>
        </div>

        <MathItems a={current.a} b={current.b} op="-" itemA={current.item} />

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
      {profile && (
        <ProgressRoute totalSteps={tasks.length + 1} currentStep={routeStep} character={profile.character} lastResult={feedback} />
      )}
    </div>
  );
}

function generateMinusTasks(count: number): MinusTask[] {
  const tasks: MinusTask[] = [];
  const seen = new Set<string>();
  while (tasks.length < count) {
    const a = Math.floor(Math.random() * 9) + 2; // 2..10
    const b = Math.floor(Math.random() * a) + 1; // 1..a (sodass a-b >= 0)
    const key = `${a}-${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const answer = a - b;
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const candidate = answer + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 2) + 1);
      if (candidate !== answer && candidate >= 0 && candidate <= 10) distractors.add(candidate);
    }
    tasks.push({ a, b, answer, options: shuffle([answer, ...distractors]), item: pickSingleItem() });
  }
  return tasks;
}
