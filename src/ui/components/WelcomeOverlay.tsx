import { useEffect, useState } from 'react';
import { audio } from '@engine/audio/AudioPlayer';
import { getRandomWelcomeBackKey } from '@engine/audio/manifest';
import PixelCharacter from './PixelCharacter';
import PixelTitle from './PixelTitle';
import type { Profile } from '@engine/db/schema';

interface Props {
  profile: Profile;
  onDone: () => void;
}

/**
 * Begrüßungs-Overlay: zeigt nach Profil-Auswahl Avatar + Name groß an
 * und spielt eine zufällige Audio-Begrüßung in der Profil-Sprache.
 */
export default function WelcomeOverlay({ profile, onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const key = profile.onboardingDone ? getRandomWelcomeBackKey() : 'ui/welcome_first';
    audio.setLanguage(profile.language);
    audio.play(key, { fallbackToTTS: true, lang: profile.language });

    const nameTimer = window.setTimeout(() => {
      audio.speak(profile.name, profile.language);
    }, 600);

    const closeTimer = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onDone, 300);
    }, 2800);

    return () => {
      window.clearTimeout(nameTimer);
      window.clearTimeout(closeTimer);
    };
  }, [profile, onDone]);

  return (
    <div
      onClick={() => {
        setVisible(false);
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
      <div className="mt-8 text-sm font-pixel text-white/40">tippen zum Weiter</div>
    </div>
  );
}
