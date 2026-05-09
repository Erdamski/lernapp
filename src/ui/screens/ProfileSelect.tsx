import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import AvatarSprite from '@ui/components/AvatarSprite';
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
    <div className="w-full h-full flex flex-col relative">
      {/* Eltern-Bereich oben rechts in der Ecke */}
      <button
        onClick={onParentZone}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 pixel-btn bg-bg-card border-0 shadow-pixel-sm shadow-ink h-12 px-4 flex items-center gap-2"
        aria-label={t('profile.parent_zone')}
      >
        <PixelIcon name="lock" size={20} tone="white" />
        <span className="font-pixel text-[10px] text-white">ELTERN</span>
      </button>

      {/* Title-Banner mit Holz-Stil */}
      <div className="flex justify-center mt-8 mb-10">
        <div className="bg-amber-700 border-4 border-ink rounded-chunk px-8 py-4 shadow-pixel-lg shadow-amber-900">
          <PixelTitle size="xl" color="white" className="text-center drop-shadow-lg">
            {t('profile.select_title')}
          </PixelTitle>
        </div>
      </div>

      {/* Profile-Bereich – zentriert vertikal + horizontal */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl w-full place-items-center">
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
      </div>

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

// ─── Karten mit fixer Höhe, damit alle gleich aussehen ─────────────────────────

const CARD_W = 160;
const CARD_INNER_H = 160;
const CARD_TOTAL_H = 260;

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
      className="relative flex flex-col items-center gap-2 transition-transform active:scale-95 hover:-translate-y-1"
      style={{ width: CARD_W, height: CARD_TOTAL_H }}
    >
      {/* Pixel-Haus */}
      <div className="relative" style={{ width: CARD_W, height: CARD_INNER_H }}>
        <div className="grid grid-cols-2" style={{ width: CARD_W }}>
          <TileSprite index={38} size={CARD_W / 2} />
          <TileSprite index={39} size={CARD_W / 2} />
          <TileSprite index={TILE.HOUSE_WALL_LEFT} size={CARD_W / 2} />
          <TileSprite index={TILE.HOUSE_WALL_RIGHT} size={CARD_W / 2} />
        </div>
        {/* Avatar steht vor dem Haus */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2">
          <AvatarSprite config={avatar} size={120} />
        </div>
      </div>

      {/* Name auf Holz-Schild – fixe Position für Konsistenz */}
      <div className="mt-12 bg-amber-200 border-4 border-amber-900 rounded-chunk px-4 py-1 shadow-pixel-sm shadow-amber-900 min-w-[140px] text-center">
        <div className="text-xl font-display font-bold text-amber-900 leading-tight">{name}</div>
        <div className="text-xs font-body text-amber-800">{age} J · {languageLabel}</div>
      </div>
    </button>
  );
}

function NewProfileCard({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 transition-transform active:scale-95 hover:-translate-y-1"
      style={{ width: CARD_W, height: CARD_TOTAL_H }}
    >
      {/* Plus-Kachel mit gleicher Höhe wie ProfileCard-Haus + Avatar-Bereich */}
      <div
        className="rounded-chunk border-4 border-dashed flex items-center justify-center"
        style={{
          width: CARD_W,
          height: CARD_INNER_H + 60, // entspricht Haus + Avatar-Überlappung
          background: 'rgba(255,255,255,0.4)',
          borderColor: '#ca8a04',
          boxShadow: '0 6px 0 0 #92400e',
        }}
      >
        <PixelIcon name="plus" size={72} tone="ink" />
      </div>
      <div className="mt-1 bg-amber-200 border-4 border-amber-900 rounded-chunk px-4 py-1 shadow-pixel-sm shadow-amber-900 min-w-[140px] text-center">
        <div className="text-xl font-display font-bold text-amber-900 leading-tight">{label}</div>
        <div className="text-xs font-body text-amber-800">&nbsp;</div>
      </div>
    </button>
  );
}
