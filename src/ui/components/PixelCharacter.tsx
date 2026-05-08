import { memo } from 'react';
import {
  CLOTH_COLORS,
  HAIR_COLORS,
  SKIN_COLORS,
  type CharacterConfig,
  type HairId,
  type TopType,
  type BottomType,
  type ShoeId,
  type EquipmentId,
} from '@engine/avatar/character';

export type CharacterCrop = 'all' | 'head' | 'top' | 'bottom' | 'shoe' | 'equipment' | 'hair';

interface Props {
  config: CharacterConfig;
  size?: number;
  bg?: string | null;
  /** Zeigt nur einen Ausschnitt des Charakters (z. B. nur Kopf, nur Beine). */
  crop?: CharacterCrop;
}

const CROP_BOXES: Record<CharacterCrop, { x: number; y: number; w: number; h: number }> = {
  all:        { x: 0,  y: 0,  w: 32, h: 48 },
  head:       { x: 4,  y: 0,  w: 24, h: 22 },
  hair:       { x: 4,  y: 0,  w: 24, h: 14 },
  top:        { x: 0,  y: 18, w: 32, h: 20 },
  bottom:     { x: 4,  y: 30, w: 24, h: 16 },
  shoe:       { x: 4,  y: 38, w: 24, h: 10 },
  // Equipment-Crop zeigt die rechte Hand mit Item
  equipment:  { x: 16, y: 12, w: 16, h: 24 },
};

/**
 * Minecraft-inspirierter Pixel-Charakter, gerendert als SVG (32×48 Pixel-Grid).
 * Rendert je nach topType/bottomType/shoeId/equipmentId unterschiedliche Formen.
 */
export default memo(function PixelCharacter({ config, size = 96, bg = '#1f1d2e', crop = 'all' }: Props) {
  const skin = SKIN_COLORS[config.skinId];
  const hair = HAIR_COLORS[config.hairColorId];
  const top = CLOTH_COLORS[config.topColorId];
  const bottom = CLOTH_COLORS[config.bottomColorId];
  const box = CROP_BOXES[crop];

  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated', display: 'block' }}
    >
      {bg && <rect x="0" y="0" width="32" height="48" fill={bg} rx="4" />}

      {/* Langes Haar hinter Kopf */}
      <LongHairBack style={config.hairId} color={hair.fill} shadow={hair.shadow} />

      {/* Hals */}
      <rect x="14" y="20" width="4" height="2" fill={skin.shadow} />

      {/* Kopf */}
      <rect x="9" y="6" width="14" height="14" fill={skin.fill} />
      <rect x="9" y="18" width="14" height="2" fill={skin.shadow} />
      <rect x="22" y="6" width="1" height="14" fill={skin.shadow} />

      {/* Frisur oben */}
      <HairTop style={config.hairId} color={hair.fill} shadow={hair.shadow} />

      {/* Augen */}
      <rect x="12" y="12" width="2" height="2" fill="#1a1a1a" />
      <rect x="18" y="12" width="2" height="2" fill="#1a1a1a" />
      {/* Wangen */}
      <rect x="11" y="15" width="1" height="1" fill="#f4a8c8" opacity="0.6" />
      <rect x="20" y="15" width="1" height="1" fill="#f4a8c8" opacity="0.6" />
      {/* Mund */}
      <rect x="14" y="16" width="4" height="1" fill="#7a3624" />

      {/* Oberkörper */}
      <Top type={config.topTypeId} color={top} skin={skin} />

      {/* Beine */}
      <Bottom type={config.bottomTypeId} color={bottom} skin={skin} />

      {/* Schuhe */}
      <Shoes shoe={config.shoeId} skin={skin} />

      {/* Ausrüstung */}
      <Equipment equipment={config.equipmentId} />
    </svg>
  );
});

function HairTop({ style, color, shadow }: { style: HairId; color: string; shadow: string }) {
  switch (style) {
    case 'short':
      return (
        <>
          <rect x="9" y="4" width="14" height="4" fill={color} />
          <rect x="9" y="6" width="14" height="1" fill={shadow} />
        </>
      );
    case 'spiky':
      return (
        <>
          <rect x="9" y="5" width="14" height="3" fill={color} />
          <rect x="10" y="3" width="2" height="2" fill={color} />
          <rect x="14" y="2" width="2" height="3" fill={color} />
          <rect x="18" y="3" width="2" height="2" fill={color} />
          <rect x="20" y="2" width="2" height="3" fill={color} />
          <rect x="9" y="7" width="14" height="1" fill={shadow} />
        </>
      );
    case 'long':
      return (
        <>
          <rect x="8" y="4" width="16" height="5" fill={color} />
          <rect x="8" y="8" width="16" height="1" fill={shadow} />
        </>
      );
    case 'pony':
      return (
        <>
          <rect x="9" y="4" width="14" height="4" fill={color} />
          <rect x="9" y="6" width="14" height="1" fill={shadow} />
        </>
      );
    case 'bun':
      return (
        <>
          <rect x="9" y="4" width="14" height="4" fill={color} />
          <rect x="13" y="0" width="6" height="4" fill={color} />
          <rect x="13" y="3" width="6" height="1" fill={shadow} />
          <rect x="9" y="6" width="14" height="1" fill={shadow} />
        </>
      );
    case 'curly':
      return (
        <>
          <rect x="9" y="3" width="14" height="5" fill={color} />
          <rect x="7" y="5" width="2" height="3" fill={color} />
          <rect x="23" y="5" width="2" height="3" fill={color} />
          <rect x="11" y="2" width="2" height="2" fill={color} />
          <rect x="15" y="2" width="2" height="2" fill={color} />
          <rect x="19" y="2" width="2" height="2" fill={color} />
          <rect x="9" y="7" width="14" height="1" fill={shadow} />
        </>
      );
  }
}

function LongHairBack({ style, color, shadow }: { style: HairId; color: string; shadow: string }) {
  if (style === 'long') {
    return (
      <>
        <rect x="7" y="6" width="2" height="22" fill={color} />
        <rect x="23" y="6" width="2" height="22" fill={color} />
        <rect x="7" y="26" width="18" height="3" fill={color} />
        <rect x="7" y="28" width="18" height="1" fill={shadow} />
      </>
    );
  }
  if (style === 'pony') {
    return (
      <>
        <rect x="14" y="20" width="4" height="14" fill={color} />
        <rect x="14" y="32" width="4" height="2" fill={shadow} />
      </>
    );
  }
  if (style === 'curly') {
    return (
      <>
        <rect x="7" y="6" width="2" height="14" fill={color} />
        <rect x="23" y="6" width="2" height="14" fill={color} />
      </>
    );
  }
  return null;
}

interface ColorTriple { fill: string; shadow: string; light: string }
interface SkinPair { fill: string; shadow: string }

function Top({ type, color, skin }: { type: TopType; color: ColorTriple; skin: SkinPair }) {
  // Gemeinsamer Torso-Block
  const torso = (
    <>
      <rect x="8" y="22" width="16" height="13" fill={color.fill} />
      <rect x="8" y="33" width="16" height="2" fill={color.shadow} />
      <rect x="22" y="22" width="2" height="13" fill={color.shadow} />
      <rect x="13" y="22" width="6" height="2" fill={color.shadow} />
    </>
  );

  switch (type) {
    case 'tshirt':
      return (
        <>
          {torso}
          {/* Kurze Ärmel */}
          <rect x="4" y="22" width="4" height="5" fill={color.fill} />
          <rect x="4" y="26" width="4" height="1" fill={color.shadow} />
          <rect x="24" y="22" width="4" height="5" fill={color.fill} />
          <rect x="24" y="26" width="4" height="1" fill={color.shadow} />
          {/* Unterarme = Haut */}
          <rect x="4" y="27" width="4" height="6" fill={skin.fill} />
          <rect x="4" y="33" width="4" height="2" fill={skin.shadow} />
          <rect x="24" y="27" width="4" height="6" fill={skin.fill} />
          <rect x="24" y="33" width="4" height="2" fill={skin.shadow} />
        </>
      );
    case 'hoodie':
      return (
        <>
          {torso}
          {/* Lange Ärmel komplett farbig */}
          <rect x="4" y="22" width="4" height="11" fill={color.fill} />
          <rect x="4" y="33" width="4" height="2" fill={color.shadow} />
          <rect x="24" y="22" width="4" height="11" fill={color.fill} />
          <rect x="24" y="33" width="4" height="2" fill={color.shadow} />
          {/* Kapuzenrand am Hals */}
          <rect x="11" y="20" width="10" height="2" fill={color.shadow} />
          {/* Reißverschluss-Linie */}
          <rect x="15" y="22" width="2" height="13" fill={color.shadow} />
        </>
      );
    case 'tank':
      return (
        <>
          {/* Schmaler Tank, Schultern frei */}
          <rect x="10" y="22" width="12" height="13" fill={color.fill} />
          <rect x="10" y="33" width="12" height="2" fill={color.shadow} />
          <rect x="20" y="22" width="2" height="13" fill={color.shadow} />
          {/* Träger */}
          <rect x="11" y="22" width="2" height="2" fill={color.fill} />
          <rect x="19" y="22" width="2" height="2" fill={color.fill} />
          {/* Schultern + Arme = Haut */}
          <rect x="8" y="22" width="2" height="11" fill={skin.fill} />
          <rect x="22" y="22" width="2" height="11" fill={skin.fill} />
          <rect x="4" y="22" width="4" height="11" fill={skin.fill} />
          <rect x="4" y="33" width="4" height="2" fill={skin.shadow} />
          <rect x="24" y="22" width="4" height="11" fill={skin.fill} />
          <rect x="24" y="33" width="4" height="2" fill={skin.shadow} />
        </>
      );
  }
}

function Bottom({
  type,
  color,
  skin,
}: {
  type: BottomType;
  color: ColorTriple;
  skin: SkinPair;
}) {
  switch (type) {
    case 'long':
      return (
        <>
          <rect x="9" y="35" width="6" height="11" fill={color.fill} />
          <rect x="17" y="35" width="6" height="11" fill={color.fill} />
          <rect x="9" y="44" width="6" height="2" fill={color.shadow} />
          <rect x="17" y="44" width="6" height="2" fill={color.shadow} />
        </>
      );
    case 'short':
      return (
        <>
          {/* Shorts kurz, dann nackte Unterschenkel */}
          <rect x="9" y="35" width="6" height="5" fill={color.fill} />
          <rect x="17" y="35" width="6" height="5" fill={color.fill} />
          <rect x="9" y="39" width="6" height="1" fill={color.shadow} />
          <rect x="17" y="39" width="6" height="1" fill={color.shadow} />
          <rect x="9" y="40" width="6" height="6" fill={skin.fill} />
          <rect x="17" y="40" width="6" height="6" fill={skin.fill} />
          <rect x="9" y="44" width="6" height="2" fill={skin.shadow} />
          <rect x="17" y="44" width="6" height="2" fill={skin.shadow} />
        </>
      );
    case 'jeans':
      return (
        <>
          <rect x="9" y="35" width="6" height="11" fill={color.fill} />
          <rect x="17" y="35" width="6" height="11" fill={color.fill} />
          <rect x="9" y="44" width="6" height="2" fill={color.shadow} />
          <rect x="17" y="44" width="6" height="2" fill={color.shadow} />
          {/* Naht */}
          <rect x="11" y="36" width="1" height="9" fill={color.light} opacity="0.5" />
          <rect x="20" y="36" width="1" height="9" fill={color.light} opacity="0.5" />
          {/* Tasche */}
          <rect x="13" y="36" width="2" height="3" fill={color.shadow} />
          <rect x="17" y="36" width="2" height="3" fill={color.shadow} />
        </>
      );
    case 'skirt':
      return (
        <>
          {/* Glockenform */}
          <rect x="7" y="35" width="18" height="6" fill={color.fill} />
          <rect x="7" y="40" width="18" height="1" fill={color.shadow} />
          {/* Beine = Haut darunter */}
          <rect x="9" y="41" width="6" height="5" fill={skin.fill} />
          <rect x="17" y="41" width="6" height="5" fill={skin.fill} />
          <rect x="9" y="44" width="6" height="2" fill={skin.shadow} />
          <rect x="17" y="44" width="6" height="2" fill={skin.shadow} />
        </>
      );
  }
}

function Shoes({ shoe, skin }: { shoe: ShoeId; skin: SkinPair }) {
  switch (shoe) {
    case 'sneaker':
      return (
        <>
          <rect x="9" y="46" width="6" height="2" fill="#262626" />
          <rect x="17" y="46" width="6" height="2" fill="#262626" />
          <rect x="9" y="46" width="6" height="1" fill="#ffffff" opacity="0.4" />
          <rect x="17" y="46" width="6" height="1" fill="#ffffff" opacity="0.4" />
        </>
      );
    case 'boot':
      return (
        <>
          <rect x="9" y="44" width="6" height="4" fill="#3d2510" />
          <rect x="17" y="44" width="6" height="4" fill="#3d2510" />
          <rect x="9" y="47" width="6" height="1" fill="#1a1a1a" />
          <rect x="17" y="47" width="6" height="1" fill="#1a1a1a" />
        </>
      );
    case 'barefoot':
      return (
        <>
          <rect x="9" y="46" width="6" height="2" fill={skin.fill} />
          <rect x="17" y="46" width="6" height="2" fill={skin.fill} />
        </>
      );
  }
}

function Equipment({ equipment }: { equipment: EquipmentId }) {
  // Items werden vor dem rechten Arm gerendert (x ≈ 24–30, y ≈ 18–35),
  // sodass es klar in der Hand liegt – nicht hinter dem Rücken.
  switch (equipment) {
    case 'wand':
      return (
        <>
          {/* Stab schräg vom Hand-Bereich nach oben */}
          <rect x="26" y="32" width="2" height="2" fill="#5b3a1a" />
          <rect x="26" y="28" width="2" height="4" fill="#5b3a1a" />
          <rect x="26" y="22" width="2" height="6" fill="#92400e" />
          <rect x="26" y="18" width="2" height="4" fill="#5b3a1a" />
          {/* Stern oben */}
          <rect x="25" y="14" width="4" height="4" fill="#facc15" />
          <rect x="24" y="15" width="6" height="2" fill="#facc15" />
          <rect x="25" y="13" width="4" height="1" fill="#fef08a" />
          <rect x="23" y="16" width="1" height="1" fill="#fef08a" />
          <rect x="30" y="16" width="1" height="1" fill="#fef08a" />
        </>
      );
    case 'sword':
      return (
        <>
          {/* Klinge nach oben gehalten */}
          <rect x="26" y="14" width="2" height="14" fill="#e2e8f0" />
          <rect x="26" y="14" width="1" height="14" fill="#ffffff" />
          <rect x="27" y="14" width="1" height="14" fill="#94a3b8" />
          <rect x="26" y="13" width="2" height="1" fill="#cbd5e1" />
          {/* Parierstange */}
          <rect x="24" y="28" width="6" height="2" fill="#5b3a1a" />
          <rect x="24" y="28" width="6" height="1" fill="#a16207" />
          {/* Griff */}
          <rect x="26" y="30" width="2" height="4" fill="#5b3a1a" />
          {/* Knauf */}
          <rect x="25" y="34" width="4" height="2" fill="#facc15" />
        </>
      );
    case 'shield':
      return (
        <>
          {/* Schild groß vor rechtem Arm */}
          <rect x="24" y="22" width="8" height="14" fill="#92400e" />
          <rect x="24" y="22" width="8" height="2" fill="#a16207" />
          <rect x="24" y="34" width="8" height="2" fill="#7c2d12" />
          {/* Innerer Schmuck (Plus-Symbol) */}
          <rect x="27" y="24" width="2" height="10" fill="#facc15" />
          <rect x="24" y="28" width="8" height="2" fill="#facc15" />
          {/* Outline */}
          <rect x="23" y="22" width="1" height="14" fill="#0a0a14" />
          <rect x="32" y="22" width="1" height="14" fill="#0a0a14" />
        </>
      );
    case 'none':
    default:
      return null;
  }
}
