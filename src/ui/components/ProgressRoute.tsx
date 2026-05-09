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
 * Lauf-Strecke unten am Spiel-Bildschirm – volle Breite.
 * Charakter wandert links → rechts. Pro beantworteter Aufgabe ein Schritt weiter.
 * Klar erkennbare Checkpoint-Fahnen auf der Strecke.
 */
export default function ProgressRoute({ totalSteps, currentStep, character, lastResult }: Props) {
  const segments = Math.max(totalSteps - 1, 1);
  const characterPercent = (currentStep / segments) * 100;

  return (
    <div className="relative w-full select-none" style={{ height: 140 }}>
      {/* Boden */}
      <div className="absolute left-0 right-0 bottom-0" style={{ height: 28, background: '#7c2d12' }} />
      <div className="absolute left-0 right-0 bottom-7" style={{ height: 18, background: '#16a34a' }} />
      <div className="absolute left-0 right-0 bottom-[40px]" style={{ height: 4, background: '#22c55e' }} />

      {/* Bäume und Bushes auf der Strecke (zwischen Checkpoints) */}
      <div className="absolute" style={{ left: '8%', bottom: 36 }}>
        <TileSprite index={TILE.TREE_TALL} size={64} />
      </div>
      <div className="absolute" style={{ left: '38%', bottom: 36 }}>
        <TileSprite index={TILE.TREE_GREEN} size={56} />
      </div>
      <div className="absolute" style={{ left: '64%', bottom: 36 }}>
        <TileSprite index={TILE.TREE_AUTUMN} size={56} />
      </div>
      <div className="absolute" style={{ left: '90%', bottom: 36 }}>
        <TileSprite index={TILE.BUSH} size={40} />
      </div>

      {/* Checkpoints – große Pixel-Fahnen */}
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
            bottom: 120,
            transform: 'translateX(-50%)',
          }}
        >
          <PixelIcon name="check" size={36} />
        </div>
      )}
    </div>
  );
}

/**
 * Pixel-Fahne: bei reached = bunt mit Wimpel; sonst grau-leer.
 * Beim letzten Checkpoint wird ein Trophy-Icon gezeigt.
 */
function Checkpoint({ index, total, reached }: { index: number; total: number; reached: boolean }) {
  const isFinal = index === total - 1;
  if (isFinal) {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-amber-200 border-2 border-ink rounded-pixel px-1.5 mb-1">
          <PixelIcon name="trophy" size={32} />
        </div>
      </div>
    );
  }
  return <Flag reached={reached} />;
}

function Flag({ reached }: { reached: boolean }) {
  const flagFill = reached ? '#facc15' : '#cbd5e1';
  const flagShadow = reached ? '#a16207' : '#475569';
  return (
    <svg width="28" height="40" viewBox="0 0 14 20" style={{ shapeRendering: 'crispEdges' }}>
      {/* Mast */}
      <rect x="6" y="0" width="2" height="20" fill="#1f2937" />
      {/* Wimpel */}
      <rect x="8" y="2" width="6" height="6" fill={flagFill} />
      <rect x="8" y="8" width="4" height="2" fill={flagFill} />
      {/* Schatten unten am Wimpel */}
      <rect x="8" y="7" width="6" height="1" fill={flagShadow} />
      <rect x="8" y="9" width="4" height="1" fill={flagShadow} />
      {/* Outline */}
      <rect x="7" y="2" width="1" height="8" fill="#1f2937" />
      <rect x="14" y="2" width="1" height="6" fill="#1f2937" />
      <rect x="12" y="8" width="1" height="2" fill="#1f2937" />
      <rect x="8" y="1" width="6" height="1" fill="#1f2937" />
      <rect x="8" y="10" width="4" height="1" fill="#1f2937" />
      {/* Sockel */}
      <rect x="4" y="18" width="6" height="2" fill="#78350f" />
      <rect x="4" y="20" width="6" height="0" fill="#1f2937" />
    </svg>
  );
}
