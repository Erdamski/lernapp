import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import AvatarSprite from '@ui/components/AvatarSprite';
import PixelButton from '@ui/components/PixelButton';
import PixelIcon from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
import TileSprite, { TILE } from '@ui/components/TileSprite';
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
    <div className="w-full h-full flex flex-col items-center p-6 overflow-y-auto relative">
      {/* Title-Banner mit Holz-Stil */}
      <div className="mt-6 mb-10 relative">
        <div className="bg-amber-700 border-4 border-ink rounded-chunk px-8 py-4 shadow-pixel-lg shadow-amber-900">
          <PixelTitle size="xl" color="white" className="text-center drop-shadow-lg">
            {t('profile.select_title')}
          </PixelTitle>
        </div>
      </div>

      {/* Profile als Pixel-Häuser */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl w-full">
        {profiles.map((p) => (
          <ProfileCard
            key={p.id}
            name={p.name}
            age={p.age}
            languageLabel={LANGUAGE_LABELS[p.language]}
            avatar={p.character}
            onClick={() => {
              if (p.pin) setPinFor(p.id);
              else selectProfile(p.id);
            }}
          />
        ))}
        <NewProfileCard onClick={() => setShowWizard(true)} label={t('profile.create_new')} />
      </div>

      <PixelButton
        variant="ghost"
        size="md"
        className="mt-10 mb-6"
        onClick={onParentZone}
        iconLeft={<PixelIcon name="lock" size={20} />}
      >
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

function ProfileCard({ name, age, languageLabel, avatar, onClick }: {
  name: string;
  age: number;
  languageLabel: string;
  avatar: import('@engine/db/schema').Profile['character'];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 p-4 transition-transform active:scale-95 hover:-translate-y-1"
    >
      {/* Pixel-Haus als Hintergrund-Element */}
      <div className="relative">
        <div className="grid grid-cols-2" style={{ width: 144 }}>
          <TileSprite index={38} size={72} />
          <TileSprite index={39} size={72} />
          <TileSprite index={TILE.HOUSE_WALL_LEFT} size={72} />
          <TileSprite index={TILE.HOUSE_WALL_RIGHT} size={72} />
        </div>
        {/* Avatar steht vor dem Haus */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3">
          <AvatarSprite config={avatar} size={120} />
        </div>
      </div>

      {/* Name auf Holz-Schild */}
      <div className="mt-12 bg-amber-200 border-4 border-amber-900 rounded-chunk px-4 py-1 shadow-pixel-sm shadow-amber-900">
        <div className="text-2xl font-display font-bold text-amber-900">{name}</div>
        <div className="text-xs font-body text-amber-800">{age} J · {languageLabel}</div>
      </div>
    </button>
  );
}

function NewProfileCard({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 transition-transform active:scale-95 hover:-translate-y-1"
    >
      <div
        className="rounded-chunk border-4 border-dashed flex items-center justify-center"
        style={{
          width: 144,
          height: 144,
          background: 'rgba(255,255,255,0.4)',
          borderColor: '#ca8a04',
          boxShadow: '0 6px 0 0 #92400e',
        }}
      >
        <PixelIcon name="plus" size={72} tone="ink" />
      </div>
      <div className="mt-2 bg-amber-200 border-4 border-amber-900 rounded-chunk px-4 py-1 shadow-pixel-sm shadow-amber-900">
        <div className="text-xl font-display font-bold text-amber-900">{label}</div>
      </div>
    </button>
  );
}
