import { memo, useEffect, useMemo, useRef } from 'react';
import PixelCharacter from './PixelCharacter';
import PixelIcon from './PixelIcon';
import TileSprite, { TILE } from './TileSprite';
import { sfx } from '@engine/audio/SoundPlayer';
import type { CharacterConfig } from '@engine/avatar/character';
import type { LevelDefinition } from '@subjects/types';
import type { ProgressEntry } from '@engine/db/schema';

interface Props {
  levels: LevelDefinition[];
  progress: ProgressEntry[];
  character: CharacterConfig;
  onLevelTap: (level: LevelDefinition) => void;
}

interface NodeState {
  level: LevelDefinition;
  unlocked: boolean;
  stars: 0 | 1 | 2 | 3;
  /** Tile-Koordinaten im Grid (x = column, y = row) */
  tileX: number;
  tileY: number;
  number: number;
}

// ─── Welt-Layout ──────────────────────────────────────────────────────
// 24×14 Tile-Grid. Jeder Eintrag = Tile-Index aus Tiny Town (TileSprite.TILE).
// 'g' = Standard-Grass, 'G' = Grass mit Blümchen, '.' = leerer Slot
// (wird als Grass gerendert, nur Marker für Lesbarkeit). Sonderwerte:
//   T = Baum tall, t = Baum klein, B = Bush, P = Path, F = Flower, H = House marker
const WORLD_W = 24;
const WORLD_H = 14;

// Layout der Hintergrund-Tiles (nur Terrain, Häuser werden separat platziert)
function buildTerrain(): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < WORLD_H; y++) {
    const row: number[] = [];
    for (let x = 0; x < WORLD_W; x++) {
      // Pseudo-zufällige Grass-Variante für Vielfalt
      const seed = (x * 7 + y * 13) % 11;
      if (seed === 0) row.push(TILE.GRASS_FLOWERS_A);
      else if (seed === 3) row.push(TILE.GRASS_DOTS);
      else row.push(TILE.GRASS);
    }
    grid.push(row);
  }
  // Streue Bäume und Bushes deterministisch (kein Noise-Generator nötig).
  // Vermeide die Korridor-Bereiche, in denen die Path / Häuser liegen.
  const TREE_POSITIONS: { x: number; y: number; tile: number }[] = [
    { x: 1, y: 1, tile: TILE.TREE_TALL },
    { x: 5, y: 1, tile: TILE.TREE_GREEN },
    { x: 19, y: 1, tile: TILE.TREE_AUTUMN },
    { x: 22, y: 2, tile: TILE.TREE_TALL },
    { x: 0, y: 6, tile: TILE.TREE_SAPLING },
    { x: 3, y: 11, tile: TILE.TREE_GREEN },
    { x: 11, y: 12, tile: TILE.TREE_AUTUMN },
    { x: 17, y: 11, tile: TILE.TREE_TALL },
    { x: 22, y: 12, tile: TILE.TREE_SAPLING },
    { x: 14, y: 2, tile: TILE.TREE_GREEN },
    { x: 8, y: 4, tile: TILE.BUSH },
    { x: 14, y: 8, tile: TILE.BUSH },
    { x: 4, y: 7, tile: TILE.FLOWER_PATCH },
    { x: 19, y: 7, tile: TILE.FLOWER_PATCH },
    { x: 12, y: 4, tile: TILE.FLOWER_PATCH },
  ];
  for (const t of TREE_POSITIONS) {
    if (grid[t.y] && grid[t.y][t.x] !== undefined) grid[t.y][t.x] = t.tile;
  }
  return grid;
}

// Checkpoint-Positionen (Tile-Koordinaten). Als Schlange durch die Welt gelegt.
const CHECKPOINTS: { x: number; y: number }[] = [
  { x: 3, y: 9 },
  { x: 7, y: 6 },
  { x: 11, y: 9 },
  { x: 15, y: 6 },
  { x: 19, y: 9 },
  { x: 21, y: 5 },
  { x: 17, y: 3 },
  { x: 13, y: 1 },
];

/**
 * Mario-/Dragon-Quest-Welt-Karte basierend auf Kenney Tiny Town Tiles.
 * Top-Down 3/4-Ansicht mit echten Pixel-Sprites.
 */
export default memo(function WorldRoadmap({ levels, progress, character, onLevelTap }: Props) {
  const nodes = computeNodes(levels, progress);
  const currentNodeIdx = computeCurrentNode(nodes);
  const prevIdxRef = useRef(currentNodeIdx);
  const terrain = useMemo(() => buildTerrain(), []);

  useEffect(() => {
    if (prevIdxRef.current !== currentNodeIdx) {
      sfx.checkpoint();
      prevIdxRef.current = currentNodeIdx;
    }
  }, [currentNodeIdx]);

  // Tile-Größe: passt sich an Container an. 36px ist ein guter Kompromiss
  // (16px Native × 2.25). Auf Mobile kann's weniger werden.
  const tileSize = 36;
  const mapW = WORLD_W * tileSize;
  const mapH = WORLD_H * tileSize;

  return (
    <div className="relative w-full overflow-x-auto rounded-chunk border-4 border-ink shadow-pixel-md shadow-ink">
      <div className="relative" style={{ width: mapW, height: mapH }}>
        {/* Hintergrund: alle Terrain-Tiles */}
        {terrain.map((row, y) =>
          row.map((tile, x) => (
            <div
              key={`${x},${y}`}
              className="absolute"
              style={{ left: x * tileSize, top: y * tileSize }}
            >
              <TileSprite index={tile} size={tileSize} />
            </div>
          )),
        )}

        {/* Pfad zwischen Checkpoints – einfache Linie */}
        <PathOverlay nodes={nodes} reachedIdx={currentNodeIdx} tileSize={tileSize} />

        {/* Häuser an den Checkpoints */}
        {nodes.map((node, i) => (
          <Checkpoint key={node.level.id} node={node} number={i + 1} tileSize={tileSize} onTap={() => node.unlocked && onLevelTap(node.level)} />
        ))}

        {/* Charakter auf aktuellem Knoten */}
        {nodes[currentNodeIdx] && (
          <div
            className="absolute pointer-events-none transition-all duration-700 ease-out"
            style={{
              left: nodes[currentNodeIdx].tileX * tileSize + tileSize * 0.5,
              top: nodes[currentNodeIdx].tileY * tileSize - tileSize * 0.6,
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
            }}
          >
            <div className="animate-bounce-slow">
              <PixelCharacter config={character} size={tileSize * 1.6} bg={null} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

function computeNodes(levels: LevelDefinition[], progress: ProgressEntry[]): NodeState[] {
  return levels.map((level, i) => {
    const entry = progress.find((p) => p.levelId === level.id);
    const previous = i > 0 ? levels[i - 1] : null;
    const previousEntry = previous ? progress.find((p) => p.levelId === previous.id) : null;
    const unlocked = i === 0 || (previousEntry?.stars ?? 0) >= 1;
    const stars = (entry?.stars ?? 0) as 0 | 1 | 2 | 3;
    const cp = CHECKPOINTS[i % CHECKPOINTS.length];
    return {
      level,
      unlocked,
      stars,
      tileX: cp.x,
      tileY: cp.y,
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

function Checkpoint({ node, number, tileSize, onTap }: { node: NodeState; number: number; tileSize: number; onTap: () => void }) {
  const { unlocked, stars, tileX, tileY } = node;
  // Haus = 2×2 Tiles. Letzter Checkpoint = Castle (3×2).
  const isCastle = number === 8;
  return (
    <button
      onClick={onTap}
      disabled={!unlocked}
      className="absolute group"
      style={{
        left: (tileX - (isCastle ? 1 : 0)) * tileSize,
        top: (tileY - 1) * tileSize,
        zIndex: 20,
      }}
      aria-label={`Level ${number}`}
    >
      {isCastle ? <CastleSprite size={tileSize} unlocked={unlocked} /> : <HouseSprite size={tileSize} unlocked={unlocked} variant={number} />}

      {/* Numbered badge */}
      <div
        className="absolute -top-2 -right-2 w-9 h-9 rounded-full border-4 border-ink flex items-center justify-center font-pixel text-[12px] z-10 shadow-pixel-sm shadow-ink"
        style={{ background: unlocked ? '#fbbf24' : '#525252', color: '#0a0a14' }}
      >
        {number}
      </div>

      {/* Stars / Lock */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-pixel border-2 border-ink"
        style={{ bottom: -tileSize * 0.6, background: '#0a0e27ee' }}
      >
        {unlocked ? (
          [1, 2, 3].map((s) => <PixelIcon key={s} name={stars >= s ? 'star' : 'star-empty'} size={14} />)
        ) : (
          <PixelIcon name="lock" size={14} />
        )}
      </div>
    </button>
  );
}

function HouseSprite({ size, unlocked, variant }: { size: number; unlocked: boolean; variant: number }) {
  // 2x2 Haus: oben Dächer, unten Wand mit Tür. Tile-Index abhängig von variant
  // für Variation (gray-Dach vs. red-Dach).
  const useRed = variant % 2 === 0;
  const roofL = useRed ? 38 : TILE.HOUSE_ROOF_GRAY_TL;
  const roofR = useRed ? 39 : TILE.HOUSE_ROOF_GRAY_TR;
  const wallL = TILE.HOUSE_WALL_LEFT;
  const wallR = TILE.HOUSE_WALL_RIGHT;
  const opacity = unlocked ? 1 : 0.5;
  const filter = unlocked ? 'none' : 'grayscale(0.7)';
  return (
    <div className="relative" style={{ width: size * 2, height: size * 2, opacity, filter }}>
      <div className="absolute" style={{ left: 0, top: 0 }}><TileSprite index={roofL} size={size} /></div>
      <div className="absolute" style={{ left: size, top: 0 }}><TileSprite index={roofR} size={size} /></div>
      <div className="absolute" style={{ left: 0, top: size }}><TileSprite index={wallL} size={size} /></div>
      <div className="absolute" style={{ left: size, top: size }}><TileSprite index={wallR} size={size} /></div>
    </div>
  );
}

function CastleSprite({ size, unlocked }: { size: number; unlocked: boolean }) {
  const opacity = unlocked ? 1 : 0.5;
  const filter = unlocked ? 'none' : 'grayscale(0.7)';
  return (
    <div className="relative" style={{ width: size * 3, height: size * 2, opacity, filter }}>
      <div className="absolute" style={{ left: 0, top: 0 }}><TileSprite index={72} size={size} /></div>
      <div className="absolute" style={{ left: size, top: 0 }}><TileSprite index={73} size={size} /></div>
      <div className="absolute" style={{ left: size * 2, top: 0 }}><TileSprite index={74} size={size} /></div>
      <div className="absolute" style={{ left: 0, top: size }}><TileSprite index={84} size={size} /></div>
      <div className="absolute" style={{ left: size, top: size }}><TileSprite index={85} size={size} /></div>
      <div className="absolute" style={{ left: size * 2, top: size }}><TileSprite index={86} size={size} /></div>
    </div>
  );
}

function PathOverlay({ nodes, reachedIdx, tileSize }: { nodes: NodeState[]; reachedIdx: number; tileSize: number }) {
  if (nodes.length < 2) return null;
  const W = WORLD_W * tileSize;
  const H = WORLD_H * tileSize;
  return (
    <svg className="absolute inset-0 pointer-events-none" width={W} height={H} style={{ zIndex: 5 }}>
      {nodes.slice(0, -1).map((a, i) => {
        const b = nodes[i + 1];
        const ax = (a.tileX + 0.5) * tileSize;
        const ay = (a.tileY + 0.5) * tileSize;
        const bx = (b.tileX + 0.5) * tileSize;
        const by = (b.tileY + 0.5) * tileSize;
        const passed = i < reachedIdx;
        return (
          <g key={i}>
            {/* Background line */}
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={passed ? '#a16207' : '#52525266'} strokeWidth="6" strokeLinecap="round" />
            {/* Dotted line on top */}
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={passed ? '#fef08a' : '#ffffff'} strokeWidth="3" strokeDasharray="2,8" strokeLinecap="round" opacity={passed ? 0.9 : 0.6} />
          </g>
        );
      })}
    </svg>
  );
}
