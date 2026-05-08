import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileSelect from '@ui/screens/ProfileSelect';
import WorldMapScreen from '@ui/screens/WorldMapScreen';
import OnboardingScreen from '@ui/screens/OnboardingScreen';
import ParentGate from '@ui/screens/ParentGate';
import ParentDashboard from '@ui/screens/ParentDashboard';
import WelcomeOverlay from '@ui/components/WelcomeOverlay';
import AnimatedBackground from '@ui/components/AnimatedBackground';
import { useAppStore } from '@engine/state/store';
import { audio } from '@engine/audio/AudioPlayer';

type Screen = 'profile-select' | 'welcome' | 'onboarding' | 'world-map' | 'parent-gate' | 'parent-dashboard';

export default function App() {
  const { i18n } = useTranslation();
  const activeProfile = useAppStore((s) => s.activeProfile);
  const [screen, setScreen] = useState<Screen>('profile-select');
  const lastProfileId = useRef<string | null>(null);

  useEffect(() => {
    if (activeProfile) {
      i18n.changeLanguage(activeProfile.language);
      audio.setLanguage(activeProfile.language);
      // Bei einem neu (oder neuerlich) ausgewählten Profil zuerst Welcome zeigen
      if (lastProfileId.current !== activeProfile.id) {
        lastProfileId.current = activeProfile.id;
        setScreen('welcome');
      }
    } else {
      lastProfileId.current = null;
      setScreen('profile-select');
    }
  }, [activeProfile, i18n]);

  const handleWelcomeDone = () => {
    if (!activeProfile) return;
    setScreen(activeProfile.onboardingDone ? 'world-map' : 'onboarding');
  };

  // Theme-Wahl für Hintergrund je nach Screen
  const bgTheme: 'math' | 'world' | 'sky' =
    screen === 'world-map' || screen === 'onboarding'
      ? 'math'
      : screen === 'profile-select'
        ? 'sky'
        : 'world';

  return (
    <div className="w-screen h-screen overflow-hidden text-white font-body relative">
      <AnimatedBackground theme={bgTheme} />
      {screen === 'profile-select' && (
        <ProfileSelect onParentZone={() => setScreen('parent-gate')} />
      )}
      {screen === 'welcome' && activeProfile && (
        <WelcomeOverlay profile={activeProfile} onDone={handleWelcomeDone} />
      )}
      {screen === 'onboarding' && <OnboardingScreen onDone={() => setScreen('world-map')} />}
      {screen === 'world-map' && <WorldMapScreen />}
      {screen === 'parent-gate' && (
        <ParentGate onSuccess={() => setScreen('parent-dashboard')} onCancel={() => setScreen('profile-select')} />
      )}
      {screen === 'parent-dashboard' && <ParentDashboard onExit={() => setScreen('profile-select')} />}
    </div>
  );
}
