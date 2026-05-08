import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileSelect from '@ui/screens/ProfileSelect';
import WorldMapScreen from '@ui/screens/WorldMapScreen';
import OnboardingScreen from '@ui/screens/OnboardingScreen';
import ParentGate from '@ui/screens/ParentGate';
import ParentDashboard from '@ui/screens/ParentDashboard';
import { useAppStore } from '@engine/state/store';

type Screen = 'profile-select' | 'onboarding' | 'world-map' | 'parent-gate' | 'parent-dashboard';

export default function App() {
  const { i18n } = useTranslation();
  const activeProfile = useAppStore((s) => s.activeProfile);
  const [screen, setScreen] = useState<Screen>('profile-select');

  useEffect(() => {
    if (activeProfile) {
      i18n.changeLanguage(activeProfile.language);
      setScreen(activeProfile.onboardingDone ? 'world-map' : 'onboarding');
    } else {
      setScreen('profile-select');
    }
  }, [activeProfile, i18n]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-indigo-950 text-white font-body">
      {screen === 'profile-select' && (
        <ProfileSelect onParentZone={() => setScreen('parent-gate')} />
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
