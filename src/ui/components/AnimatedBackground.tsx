import { memo, useMemo } from 'react';

type Theme = 'world' | 'math' | 'german' | 'celebrate';

interface Props {
  theme?: Theme;
}

/**
 * Bunter, animierter Pixel-Hintergrund.
 * Schwebende Zahlen / Buchstaben / Symbole driften langsam über den Screen.
 * Pure CSS-Animationen — performant, keine Frame-Loops.
 */
export default memo(function AnimatedBackground({ theme = 'world' }: Props) {
  const items = useMemo(() => generateItems(theme), [theme]);
  const gradient = GRADIENTS[theme];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ background: gradient }}>
      {/* Pixel-Sterne im Hintergrund */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: STAR_PATTERN, backgroundSize: '120px 120px' }} />

      {/* Driftende Symbole */}
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute font-pixel select-none"
          style={{
            left: `${it.left}%`,
            top: `${it.top}%`,
            fontSize: it.size,
            color: it.color,
            opacity: it.opacity,
            transform: `rotate(${it.rotate}deg)`,
            animation: `drift-${it.dir} ${it.duration}s linear infinite`,
            animationDelay: `${it.delay}s`,
            textShadow: '4px 4px 0 rgba(0,0,0,0.4)',
          }}
        >
          {it.char}
        </span>
      ))}

      <style>{KEYFRAMES}</style>
    </div>
  );
});

const GRADIENTS: Record<Theme, string> = {
  world: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 35%, #5b21b6 70%, #831843 100%)',
  math: 'linear-gradient(160deg, #082f49 0%, #0c4a6e 30%, #1e3a8a 65%, #4c1d95 100%)',
  german: 'linear-gradient(160deg, #064e3b 0%, #065f46 30%, #14532d 65%, #1e3a8a 100%)',
  celebrate: 'linear-gradient(160deg, #581c87 0%, #be185d 35%, #c2410c 70%, #facc15 100%)',
};

const COLORS_BY_THEME: Record<Theme, string[]> = {
  world: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fb923c'],
  math: ['#facc15', '#22d3ee', '#a78bfa', '#fb923c', '#f472b6'],
  german: ['#fbbf24', '#fb7185', '#a78bfa', '#34d399'],
  celebrate: ['#fef08a', '#fda4af', '#a5f3fc', '#bbf7d0'],
};

const CHARS_BY_THEME: Record<Theme, string[]> = {
  world: ['1', '2', '3', '4', '5', 'A', 'B', 'C', 'D', '+', '★', '♥'],
  math: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '−', '=', '×'],
  german: ['A', 'B', 'C', 'D', 'E', 'M', 'N', 'O', 'R', 'S', 'T', 'Ä', 'Ü'],
  celebrate: ['★', '♥', '!', '+', '✓', '☆', '♪'],
};

interface Item {
  char: string;
  left: number;
  top: number;
  size: number;
  color: string;
  opacity: number;
  rotate: number;
  duration: number;
  delay: number;
  dir: 'a' | 'b' | 'c';
}

function generateItems(theme: Theme): Item[] {
  const chars = CHARS_BY_THEME[theme];
  const colors = COLORS_BY_THEME[theme];
  const count = 26;
  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      char: chars[i % chars.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 16 + Math.floor(Math.random() * 36),
      color: colors[i % colors.length],
      opacity: 0.18 + Math.random() * 0.28,
      rotate: -25 + Math.random() * 50,
      duration: 22 + Math.random() * 30,
      delay: -Math.random() * 30,
      dir: (['a', 'b', 'c'] as const)[i % 3],
    });
  }
  return items;
}

const STAR_PATTERN = `radial-gradient(circle at 20% 25%, rgba(255,255,255,0.7) 0 1.2px, transparent 2px),
                      radial-gradient(circle at 70% 60%, rgba(255,255,255,0.6) 0 1.2px, transparent 2px),
                      radial-gradient(circle at 45% 80%, rgba(255,255,255,0.5) 0 1.2px, transparent 2px),
                      radial-gradient(circle at 90% 15%, rgba(255,255,255,0.7) 0 1px, transparent 2px)`;

const KEYFRAMES = `
@keyframes drift-a {
  0%   { transform: translate(0, 0) rotate(0deg); }
  50%  { transform: translate(30px, 50px) rotate(8deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes drift-b {
  0%   { transform: translate(0, 0) rotate(0deg); }
  50%  { transform: translate(-40px, 30px) rotate(-10deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes drift-c {
  0%   { transform: translate(0, 0) rotate(0deg); }
  50%  { transform: translate(20px, -45px) rotate(6deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
`;
