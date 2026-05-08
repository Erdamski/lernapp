import { useEffect, useRef, useState } from 'react';
import { audio } from '@engine/audio/AudioPlayer';
import { getOrGenerateWelcomeAudio, welcomeText } from '@engine/audio/elevenLabsClient';
import PixelCharacter from './PixelCharacter';
import PixelTitle from './PixelTitle';
import type { Profile } from '@engine/db/schema';

interface Props {
  profile: Profile;
  onDone: () => void;
}

/**
 * Begrüßungs-Overlay: zeigt nach Profil-Auswahl Avatar + Name groß an
 * und spielt eine personalisierte Audio-Begrüßung mit Namen via ElevenLabs.
 * Audio wird gecacht in IndexedDB; bei Namensänderung wird neu generiert.
 */
export default function WelcomeOverlay({ profile, onDone }: Props) {
  const [visible, setVisible] = useState(true);
  const [audioState, setAudioState] = useState<'loading' | 'playing' | 'fallback'>('loading');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    audio.setLanguage(profile.language);

    const playPersonalized = async () => {
      const text = welcomeText(profile.name, profile.language, profile.onboardingDone);
      const blob = await getOrGenerateWelcomeAudio(profile.id, text, profile.language);

      if (cancelled) return;

      if (blob) {
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        const audioEl = new Audio(url);
        audioRef.current = audioEl;
        audioEl.play().catch((err) => console.warn('[Welcome] play failed', err));
        setAudioState('playing');
      } else {
        // Fallback: Browser-TTS spricht den Satz inkl. Namen
        audio.speak(text, profile.language);
        setAudioState('fallback');
      }
    };

    playPersonalized();

    // Auto-Dismiss nach festem Timeout (egal ob Audio noch spielt)
    const closeTimer = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onDone, 300);
    }, 3500);

    return () => {
      cancelled = true;
      window.clearTimeout(closeTimer);
      if (audioRef.current) audioRef.current.pause();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [profile, onDone]);

  return (
    <div
      onClick={() => {
        setVisible(false);
        if (audioRef.current) audioRef.current.pause();
        setTimeout(onDone, 200);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-bg-deep to-bg-mid transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="animate-pop">
        <PixelCharacter config={profile.character} size={260} bg={null} />
      </div>
      <PixelTitle size="xl" color="gold" className="mt-6 animate-pop">
        HI, {profile.name.toUpperCase()}!
      </PixelTitle>
      <div className="mt-4 text-2xl font-display text-white/70 animate-pop" style={{ animationDelay: '240ms' }}>
        {profile.onboardingDone ? 'Schön, dass du wieder da bist!' : 'Lass uns dein Abenteuer starten!'}
      </div>
      {audioState === 'loading' && (
        <div className="mt-6 font-pixel text-[10px] text-white/30">stimme lädt …</div>
      )}
      <div className="mt-8 text-sm font-pixel text-white/40">tippen zum Weiter</div>
    </div>
  );
}
