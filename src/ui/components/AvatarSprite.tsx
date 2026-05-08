import PixelCharacter from './PixelCharacter';
import type { CharacterConfig } from '@engine/avatar/character';

/**
 * Wrapper für Profil-Kacheln. Zeigt den Pixel-Charakter mit dezentem
 * Hintergrund-Verlauf, sodass das Profilbild gut wirkt.
 */
interface Props {
  config: CharacterConfig;
  size?: number;
}

export default function AvatarSprite({ config, size = 120 }: Props) {
  return (
    <div
      className="rounded-3xl overflow-hidden border-4 border-white/10 shadow-lg flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(160deg, #4338ca, #312e81)',
      }}
    >
      <PixelCharacter config={config} size={size * 0.85} bg={null} />
    </div>
  );
}
