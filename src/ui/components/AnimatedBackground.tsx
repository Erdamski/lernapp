import { memo, useMemo } from 'react';

type Theme = 'world' | 'math' | 'german' | 'celebrate' | 'sky';

interface Props {
  theme?: Theme;
}

/**
 * Heller, kindgerechter Hintergrund.
 * - Himmel-Gradient (hellblau → cremeweiß zur Sonne)
 * - Sonne mit weichem Glühen
 * - Treibende Pixel-Wolken
 * - Bunte Themen-Symbole im Vorbeischweben
 * - Pixel-Wiese unten mit Bäumen aus Tiny Town
 */
export default memo(function AnimatedBackground({ theme = 'world' }: Props) {
  const items = useMemo(() => generateFloatingChars(theme), [theme]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ background: SKY_GRADIENT, zIndex: 0 }}>
      {/* Sonne */}
      <div className="absolute" style={{
        top: '6%',
        right: '10%',
        width: 80,
        height: 80,
        background: 'radial-gradient(circle, #fef9c3 0%, #fde047 50%, #f59e0b 100%)',
        borderRadius: '50%',
        boxShadow: '0 0 60px #fde04788',
      }} />

      {/* Pixel-Wolken */}
      <Cloud x={12} y={14} size={1.0} delay={0} />
      <Cloud x={38} y={8} size={1.3} delay={5} />
      <Cloud x={62} y={18} size={0.9} delay={12} />
      <Cloud x={82} y={26} size={1.1} delay={3} />

      {/* Driftende Themen-Symbole (Mathe/Buchstaben) */}
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
            textShadow: '3px 3px 0 rgba(0,0,0,0.15)',
          }}
        >
          {it.char}
        </span>
      ))}

      {/* Wiese unten – schlicht ohne Bäume (Bäume sind jetzt auf der ProgressRoute) */}
      <div className="absolute left-0 right-0 bottom-0" style={{
        height: '24%',
        background: 'linear-gradient(180deg, #86efac 0%, #4ade80 35%, #16a34a 100%)',
      }} />
      {/* Hügelwelle vor der Wiese */}
      <svg className="absolute left-0 right-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ bottom: '24%', height: '6%' }}>
        <path d="M 0 10 Q 14 0 28 5 T 56 6 T 84 4 T 100 7 L 100 10 Z" fill="#16a34a" />
      </svg>

      <style>{KEYFRAMES}</style>
    </div>
  );
});

const SKY_GRADIENT = 'linear-gradient(180deg, #93c5fd 0%, #bae6fd 35%, #fef3c7 75%, #ffe4e6 100%)';

const COLORS_BY_THEME: Record<Theme, string[]> = {
  sky: ['#fbbf24', '#f472b6', '#60a5fa'],
  world: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fb923c'],
  math: ['#facc15', '#22d3ee', '#a78bfa', '#fb923c', '#f472b6'],
  german: ['#fbbf24', '#fb7185', '#a78bfa', '#34d399'],
  celebrate: ['#fef08a', '#fda4af', '#a5f3fc', '#bbf7d0'],
};

const CHARS_BY_THEME: Record<Theme, string[]> = {
  sky: ['1', '2', '3', '+', '★'],
  world: ['1', '2', '3', '4', '5', 'A', 'B', 'C', '+', '★', '♥'],
  math: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '−', '=', '×'],
  german: ['A', 'B', 'C', 'D', 'E', 'M', 'N', 'O', 'R', 'S', 'T', 'Ä', 'Ü'],
  celebrate: ['★', '♥', '!', '+', '✓', '☆', '♪'],
};

interface FloatingChar {
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

function generateFloatingChars(theme: Theme): FloatingChar[] {
  const chars = CHARS_BY_THEME[theme];
  const colors = COLORS_BY_THEME[theme];
  const count = 18;
  const items: FloatingChar[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      char: chars[i % chars.length],
      left: Math.random() * 100,
      top: 5 + Math.random() * 50, // Nur im Himmel-Bereich
      size: 16 + Math.floor(Math.random() * 32),
      color: colors[i % colors.length],
      opacity: 0.4 + Math.random() * 0.3,
      rotate: -20 + Math.random() * 40,
      duration: 26 + Math.random() * 30,
      delay: -Math.random() * 30,
      dir: (['a', 'b', 'c'] as const)[i % 3],
    });
  }
  return items;
}

const KEYFRAMES = `
@keyframes drift-a { 0%   { transform: translate(0, 0) rotate(0deg); } 50%  { transform: translate(40px, 30px) rotate(8deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
@keyframes drift-b { 0%   { transform: translate(0, 0) rotate(0deg); } 50%  { transform: translate(-40px, 25px) rotate(-10deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
@keyframes drift-c { 0%   { transform: translate(0, 0) rotate(0deg); } 50%  { transform: translate(20px, -40px) rotate(6deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
@keyframes cloud-drift {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(60px); }
  100% { transform: translateX(0); }
}
`;

function Cloud({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `cloud-drift 70s linear ${delay}s infinite`,
      }}
    >
      <svg width={68 * size} height={36 * size} viewBox="0 0 34 18" style={{ shapeRendering: 'crispEdges' }}>
        {/* Pixel-Wolke aus mehreren Rects */}
        <rect x="6" y="4" width="22" height="10" fill="#ffffff" />
        <rect x="4" y="6" width="26" height="6" fill="#ffffff" />
        <rect x="2" y="8" width="30" height="3" fill="#ffffff" />
        <rect x="9" y="2" width="9" height="2" fill="#ffffff" />
        <rect x="18" y="3" width="8" height="3" fill="#ffffff" />
        {/* Soft outline */}
        <rect x="6" y="4" width="22" height="1" fill="#bfdbfe" />
        <rect x="4" y="13" width="26" height="1" fill="#bfdbfe" />
      </svg>
    </div>
  );
}
