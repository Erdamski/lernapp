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
import { MathBlocks } from '@ui/components/CountBlocks';
import type { LevelProps, LevelResult } from '@subjects/types';

interface MathTask {
  a: number;
  b: number;
  op: '+' | '-';
  answer: number;
  options: number[];
}

/**
 * Welt 1, Level 1.6 – Plus & Minus bis 20 OHNE Zehnerübergang.
 * Beispiele: 12+5 (=17), 18-3 (=15), 11+7 (=18).
 * Zehnerübergang (z. B. 8+5 oder 13-7) kommt erst in Level 1.7.
 */
export default function Level1_6_PlusMinus_to_20({ onComplete, onExit }: LevelProps) {
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
    if (current) audio.speak(`${current.a} ${current.op === '+' ? 'plus' : 'minus'} ${current.b}`);
  }, [taskIndex, current]);

  const handleAnswer = async (chosen: number) => {
    if (feedback || !current) return;
    setPicked(chosen);
    const isCorrect = chosen === current.answer;
    const taskKey = `math:zr20:${current.a}${current.op}${current.b}`;
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
      taskKeys: tasks.map((t) => `math:zr20:${t.a}${t.op}${t.b}`),
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
          <div className="text-3xl sm:text-5xl font-body font-bold text-white/90 text-center">
            {current.a} {current.op === '+' ? '+' : '−'} {current.b} = ?
          </div>
          <IconButton onClick={() => audio.speak(`${current.a} ${current.op === '+' ? 'plus' : 'minus'} ${current.b}`)} aria-label="Frage vorlesen">
            <PixelIcon name="speaker" size={26} tone="white" />
          </IconButton>
        </div>

        <MathBlocks a={current.a} b={current.b} op={current.op} />

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

function generateTasks(count: number): MathTask[] {
  const tasks: MathTask[] = [];
  const seen = new Set<string>();
  while (tasks.length < count) {
    const isPlus = Math.random() < 0.5;
    let a: number, b: number, answer: number;
    if (isPlus) {
      // a + b ohne Zehnerübergang: a%10 + b muss <= a%10 + (10 - a%10)
      // Einfacher: zufälliges a in 10..18, b so dass a+b <= 20 und keine Zehnerüberschreitung
      a = 10 + Math.floor(Math.random() * 9); // 10..18
      const ones = a % 10;
      const maxB = Math.min(20 - a, 9 - ones);
      if (maxB < 1) continue;
      b = 1 + Math.floor(Math.random() * maxB);
      answer = a + b;
    } else {
      // a - b ohne Zehnerübergang: a in 11..20, b kleiner als Einer von a
      a = 11 + Math.floor(Math.random() * 10); // 11..20
      const ones = a % 10;
      if (ones < 1) continue; // 20 - n hätte Übergang
      b = 1 + Math.floor(Math.random() * ones);
      answer = a - b;
    }
    const key = `${a}${isPlus ? '+' : '-'}${b}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const candidate = answer + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 2) + 1);
      if (candidate !== answer && candidate >= 0 && candidate <= 20) distractors.add(candidate);
    }
    tasks.push({ a, b, op: isPlus ? '+' : '-', answer, options: shuffle([answer, ...distractors]) });
  }
  return tasks;
}
