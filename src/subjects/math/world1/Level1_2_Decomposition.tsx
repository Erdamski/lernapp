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
import { PixelBlock } from '@ui/components/CountBlocks';
import { decompositionNodes } from '@engine/audio/speakable';
import type { LevelProps, LevelResult } from '@subjects/types';

interface DecompTask {
  total: number;
  visible: number;
  missing: number;
  options: number[];
}

/**
 * Welt 1, Level 1.2 – Zahlzerlegung
 * Zeigt Aufgaben wie "3 + ? = 5" mit visueller Hilfe (Blöcke + Geister-Slots).
 * Lehrt 5er- und 10er-Freunde – Schlüssel für strategisches Rechnen.
 */
export default function Level1_2_Decomposition({ onComplete, onExit }: LevelProps) {
  const profile = useAppStore((s) => s.activeProfile);
  const [taskIndex, setTaskIndex] = useState(0);
  const correctRef = useRef(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const attempts = useRef<{ taskKey: string; correct: boolean }[]>([]);

  const tasks = useMemo(() => generateTasks(5), []);
  const current = tasks[taskIndex];

  const voice = current ? decompositionNodes(current.total, current.visible) : null;

  useEffect(() => {
    if (!voice) return;
    const timer = window.setTimeout(() => audio.speak(voice.question), 250);
    return () => window.clearTimeout(timer);
  }, [taskIndex, voice]);

  const handleAnswer = async (chosen: number) => {
    if (feedback || !current) return;
    setPicked(chosen);
    const isCorrect = chosen === current.missing;
    const taskKey = `math:decomp:${current.total}:${current.visible}`;
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
      taskKeys: tasks.map((t) => `math:decomp:${t.total}:${t.visible}`),
      attempts: attempts.current,
    };
    onComplete(result);
  };

  if (!current) return null;
  const routeStep = feedback ? taskIndex + 1 : taskIndex;
  const ghostCount = current.total - current.visible;
  const blockSize = current.total <= 5 ? 60 : current.total <= 8 ? 50 : 42;

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
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-5xl font-body font-bold text-white text-center text-outlined">
            Welche Zahl fehlt?
          </div>
          <IconButton onClick={() => voice && audio.speak(voice.question)} aria-label="Frage vorlesen">
            <PixelIcon name="speaker" size={26} tone="white" />
          </IconButton>
        </div>

        {/* Visuelle Aufgabe: feste Blöcke + Geister-Slots */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
          <div className="flex gap-1.5">
            {Array.from({ length: current.visible }).map((_, i) => (
              <div key={i} className="animate-pop" style={{ animationDelay: `${i * 40}ms` }}>
                <PixelBlock color="blue" size={blockSize} />
              </div>
            ))}
          </div>
          <span className="font-pixel text-[36px] sm:text-[48px] text-white">+</span>
          <div className="flex gap-1.5">
            {Array.from({ length: ghostCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: blockSize,
                  height: blockSize,
                  border: '4px dashed rgba(255,255,255,0.4)',
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
          <span className="font-pixel text-[36px] sm:text-[48px] text-white">=</span>
          <span className="font-pixel text-[40px] sm:text-[56px] text-accent-coin">{current.total}</span>
        </div>

        {/* Symbolische Aufgabe als Text */}
        <div className="font-pixel text-[28px] sm:text-[36px] text-white/90">
          {current.visible} + ? = {current.total}
        </div>

        <div className="flex justify-center gap-5 mt-4">
          {current.options.map((opt) => (
            <AnswerButton
              key={opt}
              picked={picked === opt}
              isAnswer={opt === current.missing}
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

function generateTasks(count: number): DecompTask[] {
  const tasks: DecompTask[] = [];
  const seen = new Set<string>();
  // Targets: 5 und 10 (5er-/10er-Freunde, plus 6-9 für Variation)
  const TARGETS = [5, 6, 7, 8, 9, 10];
  while (tasks.length < count) {
    const total = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    const visible = Math.floor(Math.random() * (total - 1)) + 1; // 1..total-1
    const key = `${total}:${visible}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const missing = total - visible;
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const candidate = missing + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 2) + 1);
      if (candidate !== missing && candidate >= 0 && candidate <= 10) distractors.add(candidate);
    }
    tasks.push({ total, visible, missing, options: shuffle([missing, ...distractors]) });
  }
  return tasks;
}
