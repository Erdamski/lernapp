import PixelCharacter from './PixelCharacter';
import PixelIcon from './PixelIcon';
import type { CharacterConfig } from '@engine/avatar/character';

interface Props {
  totalSteps: number;
  currentStep: number;       // 0-basiert; aktuelle Position
  character: CharacterConfig;
  /** Optional: zeigt einen "korrekt"-Effekt am letzten erledigten Checkpoint */
  lastResult?: 'correct' | 'wrong' | null;
}

/**
 * Horizontale Lauf-Strecke: Charakter wandert von links nach rechts,
 * pro beantwortete Aufgabe einen Checkpoint weiter. Am Ende wartet ein Pokal.
 *
 * Visuell: pixelige Grasfläche unten, Checkpoints als Stern-Pfähle,
 * Charakter als animierte PixelCharacter-Komponente.
 */
export default function ProgressRoute({ totalSteps, currentStep, character, lastResult }: Props) {
  const segments = Math.max(totalSteps - 1, 1);
  const characterPercent = (currentStep / segments) * 100;

  return (
    <div className="relative w-full max-w-3xl mx-auto h-28 select-none">
      {/* Himmel/leerer Bereich */}
      <div className="absolute inset-0" />

      {/* Boden – pixelige Grasfläche */}
      <div className="absolute left-0 right-0 bottom-0 h-6 bg-amber-800 border-t-4 border-ink" />
      <div className="absolute left-0 right-0 bottom-6 h-3 bg-emerald-600 border-t-2 border-emerald-800" />
      <div className="absolute left-0 right-0 bottom-9 h-1 bg-emerald-400 opacity-60" />

      {/* Checkpoints */}
      <div className="absolute left-2 right-2 bottom-9 flex justify-between items-end">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Checkpoint key={i} index={i} total={totalSteps} reached={i < currentStep} />
        ))}
      </div>

      {/* Charakter */}
      <div
        className="absolute bottom-8 transition-all duration-700 ease-out"
        style={{
          left: `calc(${characterPercent}% + 8px)`,
          transform: 'translateX(-50%)',
        }}
      >
        <div className={lastResult === 'correct' ? 'animate-bounce-slow' : ''}>
          <PixelCharacter config={character} size={64} bg={null} />
        </div>
      </div>

      {/* Status-Effekt */}
      {lastResult === 'correct' && currentStep > 0 && (
        <div
          className="absolute bottom-20 animate-pop pointer-events-none"
          style={{
            left: `calc(${((currentStep - 1) / segments) * 100}% + 8px)`,
            transform: 'translateX(-50%)',
          }}
        >
          <PixelIcon name="check" size={32} />
        </div>
      )}
    </div>
  );
}

function Checkpoint({ index, total, reached }: { index: number; total: number; reached: boolean }) {
  const isFinal = index === total - 1;
  if (isFinal) {
    return (
      <div className="flex flex-col items-center gap-1">
        <PixelIcon name="trophy" size={36} />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Pfahl */}
      <PixelIcon name={reached ? 'star' : 'star-empty'} size={20} />
    </div>
  );
}
