import { memo } from 'react';
import {
  BOTTOM_COLORS,
  HAIR_COLORS,
  SKIN_COLORS,
  TOP_COLORS,
  type CharacterConfig,
  type HairId,
} from '@engine/avatar/character';

interface Props {
  config: CharacterConfig;
  size?: number;
  bg?: string | null;       // Hintergrund-Farbe der Kachel; null = transparent
}

/**
 * Minecraft-inspirierter Pixel-Charakter, gerendert als SVG.
 * 32 x 48 Pixel-Grid. shapeRendering="crispEdges" sorgt für scharfe Pixel-Optik.
 *
 * memo, da der Charakter oft mit gleichen Props re-rendert
 * (z. B. in ProgressRoute bei jedem Render des übergeordneten Screens).
 */
export default memo(function PixelCharacter({ config, size = 96, bg = '#1f1d2e' }: Props) {
  const skin = SKIN_COLORS[config.skinId];
  const hair = HAIR_COLORS[config.hairColorId];
  const top = TOP_COLORS[config.topId];
  const bottom = BOTTOM_COLORS[config.bottomId];

  return (
    <svg
      viewBox="0 0 32 48"
      width={size}
      height={size * 1.0}
      style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated', display: 'block' }}
    >
      {bg && <rect x="0" y="0" width="32" height="48" fill={bg} rx="4" />}

      {/* langes Haar hinter Kopf */}
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

      {/* Körper / Oberteil */}
      <rect x="8" y="22" width="16" height="13" fill={top.fill} />
      <rect x="8" y="33" width="16" height="2" fill={top.shadow} />
      <rect x="22" y="22" width="2" height="13" fill={top.shadow} />
      {/* Halsausschnitt */}
      <rect x="13" y="22" width="6" height="2" fill={top.shadow} />

      {/* Arme */}
      <rect x="4" y="22" width="4" height="11" fill={skin.fill} />
      <rect x="4" y="33" width="4" height="2" fill={skin.shadow} />
      <rect x="24" y="22" width="4" height="11" fill={skin.fill} />
      <rect x="24" y="33" width="4" height="2" fill={skin.shadow} />

      {/* Beine / Hose */}
      <rect x="9" y="35" width="6" height="11" fill={bottom.fill} />
      <rect x="17" y="35" width="6" height="11" fill={bottom.fill} />
      <rect x="9" y="44" width="6" height="2" fill={bottom.shadow} />
      <rect x="17" y="44" width="6" height="2" fill={bottom.shadow} />

      {/* Schuhe */}
      <rect x="9" y="46" width="6" height="2" fill="#262626" />
      <rect x="17" y="46" width="6" height="2" fill="#262626" />
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
