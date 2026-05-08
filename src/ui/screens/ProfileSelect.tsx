import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import AvatarSprite from '@ui/components/AvatarSprite';
import PixelButton from '@ui/components/PixelButton';
import PixelIcon from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
import { LANGUAGE_LABELS } from '@i18n/init';
import PinPad from '@ui/components/PinPad';
import CharacterWizard from './CharacterWizard';

interface Props {
  onParentZone: () => void;
}

export default function ProfileSelect({ onParentZone }: Props) {
  const { t } = useTranslation();
  const profiles = useAppStore((s) => s.profiles);
  const loadProfiles = useAppStore((s) => s.loadProfiles);
  const selectProfile = useAppStore((s) => s.selectProfile);
  const createProfile = useAppStore((s) => s.createProfile);
  const [showWizard, setShowWizard] = useState(false);
  const [pinFor, setPinFor] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const profileForPin = pinFor ? profiles.find((p) => p.id === pinFor) : null;

  if (showWizard) {
    return (
      <CharacterWizard
        mode="create"
        onCancel={() => setShowWizard(false)}
        onSubmit={async ({ character, name, age, language }) => {
          await createProfile({ character, name, age, language });
          setShowWizard(false);
        }}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-6 overflow-y-auto">
      <PixelTitle size="xl" className="mt-4 mb-10 text-center">{t('profile.select_title')}</PixelTitle>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl w-full">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              if (p.pin) setPinFor(p.id);
              else selectProfile(p.id);
            }}
            className="pixel-btn bg-bg-card hover:bg-bg-mid border-ink-soft shadow-black shadow-pixel-md p-4 flex flex-col items-center gap-3 h-auto"
          >
            <AvatarSprite config={p.character} size={150} />
            <div className="text-2xl font-display font-bold text-white">{p.name}</div>
            <div className="text-sm font-body text-white/70">{p.age} J · {LANGUAGE_LABELS[p.language]}</div>
          </button>
        ))}

        <button
          onClick={() => setShowWizard(true)}
          className="pixel-btn bg-primary-500/20 hover:bg-primary-500/40 border-primary-700 shadow-ink-soft shadow-pixel-md p-4 flex flex-col items-center gap-3 h-auto"
        >
          <div className="w-[150px] h-[150px] rounded-chunk border-4 border-dashed border-white/30 flex items-center justify-center">
            <PixelIcon name="plus" size={64} tone="white" />
          </div>
          <div className="text-2xl font-display font-bold text-white">{t('profile.create_new')}</div>
        </button>
      </div>

      <PixelButton variant="ghost" size="md" className="mt-10" onClick={onParentZone} iconLeft={<PixelIcon name="lock" size={20} />}>
        {t('profile.parent_zone')}
      </PixelButton>

      {profileForPin && (
        <PinPad
          title={t('pin.enter_title')}
          expectedPin={profileForPin.pin}
          onSuccess={() => {
            selectProfile(profileForPin.id);
            setPinFor(null);
          }}
          onCancel={() => setPinFor(null)}
        />
      )}
    </div>
  );
}
