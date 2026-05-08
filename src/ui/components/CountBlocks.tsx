import { memo } from 'react';

/**
 * Leichtgewichtige Pixel-Blöcke zum Zählen.
 * Pure CSS (keine SVG-Rects) — deutlich schneller als PixelIcon-Apfel
 * und ein klarer "Mengen erkennen"-Helfer (EIS-Prinzip ikonisch).
 */

interface BlockProps {
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange';
  size?: number;
}

const BLOCK_PALETTE: Record<BlockProps['color'], { fill: string; shadow: string; light: string }> = {
  blue: { fill: '#3b82f6', shadow: '#1e3a8a', light: '#93c5fd' },
  red: { fill: '#ef4444', shadow: '#7f1d1d', light: '#fca5a5' },
  green: { fill: '#10b981', shadow: '#065f46', light: '#6ee7b7' },
  yellow: { fill: '#facc15', shadow: '#854d0e', light: '#fef08a' },
  purple: { fill: '#a855f7', shadow: '#581c87', light: '#d8b4fe' },
  orange: { fill: '#f97316', shadow: '#7c2d12', light: '#fdba74' },
};

export const PixelBlock = memo(function PixelBlock({ color, size = 48 }: BlockProps) {
  const c = BLOCK_PALETTE[color];
  return (
    <div
      className="shrink-0"
      style={{
        width: size,
        height: size,
        background: c.fill,
        border: `4px solid #0a0a14`,
        borderRadius: 2,
        boxShadow: `inset ${size * 0.1}px ${size * 0.1}px 0 ${c.light}, inset -${size * 0.1}px -${size * 0.1}px 0 ${c.shadow}`,
      }}
    />
  );
});

interface BlockRowProps {
  count: number;
  color: BlockProps['color'];
}

/**
 * Zeigt 1–10 Blöcke in einer Reihe. Größe schrumpft mit Anzahl.
 */
export const BlockRow = memo(function BlockRow({ count, color }: BlockRowProps) {
  const size = count <= 4 ? 80 : count <= 6 ? 64 : count <= 8 ? 52 : 44;
  return (
    <div className="flex flex-row items-center justify-center gap-2 max-w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pop shrink-0" style={{ animationDelay: `${i * 40}ms` }}>
          <PixelBlock color={color} size={size} />
        </div>
      ))}
    </div>
  );
});

/**
 * Mathe-Ausdruck mit Blöcken statt nur Zahlen.
 * "2+3" → 2 blaue Blöcke + Operator + 3 grüne Blöcke
 * Kinder können alle Blöcke zusammen zählen.
 */
interface MathBlocksProps {
  a: number;
  b: number;
  op: '+' | '-';
}

export const MathBlocks = memo(function MathBlocks({ a, b, op }: MathBlocksProps) {
  const total = a + b;
  // Größe so wählen, dass beide Gruppen + Operator sicher in eine Reihe passen
  const size = total <= 5 ? 60 : total <= 8 ? 50 : total <= 12 ? 42 : 36;
  return (
    <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
      <Group count={a} color="blue" size={size} />
      <span className="font-pixel text-[36px] sm:text-[48px] text-white">{op}</span>
      <Group count={b} color={op === '+' ? 'green' : 'red'} size={size} faded={op === '-'} />
    </div>
  );
});

function Group({ count, color, size, faded }: { count: number; color: BlockProps['color']; size: number; faded?: boolean }) {
  return (
    <div className="flex gap-1.5" style={{ opacity: faded ? 0.5 : 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pop" style={{ animationDelay: `${i * 40}ms` }}>
          <PixelBlock color={color} size={size} />
        </div>
      ))}
    </div>
  );
}
