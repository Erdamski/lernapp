import { useEffect, useState } from 'react';
import { audio } from '@engine/audio/AudioPlayer';
import { sfx } from '@engine/audio/SoundPlayer';
import PixelIcon from './PixelIcon';

const STORAGE_KEY = 'lernapp:sound-enabled';

/**
 * Globaler Sound-On/Off-Toggle. Persistiert in localStorage.
 * Steuert sowohl Voice-Audio (ElevenLabs / TTS) als auch Sound-Effekte
 * (button-tap, coin, …). Ein Klick macht beides aus oder an.
 */
export default function SoundToggle({ className = '' }: { className?: string }) {
  const initial = readStored();
  const [enabled, setEnabled] = useState(initial);

  useEffect(() => {
    audio.setEnabled(enabled);
    sfx.setEnabled(enabled);
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch {
      // ignore storage errors
    }
  }, [enabled]);

  const toggle = () => {
    setEnabled((v) => !v);
    if (!enabled) {
      // Beim Anschalten kurz pingen, damit Kind hört dass Sound an ist
      window.setTimeout(() => sfx.buttonTap(), 100);
    } else {
      audio.stop();
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Ton aus' : 'Ton an'}
      className={`pixel-btn bg-bg-card border-0 shadow-pixel-sm shadow-ink p-0 flex items-center justify-center w-12 h-12 ${className}`}
    >
      <PixelIcon name={enabled ? 'speaker' : 'speaker-off'} size={22} tone="white" />
    </button>
  );
}

function readStored(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return true;
    return raw === '1';
  } catch {
    return true;
  }
}
