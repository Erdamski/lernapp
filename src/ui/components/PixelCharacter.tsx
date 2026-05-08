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

interface Props {
  config: CharacterConfig;
  size?: number;
  bg?: string | null;
}

/**
 * Minecraft-inspirierter Pixel-Charakter, gerendert als SVG (32×48 Pixel-Grid).
 * Rendert je nach topType/bottomType/shoeId/equipmentId unterschiedliche Formen.
 */
export default memo(function PixelCharacter({ config, size = 96, bg = '#1f1d2e' }: Props) {
  const skin = SKIN_COLORS[config.skinId];
  const hair = HAIR_COLORS[config.hairColorId];
  const top = CLOTH_COLORS[config.topColorId];
  const bottom = CLOTH_COLORS[config.bottomColorId];

  return (
    <svg
      viewBox="0 0 32 48"
      width={size}
      height={size}
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
      <Bottom type={config.bottomTypeId} color={bottom} skin={skin} dressColor={config.topTypeId === 'dress' ? top : undefined} />

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
    case 'dress':
      return (
        <>
          {torso}
          {/* Kurze Ärmel */}
          <rect x="4" y="22" width="4" height="5" fill={color.fill} />
          <rect x="4" y="26" width="4" height="1" fill={color.shadow} />
          <rect x="24" y="22" width="4" height="5" fill={color.fill} />
          <rect x="24" y="26" width="4" height="1" fill={color.shadow} />
          <rect x="4" y="27" width="4" height="6" fill={skin.fill} />
          <rect x="4" y="33" width="4" height="2" fill={skin.shadow} />
          <rect x="24" y="27" width="4" height="6" fill={skin.fill} />
          <rect x="24" y="33" width="4" height="2" fill={skin.shadow} />
          {/* Kleid-Glocke unten */}
          <rect x="6" y="35" width="20" height="6" fill={color.fill} />
          <rect x="6" y="40" width="20" height="1" fill={color.shadow} />
        </>
      );
  }
}

function Bottom({
  type,
  color,
  skin,
  dressColor,
}: {
  type: BottomType;
  color: ColorTriple;
  skin: SkinPair;
  dressColor?: ColorTriple;
}) {
  // Wenn Kleid getragen wird, fällt der Rock-Bereich darunter weg (Beine = nackt).
  if (dressColor) {
    return (
      <>
        <rect x="9" y="41" width="6" height="5" fill={skin.fill} />
        <rect x="17" y="41" width="6" height="5" fill={skin.fill} />
      </>
    );
  }

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
  switch (equipment) {
    case 'wand':
      return (
        <>
          <rect x="2" y="20" width="2" height="2" fill="#fbbf24" />
          <rect x="2" y="22" width="1" height="10" fill="#5b3a1a" />
        </>
      );
    case 'sword':
      return (
        <>
          <rect x="0" y="22" width="3" height="2" fill="#5b3a1a" />
          <rect x="3" y="20" width="1" height="6" fill="#cbd5e1" />
          <rect x="2" y="19" width="3" height="1" fill="#cbd5e1" />
        </>
      );
    case 'shield':
      return (
        <>
          <rect x="1" y="24" width="3" height="6" fill="#92400e" />
          <rect x="2" y="25" width="1" height="4" fill="#fbbf24" />
        </>
      );
    case 'none':
    default:
      return null;
  }
}
