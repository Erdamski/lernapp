/**
 * Pixel-Icon-Library.
 * Alle Icons als SVG mit <rect>, shapeRendering="crispEdges" für scharfe Pixel.
 * Standard-ViewBox 16x16 (außer Charakter-Icons mit 32x32).
 *
 * Hinzufügen eines neuen Icons:
 *   1) Funktion in ICONS unten ergänzen
 *   2) Name zum IconName-Type ergänzen
 *   3) STYLEGUIDE.md §4 aktualisieren
 */

export type IconName =
  | 'speaker'
  | 'speaker-off'
  | 'lock'
  | 'unlock'
  | 'star'
  | 'star-empty'
  | 'coin'
  | 'heart'
  | 'plus'
  | 'minus'
  | 'equals'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'swap'
  | 'gear'
  | 'check'
  | 'cross'
  | 'apple'
  | 'dragon'
  | 'trophy'
  | 'shirt'
  | 'pants'
  | 'hair'
  | 'skin'
  | 'paint'
  | 'home'
  | 'play'
  | 'pause'
  | 'globe'
  | 'repeat';

import { memo } from 'react';

interface Props {
  name: IconName;
  size?: number;
  tone?: 'default' | 'ink' | 'white';
  className?: string;
}

export default memo(function PixelIcon({ name, size = 24, tone = 'default', className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated' }}
      className={className}
    >
      {ICONS[name](tone)}
    </svg>
  );
});

// Hilfs-Render-Funktion: Pixel als <rect>
function p(x: number, y: number, fill: string, w = 1, h = 1) {
  return <rect key={`${x},${y},${w},${h},${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

const colors = (tone: 'default' | 'ink' | 'white') => ({
  ink: tone === 'white' ? '#ffffff' : tone === 'ink' ? '#0a0a14' : '#0a0a14',
  white: '#ffffff',
  red: tone === 'ink' ? '#0a0a14' : '#ef4444',
  redDeep: '#991b1b',
  green: tone === 'ink' ? '#0a0a14' : '#10b981',
  greenDeep: '#065f46',
  yellow: tone === 'ink' ? '#0a0a14' : '#facc15',
  yellowDeep: '#a16207',
  gold: tone === 'ink' ? '#0a0a14' : '#fbbf24',
  goldDeep: '#92400e',
  blue: tone === 'ink' ? '#0a0a14' : '#3b82f6',
  blueDeep: '#1e3a8a',
  purple: tone === 'ink' ? '#0a0a14' : '#a855f7',
  purpleDeep: '#581c87',
  brown: '#78350f',
  pink: '#f472b6',
});

type ToneKey = 'default' | 'ink' | 'white';

const ICONS: Record<IconName, (tone: ToneKey) => JSX.Element> = {
  // ┌─────────────────── AUDIO ───────────────────┐
  speaker: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(2, 6, c.ink, 2, 4)}
        {p(4, 5, c.ink, 1, 6)}
        {p(5, 4, c.ink, 1, 8)}
        {p(6, 3, c.ink, 2, 10)}
        {p(9, 5, c.ink)}
        {p(10, 6, c.ink)}
        {p(11, 7, c.ink, 1, 2)}
        {p(10, 9, c.ink)}
        {p(9, 10, c.ink)}
        {p(11, 4, c.ink)}
        {p(12, 5, c.ink)}
        {p(13, 6, c.ink, 1, 4)}
        {p(12, 10, c.ink)}
        {p(11, 11, c.ink)}
      </g>
    );
  },
  'speaker-off': (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(2, 6, c.ink, 2, 4)}
        {p(4, 5, c.ink, 1, 6)}
        {p(5, 4, c.ink, 1, 8)}
        {p(6, 3, c.ink, 2, 10)}
        {p(10, 6, c.red)}
        {p(11, 7, c.red)}
        {p(12, 8, c.red)}
        {p(13, 9, c.red)}
        {p(13, 6, c.red)}
        {p(12, 7, c.red)}
        {p(11, 8, c.red)}
        {p(10, 9, c.red)}
      </g>
    );
  },

  // ┌─────────────────── STATE ───────────────────┐
  lock: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(5, 4, c.ink)}
        {p(6, 3, c.ink, 4, 1)}
        {p(10, 4, c.ink)}
        {p(5, 5, c.ink)}
        {p(10, 5, c.ink)}
        {p(5, 6, c.ink)}
        {p(10, 6, c.ink)}
        {p(3, 7, c.gold, 10, 7)}
        {p(3, 7, c.ink, 10, 1)}
        {p(3, 13, c.ink, 10, 1)}
        {p(3, 7, c.ink, 1, 7)}
        {p(12, 7, c.ink, 1, 7)}
        {p(7, 9, c.ink, 2, 3)}
      </g>
    );
  },
  unlock: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(5, 4, c.ink)}
        {p(6, 3, c.ink, 4, 1)}
        {p(10, 4, c.ink)}
        {p(10, 5, c.ink)}
        {p(10, 6, c.ink)}
        {p(3, 7, c.green, 10, 7)}
        {p(3, 7, c.ink, 10, 1)}
        {p(3, 13, c.ink, 10, 1)}
        {p(3, 7, c.ink, 1, 7)}
        {p(12, 7, c.ink, 1, 7)}
        {p(7, 9, c.ink, 2, 3)}
      </g>
    );
  },

  star: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(7, 1, c.yellow, 2, 1)}
        {p(6, 2, c.yellow, 4, 1)}
        {p(5, 3, c.yellow, 6, 1)}
        {p(1, 4, c.yellow, 14, 2)}
        {p(2, 6, c.yellow, 12, 2)}
        {p(3, 8, c.yellow, 10, 1)}
        {p(4, 9, c.yellow, 3, 1)}
        {p(9, 9, c.yellow, 3, 1)}
        {p(3, 10, c.yellow, 3, 1)}
        {p(10, 10, c.yellow, 3, 1)}
        {p(2, 11, c.yellow, 3, 1)}
        {p(11, 11, c.yellow, 3, 1)}
        {p(7, 6, c.white, 2, 1)}
        {p(6, 5, c.white, 1, 1)}
      </g>
    );
  },
  'star-empty': () => {
    const c = colors('default');
    return (
      <g>
        {p(7, 1, c.ink, 2, 1)}
        {p(6, 2, c.ink, 1, 1)}
        {p(9, 2, c.ink, 1, 1)}
        {p(5, 3, c.ink, 1, 1)}
        {p(10, 3, c.ink, 1, 1)}
        {p(1, 4, c.ink, 4, 1)}
        {p(11, 4, c.ink, 4, 1)}
        {p(2, 5, c.ink, 1, 1)}
        {p(13, 5, c.ink, 1, 1)}
        {p(3, 6, c.ink, 1, 1)}
        {p(12, 6, c.ink, 1, 1)}
        {p(3, 7, c.ink, 1, 1)}
        {p(12, 7, c.ink, 1, 1)}
        {p(4, 8, c.ink, 1, 1)}
        {p(11, 8, c.ink, 1, 1)}
        {p(4, 9, c.ink, 1, 1)}
        {p(11, 9, c.ink, 1, 1)}
        {p(3, 10, c.ink, 2, 1)}
        {p(11, 10, c.ink, 2, 1)}
        {p(2, 11, c.ink, 2, 1)}
        {p(12, 11, c.ink, 2, 1)}
      </g>
    );
  },

  coin: () => {
    const c = colors('default');
    return (
      <g>
        {p(5, 1, c.ink, 6, 1)}
        {p(3, 2, c.ink, 2, 1)}
        {p(11, 2, c.ink, 2, 1)}
        {p(2, 3, c.ink, 1, 1)}
        {p(13, 3, c.ink, 1, 1)}
        {p(1, 4, c.ink, 1, 8)}
        {p(14, 4, c.ink, 1, 8)}
        {p(2, 12, c.ink, 1, 1)}
        {p(13, 12, c.ink, 1, 1)}
        {p(3, 13, c.ink, 2, 1)}
        {p(11, 13, c.ink, 2, 1)}
        {p(5, 14, c.ink, 6, 1)}
        {/* fill */}
        {p(5, 2, c.gold, 6, 1)}
        {p(3, 3, c.gold, 10, 1)}
        {p(2, 4, c.gold, 12, 8)}
        {p(3, 12, c.gold, 10, 1)}
        {p(5, 13, c.gold, 6, 1)}
        {/* highlight */}
        {p(4, 3, c.yellow, 2, 1)}
        {p(3, 4, c.yellow, 2, 1)}
        {p(2, 5, c.yellow, 2, 4)}
        {/* € symbol */}
        {p(7, 5, c.goldDeep, 3, 1)}
        {p(6, 6, c.goldDeep, 1, 1)}
        {p(6, 7, c.goldDeep, 4, 1)}
        {p(6, 8, c.goldDeep, 1, 1)}
        {p(6, 9, c.goldDeep, 4, 1)}
        {p(7, 10, c.goldDeep, 3, 1)}
      </g>
    );
  },

  heart: () => {
    const c = colors('default');
    return (
      <g>
        {p(2, 4, c.red, 4, 1)}
        {p(10, 4, c.red, 4, 1)}
        {p(1, 5, c.red, 6, 1)}
        {p(9, 5, c.red, 6, 1)}
        {p(1, 6, c.red, 14, 2)}
        {p(2, 8, c.red, 12, 1)}
        {p(3, 9, c.red, 10, 1)}
        {p(4, 10, c.red, 8, 1)}
        {p(5, 11, c.red, 6, 1)}
        {p(6, 12, c.red, 4, 1)}
        {p(7, 13, c.red, 2, 1)}
        {p(2, 5, c.pink, 2, 1)}
        {p(3, 6, c.pink, 2, 1)}
      </g>
    );
  },

  // ┌─────────────────── MATH ───────────────────┐
  plus: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(7, 3, c.ink, 2, 10)}
        {p(3, 7, c.ink, 10, 2)}
      </g>
    );
  },
  minus: (tone) => {
    const c = colors(tone);
    return p(3, 7, c.ink, 10, 2);
  },
  equals: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(3, 5, c.ink, 10, 2)}
        {p(3, 9, c.ink, 10, 2)}
      </g>
    );
  },

  apple: () => {
    const c = colors('default');
    // Chunkigerer Apfel mit größeren Pixel-Blöcken und stärkerem Kontrast.
    return (
      <g>
        {/* Stem (chunkier) */}
        {p(8, 1, c.brown, 1, 2)}
        {/* Leaf */}
        {p(9, 2, c.green, 3, 1)}
        {p(10, 1, c.green, 1, 1)}
        {p(11, 2, c.green, 1, 1)}
        {/* Top outline */}
        {p(4, 3, c.redDeep, 8, 1)}
        {p(3, 4, c.redDeep, 1, 1)}
        {p(12, 4, c.redDeep, 1, 1)}
        {/* Apple body – große Blöcke */}
        {p(4, 4, c.red, 8, 1)}
        {p(3, 5, c.red, 10, 7)}
        {p(4, 12, c.red, 8, 1)}
        {p(5, 13, c.red, 6, 1)}
        {/* Side outlines */}
        {p(2, 5, c.redDeep, 1, 7)}
        {p(13, 5, c.redDeep, 1, 7)}
        {p(3, 12, c.redDeep, 1, 1)}
        {p(12, 12, c.redDeep, 1, 1)}
        {p(4, 13, c.redDeep, 1, 1)}
        {p(11, 13, c.redDeep, 1, 1)}
        {p(5, 14, c.redDeep, 6, 1)}
        {/* Big highlight – chunky */}
        {p(4, 5, c.pink, 2, 2)}
        {p(5, 7, c.pink, 1, 1)}
        {/* Shadow at bottom */}
        {p(4, 11, c.redDeep, 8, 1)}
      </g>
    );
  },

  dragon: () => {
    const c = colors('default');
    return (
      <g>
        {/* Snout */}
        {p(2, 8, c.green, 4, 1)}
        {p(2, 9, c.green, 4, 2)}
        {/* Head */}
        {p(6, 5, c.green, 6, 1)}
        {p(5, 6, c.green, 8, 5)}
        {p(6, 11, c.green, 6, 1)}
        {/* Horn */}
        {p(8, 3, c.green)}
        {p(8, 4, c.green)}
        {p(11, 3, c.green)}
        {p(11, 4, c.green)}
        {/* Eye */}
        {p(8, 7, c.white, 2, 1)}
        {p(9, 7, c.ink)}
        {/* Nostril */}
        {p(3, 9, c.ink)}
        {/* Teeth */}
        {p(3, 11, c.white)}
        {p(5, 11, c.white)}
      </g>
    );
  },

  trophy: () => {
    const c = colors('default');
    return (
      <g>
        {p(3, 2, c.ink, 10, 1)}
        {p(3, 3, c.gold, 10, 4)}
        {p(4, 7, c.gold, 8, 2)}
        {p(5, 9, c.goldDeep, 6, 1)}
        {p(6, 10, c.ink, 4, 1)}
        {p(5, 11, c.ink, 6, 1)}
        {p(4, 12, c.ink, 8, 2)}
        {p(2, 4, c.gold, 1, 2)}
        {p(13, 4, c.gold, 1, 2)}
        {p(4, 4, c.yellow, 2, 1)}
      </g>
    );
  },

  // ┌─────────────────── NAV ───────────────────┐
  'arrow-left': (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(7, 3, c.ink, 1, 1)}
        {p(6, 4, c.ink, 1, 1)}
        {p(5, 5, c.ink, 1, 1)}
        {p(4, 6, c.ink, 1, 1)}
        {p(3, 7, c.ink, 1, 2)}
        {p(4, 9, c.ink, 1, 1)}
        {p(5, 10, c.ink, 1, 1)}
        {p(6, 11, c.ink, 1, 1)}
        {p(7, 12, c.ink, 1, 1)}
        {/* shaft */}
        {p(4, 7, c.ink, 9, 2)}
      </g>
    );
  },
  'arrow-right': (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(8, 3, c.ink, 1, 1)}
        {p(9, 4, c.ink, 1, 1)}
        {p(10, 5, c.ink, 1, 1)}
        {p(11, 6, c.ink, 1, 1)}
        {p(12, 7, c.ink, 1, 2)}
        {p(11, 9, c.ink, 1, 1)}
        {p(10, 10, c.ink, 1, 1)}
        {p(9, 11, c.ink, 1, 1)}
        {p(8, 12, c.ink, 1, 1)}
        {p(3, 7, c.ink, 9, 2)}
      </g>
    );
  },
  'arrow-up': (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(7, 3, c.ink, 2, 1)}
        {p(6, 4, c.ink, 4, 1)}
        {p(5, 5, c.ink, 6, 1)}
        {p(4, 6, c.ink, 8, 1)}
        {p(7, 7, c.ink, 2, 6)}
      </g>
    );
  },
  'arrow-down': (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(7, 3, c.ink, 2, 6)}
        {p(4, 9, c.ink, 8, 1)}
        {p(5, 10, c.ink, 6, 1)}
        {p(6, 11, c.ink, 4, 1)}
        {p(7, 12, c.ink, 2, 1)}
      </g>
    );
  },
  swap: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(2, 5, c.ink, 12, 1)}
        {p(11, 4, c.ink)}
        {p(11, 6, c.ink)}
        {p(12, 3, c.ink)}
        {p(12, 7, c.ink)}
        {p(2, 10, c.ink, 12, 1)}
        {p(4, 9, c.ink)}
        {p(4, 11, c.ink)}
        {p(3, 8, c.ink)}
        {p(3, 12, c.ink)}
      </g>
    );
  },
  gear: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(7, 1, c.ink, 2, 2)}
        {p(7, 13, c.ink, 2, 2)}
        {p(1, 7, c.ink, 2, 2)}
        {p(13, 7, c.ink, 2, 2)}
        {p(3, 3, c.ink, 2, 2)}
        {p(11, 3, c.ink, 2, 2)}
        {p(3, 11, c.ink, 2, 2)}
        {p(11, 11, c.ink, 2, 2)}
        {p(4, 4, c.ink, 8, 8)}
        {p(6, 6, c.white, 4, 4)}
      </g>
    );
  },
  check: (tone) => {
    const c = tone === 'default' ? colors('default').green : colors(tone).ink;
    return (
      <g>
        {p(11, 4, c, 1, 1)}
        {p(10, 5, c, 2, 1)}
        {p(9, 6, c, 2, 1)}
        {p(8, 7, c, 2, 1)}
        {p(7, 8, c, 2, 1)}
        {p(6, 9, c, 2, 1)}
        {p(3, 9, c, 1, 1)}
        {p(4, 10, c, 2, 1)}
        {p(5, 11, c, 1, 1)}
      </g>
    );
  },
  cross: (tone) => {
    const c = tone === 'default' ? colors('default').red : colors(tone).ink;
    return (
      <g>
        {p(3, 3, c)}
        {p(4, 4, c)}
        {p(5, 5, c)}
        {p(6, 6, c)}
        {p(7, 7, c, 2, 2)}
        {p(9, 5, c)}
        {p(10, 4, c)}
        {p(11, 3, c)}
        {p(12, 2, c)}
        {p(2, 12, c)}
        {p(3, 11, c)}
        {p(4, 10, c)}
        {p(5, 9, c)}
        {p(9, 9, c)}
        {p(10, 10, c)}
        {p(11, 11, c)}
        {p(12, 12, c)}
      </g>
    );
  },

  // ┌─────────────────── EQUIPMENT ───────────────────┐
  shirt: () => {
    const c = colors('default');
    return (
      <g>
        {p(2, 3, c.blue, 4, 2)}
        {p(10, 3, c.blue, 4, 2)}
        {p(3, 5, c.blue, 10, 9)}
        {p(6, 3, c.ink, 4, 2)}
      </g>
    );
  },
  pants: () => {
    const c = colors('default');
    return (
      <g>
        {p(3, 2, c.blueDeep, 10, 4)}
        {p(3, 6, c.blueDeep, 4, 8)}
        {p(9, 6, c.blueDeep, 4, 8)}
      </g>
    );
  },
  hair: () => {
    const c = colors('default');
    return (
      <g>
        {p(4, 3, c.brown, 8, 1)}
        {p(3, 4, c.brown, 10, 4)}
        {p(2, 6, c.brown, 1, 2)}
        {p(13, 6, c.brown, 1, 2)}
      </g>
    );
  },
  skin: () => {
    const c = colors('default');
    return (
      <g>
        {p(5, 3, '#fcd5b4', 6, 6)}
        {p(6, 4, c.ink)}
        {p(9, 4, c.ink)}
        {p(7, 6, c.ink, 2, 1)}
      </g>
    );
  },
  paint: () => {
    const c = colors('default');
    return (
      <g>
        {p(3, 3, c.purple, 10, 4)}
        {p(2, 7, c.ink)}
        {p(13, 7, c.ink)}
        {p(4, 7, c.purple, 8, 4)}
        {p(6, 11, c.brown, 4, 3)}
      </g>
    );
  },

  // ┌─────────────────── MISC ───────────────────┐
  home: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(7, 2, c.ink, 2)}
        {p(6, 3, c.ink, 4)}
        {p(5, 4, c.ink, 6)}
        {p(4, 5, c.ink, 8)}
        {p(3, 6, c.ink, 10)}
        {p(2, 7, c.ink, 12)}
        {p(4, 8, c.ink, 8, 6)}
        {p(7, 11, c.ink, 2, 3)}
      </g>
    );
  },
  play: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(4, 3, c.ink, 1, 10)}
        {p(5, 4, c.ink, 1, 8)}
        {p(6, 5, c.ink, 1, 6)}
        {p(7, 6, c.ink, 1, 4)}
        {p(8, 7, c.ink, 1, 2)}
      </g>
    );
  },
  pause: (tone) => {
    const c = colors(tone);
    return (
      <g>
        {p(4, 3, c.ink, 2, 10)}
        {p(10, 3, c.ink, 2, 10)}
      </g>
    );
  },
  globe: () => {
    const c = colors('default');
    return (
      <g>
        {/* Outline/sphere */}
        {p(5, 1, c.ink, 6, 1)}
        {p(3, 2, c.ink, 2, 1)}
        {p(11, 2, c.ink, 2, 1)}
        {p(2, 3, c.ink, 1, 1)}
        {p(13, 3, c.ink, 1, 1)}
        {p(1, 4, c.ink, 1, 8)}
        {p(14, 4, c.ink, 1, 8)}
        {p(2, 12, c.ink, 1, 1)}
        {p(13, 12, c.ink, 1, 1)}
        {p(3, 13, c.ink, 2, 1)}
        {p(11, 13, c.ink, 2, 1)}
        {p(5, 14, c.ink, 6, 1)}
        {/* Ozean (blau) */}
        {p(5, 2, c.blue, 6, 1)}
        {p(3, 3, c.blue, 10, 1)}
        {p(2, 4, c.blue, 12, 8)}
        {p(3, 12, c.blue, 10, 1)}
        {p(5, 13, c.blue, 6, 1)}
        {/* Kontinente (grün) */}
        {p(5, 4, c.green, 2, 2)}
        {p(8, 5, c.green, 3, 2)}
        {p(4, 7, c.green, 4, 2)}
        {p(9, 8, c.green, 4, 2)}
        {p(6, 10, c.green, 3, 2)}
        {p(11, 11, c.green, 2, 1)}
        {/* Highlight oben */}
        {p(4, 3, '#93c5fd', 3, 1)}
      </g>
    );
  },
  repeat: () => {
    const c = colors('default');
    // Kreisförmiger Pfeil, der links zurück und rechts nach vorne zeigt
    return (
      <g>
        {/* Ring */}
        {p(5, 2, c.ink, 6, 1)}
        {p(3, 3, c.ink, 1, 1)}
        {p(11, 3, c.ink, 1, 1)}
        {p(2, 4, c.ink, 1, 2)}
        {p(13, 4, c.ink, 1, 2)}
        {p(2, 10, c.ink, 1, 2)}
        {p(13, 10, c.ink, 1, 2)}
        {p(3, 12, c.ink, 1, 1)}
        {p(11, 12, c.ink, 1, 1)}
        {p(5, 13, c.ink, 6, 1)}
        {/* Inner Ring fill (transparent) – wir lassen das einfach */}
        {/* Pfeilspitzen oben rechts (geht nach rechts) */}
        {p(11, 1, c.ink, 1, 2)}
        {p(12, 1, c.ink, 1, 1)}
        {p(13, 2, c.ink, 1, 1)}
        {/* Pfeilspitze farbig */}
        {p(10, 4, c.green, 2, 1)}
        {p(11, 3, c.green, 1, 1)}
        {p(12, 4, c.green, 1, 1)}
      </g>
    );
  },
};
