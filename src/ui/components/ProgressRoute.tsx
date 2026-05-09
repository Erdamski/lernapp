import PixelCharacter from './PixelCharacter';
import PixelIcon from './PixelIcon';
import TileSprite, { TILE } from './TileSprite';
import type { CharacterConfig } from '@engine/avatar/character';

interface Props {
  totalSteps: number;
  currentStep: number;
  character: CharacterConfig;
  lastResult?: 'correct' | 'wrong' | null;
}

/**
 * Lauf-Strecke unten am Spiel-Bildschirm – spannt sich über die volle Breite.
 * Charakter wandert links → rechts. Pro beantworteter Aufgabe ein Schritt weiter.
 * Bäume aus Tiny Town schmücken die Strecke (statt im Hintergrund).
 */
export default function ProgressRoute({ totalSteps, currentStep, character, lastResult }: Props) {
  const segments = Math.max(totalSteps - 1, 1);
  const characterPercent = (currentStep / segments) * 100;

  return (
    <div className="relative w-full select-none" style={{ height: 130 }}>
      {/* Boden – durchgehende Wiese mit Erd-Sockel */}
      <div className="absolute left-0 right-0 bottom-0" style={{ height: 28, background: '#7c2d12' }} />
      <div className="absolute left-0 right-0 bottom-7" style={{ height: 18, background: '#16a34a' }} />
      <div className="absolute left-0 right-0 bottom-[40px]" style={{ height: 4, background: '#22c55e' }} />

      {/* Bäume und Bushes auf der Strecke */}
      <div className="absolute" style={{ left: '4%', bottom: 36 }}>
        <TileSprite index={TILE.TREE_TALL} size={64} />
      </div>
      <div className="absolute" style={{ left: '14%', bottom: 36 }}>
        <TileSprite index={TILE.BUSH} size={40} />
      </div>
      <div className="absolute" style={{ left: '34%', bottom: 36 }}>
        <TileSprite index={TILE.TREE_GREEN} size={56} />
      </div>
      <div className="absolute" style={{ left: '52%', bottom: 36 }}>
        <TileSprite index={TILE.FLOWER_PATCH} size={36} />
      </div>
      <div className="absolute" style={{ left: '68%', bottom: 36 }}>
        <TileSprite index={TILE.TREE_AUTUMN} size={56} />
      </div>
      <div className="absolute" style={{ left: '88%', bottom: 36 }}>
        <TileSprite index={TILE.BUSH} size={40} />
      </div>

      {/* Checkpoints */}
      <div className="absolute left-2 right-2 flex justify-between items-end" style={{ bottom: 50 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Checkpoint key={i} index={i} total={totalSteps} reached={i < currentStep} />
        ))}
      </div>

      {/* Charakter wandert mit smoother Transition */}
      <div
        className="absolute transition-all duration-700 ease-out"
        style={{
          left: `calc(${characterPercent}% + 8px)`,
          bottom: 56,
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <div className={lastResult === 'correct' ? 'animate-bounce-slow' : ''}>
          <PixelCharacter config={character} size={64} bg={null} />
        </div>
      </div>

      {/* Status-Effekt am letzten erledigten Knoten */}
      {lastResult === 'correct' && currentStep > 0 && (
        <div
          className="absolute animate-pop pointer-events-none"
          style={{
            left: `calc(${((currentStep - 1) / segments) * 100}% + 8px)`,
            bottom: 110,
            transform: 'translateX(-50%)',
          }}
        >
          <PixelIcon name="check" size={28} />
        </div>
      )}
    </div>
  );
}

function Checkpoint({ index, total, reached }: { index: number; total: number; reached: boolean }) {
  const isFinal = index === total - 1;
  if (isFinal) return <PixelIcon name="trophy" size={32} />;
  return <PixelIcon name={reached ? 'star' : 'star-empty'} size={20} />;
}
