/**
 * Pixel-Avatar-System (Minecraft-Stil).
 *
 * Aufbau:
 *   Preset wählen → einzelne Slots ändern (Hautfarbe, Frisur, Oberteil, Hose)
 *   Profilbild = Avatar.
 *
 * Items/Cosmetics für Belohnungen (Hüte, Werkzeuge etc.) kommen später als
 * separate Slots dazu, ohne diese Grundstruktur zu brechen.
 */

export interface CharacterConfig {
  presetId: string;        // wird beim Erstellen genutzt; danach editierbar
  skinId: SkinId;
  hairId: HairId;
  hairColorId: HairColorId;
  topId: TopId;
  bottomId: BottomId;
}

export type SkinId = 'light' | 'tan' | 'olive' | 'brown' | 'dark';
export type HairId = 'short' | 'spiky' | 'long' | 'pony' | 'bun' | 'curly';
export type HairColorId = 'black' | 'brown' | 'blonde' | 'red' | 'white';
export type TopId = 'tshirt_red' | 'tshirt_blue' | 'tshirt_yellow' | 'tshirt_pink' | 'hoodie_green';
export type BottomId = 'pants_blue' | 'pants_grey' | 'pants_brown' | 'shorts_red' | 'skirt_purple';

export const SKIN_COLORS: Record<SkinId, { fill: string; shadow: string; label: string }> = {
  light: { fill: '#fcd5b4', shadow: '#e8b993', label: 'Hell' },
  tan: { fill: '#e0a47a', shadow: '#bf8459', label: 'Tan' },
  olive: { fill: '#c08858', label: 'Oliv', shadow: '#9b6a3e' },
  brown: { fill: '#a0623c', shadow: '#7a4828', label: 'Braun' },
  dark: { fill: '#5a3520', shadow: '#3d2415', label: 'Dunkel' },
};

export const HAIR_COLORS: Record<HairColorId, { fill: string; shadow: string; label: string }> = {
  black: { fill: '#1a1a1a', shadow: '#000000', label: 'Schwarz' },
  brown: { fill: '#5c3a1a', shadow: '#3d2510', label: 'Braun' },
  blonde: { fill: '#e8c66b', shadow: '#c2a345', label: 'Blond' },
  red: { fill: '#c9421f', shadow: '#9a3018', label: 'Rot' },
  white: { fill: '#e8e8e8', shadow: '#bdbdbd', label: 'Weiß' },
};

export const TOP_COLORS: Record<TopId, { fill: string; shadow: string; label: string }> = {
  tshirt_red: { fill: '#dc2626', shadow: '#a01a1a', label: 'Rot' },
  tshirt_blue: { fill: '#2563eb', shadow: '#1c4ab8', label: 'Blau' },
  tshirt_yellow: { fill: '#facc15', shadow: '#d4ad0d', label: 'Gelb' },
  tshirt_pink: { fill: '#ec4899', shadow: '#c2317d', label: 'Pink' },
  hoodie_green: { fill: '#16a34a', shadow: '#107a37', label: 'Grün' },
};

export const BOTTOM_COLORS: Record<BottomId, { fill: string; shadow: string; label: string }> = {
  pants_blue: { fill: '#1e40af', shadow: '#152d7a', label: 'Blau' },
  pants_grey: { fill: '#525252', shadow: '#3a3a3a', label: 'Grau' },
  pants_brown: { fill: '#5b3a1a', shadow: '#3e2710', label: 'Braun' },
  shorts_red: { fill: '#b91c1c', shadow: '#7f1313', label: 'Shorts' },
  skirt_purple: { fill: '#7c3aed', shadow: '#5b22b5', label: 'Lila' },
};

export interface CharacterPreset {
  id: string;
  label: string;
  config: CharacterConfig;
}

/**
 * 6 vorgefertigte Charaktere zur Auswahl. Mischung aus Geschlechtern und Hauttönen.
 * Kinder klicken einfach den, der ihnen gefällt.
 */
export const CHARACTER_PRESETS: CharacterPreset[] = [
  {
    id: 'boy_1',
    label: 'Max',
    config: { presetId: 'boy_1', skinId: 'tan', hairId: 'short', hairColorId: 'brown', topId: 'tshirt_red', bottomId: 'pants_blue' },
  },
  {
    id: 'boy_2',
    label: 'Leo',
    config: { presetId: 'boy_2', skinId: 'light', hairId: 'spiky', hairColorId: 'black', topId: 'hoodie_green', bottomId: 'pants_grey' },
  },
  {
    id: 'boy_3',
    label: 'Theo',
    config: { presetId: 'boy_3', skinId: 'brown', hairId: 'short', hairColorId: 'black', topId: 'tshirt_blue', bottomId: 'pants_brown' },
  },
  {
    id: 'girl_1',
    label: 'Mia',
    config: { presetId: 'girl_1', skinId: 'light', hairId: 'long', hairColorId: 'blonde', topId: 'tshirt_pink', bottomId: 'skirt_purple' },
  },
  {
    id: 'girl_2',
    label: 'Lina',
    config: { presetId: 'girl_2', skinId: 'tan', hairId: 'pony', hairColorId: 'brown', topId: 'tshirt_yellow', bottomId: 'pants_blue' },
  },
  {
    id: 'girl_3',
    label: 'Ada',
    config: { presetId: 'girl_3', skinId: 'dark', hairId: 'bun', hairColorId: 'black', topId: 'tshirt_blue', bottomId: 'shorts_red' },
  },
];

export const SKIN_OPTIONS: SkinId[] = ['light', 'tan', 'olive', 'brown', 'dark'];
export const HAIR_OPTIONS: HairId[] = ['short', 'spiky', 'long', 'pony', 'bun', 'curly'];
export const HAIR_COLOR_OPTIONS: HairColorId[] = ['black', 'brown', 'blonde', 'red', 'white'];
export const TOP_OPTIONS: TopId[] = ['tshirt_red', 'tshirt_blue', 'tshirt_yellow', 'tshirt_pink', 'hoodie_green'];
export const BOTTOM_OPTIONS: BottomId[] = ['pants_blue', 'pants_grey', 'pants_brown', 'shorts_red', 'skirt_purple'];

export function getDefaultCharacter(): CharacterConfig {
  return CHARACTER_PRESETS[0].config;
}

/**
 * Migration: Falls eine alte AvatarConfig (mit baseColor/outfitId etc.) im Storage liegt,
 * konvertieren wir sie auf den neuen Typ.
 */
export function normalizeCharacter(input: unknown): CharacterConfig {
  if (!input || typeof input !== 'object') return getDefaultCharacter();
  const c = input as Partial<CharacterConfig>;
  if (c.skinId && c.hairId && c.topId && c.bottomId) return c as CharacterConfig;
  return getDefaultCharacter();
}
