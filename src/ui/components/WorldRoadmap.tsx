import { memo } from 'react';
import PixelCharacter from './PixelCharacter';
import PixelIcon, { type IconName } from './PixelIcon';
import type { CharacterConfig } from '@engine/avatar/character';
import type { LevelDefinition } from '@subjects/types';
import type { ProgressEntry } from '@engine/db/schema';

interface Props {
  levels: LevelDefinition[];
  progress: ProgressEntry[];
  character: CharacterConfig;
  onLevelTap: (level: LevelDefinition) => void;
  /** Subject-Theme für Landschaftsfarben & Landmark-Icons */
  theme?: 'math' | 'german';
}

interface NodeState {
  level: LevelDefinition;
  unlocked: boolean;
  stars: 0 | 1 | 2 | 3;
  position: { x: number; y: number };
  landmark: IconName;
}

/**
 * Mario-/Dragon-Quest-artige Welt-Karte mit Checkpoints.
 * Jeder Level ist ein Knoten auf einem geschwungenen Pfad.
 * Der Charakter steht auf dem höchsten freigeschalteten Knoten.
 */
export default memo(function WorldRoadmap({ levels, progress, character, onLevelTap, theme = 'math' }: Props) {
  const nodes = computeNodes(levels, progress, theme);
  const currentNodeIdx = computeCurrentNode(nodes);

  return (
    <div className="relative w-full max-w-5xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
      {/* Hintergrund-Szenerie */}
      <Scenery theme={theme} />

      {/* Pfad zwischen Knoten */}
      <PathSvg nodes={nodes} reachedIdx={currentNodeIdx} />

      {/* Knoten */}
      {nodes.map((node, i) => (
        <NodeMarker
          key={node.level.id}
          node={node}
          index={i}
          onTap={() => node.unlocked && onLevelTap(node.level)}
        />
      ))}

      {/* Charakter auf aktuellem Knoten */}
      {nodes[currentNodeIdx] && (
        <div
          className="absolute transition-all duration-700 ease-out pointer-events-none"
          style={{
            left: `${nodes[currentNodeIdx].position.x}%`,
            top: `${nodes[currentNodeIdx].position.y - 12}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="animate-bounce-slow">
            <PixelCharacter config={character} size={72} bg={null} />
          </div>
        </div>
      )}
    </div>
  );
});

function computeNodes(levels: LevelDefinition[], progress: ProgressEntry[], theme: 'math' | 'german'): NodeState[] {
  const POSITIONS: { x: number; y: number }[] = [
    { x: 12, y: 78 },
    { x: 30, y: 60 },
    { x: 45, y: 75 },
    { x: 60, y: 50 },
    { x: 72, y: 65 },
    { x: 85, y: 45 },
    { x: 92, y: 25 },
    { x: 78, y: 18 },
  ];
  const LANDMARKS: IconName[] = theme === 'math'
    ? ['home', 'plus', 'minus', 'equals', 'star', 'coin', 'trophy', 'gear']
    : ['home', 'star', 'heart', 'coin', 'trophy', 'gear', 'star', 'star'];

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
    };
  });
}

function computeCurrentNode(nodes: NodeState[]): number {
  // Charakter steht auf dem letzten freigeschalteten Knoten ohne 3 Sterne,
  // sonst auf dem ersten gesperrten / letzten Knoten.
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].unlocked && nodes[i].stars < 3) return i;
  }
  // Alle gemeistert → letzter Knoten
  return Math.max(0, nodes.length - 1);
}

function NodeMarker({ node, index, onTap }: { node: NodeState; index: number; onTap: () => void }) {
  const { unlocked, stars, position, landmark } = node;
  return (
    <button
      onClick={onTap}
      disabled={!unlocked}
      className="absolute pixel-btn border-ink shadow-pixel-md p-0 flex flex-col items-center justify-center transition-all"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: 72,
        height: 72,
        background: unlocked ? '#fbbf24' : '#3a3a4a',
        boxShadow: unlocked ? '0 6px 0 0 #92400e' : '0 4px 0 0 #1a1a1a',
        opacity: unlocked ? 1 : 0.7,
      }}
      aria-label={`Level ${index + 1}`}
    >
      <PixelIcon name={unlocked ? landmark : 'lock'} size={36} tone={unlocked ? 'ink' : 'default'} />
      {/* Sterne unter dem Knoten */}
      {unlocked && (
        <div className="absolute -bottom-7 flex gap-0.5">
          {[1, 2, 3].map((s) => (
            <PixelIcon key={s} name={stars >= s ? 'star' : 'star-empty'} size={14} />
          ))}
        </div>
      )}
    </button>
  );
}

function PathSvg({ nodes, reachedIdx }: { nodes: NodeState[]; reachedIdx: number }) {
  if (nodes.length < 2) return null;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {nodes.slice(0, -1).map((node, i) => {
        const next = nodes[i + 1];
        const dots = generateDots(node.position, next.position, 8);
        const passed = i < reachedIdx;
        return (
          <g key={i}>
            {dots.map((d, di) => (
              <circle
                key={di}
                cx={d.x}
                cy={d.y}
                r="0.7"
                fill={passed ? '#fbbf24' : '#ffffff'}
                opacity={passed ? 0.95 : 0.5}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function generateDots(a: { x: number; y: number }, b: { x: number; y: number }, count: number) {
  const dots = [];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    dots.push({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });
  }
  return dots;
}

function Scenery({ theme }: { theme: 'math' | 'german' }) {
  const sky = theme === 'math'
    ? 'linear-gradient(180deg, #1e3a8a 0%, #4338ca 60%, #6366f1 100%)'
    : 'linear-gradient(180deg, #064e3b 0%, #065f46 60%, #14532d 100%)';

  return (
    <div className="absolute inset-0 rounded-chunk overflow-hidden border-4 border-ink shadow-pixel-md shadow-ink" style={{ background: sky }}>
      {/* Boden / Wiese */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%]" style={{
        background: 'linear-gradient(180deg, #16a34a 0%, #15803d 70%, #14532d 100%)',
      }} />
      {/* Pixelige Bergsilhouetten */}
      <svg className="absolute bottom-[40%] left-0 right-0 w-full" viewBox="0 0 100 16" preserveAspectRatio="none" style={{ height: '18%' }}>
        <polygon points="0,16 8,8 14,12 22,4 32,10 40,6 50,12 60,4 72,10 80,6 90,12 100,8 100,16" fill="#312e81" />
        <polygon points="0,16 6,12 12,14 20,10 30,13 38,11 50,14 60,11 70,14 78,12 88,15 100,13 100,16" fill="#1e1b4b" opacity="0.7" />
      </svg>
      {/* Schwebende Themen-Symbole im Himmel */}
      {(theme === 'math' ? ['1', '2', '3', '+', '−', '7', '5'] : ['A', 'B', 'C', 'D', 'M']).map((char, i) => (
        <span
          key={i}
          className="absolute font-pixel text-white/30 select-none"
          style={{
            left: `${10 + (i * 13) % 80}%`,
            top: `${5 + (i * 7) % 25}%`,
            fontSize: 16 + (i % 3) * 6,
            transform: `rotate(${-15 + i * 5}deg)`,
            textShadow: '3px 3px 0 rgba(0,0,0,0.4)',
          }}
        >
          {char}
        </span>
      ))}
      {/* Sonne */}
      <div className="absolute top-[8%] right-[8%] w-12 h-12 bg-accent-coin border-4 border-ink rounded-full shadow-amber-700 shadow-pixel-md" />
    </div>
  );
}
