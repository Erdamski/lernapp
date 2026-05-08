import { memo } from 'react';

/**
 * Rendert einen einzelnen Tile aus dem Kenney "Tiny Town" Tilesheet.
 *
 * Das Tilesheet hat 12×11 Tiles (132 total), jeder 16×16 Pixel mit
 * 1 px Padding zwischen Tiles. Der Renderer nutzt CSS background-position
 * mit der Packed-PNG → eine HTTP-Anfrage, beliebig viele Tiles auf dem Screen.
 */

const TILES_PER_ROW = 12;
const TILE_PX = 16;
const PAD = 1;
const SHEET_URL = '/assets/tiles/tiny-town/kenney_tiny-town/Tilemap/tilemap_packed.png';
const SHEET_W = TILES_PER_ROW * (TILE_PX + PAD); // = 204

interface Props {
  /** Tile-Index 0..131 */
  index: number;
  /** Render-Größe (Quadrat) in Pixeln. Default 32 (= 2× Skalierung). */
  size?: number;
  className?: string;
}

export default memo(function TileSprite({ index, size = 32, className = '' }: Props) {
  const col = index % TILES_PER_ROW;
  const row = Math.floor(index / TILES_PER_ROW);
  const scale = size / TILE_PX;
  const x = col * (TILE_PX + PAD) * scale;
  const y = row * (TILE_PX + PAD) * scale;
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundImage: `url('${SHEET_URL}')`,
        backgroundPosition: `-${x}px -${y}px`,
        backgroundSize: `${SHEET_W * scale}px auto`,
        imageRendering: 'pixelated',
      }}
    />
  );
});

/**
 * Kompakter Tile-Index-Katalog. Identifiziert über Sample.png + visuelle
 * Inspektion. Nicht jeder einzelne Tile ist hier benannt – nur die,
 * die wir aktiv für die World Map nutzen. Erweitern bei Bedarf.
 */
export const TILE = {
  // ── Terrain (Row 0-2) ────────────────────────────────────
  GRASS: 0,
  GRASS_FLOWERS_A: 1,
  GRASS_DOTS: 2,

  // ── Bäume (verschiedene Größen) ──────────────────────────
  TREE_SAPLING: 4,        // kleiner Baum
  TREE_GREEN: 5,          // mittlerer grüner Baum
  TREE_TALL: 6,           // großer grüner Baum
  TREE_AUTUMN: 7,         // Herbst-Baum (orange)

  // ── Bushes / Decorations (Row 1-2) ───────────────────────
  BUSH: 16,
  FLOWER_PATCH: 17,
  STONE: 18,

  // ── Pfad / Boden (Row 2-3) ───────────────────────────────
  DIRT_PATCH: 24,
  PATH_TILE: 36,
  FENCE_H: 30,
  FENCE_V: 31,

  // ── Haus mit grauem Dach (Row 3-5) ───────────────────────
  HOUSE_ROOF_GRAY_TL: 36,
  HOUSE_ROOF_GRAY_TR: 37,
  HOUSE_ROOF_GRAY_BL: 48,
  HOUSE_ROOF_GRAY_BR: 49,
  HOUSE_WALL_LEFT: 60,
  HOUSE_WALL_MID: 61,
  HOUSE_WALL_RIGHT: 62,
  HOUSE_DOOR: 64,
  HOUSE_WINDOW: 65,

  // ── Castle (Row 6-7) ─────────────────────────────────────
  CASTLE_TL: 72,
  CASTLE_TR: 74,
  CASTLE_GATE: 86,
  CASTLE_WALL: 84,

  // ── NPCs (Row 8) ─────────────────────────────────────────
  NPC_BOY: 96,
  NPC_GIRL: 97,
  NPC_KID: 98,

  // ── Items (Row 9-10) ─────────────────────────────────────
  SIGN: 109,
  CHEST: 110,
  ANVIL: 116,
  PUMPKIN: 124,
  MUSHROOM: 125,
} as const;
