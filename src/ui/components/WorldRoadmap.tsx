import { memo, useEffect, useMemo, useRef } from 'react';
import PixelCharacter from './PixelCharacter';
import PixelIcon from './PixelIcon';
import MapLandmark, { type LandmarkKind } from './MapLandmark';
import { sfx } from '@engine/audio/SoundPlayer';
import type { CharacterConfig } from '@engine/avatar/character';
import type { LevelDefinition } from '@subjects/types';
import type { ProgressEntry } from '@engine/db/schema';

interface Props {
  levels: LevelDefinition[];
  progress: ProgressEntry[];
  character: CharacterConfig;
  onLevelTap: (level: LevelDefinition) => void;
  theme?: 'math' | 'german';
}

interface NodeState {
  level: LevelDefinition;
  unlocked: boolean;
  stars: 0 | 1 | 2 | 3;
  position: { x: number; y: number };
  landmark: LandmarkKind;
  number: number;
}

/**
 * Mario-/Dragon-Quest-Welt-Karte mit Pixel-Landmarks pro Checkpoint.
 * Geschwungener Pfad, animierter Charakter, drift­ende Wolken.
 */
export default memo(function WorldRoadmap({ levels, progress, character, onLevelTap, theme = 'math' }: Props) {
  const nodes = computeNodes(levels, progress);
  const currentNodeIdx = computeCurrentNode(nodes);
  const prevIdxRef = useRef(currentNodeIdx);

  // Sound, wenn der Charakter zu einem neuen Knoten wandert
  useEffect(() => {
    if (prevIdxRef.current !== currentNodeIdx) {
      sfx.checkpoint();
      prevIdxRef.current = currentNodeIdx;
    }
  }, [currentNodeIdx]);

  return (
    <div className="relative w-full max-w-6xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
      <Scenery theme={theme} />
      <PathSvg nodes={nodes} reachedIdx={currentNodeIdx} />
      <Decorations />

      {/* Knoten als Pixel-Landmarks */}
      {nodes.map((node, i) => (
        <NodeMarker key={node.level.id} node={node} index={i} onTap={() => node.unlocked && onLevelTap(node.level)} />
      ))}

      {/* Charakter auf aktuellem Knoten */}
      {nodes[currentNodeIdx] && (
        <div
          className="absolute pointer-events-none transition-all ease-out"
          style={{
            left: `${nodes[currentNodeIdx].position.x}%`,
            top: `${nodes[currentNodeIdx].position.y - 14}%`,
            transform: 'translate(-50%, -100%)',
            transitionDuration: '900ms',
            zIndex: 10,
          }}
        >
          <div className="animate-bounce-slow">
            <PixelCharacter config={character} size={64} bg={null} />
          </div>
          {/* Schatten unter dem Charakter */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -4,
              width: 38,
              height: 8,
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
            }}
          />
        </div>
      )}
    </div>
  );
});

function computeNodes(levels: LevelDefinition[], progress: ProgressEntry[]): NodeState[] {
  // Geschwungene Pfad-Positionen quer durch die Karte
  const POSITIONS: { x: number; y: number }[] = [
    { x: 10, y: 78 },
    { x: 24, y: 62 },
    { x: 38, y: 78 },
    { x: 52, y: 60 },
    { x: 64, y: 76 },
    { x: 76, y: 56 },
    { x: 86, y: 36 },
    { x: 92, y: 18 },
  ];
  const LANDMARKS: LandmarkKind[] = ['start_house', 'split_tree', 'plus_monument', 'minus_cave', 'tower', 'bridge', 'mountain', 'castle'];

  return levels.map((level, i) => {
    const entry = progress.find((p) => p.levelId === level.id);
    const previous = i > 0 ? levels[i - 1] : null;
    const previousEntry = previous ? progress.find((p) => p.levelId === previous.id) : null;
    const unlocked = i === 0 || (previousEntry?.stars ?? 0) >= 1;
    const stars = (entry?.stars ?? 0) as 0 | 1 | 2 | 3;
    return {
      level,
      unlocked,
      stars,
      position: POSITIONS[i % POSITIONS.length],
      landmark: LANDMARKS[i % LANDMARKS.length],
      number: i + 1,
    };
  });
}

function computeCurrentNode(nodes: NodeState[]): number {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].unlocked && nodes[i].stars < 3) return i;
  }
  return Math.max(0, nodes.length - 1);
}

function NodeMarker({ node, index, onTap }: { node: NodeState; index: number; onTap: () => void }) {
  const { unlocked, stars, position, landmark, number } = node;

  return (
    <button
      onClick={onTap}
      disabled={!unlocked}
      className="absolute flex flex-col items-center group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -100%)',
        zIndex: 5,
      }}
      aria-label={`Level ${index + 1}`}
    >
      {/* Numbered badge */}
      <div
        className={`absolute -top-2 -right-3 w-8 h-8 rounded-full border-4 border-ink flex items-center justify-center font-pixel text-[12px] z-10
          ${unlocked ? 'bg-accent-coin text-ink' : 'bg-bg-card text-white/40'}`}
      >
        {number}
      </div>
      {/* Landmark-Sprite */}
      <div className={`transition-transform ${unlocked ? 'group-hover:scale-110 group-active:scale-95' : ''}`}>
        <MapLandmark kind={landmark} size={88} unlocked={unlocked} />
      </div>
      {/* Sterne unter dem Knoten */}
      {unlocked ? (
        <div className="flex gap-0.5 mt-1 bg-bg-deep/70 rounded-pixel border-2 border-ink px-1 py-0.5">
          {[1, 2, 3].map((s) => (
            <PixelIcon key={s} name={stars >= s ? 'star' : 'star-empty'} size={12} />
          ))}
        </div>
      ) : (
        <div className="mt-1 bg-bg-deep/70 rounded-pixel border-2 border-ink px-2 py-0.5">
          <PixelIcon name="lock" size={14} />
        </div>
      )}
    </button>
  );
}

/**
 * Geschwungener Pfad zwischen Knoten via SVG-Bezier-Kurven.
 * Zwischen zwei Knoten wird eine quadratische Kurve mit Kontrollpunkt
 * leicht versetzt gezeichnet, sodass es organischer wirkt.
 */
function PathSvg({ nodes, reachedIdx }: { nodes: NodeState[]; reachedIdx: number }) {
  if (nodes.length < 2) return null;
  const segments = useMemo(() => {
    return nodes.slice(0, -1).map((a, i) => {
      const b = nodes[i + 1];
      const midX = (a.position.x + b.position.x) / 2;
      const midY = (a.position.y + b.position.y) / 2;
      // Kontrollpunkt leicht über/unter dem Mittelpunkt für Schwung
      const offset = i % 2 === 0 ? -4 : 6;
      const ctrlX = midX;
      const ctrlY = midY + offset;
      return {
        d: `M ${a.position.x} ${a.position.y} Q ${ctrlX} ${ctrlY}, ${b.position.x} ${b.position.y}`,
        passed: i < reachedIdx,
      };
    });
  }, [nodes, reachedIdx]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 2 }}
    >
      {segments.map((seg, i) => (
        <g key={i}>
          {/* Untergrund-Pfad: dunkler, dicker */}
          <path
            d={seg.d}
            fill="none"
            stroke={seg.passed ? '#fbbf24' : '#1e1b4b'}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Punktierte Linie obendrauf */}
          <path
            d={seg.d}
            fill="none"
            stroke={seg.passed ? '#fef08a' : '#ffffff'}
            strokeWidth="0.6"
            strokeDasharray="0.5,1.6"
            strokeLinecap="round"
            opacity={seg.passed ? 0.95 : 0.5}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Hintergrund-Szenerie: gradienter Himmel, fernes Bergsilhouette,
 * drift­ende Wolken, Wiese mit Hügeln, Sonne.
 */
function Scenery({ theme }: { theme: 'math' | 'german' }) {
  const sky = theme === 'math'
    ? 'linear-gradient(180deg, #38bdf8 0%, #818cf8 60%, #c084fc 100%)'
    : 'linear-gradient(180deg, #4ade80 0%, #34d399 60%, #14b8a6 100%)';

  return (
    <div
      className="absolute inset-0 rounded-chunk overflow-hidden border-4 border-ink shadow-pixel-md shadow-ink"
      style={{ background: sky }}
    >
      {/* Sonne */}
      <div
        className="absolute"
        style={{
          top: '6%',
          right: '8%',
          width: 56,
          height: 56,
          background: 'radial-gradient(circle, #fef08a 0%, #facc15 60%, #f59e0b 100%)',
          borderRadius: '50%',
          border: '4px solid #0a0a14',
          boxShadow: '0 0 20px #facc15',
        }}
      />

      {/* Driftende Wolken */}
      <Cloud x={15} y={10} size={1} delay={0} />
      <Cloud x={45} y={6} size={1.2} delay={5} />
      <Cloud x={70} y={12} size={0.9} delay={10} />
      <Cloud x={85} y={20} size={1.1} delay={2} />

      {/* Ferne Berge */}
      <svg className="absolute left-0 right-0 w-full" viewBox="0 0 100 22" preserveAspectRatio="none" style={{ bottom: '40%', height: '20%' }}>
        <polygon points="0,22 6,12 12,16 20,8 30,14 40,10 52,15 62,8 74,13 84,9 94,14 100,11 100,22" fill="#5b21b6" opacity="0.9" />
      </svg>
      <svg className="absolute left-0 right-0 w-full" viewBox="0 0 100 18" preserveAspectRatio="none" style={{ bottom: '40%', height: '14%' }}>
        <polygon points="0,18 8,10 14,13 24,5 34,11 44,7 56,12 66,5 78,10 88,7 100,12 100,18" fill="#4338ca" />
      </svg>

      {/* Wiese mit Hügelschicht */}
      <div className="absolute left-0 right-0 bottom-0" style={{
        height: '40%',
        background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 70%, #14532d 100%)',
      }} />
      <svg className="absolute left-0 right-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none" style={{ bottom: '36%', height: '8%' }}>
        <path d="M 0 12 Q 12 0 25 6 T 50 8 T 75 4 T 100 8 L 100 12 Z" fill="#16a34a" opacity="0.7" />
      </svg>

      {/* Pixelige Sterne im Himmel als Detail */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 25% 15%, #ffffff 0 1px, transparent 2px), radial-gradient(circle at 60% 8%, #ffffff 0 1px, transparent 2px), radial-gradient(circle at 88% 30%, #ffffff 0 1px, transparent 2px)',
        backgroundSize: '180px 180px',
      }} />
    </div>
  );
}

function Cloud({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `cloud-drift 60s linear ${delay}s infinite`,
      }}
    >
      <div
        style={{
          width: 56 * size,
          height: 24 * size,
          background: '#ffffff',
          border: '3px solid #0a0a14',
          borderRadius: '999px',
          opacity: 0.9,
        }}
      />
      <style>{CLOUD_KEYFRAMES}</style>
    </div>
  );
}

const CLOUD_KEYFRAMES = `
@keyframes cloud-drift {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(40px); }
  100% { transform: translateX(0); }
}
`;

/**
 * Statische Pixel-Dekorationen: Bäume, Büsche, Steine zwischen den Knoten.
 */
function Decorations() {
  return (
    <>
      <Tree x={6} y={62} />
      <Tree x={32} y={70} />
      <Bush x={18} y={86} />
      <Bush x={48} y={84} />
      <Bush x={68} y={82} />
      <Tree x={58} y={70} />
      <Stone x={42} y={88} />
      <Stone x={82} y={66} />
    </>
  );
}

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)', zIndex: 1 }}
    >
      <svg width="40" height="56" viewBox="0 0 20 28" style={sr}>
        <rect x="8" y="20" width="4" height="8" fill="#5b3a1a" />
        <rect x="8" y="20" width="1" height="8" fill="#3e2710" />
        <polygon points="10,2 2,18 18,18" fill="#16a34a" stroke="#0a0a14" strokeWidth="0.5" />
        <polygon points="10,8 4,20 16,20" fill="#22c55e" stroke="#0a0a14" strokeWidth="0.5" />
        <rect x="9" y="14" width="1" height="1" fill="#86efac" />
      </svg>
    </div>
  );
}

function Bush({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: 1 }}>
      <svg width="36" height="20" viewBox="0 0 18 10" style={sr}>
        <rect x="2" y="4" width="14" height="6" fill="#16a34a" />
        <rect x="0" y="6" width="18" height="4" fill="#16a34a" />
        <rect x="2" y="4" width="14" height="1" fill="#86efac" />
        <rect x="0" y="9" width="18" height="1" fill="#0a0a14" />
        <rect x="0" y="6" width="1" height="3" fill="#0a0a14" />
        <rect x="17" y="6" width="1" height="3" fill="#0a0a14" />
      </svg>
    </div>
  );
}

function Stone({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: 1 }}>
      <svg width="24" height="16" viewBox="0 0 12 8" style={sr}>
        <rect x="1" y="3" width="10" height="5" fill="#94a3b8" />
        <rect x="1" y="3" width="10" height="1" fill="#cbd5e1" />
        <rect x="0" y="4" width="1" height="4" fill="#475569" />
        <rect x="11" y="4" width="1" height="4" fill="#475569" />
        <rect x="1" y="7" width="10" height="1" fill="#0a0a14" />
      </svg>
    </div>
  );
}

const sr = { shapeRendering: 'crispEdges' as const, imageRendering: 'pixelated' as const };
