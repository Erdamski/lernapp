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
import { BlockRow } from '@ui/components/CountBlocks';
import type { LevelProps, LevelResult } from '@subjects/types';

type ItemType = 'block-blue' | 'block-red' | 'block-green' | 'block-yellow' | 'star' | 'heart' | 'coin';
const ITEM_TYPES: ItemType[] = ['block-blue', 'block-red', 'block-green', 'block-yellow', 'star', 'heart', 'coin'];

/**
 * Level 1.1: Zahlen 1–10
 * Mengen erfassen → richtige Zahl auswählen.
 * EIS: ikonisch (Pixel-Äpfel) + symbolisch (Zahlen). Touch-First, große Buttons.
 */
export default function Level1_1({ onComplete, onExit }: LevelProps) {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.activeProfile);
  const [taskIndex, setTaskIndex] = useState(0);
  // correctRef vermeidet Stale-Closure-Bug beim finalize() im setTimeout.
  // (setState ist async; ohne ref liest finalize einen veralteten correct-Wert.)
  const correctRef = useRef(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const attempts = useRef<{ taskKey: string; correct: boolean }[]>([]);

  const tasks = useMemo(() => generateTasks(5), []);
  const current = tasks[taskIndex];
  const itemQuestionLabel = useMemo(() => labelForItem(current?.item ?? 'block-blue'), [current?.item]);

  useEffect(() => {
    audio.play('math/level_1_1_intro', { fallbackToTTS: true });
  }, []);

  useEffect(() => {
    if (current) audio.speak(`Wie viele ${itemQuestionLabel} siehst du?`);
  }, [taskIndex, current, itemQuestionLabel]);

  const handleAnswer = async (chosen: number) => {
    if (feedback) return;
    const isCorrect = chosen === current.answer;
    const taskKey = `math:count:${current.answer}`;
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
      if (taskIndex + 1 >= tasks.length) finalize();
      else setTaskIndex((i) => i + 1);
    }, 800);
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
      taskKeys: tasks.map((t) => `math:count:${t.answer}`),
      attempts: attempts.current,
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
        <IconButton onClick={onExit} aria-label="Zurück">
          <PixelIcon name="arrow-left" size={26} tone="white" />
        </IconButton>
        <span className="font-pixel text-[16px] text-white/70">{taskIndex + 1} / {tasks.length}</span>
        <IconButton onClick={() => audio.speak(`Wie viele ${itemQuestionLabel} siehst du?`)} aria-label="Vorlesen">
          <PixelIcon name="speaker" size={26} tone="white" />
        </IconButton>
      </header>

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-10">
        <div className="text-4xl sm:text-5xl font-body font-bold text-white/90 text-center">
          Wie viele {itemQuestionLabel} siehst du?
        </div>

        <ItemRow count={current.answer} item={current.item} />

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
  item: ItemType;
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
    const item = ITEM_TYPES[tasks.length % ITEM_TYPES.length];
    tasks.push({ answer, options, item });
  }
  return tasks;
}

function ItemRow({ count, item }: { count: number; item: ItemType }) {
  // Block-Items nutzen die schnellen CountBlocks, Pixel-Items das Icon.
  if (item.startsWith('block-')) {
    const color = item.replace('block-', '') as 'blue' | 'red' | 'green' | 'yellow';
    return <BlockRow count={count} color={color} />;
  }
  const size = count <= 4 ? 96 : count <= 6 ? 80 : count <= 8 ? 68 : 56;
  return (
    <div className="flex flex-row items-center justify-center gap-3 max-w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pop shrink-0" style={{ animationDelay: `${i * 40}ms` }}>
          <PixelIcon name={item as 'star' | 'heart' | 'coin'} size={size} />
        </div>
      ))}
    </div>
  );
}

function labelForItem(item: ItemType): string {
  switch (item) {
    case 'block-blue': return 'blaue Blöcke';
    case 'block-red': return 'rote Blöcke';
    case 'block-green': return 'grüne Blöcke';
    case 'block-yellow': return 'gelbe Blöcke';
    case 'star': return 'Sterne';
    case 'heart': return 'Herzen';
    case 'coin': return 'Münzen';
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
