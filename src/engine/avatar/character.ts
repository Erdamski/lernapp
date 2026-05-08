/**
 * Pixel-Avatar-System (Minecraft-Stil) – Schema v2 mit Type+Color-Split.
 *
 * Slots:
 *   presetId      (Schnellstart-Vorlage)
 *   skinId        (Hautfarbe)
 *   hairId        (Frisur-Form)
 *   hairColorId   (Haarfarbe)
 *   topTypeId     (Oberteil-Form: T-Shirt, Hoodie, Tank, Kleid)
 *   topColorId    (Oberteil-Farbe)
 *   bottomTypeId  (Hose-Form: Lang, Shorts, Jeans, Rock)
 *   bottomColorId (Hose-Farbe)
 *   shoeId        (Schuhe: Sneaker, Stiefel, Barfuß)
 *   equipmentId   (Ausrüstung: nichts, Zauberstab, Schwert, Schild)
 */

export interface CharacterConfig {
  presetId: string;
  skinId: SkinId;
  hairId: HairId;
  hairColorId: HairColorId;
  topTypeId: TopType;
  topColorId: ClothColor;
  bottomTypeId: BottomType;
  bottomColorId: ClothColor;
  shoeId: ShoeId;
  equipmentId: EquipmentId;
}

export type SkinId = 'light' | 'tan' | 'olive' | 'brown' | 'dark';
export type HairId = 'short' | 'spiky' | 'long' | 'pony' | 'bun' | 'curly';
export type HairColorId = 'black' | 'brown' | 'blonde' | 'red' | 'white';
export type TopType = 'tshirt' | 'hoodie' | 'tank';
export type BottomType = 'long' | 'short' | 'jeans' | 'skirt';
export type ClothColor = 'red' | 'blue' | 'yellow' | 'pink' | 'green' | 'purple' | 'orange' | 'grey' | 'brown';
export type ShoeId = 'sneaker' | 'boot' | 'barefoot';
export type EquipmentId = 'none' | 'wand' | 'sword' | 'shield';

export const SKIN_COLORS: Record<SkinId, { fill: string; shadow: string; label: string }> = {
  light: { fill: '#fcd5b4', shadow: '#e8b993', label: 'Hell' },
  tan: { fill: '#e0a47a', shadow: '#bf8459', label: 'Tan' },
  olive: { fill: '#c08858', shadow: '#9b6a3e', label: 'Oliv' },
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

export const CLOTH_COLORS: Record<ClothColor, { fill: string; shadow: string; light: string; label: string }> = {
  red: { fill: '#dc2626', shadow: '#7f1d1d', light: '#fca5a5', label: 'Rot' },
  blue: { fill: '#2563eb', shadow: '#1e3a8a', light: '#93c5fd', label: 'Blau' },
  yellow: { fill: '#facc15', shadow: '#854d0e', light: '#fef08a', label: 'Gelb' },
  pink: { fill: '#ec4899', shadow: '#9d174d', light: '#fbcfe8', label: 'Pink' },
  green: { fill: '#16a34a', shadow: '#14532d', light: '#86efac', label: 'Grün' },
  purple: { fill: '#7c3aed', shadow: '#4c1d95', light: '#c4b5fd', label: 'Lila' },
  orange: { fill: '#f97316', shadow: '#7c2d12', light: '#fed7aa', label: 'Orange' },
  grey: { fill: '#525252', shadow: '#262626', light: '#a3a3a3', label: 'Grau' },
  brown: { fill: '#5b3a1a', shadow: '#3e2710', light: '#a47148', label: 'Braun' },
};

export interface CharacterPreset {
  id: string;
  label: string;
  config: CharacterConfig;
}

export const CHARACTER_PRESETS: CharacterPreset[] = [
  { id: 'boy_1', label: 'Max', config: { presetId: 'boy_1', skinId: 'tan', hairId: 'short', hairColorId: 'brown', topTypeId: 'tshirt', topColorId: 'red', bottomTypeId: 'long', bottomColorId: 'blue', shoeId: 'sneaker', equipmentId: 'none' } },
  { id: 'boy_2', label: 'Leo', config: { presetId: 'boy_2', skinId: 'light', hairId: 'spiky', hairColorId: 'black', topTypeId: 'hoodie', topColorId: 'green', bottomTypeId: 'jeans', bottomColorId: 'grey', shoeId: 'sneaker', equipmentId: 'none' } },
  { id: 'boy_3', label: 'Theo', config: { presetId: 'boy_3', skinId: 'brown', hairId: 'short', hairColorId: 'black', topTypeId: 'tshirt', topColorId: 'blue', bottomTypeId: 'long', bottomColorId: 'brown', shoeId: 'boot', equipmentId: 'none' } },
  { id: 'girl_1', label: 'Mia', config: { presetId: 'girl_1', skinId: 'light', hairId: 'long', hairColorId: 'blonde', topTypeId: 'tshirt', topColorId: 'pink', bottomTypeId: 'skirt', bottomColorId: 'purple', shoeId: 'sneaker', equipmentId: 'none' } },
  { id: 'girl_2', label: 'Lina', config: { presetId: 'girl_2', skinId: 'tan', hairId: 'pony', hairColorId: 'brown', topTypeId: 'tshirt', topColorId: 'yellow', bottomTypeId: 'long', bottomColorId: 'blue', shoeId: 'sneaker', equipmentId: 'none' } },
  { id: 'girl_3', label: 'Ada', config: { presetId: 'girl_3', skinId: 'dark', hairId: 'bun', hairColorId: 'black', topTypeId: 'tank', topColorId: 'blue', bottomTypeId: 'short', bottomColorId: 'red', shoeId: 'sneaker', equipmentId: 'none' } },
];

export const SKIN_OPTIONS: SkinId[] = ['light', 'tan', 'olive', 'brown', 'dark'];
export const HAIR_OPTIONS: HairId[] = ['short', 'spiky', 'long', 'pony', 'bun', 'curly'];
export const HAIR_COLOR_OPTIONS: HairColorId[] = ['black', 'brown', 'blonde', 'red', 'white'];
export const TOP_TYPE_OPTIONS: TopType[] = ['tshirt', 'hoodie', 'tank'];
export const BOTTOM_TYPE_OPTIONS: BottomType[] = ['long', 'short', 'jeans', 'skirt'];
export const CLOTH_COLOR_OPTIONS: ClothColor[] = ['red', 'blue', 'yellow', 'pink', 'green', 'purple', 'orange', 'grey', 'brown'];
export const SHOE_OPTIONS: ShoeId[] = ['sneaker', 'boot', 'barefoot'];
export const EQUIPMENT_OPTIONS: EquipmentId[] = ['none', 'wand', 'sword', 'shield'];

export const HAIR_LABELS: Record<HairId, string> = { short: 'Kurz', spiky: 'Stachel', long: 'Lang', pony: 'Zopf', bun: 'Dutt', curly: 'Locken' };
export const TOP_TYPE_LABELS: Record<TopType, string> = { tshirt: 'T-Shirt', hoodie: 'Hoodie', tank: 'Tank' };
export const BOTTOM_TYPE_LABELS: Record<BottomType, string> = { long: 'Lang', short: 'Shorts', jeans: 'Jeans', skirt: 'Rock' };
export const SHOE_LABELS: Record<ShoeId, string> = { sneaker: 'Sneaker', boot: 'Stiefel', barefoot: 'Barfuß' };
export const EQUIPMENT_LABELS: Record<EquipmentId, string> = { none: 'Nichts', wand: 'Zauberstab', sword: 'Schwert', shield: 'Schild' };

export function getDefaultCharacter(): CharacterConfig {
  return CHARACTER_PRESETS[0].config;
}

/**
 * Migration: Konvertiert alte Schema-Varianten (kombiniertes topId/bottomId) auf das neue Schema.
 */
export function normalizeCharacter(input: unknown): CharacterConfig {
  if (!input || typeof input !== 'object') return getDefaultCharacter();
  const c = input as Record<string, unknown>;
  // Bereits neues Schema?
  if (c.topTypeId && c.bottomTypeId && c.shoeId) return c as unknown as CharacterConfig;

  const result = { ...getDefaultCharacter() };
  if (typeof c.skinId === 'string') result.skinId = c.skinId as SkinId;
  if (typeof c.hairId === 'string') result.hairId = c.hairId as HairId;
  if (typeof c.hairColorId === 'string') result.hairColorId = c.hairColorId as HairColorId;
  if (typeof c.presetId === 'string') result.presetId = c.presetId;

  // Old combined topId: 'tshirt_red', 'hoodie_green'
  if (typeof c.topId === 'string') {
    const [type, color] = c.topId.split('_');
    if (type === 'tshirt' || type === 'hoodie' || type === 'tank') result.topTypeId = type;
    if (CLOTH_COLOR_OPTIONS.includes(color as ClothColor)) result.topColorId = color as ClothColor;
  }
  // Old combined bottomId: 'pants_blue', 'shorts_red', 'skirt_purple'
  if (typeof c.bottomId === 'string') {
    if (c.bottomId.startsWith('shorts')) result.bottomTypeId = 'short';
    else if (c.bottomId.startsWith('skirt')) result.bottomTypeId = 'skirt';
    else result.bottomTypeId = 'long';
    const parts = c.bottomId.split('_');
    const color = parts[1];
    if (color && CLOTH_COLOR_OPTIONS.includes(color as ClothColor)) result.bottomColorId = color as ClothColor;
  }
  return result;
}
