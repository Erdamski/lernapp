import { memo } from 'react';
import PixelItem, { type CountItemKind } from './PixelItem';

interface Props {
  a: number;
  b: number;
  op: '+' | '-';
  /** Item-Typ für die erste Gruppe */
  itemA: CountItemKind;
  /** Item-Typ für die zweite Gruppe (nur Plus). Bei Minus: gleiche wie A, b davon ausgegraut. */
  itemB?: CountItemKind;
}

/**
 * Visualisiert eine Mathe-Aufgabe (Plus oder Minus) mit echten Pixel-Items
 * statt langweiligen Blöcken.
 *
 * Plus:  3 🍎 + 2 🍊 = ?
 * Minus: 5 🍎 (davon 2 ausgegraut) → 3 übrig
 */
export default memo(function MathItems({ a, b, op, itemA, itemB }: Props) {
  const total = op === '+' ? a + b : a;
  const size = total <= 5 ? 64 : total <= 8 ? 52 : total <= 12 ? 44 : 36;

  if (op === '+') {
    return (
      <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
        <ItemGroup count={a} kind={itemA} size={size} />
        <span className="font-pixel text-[36px] sm:text-[48px] text-white">+</span>
        <ItemGroup count={b} kind={itemB ?? itemA} size={size} />
      </div>
    );
  }

  // Minus: zeige a Items, davon b ausgegraut/durchgestrichen
  return (
    <div className="flex flex-row items-center justify-center gap-2 max-w-full">
      {Array.from({ length: a }).map((_, i) => {
        const isRemoved = i >= a - b;
        return (
          <div
            key={i}
            className="animate-pop shrink-0 relative"
            style={{ animationDelay: `${i * 40}ms`, opacity: isRemoved ? 0.3 : 1, filter: isRemoved ? 'grayscale(0.8)' : 'none' }}
          >
            <PixelItem kind={itemA} size={size} />
            {isRemoved && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-hidden="true"
              >
                {/* Pixel-Kreuz drüber */}
                <svg viewBox="0 0 16 16" width={size} height={size} style={{ shapeRendering: 'crispEdges' }}>
                  <rect x="2" y="2" width="2" height="2" fill="#dc2626" />
                  <rect x="4" y="4" width="2" height="2" fill="#dc2626" />
                  <rect x="6" y="6" width="4" height="4" fill="#dc2626" />
                  <rect x="10" y="10" width="2" height="2" fill="#dc2626" />
                  <rect x="12" y="12" width="2" height="2" fill="#dc2626" />
                  <rect x="12" y="2" width="2" height="2" fill="#dc2626" />
                  <rect x="10" y="4" width="2" height="2" fill="#dc2626" />
                  <rect x="2" y="12" width="2" height="2" fill="#dc2626" />
                  <rect x="4" y="10" width="2" height="2" fill="#dc2626" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

function ItemGroup({ count, kind, size }: { count: number; kind: CountItemKind; size: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pop" style={{ animationDelay: `${i * 40}ms` }}>
          <PixelItem kind={kind} size={size} />
        </div>
      ))}
    </div>
  );
}

/**
 * Pickt zwei verschiedene Item-Typen aus einer thematisch passenden Gruppe.
 * Sodass Aufgaben mit Obst zu Obst, Tiere zu Tiere etc. kombiniert werden.
 */
export function pickItemPair(): { a: CountItemKind; b: CountItemKind } {
  const pools: CountItemKind[][] = [
    ['apple', 'orange', 'banana', 'strawberry', 'cherry'],     // Obst
    ['carrot', 'mushroom'],                                    // Gemüse (klein, fallback)
    ['cat', 'dog', 'fish', 'frog'],                            // Tiere groß
    ['bee', 'butterfly'],                                      // Insekten
    ['star', 'heart', 'flower'],                               // Misc
  ];
  const pool = pools[Math.floor(Math.random() * pools.length)];
  if (pool.length < 2) {
    // Fallback: aus dem Obst-Pool
    const obst = pools[0];
    const a = obst[Math.floor(Math.random() * obst.length)];
    let b = obst[Math.floor(Math.random() * obst.length)];
    while (b === a) b = obst[Math.floor(Math.random() * obst.length)];
    return { a, b };
  }
  const a = pool[Math.floor(Math.random() * pool.length)];
  let b = pool[Math.floor(Math.random() * pool.length)];
  while (b === a) b = pool[Math.floor(Math.random() * pool.length)];
  return { a, b };
}

export function pickSingleItem(): CountItemKind {
  const pools: CountItemKind[] = ['apple', 'orange', 'banana', 'strawberry', 'cherry', 'carrot', 'mushroom', 'cat', 'dog', 'fish', 'frog', 'bee', 'butterfly', 'star', 'heart', 'flower'];
  return pools[Math.floor(Math.random() * pools.length)];
}
