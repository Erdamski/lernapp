import { memo } from 'react';

/**
 * Pixel-Art-Landmarks für die Welt-Karte. 8 verschiedene Sprites,
 * jeweils 64×64 ViewBox, skalierbar via size-Prop.
 */

export type LandmarkKind =
  | 'start_house'
  | 'split_tree'
  | 'plus_monument'
  | 'minus_cave'
  | 'tower'
  | 'bridge'
  | 'mountain'
  | 'castle';

interface Props {
  kind: LandmarkKind;
  size?: number;
  unlocked?: boolean;
}

const sr = { shapeRendering: 'crispEdges' as const, imageRendering: 'pixelated' as const };

export default memo(function MapLandmark({ kind, size = 80, unlocked = true }: Props) {
  const opacity = unlocked ? 1 : 0.4;
  const grayscale = unlocked ? 'none' : 'grayscale(0.8)';
  return (
    <div style={{ width: size, height: size, opacity, filter: grayscale }}>
      {kind === 'start_house' && <StartHouse />}
      {kind === 'split_tree' && <SplitTree />}
      {kind === 'plus_monument' && <PlusMonument />}
      {kind === 'minus_cave' && <MinusCave />}
      {kind === 'tower' && <Tower />}
      {kind === 'bridge' && <Bridge />}
      {kind === 'mountain' && <Mountain />}
      {kind === 'castle' && <Castle />}
    </div>
  );
});

function StartHouse() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={sr}>
      {/* Roof */}
      <polygon points="8,28 32,8 56,28" fill="#dc2626" />
      <polygon points="32,8 56,28 32,28" fill="#991b1b" />
      <rect x="6" y="26" width="52" height="3" fill="#0a0a14" />
      {/* Body */}
      <rect x="12" y="28" width="40" height="32" fill="#fbbf24" />
      <rect x="12" y="28" width="40" height="2" fill="#a16207" />
      <rect x="12" y="58" width="40" height="2" fill="#7c2d12" />
      <rect x="12" y="28" width="2" height="32" fill="#0a0a14" />
      <rect x="50" y="28" width="2" height="32" fill="#0a0a14" />
      {/* Door */}
      <rect x="28" y="42" width="8" height="18" fill="#5b3a1a" />
      <rect x="34" y="50" width="1" height="1" fill="#facc15" />
      {/* Window */}
      <rect x="16" y="34" width="8" height="6" fill="#60a5fa" />
      <rect x="40" y="34" width="8" height="6" fill="#60a5fa" />
      <rect x="20" y="34" width="1" height="6" fill="#0a0a14" />
      <rect x="44" y="34" width="1" height="6" fill="#0a0a14" />
      {/* Sign "1-10" */}
      <rect x="2" y="44" width="14" height="6" fill="#fef9c3" stroke="#0a0a14" strokeWidth="1" />
      <text x="9" y="49" textAnchor="middle" fill="#0a0a14" fontFamily="Press Start 2P" fontSize="3.5">1-10</text>
    </svg>
  );
}

function SplitTree() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={sr}>
      {/* Trunk */}
      <rect x="28" y="38" width="8" height="22" fill="#5b3a1a" />
      <rect x="28" y="38" width="2" height="22" fill="#3e2710" />
      {/* Two branches */}
      <rect x="14" y="34" width="12" height="3" fill="#5b3a1a" />
      <rect x="38" y="34" width="12" height="3" fill="#5b3a1a" />
      {/* Left foliage with apple */}
      <rect x="6" y="14" width="22" height="20" fill="#16a34a" />
      <rect x="6" y="14" width="22" height="3" fill="#86efac" />
      <rect x="14" y="22" width="6" height="6" fill="#dc2626" />
      <rect x="15" y="23" width="2" height="2" fill="#fca5a5" />
      {/* Right foliage with apple */}
      <rect x="36" y="14" width="22" height="20" fill="#16a34a" />
      <rect x="36" y="14" width="22" height="3" fill="#86efac" />
      <rect x="44" y="22" width="6" height="6" fill="#dc2626" />
      <rect x="45" y="23" width="2" height="2" fill="#fca5a5" />
      {/* Outline */}
      <rect x="6" y="14" width="22" height="1" fill="#0a0a14" />
      <rect x="36" y="14" width="22" height="1" fill="#0a0a14" />
      <rect x="6" y="33" width="22" height="1" fill="#0a0a14" />
      <rect x="36" y="33" width="22" height="1" fill="#0a0a14" />
      <rect x="5" y="14" width="1" height="20" fill="#0a0a14" />
      <rect x="28" y="14" width="1" height="20" fill="#0a0a14" />
      <rect x="35" y="14" width="1" height="20" fill="#0a0a14" />
      <rect x="58" y="14" width="1" height="20" fill="#0a0a14" />
    </svg>
  );
}

function PlusMonument() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={sr}>
      {/* Base */}
      <rect x="12" y="50" width="40" height="10" fill="#94a3b8" />
      <rect x="12" y="50" width="40" height="2" fill="#cbd5e1" />
      <rect x="12" y="58" width="40" height="2" fill="#475569" />
      {/* Pillar */}
      <rect x="22" y="20" width="20" height="32" fill="#cbd5e1" />
      <rect x="22" y="20" width="2" height="32" fill="#94a3b8" />
      <rect x="40" y="20" width="2" height="32" fill="#475569" />
      <rect x="22" y="20" width="20" height="2" fill="#0a0a14" />
      {/* Plus carved into pillar */}
      <rect x="29" y="28" width="6" height="2" fill="#0a0a14" />
      <rect x="29" y="32" width="6" height="2" fill="#0a0a14" />
      <rect x="29" y="36" width="6" height="2" fill="#0a0a14" />
      <rect x="30" y="26" width="4" height="14" fill="#16a34a" />
      <rect x="26" y="30" width="12" height="4" fill="#16a34a" />
      <rect x="30" y="26" width="4" height="1" fill="#86efac" />
      {/* Outline */}
      <rect x="11" y="50" width="1" height="10" fill="#0a0a14" />
      <rect x="52" y="50" width="1" height="10" fill="#0a0a14" />
    </svg>
  );
}

function MinusCave() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={sr}>
      {/* Hill */}
      <polygon points="0,60 8,40 16,32 32,28 48,32 56,40 64,60" fill="#475569" />
      <polygon points="0,60 8,40 16,32 32,28 48,32 56,40 64,60" fill="#334155" opacity="0.6" />
      <rect x="0" y="60" width="64" height="4" fill="#0a0a14" />
      {/* Cave entrance */}
      <rect x="22" y="38" width="20" height="22" fill="#0a0a14" />
      <rect x="20" y="36" width="24" height="2" fill="#1e293b" />
      <rect x="22" y="38" width="2" height="22" fill="#1e293b" />
      <rect x="40" y="38" width="2" height="22" fill="#1e293b" />
      {/* Minus sign on wall */}
      <rect x="26" y="46" width="12" height="4" fill="#dc2626" />
      <rect x="26" y="46" width="12" height="1" fill="#fca5a5" />
      {/* Grass tuft */}
      <rect x="4" y="58" width="6" height="2" fill="#16a34a" />
      <rect x="54" y="58" width="6" height="2" fill="#16a34a" />
    </svg>
  );
}

function Tower() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={sr}>
      {/* Tower body */}
      <rect x="22" y="14" width="20" height="46" fill="#a78bfa" />
      <rect x="22" y="14" width="2" height="46" fill="#7c3aed" />
      <rect x="40" y="14" width="2" height="46" fill="#5b21b6" />
      {/* Battlements */}
      <rect x="22" y="14" width="3" height="4" fill="#a78bfa" />
      <rect x="29" y="14" width="3" height="4" fill="#a78bfa" />
      <rect x="36" y="14" width="3" height="4" fill="#a78bfa" />
      <rect x="22" y="11" width="3" height="3" fill="#a78bfa" />
      <rect x="29" y="11" width="3" height="3" fill="#a78bfa" />
      <rect x="36" y="11" width="3" height="3" fill="#a78bfa" />
      {/* Window */}
      <rect x="29" y="24" width="6" height="8" fill="#0a0a14" />
      <rect x="29" y="24" width="6" height="2" fill="#1e293b" />
      {/* Door */}
      <rect x="28" y="44" width="8" height="16" fill="#5b3a1a" />
      <rect x="28" y="44" width="2" height="16" fill="#3e2710" />
      {/* Sign "20" */}
      <rect x="26" y="36" width="12" height="6" fill="#fef9c3" stroke="#0a0a14" strokeWidth="1" />
      <text x="32" y="41" textAnchor="middle" fill="#0a0a14" fontFamily="Press Start 2P" fontSize="4">20</text>
      {/* Roof flag */}
      <rect x="31" y="4" width="2" height="10" fill="#5b3a1a" />
      <rect x="33" y="4" width="6" height="4" fill="#dc2626" />
      {/* Outline */}
      <rect x="21" y="14" width="1" height="46" fill="#0a0a14" />
      <rect x="42" y="14" width="1" height="46" fill="#0a0a14" />
    </svg>
  );
}

function Bridge() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={sr}>
      {/* Water */}
      <rect x="0" y="42" width="64" height="22" fill="#3b82f6" />
      <rect x="0" y="42" width="64" height="2" fill="#93c5fd" />
      <rect x="0" y="50" width="64" height="1" fill="#60a5fa" />
      {/* Bridge arch */}
      <path d="M 6 42 Q 32 24 58 42" fill="none" stroke="#5b3a1a" strokeWidth="6" />
      <path d="M 6 44 Q 32 26 58 44" fill="none" stroke="#3e2710" strokeWidth="2" />
      {/* Bridge deck */}
      <rect x="4" y="38" width="56" height="6" fill="#a16207" />
      <rect x="4" y="38" width="56" height="2" fill="#fbbf24" />
      <rect x="4" y="42" width="56" height="2" fill="#5b3a1a" />
      {/* Posts */}
      <rect x="6" y="32" width="3" height="6" fill="#5b3a1a" />
      <rect x="55" y="32" width="3" height="6" fill="#5b3a1a" />
      <rect x="30" y="32" width="3" height="6" fill="#5b3a1a" />
      {/* Plus and Minus signs above */}
      <rect x="14" y="22" width="8" height="8" fill="#16a34a" />
      <text x="18" y="28" textAnchor="middle" fill="#fff" fontFamily="Press Start 2P" fontSize="6">+</text>
      <rect x="42" y="22" width="8" height="8" fill="#dc2626" />
      <text x="46" y="28" textAnchor="middle" fill="#fff" fontFamily="Press Start 2P" fontSize="6">−</text>
    </svg>
  );
}

function Mountain() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={sr}>
      {/* Big mountain */}
      <polygon points="32,4 4,60 60,60" fill="#64748b" />
      <polygon points="32,4 60,60 32,60" fill="#475569" />
      {/* Snow cap */}
      <polygon points="32,4 22,20 30,18 28,22 36,20 42,20" fill="#f1f5f9" />
      <polygon points="32,4 28,12 32,10 36,14 42,20 32,4" fill="#e2e8f0" />
      {/* Path zigzag */}
      <rect x="20" y="40" width="8" height="2" fill="#fbbf24" />
      <rect x="28" y="44" width="8" height="2" fill="#fbbf24" />
      <rect x="36" y="48" width="8" height="2" fill="#fbbf24" />
      {/* "10" sign */}
      <rect x="44" y="54" width="14" height="6" fill="#fef9c3" stroke="#0a0a14" strokeWidth="1" />
      <text x="51" y="59" textAnchor="middle" fill="#0a0a14" fontFamily="Press Start 2P" fontSize="3.5">→10</text>
      {/* Outline */}
      <polygon points="32,4 4,60 60,60" fill="none" stroke="#0a0a14" strokeWidth="1" />
    </svg>
  );
}

function Castle() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={sr}>
      {/* Body */}
      <rect x="10" y="24" width="44" height="36" fill="#a3a3a3" />
      <rect x="10" y="24" width="44" height="2" fill="#d4d4d4" />
      <rect x="10" y="58" width="44" height="2" fill="#525252" />
      {/* Towers (sides) */}
      <rect x="6" y="18" width="10" height="42" fill="#a3a3a3" />
      <rect x="48" y="18" width="10" height="42" fill="#a3a3a3" />
      <rect x="6" y="18" width="10" height="2" fill="#d4d4d4" />
      <rect x="48" y="18" width="10" height="2" fill="#d4d4d4" />
      {/* Battlements top */}
      <rect x="6" y="14" width="3" height="4" fill="#a3a3a3" />
      <rect x="13" y="14" width="3" height="4" fill="#a3a3a3" />
      <rect x="48" y="14" width="3" height="4" fill="#a3a3a3" />
      <rect x="55" y="14" width="3" height="4" fill="#a3a3a3" />
      <rect x="10" y="20" width="3" height="4" fill="#a3a3a3" />
      <rect x="17" y="20" width="3" height="4" fill="#a3a3a3" />
      <rect x="24" y="20" width="3" height="4" fill="#a3a3a3" />
      <rect x="31" y="20" width="3" height="4" fill="#a3a3a3" />
      <rect x="38" y="20" width="3" height="4" fill="#a3a3a3" />
      <rect x="45" y="20" width="3" height="4" fill="#a3a3a3" />
      {/* Center tower */}
      <rect x="26" y="10" width="12" height="14" fill="#a3a3a3" />
      <rect x="26" y="10" width="2" height="14" fill="#d4d4d4" />
      <rect x="36" y="10" width="2" height="14" fill="#525252" />
      <polygon points="22,10 42,10 32,2" fill="#dc2626" />
      <rect x="32" y="2" width="1" height="6" fill="#5b3a1a" />
      <rect x="33" y="3" width="6" height="3" fill="#fbbf24" />
      {/* Door (drawbridge) */}
      <rect x="26" y="42" width="12" height="18" fill="#5b3a1a" />
      <path d="M 26 42 L 32 36 L 38 42" fill="#5b3a1a" />
      <rect x="26" y="42" width="2" height="18" fill="#3e2710" />
      <rect x="36" y="42" width="2" height="18" fill="#3e2710" />
      {/* Window in center tower */}
      <rect x="30" y="14" width="4" height="6" fill="#0a0a14" />
      {/* Outlines */}
      <rect x="9" y="18" width="1" height="42" fill="#0a0a14" />
      <rect x="58" y="18" width="1" height="42" fill="#0a0a14" />
      <rect x="6" y="18" width="10" height="1" fill="#0a0a14" />
      <rect x="48" y="18" width="10" height="1" fill="#0a0a14" />
    </svg>
  );
}
