import { AVATAR_ITEMS, type AvatarItem } from '@engine/avatar/items';
import type { AvatarConfig } from '@engine/db/schema';

interface Props {
  config: AvatarConfig;
  size?: number;
}

/**
 * Einfache Emoji-basierte Avatar-Darstellung.
 * Echte Pixel-Sprites kommen später — diese Variante ist sofort einsetzbar
 * und sieht schon knuffig aus.
 */
export default function AvatarSprite({ config, size = 120 }: Props) {
  const outfit = findItem(config.outfitId);
  const hat = findItem(config.hatId);
  const tool = findItem(config.toolId);

  return (
    <div
      className="relative flex items-center justify-center rounded-3xl shadow-lg border-4 border-white/20"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${config.baseColor}, ${shade(config.baseColor, -20)})`,
      }}
    >
      {/* Gesicht */}
      <div className="text-5xl select-none" style={{ fontSize: size * 0.4 }}>😊</div>

      {/* Hut oben */}
      {hat && hat.icon !== '—' && (
        <div className="absolute -top-3 text-4xl" style={{ fontSize: size * 0.35 }}>{hat.icon}</div>
      )}

      {/* Outfit unten links */}
      {outfit && (
        <div className="absolute bottom-1 left-1 text-2xl" style={{ fontSize: size * 0.22 }}>{outfit.icon}</div>
      )}

      {/* Werkzeug unten rechts */}
      {tool && tool.icon !== '—' && (
        <div className="absolute bottom-1 right-1 text-2xl" style={{ fontSize: size * 0.22 }}>{tool.icon}</div>
      )}
    </div>
  );
}

function findItem(id: string): AvatarItem | undefined {
  return AVATAR_ITEMS.find((i) => i.id === id);
}

function shade(hex: string, percent: number): string {
  const h = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(h.slice(0, 2), 16) + percent));
  const g = Math.max(0, Math.min(255, parseInt(h.slice(2, 4), 16) + percent));
  const b = Math.max(0, Math.min(255, parseInt(h.slice(4, 6), 16) + percent));
  return `rgb(${r},${g},${b})`;
}
