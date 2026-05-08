import { memo } from 'react';

/**
 * Pixel-Icons für Zähl-Aufgaben. Vielfalt statt nur rote Blöcke.
 * Alle 16×16 Pixel-Grid mit shapeRendering="crispEdges".
 *
 * Eine Liste von Items, die in Zähl-Aufgaben rotieren – Kinder zählen
 * lieber Tiere und Obst als abstrakte Blöcke.
 */

export type CountItemKind =
  | 'apple'
  | 'orange'
  | 'banana'
  | 'strawberry'
  | 'cherry'
  | 'carrot'
  | 'mushroom'
  | 'cat'
  | 'dog'
  | 'fish'
  | 'frog'
  | 'bee'
  | 'butterfly'
  | 'star'
  | 'heart'
  | 'flower';

interface Props {
  kind: CountItemKind;
  size?: number;
}

export const ITEM_LABELS_DE: Record<CountItemKind, { sg: string; pl: string }> = {
  apple: { sg: 'Apfel', pl: 'Äpfel' },
  orange: { sg: 'Orange', pl: 'Orangen' },
  banana: { sg: 'Banane', pl: 'Bananen' },
  strawberry: { sg: 'Erdbeere', pl: 'Erdbeeren' },
  cherry: { sg: 'Kirsche', pl: 'Kirschen' },
  carrot: { sg: 'Karotte', pl: 'Karotten' },
  mushroom: { sg: 'Pilz', pl: 'Pilze' },
  cat: { sg: 'Katze', pl: 'Katzen' },
  dog: { sg: 'Hund', pl: 'Hunde' },
  fish: { sg: 'Fisch', pl: 'Fische' },
  frog: { sg: 'Frosch', pl: 'Frösche' },
  bee: { sg: 'Biene', pl: 'Bienen' },
  butterfly: { sg: 'Schmetterling', pl: 'Schmetterlinge' },
  star: { sg: 'Stern', pl: 'Sterne' },
  heart: { sg: 'Herz', pl: 'Herzen' },
  flower: { sg: 'Blume', pl: 'Blumen' },
};

const sr = { shapeRendering: 'crispEdges' as const, imageRendering: 'pixelated' as const };

const p = (x: number, y: number, fill: string, w = 1, h = 1) => (
  <rect key={`${x},${y},${w},${h}`} x={x} y={y} width={w} height={h} fill={fill} />
);

export default memo(function PixelItem({ kind, size = 64 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={sr}>
      {RENDERS[kind]()}
    </svg>
  );
});

const RENDERS: Record<CountItemKind, () => JSX.Element> = {
  apple: () => (
    <g>
      {/* Stem */}
      {p(8, 1, '#5b3a1a', 1, 2)}
      {/* Leaf */}
      {p(9, 2, '#16a34a', 3, 1)}
      {p(11, 1, '#16a34a', 1, 1)}
      {/* Apple body */}
      {p(4, 4, '#dc2626', 8, 1)}
      {p(3, 5, '#dc2626', 10, 7)}
      {p(4, 12, '#dc2626', 8, 1)}
      {p(5, 13, '#dc2626', 6, 1)}
      {/* Outline */}
      {p(3, 4, '#7f1d1d')}
      {p(12, 4, '#7f1d1d')}
      {p(2, 5, '#7f1d1d', 1, 7)}
      {p(13, 5, '#7f1d1d', 1, 7)}
      {p(3, 12, '#7f1d1d')}
      {p(12, 12, '#7f1d1d')}
      {p(4, 13, '#7f1d1d')}
      {p(11, 13, '#7f1d1d')}
      {p(5, 14, '#7f1d1d', 6, 1)}
      {/* Highlight */}
      {p(4, 5, '#fca5a5', 2, 2)}
      {p(5, 7, '#fca5a5', 1, 1)}
      {/* Bottom shadow */}
      {p(4, 11, '#7f1d1d', 8, 1)}
    </g>
  ),
  orange: () => (
    <g>
      {/* Stem + leaf */}
      {p(8, 2, '#5b3a1a', 1, 1)}
      {p(9, 1, '#16a34a', 2, 2)}
      {/* Body */}
      {p(4, 3, '#f97316', 8, 1)}
      {p(3, 4, '#f97316', 10, 8)}
      {p(4, 12, '#f97316', 8, 1)}
      {p(5, 13, '#f97316', 6, 1)}
      {/* Outline */}
      {p(3, 3, '#7c2d12')}
      {p(12, 3, '#7c2d12')}
      {p(2, 4, '#7c2d12', 1, 8)}
      {p(13, 4, '#7c2d12', 1, 8)}
      {p(3, 12, '#7c2d12')}
      {p(12, 12, '#7c2d12')}
      {p(4, 13, '#7c2d12')}
      {p(11, 13, '#7c2d12')}
      {p(5, 14, '#7c2d12', 6, 1)}
      {/* Texture dots */}
      {p(5, 7, '#fed7aa')}
      {p(9, 8, '#fed7aa')}
      {p(7, 5, '#fed7aa')}
      {/* Highlight */}
      {p(4, 5, '#fed7aa', 2, 2)}
    </g>
  ),
  banana: () => (
    <g>
      {/* Curved banana */}
      {p(11, 2, '#5b3a1a', 1, 1)}
      {p(10, 3, '#facc15', 2, 1)}
      {p(9, 4, '#facc15', 3, 1)}
      {p(8, 5, '#facc15', 4, 1)}
      {p(7, 6, '#facc15', 4, 1)}
      {p(6, 7, '#facc15', 4, 1)}
      {p(5, 8, '#facc15', 4, 1)}
      {p(4, 9, '#facc15', 4, 1)}
      {p(3, 10, '#facc15', 4, 1)}
      {p(3, 11, '#facc15', 3, 1)}
      {p(3, 12, '#5b3a1a')}
      {/* Outline */}
      {p(11, 3, '#854d0e')}
      {p(10, 4, '#854d0e')}
      {p(9, 5, '#854d0e')}
      {p(8, 6, '#854d0e')}
      {p(7, 7, '#854d0e')}
      {p(6, 8, '#854d0e')}
      {p(5, 9, '#854d0e')}
      {p(4, 10, '#854d0e')}
      {p(2, 11, '#854d0e')}
      {p(2, 12, '#854d0e')}
      {/* Highlight */}
      {p(8, 4, '#fef9c3')}
      {p(6, 6, '#fef9c3')}
    </g>
  ),
  strawberry: () => (
    <g>
      {/* Leaves */}
      {p(6, 2, '#16a34a', 4, 1)}
      {p(5, 3, '#16a34a', 6, 1)}
      {p(7, 4, '#16a34a', 2, 1)}
      {/* Body */}
      {p(4, 4, '#dc2626', 8, 1)}
      {p(3, 5, '#dc2626', 10, 1)}
      {p(3, 6, '#dc2626', 10, 5)}
      {p(4, 11, '#dc2626', 8, 1)}
      {p(5, 12, '#dc2626', 6, 1)}
      {p(6, 13, '#dc2626', 4, 1)}
      {/* Outline */}
      {p(3, 4, '#7f1d1d')}
      {p(12, 4, '#7f1d1d')}
      {p(2, 5, '#7f1d1d', 1, 6)}
      {p(13, 5, '#7f1d1d', 1, 6)}
      {p(3, 11, '#7f1d1d')}
      {p(12, 11, '#7f1d1d')}
      {p(4, 12, '#7f1d1d')}
      {p(11, 12, '#7f1d1d')}
      {p(5, 13, '#7f1d1d')}
      {p(10, 13, '#7f1d1d')}
      {p(6, 14, '#7f1d1d', 4, 1)}
      {/* Seeds */}
      {p(5, 7, '#facc15')}
      {p(8, 7, '#facc15')}
      {p(11, 7, '#facc15')}
      {p(6, 9, '#facc15')}
      {p(10, 9, '#facc15')}
      {p(8, 10, '#facc15')}
    </g>
  ),
  cherry: () => (
    <g>
      {/* Stems */}
      {p(7, 2, '#5b3a1a')}
      {p(8, 3, '#5b3a1a')}
      {p(7, 4, '#5b3a1a')}
      {p(6, 5, '#5b3a1a')}
      {p(11, 4, '#5b3a1a')}
      {p(10, 5, '#5b3a1a')}
      {p(9, 6, '#5b3a1a')}
      {/* Leaf */}
      {p(8, 4, '#16a34a', 2, 1)}
      {/* Cherry 1 (left) */}
      {p(2, 7, '#dc2626', 4, 1)}
      {p(2, 8, '#dc2626', 5, 5)}
      {p(3, 13, '#dc2626', 3, 1)}
      {p(2, 6, '#7f1d1d', 4, 1)}
      {p(1, 7, '#7f1d1d', 1, 6)}
      {p(6, 7, '#7f1d1d', 1, 6)}
      {p(2, 13, '#7f1d1d')}
      {p(6, 13, '#7f1d1d')}
      {p(3, 14, '#7f1d1d', 3, 1)}
      {p(3, 8, '#fca5a5', 1, 1)}
      {/* Cherry 2 (right) */}
      {p(8, 8, '#dc2626', 4, 1)}
      {p(7, 9, '#dc2626', 6, 4)}
      {p(8, 13, '#dc2626', 4, 1)}
      {p(8, 7, '#7f1d1d', 4, 1)}
      {p(7, 8, '#7f1d1d')}
      {p(12, 8, '#7f1d1d')}
      {p(6, 9, '#7f1d1d', 1, 4)}
      {p(13, 9, '#7f1d1d', 1, 4)}
      {p(7, 13, '#7f1d1d')}
      {p(12, 13, '#7f1d1d')}
      {p(8, 14, '#7f1d1d', 4, 1)}
      {p(9, 9, '#fca5a5', 1, 1)}
    </g>
  ),
  carrot: () => (
    <g>
      {/* Leaves */}
      {p(5, 2, '#16a34a')}
      {p(7, 1, '#16a34a')}
      {p(9, 2, '#16a34a')}
      {p(8, 3, '#16a34a', 2, 1)}
      {p(6, 3, '#16a34a', 2, 1)}
      {p(7, 4, '#16a34a', 2, 1)}
      {/* Carrot body (triangle going down) */}
      {p(5, 5, '#f97316', 6, 1)}
      {p(5, 6, '#f97316', 6, 1)}
      {p(6, 7, '#f97316', 5, 1)}
      {p(6, 8, '#f97316', 4, 1)}
      {p(7, 9, '#f97316', 4, 1)}
      {p(7, 10, '#f97316', 3, 1)}
      {p(8, 11, '#f97316', 2, 1)}
      {p(8, 12, '#f97316', 1, 1)}
      {p(8, 13, '#f97316', 1, 1)}
      {/* Outline */}
      {p(4, 5, '#7c2d12')}
      {p(11, 5, '#7c2d12')}
      {p(4, 6, '#7c2d12')}
      {p(11, 6, '#7c2d12')}
      {p(5, 7, '#7c2d12')}
      {p(11, 7, '#7c2d12')}
      {p(5, 8, '#7c2d12')}
      {p(10, 8, '#7c2d12')}
      {p(6, 9, '#7c2d12')}
      {p(11, 9, '#7c2d12')}
      {p(6, 10, '#7c2d12')}
      {p(10, 10, '#7c2d12')}
      {p(7, 11, '#7c2d12')}
      {p(10, 11, '#7c2d12')}
      {p(7, 12, '#7c2d12')}
      {p(9, 12, '#7c2d12')}
      {p(7, 13, '#7c2d12')}
      {p(9, 13, '#7c2d12')}
      {p(8, 14, '#7c2d12')}
      {/* Texture lines */}
      {p(7, 7, '#fed7aa')}
      {p(8, 9, '#fed7aa')}
    </g>
  ),
  mushroom: () => (
    <g>
      {/* Cap */}
      {p(5, 2, '#dc2626', 6, 1)}
      {p(4, 3, '#dc2626', 8, 1)}
      {p(3, 4, '#dc2626', 10, 1)}
      {p(3, 5, '#dc2626', 10, 2)}
      {/* White spots on cap */}
      {p(5, 4, '#ffffff')}
      {p(9, 5, '#ffffff', 2, 2)}
      {p(4, 6, '#ffffff')}
      {/* Cap outline */}
      {p(5, 1, '#7f1d1d', 6, 1)}
      {p(4, 2, '#7f1d1d')}
      {p(11, 2, '#7f1d1d')}
      {p(3, 3, '#7f1d1d')}
      {p(12, 3, '#7f1d1d')}
      {p(2, 4, '#7f1d1d')}
      {p(13, 4, '#7f1d1d')}
      {p(2, 5, '#7f1d1d')}
      {p(13, 5, '#7f1d1d')}
      {p(2, 6, '#7f1d1d')}
      {p(13, 6, '#7f1d1d')}
      {p(2, 7, '#7f1d1d', 12, 1)}
      {/* Stem */}
      {p(6, 8, '#fef9c3', 4, 5)}
      {p(5, 8, '#92400e')}
      {p(10, 8, '#92400e')}
      {p(5, 9, '#92400e')}
      {p(10, 9, '#92400e')}
      {p(5, 10, '#92400e')}
      {p(10, 10, '#92400e')}
      {p(5, 11, '#92400e')}
      {p(10, 11, '#92400e')}
      {p(5, 12, '#92400e')}
      {p(10, 12, '#92400e')}
      {p(6, 13, '#92400e', 4, 1)}
    </g>
  ),
  cat: () => (
    <g>
      {/* Ears */}
      {p(3, 3, '#fbbf24')}
      {p(4, 4, '#fbbf24')}
      {p(11, 3, '#fbbf24')}
      {p(11, 4, '#fbbf24')}
      {/* Head */}
      {p(3, 5, '#fbbf24', 9, 1)}
      {p(2, 6, '#fbbf24', 11, 4)}
      {p(3, 10, '#fbbf24', 9, 1)}
      {/* Outline */}
      {p(2, 5, '#92400e')}
      {p(12, 5, '#92400e')}
      {p(1, 6, '#92400e', 1, 4)}
      {p(13, 6, '#92400e', 1, 4)}
      {p(2, 10, '#92400e')}
      {p(12, 10, '#92400e')}
      {p(3, 11, '#92400e', 9, 1)}
      {/* Eyes */}
      {p(5, 7, '#0a0a14')}
      {p(10, 7, '#0a0a14')}
      {/* Nose */}
      {p(7, 8, '#dc2626')}
      {p(8, 8, '#dc2626')}
      {/* Mouth */}
      {p(6, 9, '#0a0a14')}
      {p(9, 9, '#0a0a14')}
      {/* Body suggestion */}
      {p(4, 12, '#fbbf24', 7, 2)}
      {p(3, 13, '#fbbf24')}
      {p(11, 13, '#fbbf24')}
      {/* Tail */}
      {p(12, 11, '#fbbf24')}
      {p(13, 12, '#fbbf24')}
    </g>
  ),
  dog: () => (
    <g>
      {/* Floppy ears */}
      {p(3, 4, '#7c2d12', 1, 4)}
      {p(2, 5, '#7c2d12', 1, 3)}
      {p(11, 4, '#7c2d12', 1, 4)}
      {p(12, 5, '#7c2d12', 1, 3)}
      {/* Head */}
      {p(4, 4, '#a16207', 7, 1)}
      {p(4, 5, '#a16207', 7, 5)}
      {p(5, 10, '#a16207', 5, 1)}
      {/* Snout (lighter) */}
      {p(6, 8, '#fef9c3', 3, 2)}
      {/* Outline */}
      {p(4, 3, '#7c2d12', 7, 1)}
      {p(3, 3, '#7c2d12')}
      {p(11, 3, '#7c2d12')}
      {p(3, 8, '#7c2d12')}
      {p(11, 8, '#7c2d12')}
      {p(4, 10, '#7c2d12')}
      {p(10, 10, '#7c2d12')}
      {p(5, 11, '#7c2d12', 5, 1)}
      {/* Eyes */}
      {p(5, 6, '#0a0a14')}
      {p(9, 6, '#0a0a14')}
      {/* Nose */}
      {p(7, 8, '#0a0a14')}
      {/* Body suggestion */}
      {p(4, 12, '#a16207', 7, 2)}
      {p(3, 13, '#a16207')}
      {p(11, 13, '#a16207')}
    </g>
  ),
  fish: () => (
    <g>
      {/* Body */}
      {p(3, 6, '#3b82f6', 8, 4)}
      {p(4, 5, '#3b82f6', 6, 1)}
      {p(4, 10, '#3b82f6', 6, 1)}
      {p(5, 4, '#3b82f6', 4, 1)}
      {p(5, 11, '#3b82f6', 4, 1)}
      {/* Tail */}
      {p(11, 5, '#3b82f6')}
      {p(12, 4, '#3b82f6', 1, 2)}
      {p(11, 10, '#3b82f6')}
      {p(12, 10, '#3b82f6', 1, 2)}
      {p(13, 6, '#3b82f6', 1, 4)}
      {/* Outline */}
      {p(4, 4, '#1e3a8a')}
      {p(9, 4, '#1e3a8a')}
      {p(3, 5, '#1e3a8a')}
      {p(10, 5, '#1e3a8a')}
      {p(2, 6, '#1e3a8a')}
      {p(2, 9, '#1e3a8a')}
      {p(3, 10, '#1e3a8a')}
      {p(10, 10, '#1e3a8a')}
      {p(4, 11, '#1e3a8a')}
      {p(9, 11, '#1e3a8a')}
      {p(2, 7, '#1e3a8a', 1, 2)}
      {/* Eye */}
      {p(5, 7, '#ffffff', 2, 2)}
      {p(6, 7, '#0a0a14')}
      {/* Highlight */}
      {p(8, 6, '#93c5fd')}
      {p(9, 7, '#93c5fd')}
    </g>
  ),
  frog: () => (
    <g>
      {/* Body */}
      {p(3, 6, '#16a34a', 10, 6)}
      {p(4, 5, '#16a34a', 8, 1)}
      {p(4, 12, '#16a34a', 8, 1)}
      {/* Belly (lighter) */}
      {p(5, 9, '#86efac', 6, 2)}
      {/* Eyes (pop on top) */}
      {p(4, 3, '#16a34a', 2, 2)}
      {p(10, 3, '#16a34a', 2, 2)}
      {p(5, 4, '#ffffff')}
      {p(11, 4, '#ffffff')}
      {p(5, 5, '#0a0a14')}
      {p(11, 5, '#0a0a14')}
      {/* Mouth */}
      {p(6, 8, '#0a0a14', 4, 1)}
      {/* Outline */}
      {p(4, 2, '#14532d', 2, 1)}
      {p(10, 2, '#14532d', 2, 1)}
      {p(3, 5, '#14532d')}
      {p(12, 5, '#14532d')}
      {p(2, 6, '#14532d', 1, 6)}
      {p(13, 6, '#14532d', 1, 6)}
      {p(3, 12, '#14532d')}
      {p(12, 12, '#14532d')}
      {p(4, 13, '#14532d', 8, 1)}
      {/* Spots */}
      {p(8, 6, '#14532d')}
      {p(4, 8, '#14532d')}
      {p(11, 7, '#14532d')}
    </g>
  ),
  bee: () => (
    <g>
      {/* Body */}
      {p(4, 5, '#facc15', 8, 7)}
      {/* Stripes */}
      {p(4, 6, '#0a0a14', 8, 1)}
      {p(4, 9, '#0a0a14', 8, 1)}
      {/* Outline */}
      {p(3, 5, '#92400e')}
      {p(12, 5, '#92400e')}
      {p(3, 11, '#92400e')}
      {p(12, 11, '#92400e')}
      {p(4, 4, '#92400e', 8, 1)}
      {p(4, 12, '#92400e', 8, 1)}
      {p(2, 6, '#92400e', 1, 5)}
      {p(13, 6, '#92400e', 1, 5)}
      {/* Wings */}
      {p(2, 3, '#bfdbfe', 3, 2)}
      {p(11, 3, '#bfdbfe', 3, 2)}
      {p(2, 3, '#3b82f6')}
      {p(13, 3, '#3b82f6')}
      {p(1, 4, '#3b82f6')}
      {p(14, 4, '#3b82f6')}
      {/* Eye */}
      {p(5, 7, '#ffffff')}
      {p(5, 8, '#0a0a14')}
      {/* Stinger */}
      {p(13, 8, '#0a0a14')}
    </g>
  ),
  butterfly: () => (
    <g>
      {/* Wings (top) */}
      {p(3, 3, '#a855f7', 4, 4)}
      {p(2, 4, '#a855f7', 1, 3)}
      {p(9, 3, '#a855f7', 4, 4)}
      {p(13, 4, '#a855f7', 1, 3)}
      {/* Wings (bottom) */}
      {p(4, 8, '#7c3aed', 3, 4)}
      {p(9, 8, '#7c3aed', 3, 4)}
      {/* Spots */}
      {p(4, 4, '#fef08a')}
      {p(11, 4, '#fef08a')}
      {p(5, 9, '#facc15')}
      {p(10, 9, '#facc15')}
      {/* Body */}
      {p(7, 4, '#0a0a14', 2, 9)}
      {/* Antennae */}
      {p(6, 2, '#0a0a14')}
      {p(9, 2, '#0a0a14')}
      {p(7, 3, '#0a0a14')}
      {p(8, 3, '#0a0a14')}
      {/* Outlines */}
      {p(2, 3, '#581c87')}
      {p(7, 3, '#581c87')}
      {p(8, 3, '#581c87')}
      {p(13, 3, '#581c87')}
      {p(1, 4, '#581c87')}
      {p(14, 4, '#581c87')}
      {p(1, 7, '#581c87')}
      {p(14, 7, '#581c87')}
      {p(3, 12, '#581c87', 4, 1)}
      {p(9, 12, '#581c87', 4, 1)}
    </g>
  ),
  star: () => (
    <g>
      {p(7, 1, '#facc15', 2, 1)}
      {p(6, 2, '#facc15', 4, 1)}
      {p(5, 3, '#facc15', 6, 1)}
      {p(1, 4, '#facc15', 14, 2)}
      {p(2, 6, '#facc15', 12, 2)}
      {p(3, 8, '#facc15', 10, 1)}
      {p(4, 9, '#facc15', 3, 1)}
      {p(9, 9, '#facc15', 3, 1)}
      {p(3, 10, '#facc15', 3, 1)}
      {p(10, 10, '#facc15', 3, 1)}
      {p(2, 11, '#facc15', 3, 1)}
      {p(11, 11, '#facc15', 3, 1)}
      {p(7, 6, '#fef08a', 2, 1)}
      {p(6, 5, '#fef08a')}
      {/* Outline */}
      {p(7, 0, '#854d0e', 2, 1)}
      {p(0, 4, '#854d0e')}
      {p(15, 4, '#854d0e')}
    </g>
  ),
  heart: () => (
    <g>
      {p(2, 4, '#dc2626', 4, 1)}
      {p(10, 4, '#dc2626', 4, 1)}
      {p(1, 5, '#dc2626', 6, 1)}
      {p(9, 5, '#dc2626', 6, 1)}
      {p(1, 6, '#dc2626', 14, 2)}
      {p(2, 8, '#dc2626', 12, 1)}
      {p(3, 9, '#dc2626', 10, 1)}
      {p(4, 10, '#dc2626', 8, 1)}
      {p(5, 11, '#dc2626', 6, 1)}
      {p(6, 12, '#dc2626', 4, 1)}
      {p(7, 13, '#dc2626', 2, 1)}
      {/* Highlight */}
      {p(2, 5, '#fca5a5', 2, 1)}
      {p(3, 6, '#fca5a5', 2, 1)}
    </g>
  ),
  flower: () => (
    <g>
      {/* Petals */}
      {p(5, 2, '#ec4899', 6, 1)}
      {p(4, 3, '#ec4899', 8, 1)}
      {p(3, 4, '#ec4899', 10, 1)}
      {p(3, 5, '#ec4899', 10, 1)}
      {p(4, 6, '#ec4899', 8, 1)}
      {p(5, 7, '#ec4899', 6, 1)}
      {/* Center */}
      {p(7, 4, '#facc15', 2, 2)}
      {/* Outline */}
      {p(4, 2, '#9d174d')}
      {p(11, 2, '#9d174d')}
      {p(2, 4, '#9d174d')}
      {p(13, 4, '#9d174d')}
      {p(2, 5, '#9d174d')}
      {p(13, 5, '#9d174d')}
      {p(3, 7, '#9d174d')}
      {p(12, 7, '#9d174d')}
      {p(4, 8, '#9d174d', 8, 1)}
      {/* Stem */}
      {p(7, 8, '#16a34a', 2, 6)}
      {/* Leaf */}
      {p(9, 10, '#16a34a', 3, 1)}
      {p(10, 11, '#16a34a', 2, 1)}
    </g>
  ),
};

/**
 * Item-Pools für unterschiedliche Aufgabentypen.
 * Die App rotiert zufällig durch sie, sodass Kinder nicht
 * immer dasselbe sehen – aber die Aussage zur gezeigten
 * Sache (Apfel/Hund) bleibt stets korrekt.
 */
export const COUNT_ITEMS_POOL: CountItemKind[] = [
  'apple', 'orange', 'banana', 'strawberry', 'cherry',
  'carrot', 'mushroom',
  'cat', 'dog', 'fish', 'frog', 'bee', 'butterfly',
  'star', 'heart', 'flower',
];

export function pickRandomItem(): CountItemKind {
  return COUNT_ITEMS_POOL[Math.floor(Math.random() * COUNT_ITEMS_POOL.length)];
}
