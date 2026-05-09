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
import AnswerButton from '@ui/components/AnswerButton';
import type { LevelProps, LevelResult } from '@subjects/types';

type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle';

interface BaseTask {
  question: string;
  audioPrompt: string;
  options: string[];
  answer: string;
  visual: () => React.ReactNode;
  taskKey: string;
}

/**
 * Welt 1, Level 1.8 – Geometrie, Geld, Uhr (Mix-Level)
 * Letzter Stop in Klasse 1: bunte Mischung aus
 *  - Formen erkennen (Kreis, Dreieck, Quadrat, Rechteck)
 *  - Geld zählen (1ct + 2ct = ?)
 *  - Volle Stunde von der Uhr ablesen
 */
export default function Level1_8_Shapes_Money_Time({ onComplete, onExit }: LevelProps) {
  const profile = useAppStore((s) => s.activeProfile);
  const [taskIndex, setTaskIndex] = useState(0);
  const correctRef = useRef(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const attempts = useRef<{ taskKey: string; correct: boolean }[]>([]);
  const tasks = useMemo(() => generateTasks(), []);
  const current = tasks[taskIndex];

  useEffect(() => {
    if (current) audio.speak(current.audioPrompt);
  }, [taskIndex, current]);

  const handleAnswer = async (chosen: string) => {
    if (feedback || !current) return;
    const isCorrect = chosen === current.answer;
    attempts.current.push({ taskKey: current.taskKey, correct: isCorrect });
    if (profile) await recordAttempt(profile.id, 'math', current.taskKey, isCorrect);

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
    onComplete({
      correct: correctCount,
      total,
      durationMs,
      stars,
      taskKeys: tasks.map((t) => t.taskKey),
      attempts: attempts.current,
    } satisfies LevelResult);
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
        <div className="flex items-center gap-3 max-w-4xl">
          <div className="text-2xl sm:text-4xl font-body font-bold text-white text-center text-outlined">
            {current.question}
          </div>
          <IconButton onClick={() => audio.speak(current.audioPrompt)} aria-label="Frage vorlesen">
            <PixelIcon name="speaker" size={26} tone="white" />
          </IconButton>
        </div>

        <div className="animate-pop">{current.visual()}</div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2 max-w-3xl">
          {current.options.map((opt) => {
            const isCorrect = feedback === 'correct' && opt === current.answer;
            const reveal = feedback === 'wrong' && opt === current.answer;
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className={`pixel-btn border-ink rounded-chunk shadow-pixel-md min-w-[140px] h-20 px-5 font-pixel text-[14px] sm:text-[16px] text-white transition-colors
                  ${isCorrect || reveal
                    ? 'bg-accent-success shadow-emerald-900'
                    : 'bg-primary-500 active:bg-primary-600 shadow-ink-soft'}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
      {profile && (
        <ProgressRoute totalSteps={tasks.length + 1} currentStep={routeStep} character={profile.character} lastResult={feedback} />
      )}
    </div>
  );
}

// ─── Visualisierungen ───────────────────────────────────────────────────

function Shape({ type, color = '#facc15' }: { type: ShapeType; color?: string }) {
  const stroke = '#0a0a14';
  const sw = 4;
  switch (type) {
    case 'circle':
      return (
        <svg width="160" height="160" viewBox="0 0 64 64" style={{ shapeRendering: 'crispEdges' }}>
          <rect x="22" y="8" width="20" height="48" fill={color} />
          <rect x="14" y="14" width="36" height="36" fill={color} />
          <rect x="8" y="22" width="48" height="20" fill={color} />
          <rect x="22" y="6" width="20" height="2" fill={stroke} />
          <rect x="22" y="56" width="20" height="2" fill={stroke} />
          <rect x="6" y="22" width="2" height="20" fill={stroke} />
          <rect x="56" y="22" width="2" height="20" fill={stroke} />
          <rect x="14" y="12" width="8" height="2" fill={stroke} />
          <rect x="42" y="12" width="8" height="2" fill={stroke} />
          <rect x="14" y="50" width="8" height="2" fill={stroke} />
          <rect x="42" y="50" width="8" height="2" fill={stroke} />
          <rect x="8" y="14" width="2" height="8" fill={stroke} />
          <rect x="54" y="14" width="2" height="8" fill={stroke} />
          <rect x="8" y="42" width="2" height="8" fill={stroke} />
          <rect x="54" y="42" width="2" height="8" fill={stroke} />
        </svg>
      );
    case 'square':
      return (
        <svg width="160" height="160" viewBox="0 0 64 64" style={{ shapeRendering: 'crispEdges' }}>
          <rect x="8" y="8" width="48" height="48" fill={color} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width="200" height="120" viewBox="0 0 80 48" style={{ shapeRendering: 'crispEdges' }}>
          <rect x="4" y="6" width="72" height="36" fill={color} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width="160" height="160" viewBox="0 0 64 64" style={{ shapeRendering: 'crispEdges' }}>
          <polygon points="32,6 4,56 60,56" fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="miter" />
        </svg>
      );
  }
}

function Coin({ value }: { value: 1 | 2 | 5 | 10 }) {
  return (
    <div
      className="rounded-full border-4 border-amber-700 flex items-center justify-center"
      style={{
        width: 80,
        height: 80,
        background: 'radial-gradient(circle, #fef08a 0%, #fbbf24 60%, #d97706 100%)',
      }}
    >
      <span className="font-pixel text-[16px] text-amber-900">{value}ct</span>
    </div>
  );
}

function Clock({ hour }: { hour: number }) {
  const angle = ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  const x = 50 + Math.cos(angle) * 28;
  const y = 50 + Math.sin(angle) * 28;
  return (
    <svg width="180" height="180" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }}>
      <circle cx="50" cy="50" r="46" fill="#fef9c3" stroke="#0a0a14" strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
        const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
        const lx = 50 + Math.cos(a) * 36;
        const ly = 50 + Math.sin(a) * 36;
        return <text key={h} x={lx} y={ly + 3} textAnchor="middle" fill="#0a0a14" fontFamily="Press Start 2P" fontSize="6">{h === 0 ? 12 : h}</text>;
      })}
      <line x1="50" y1="50" x2={x} y2={y} stroke="#dc2626" strokeWidth="4" strokeLinecap="square" />
      <circle cx="50" cy="50" r="3" fill="#0a0a14" />
    </svg>
  );
}

// ─── Aufgaben-Generator ──────────────────────────────────────────────────

function generateTasks(): BaseTask[] {
  const all: BaseTask[] = [
    // Formen
    {
      question: 'Welche Form ist das?',
      audioPrompt: 'Welche Form ist das?',
      taskKey: 'math:shape:circle',
      visual: () => <Shape type="circle" color="#f87171" />,
      answer: 'Kreis',
      options: shuffle(['Kreis', 'Quadrat', 'Dreieck']),
    },
    {
      question: 'Welche Form ist das?',
      audioPrompt: 'Welche Form ist das?',
      taskKey: 'math:shape:square',
      visual: () => <Shape type="square" color="#60a5fa" />,
      answer: 'Quadrat',
      options: shuffle(['Quadrat', 'Rechteck', 'Dreieck']),
    },
    {
      question: 'Welche Form ist das?',
      audioPrompt: 'Welche Form ist das?',
      taskKey: 'math:shape:triangle',
      visual: () => <Shape type="triangle" color="#34d399" />,
      answer: 'Dreieck',
      options: shuffle(['Kreis', 'Dreieck', 'Rechteck']),
    },
    {
      question: 'Welche Form ist das?',
      audioPrompt: 'Welche Form ist das?',
      taskKey: 'math:shape:rectangle',
      visual: () => <Shape type="rectangle" color="#a78bfa" />,
      answer: 'Rechteck',
      options: shuffle(['Quadrat', 'Rechteck', 'Kreis']),
    },
    // Geld
    {
      question: 'Wie viel Geld ist das zusammen?',
      audioPrompt: 'Wie viel Geld ist das zusammen?',
      taskKey: 'math:money:1+2',
      visual: () => (
        <div className="flex gap-3">
          <Coin value={1} />
          <Coin value={2} />
        </div>
      ),
      answer: '3 Cent',
      options: shuffle(['3 Cent', '12 Cent', '21 Cent']),
    },
    {
      question: 'Wie viel Geld ist das zusammen?',
      audioPrompt: 'Wie viel Geld ist das zusammen?',
      taskKey: 'math:money:5+5',
      visual: () => (
        <div className="flex gap-3">
          <Coin value={5} />
          <Coin value={5} />
        </div>
      ),
      answer: '10 Cent',
      options: shuffle(['10 Cent', '15 Cent', '5 Cent']),
    },
    // Uhr
    {
      question: 'Welche Uhrzeit zeigt die Uhr?',
      audioPrompt: 'Welche Uhrzeit zeigt die Uhr?',
      taskKey: 'math:clock:3',
      visual: () => <Clock hour={3} />,
      answer: '3 Uhr',
      options: shuffle(['3 Uhr', '9 Uhr', '4 Uhr']),
    },
    {
      question: 'Welche Uhrzeit zeigt die Uhr?',
      audioPrompt: 'Welche Uhrzeit zeigt die Uhr?',
      taskKey: 'math:clock:7',
      visual: () => <Clock hour={7} />,
      answer: '7 Uhr',
      options: shuffle(['7 Uhr', '5 Uhr', '11 Uhr']),
    },
  ];
  // Zufällige Auswahl von 5 (Mix aus allen Kategorien)
  return shuffle(all).slice(0, 5);
}
