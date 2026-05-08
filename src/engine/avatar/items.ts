/**
 * Avatar-Items: Outfits, Hüte, Werkzeuge.
 * Items werden durch Levels / Sterne freigeschaltet.
 * Anzeige als Kachel mit emoji/svg-Icon. Echte Sprite-Grafiken kommen später.
 */

export type ItemSlot = 'outfit' | 'hat' | 'tool';

export interface AvatarItem {
  id: string;
  slot: ItemSlot;
  label: string;        // i18n key (z. B. "items.outfit_explorer")
  icon: string;         // Emoji oder Pfad zu SVG
  unlockRequirement: { type: 'free' } | { type: 'stars'; count: number } | { type: 'level'; subject: string; worldId: string; levelId: string };
  teaserHint?: string;  // i18n key für Sperre-Hinweis
}

export const AVATAR_ITEMS: AvatarItem[] = [
  // Outfits
  { id: 'outfit_basic', slot: 'outfit', label: 'Standard', icon: '👕', unlockRequirement: { type: 'free' } },
  { id: 'outfit_explorer', slot: 'outfit', label: 'Forscher', icon: '🥼', unlockRequirement: { type: 'stars', count: 3 } },
  { id: 'outfit_knight', slot: 'outfit', label: 'Ritter', icon: '🛡️', unlockRequirement: { type: 'stars', count: 9 } },
  { id: 'outfit_astronaut', slot: 'outfit', label: 'Astronaut', icon: '👨‍🚀', unlockRequirement: { type: 'stars', count: 18 } },
  { id: 'outfit_ninja', slot: 'outfit', label: 'Ninja', icon: '🥷', unlockRequirement: { type: 'stars', count: 30 } },

  // Hüte
  { id: 'hat_none', slot: 'hat', label: 'Kein Hut', icon: '—', unlockRequirement: { type: 'free' } },
  { id: 'hat_cap', slot: 'hat', label: 'Cap', icon: '🧢', unlockRequirement: { type: 'free' } },
  { id: 'hat_wizard', slot: 'hat', label: 'Zaubererhut', icon: '🧙', unlockRequirement: { type: 'stars', count: 6 } },
  { id: 'hat_crown', slot: 'hat', label: 'Krone', icon: '👑', unlockRequirement: { type: 'stars', count: 24 } },
  { id: 'hat_pirate', slot: 'hat', label: 'Piratenhut', icon: '🏴‍☠️', unlockRequirement: { type: 'stars', count: 12 } },

  // Werkzeuge
  { id: 'tool_none', slot: 'tool', label: 'Nichts', icon: '—', unlockRequirement: { type: 'free' } },
  { id: 'tool_wand', slot: 'tool', label: 'Zauberstab', icon: '🪄', unlockRequirement: { type: 'free' } },
  { id: 'tool_sword', slot: 'tool', label: 'Schwert', icon: '⚔️', unlockRequirement: { type: 'stars', count: 6 } },
  { id: 'tool_telescope', slot: 'tool', label: 'Fernrohr', icon: '🔭', unlockRequirement: { type: 'stars', count: 15 } },
  { id: 'tool_pickaxe', slot: 'tool', label: 'Spitzhacke', icon: '⛏️', unlockRequirement: { type: 'stars', count: 21 } },
];

export const AVATAR_COLORS = ['#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#34d399', '#fb7185'];

export function isItemUnlocked(item: AvatarItem, totalStars: number): boolean {
  if (item.unlockRequirement.type === 'free') return true;
  if (item.unlockRequirement.type === 'stars') return totalStars >= item.unlockRequirement.count;
  return false;
}

export function getDefaultAvatar() {
  return {
    baseColor: AVATAR_COLORS[0],
    outfitId: 'outfit_basic',
    hatId: 'hat_none',
    toolId: 'tool_none',
  };
}
