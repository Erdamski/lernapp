import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import AvatarSprite from '@ui/components/AvatarSprite';
import PixelCharacter from '@ui/components/PixelCharacter';
import PixelButton from '@ui/components/PixelButton';
import PixelIcon from '@ui/components/PixelIcon';
import PixelTitle from '@ui/components/PixelTitle';
import { CHARACTER_PRESETS, type CharacterConfig } from '@engine/avatar/character';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@i18n/init';
import PinPad from '@ui/components/PinPad';

interface Props {
  onParentZone: () => void;
}

export default function ProfileSelect({ onParentZone }: Props) {
  const { t } = useTranslation();
  const profiles = useAppStore((s) => s.profiles);
  const loadProfiles = useAppStore((s) => s.loadProfiles);
  const selectProfile = useAppStore((s) => s.selectProfile);
  const [showCreate, setShowCreate] = useState(false);
  const [pinFor, setPinFor] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const profileForPin = pinFor ? profiles.find((p) => p.id === pinFor) : null;

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
          onClick={() => setShowCreate(true)}
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

      {showCreate && <CreateProfileFlow onClose={() => setShowCreate(false)} />}

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

/**
 * 2-stufiger Erstell-Flow: Charakter wählen → Name/Alter/Sprache eingeben.
 * Bewusst minimalistisch — drei klare Schritte, große Tap-Flächen.
 */
function CreateProfileFlow({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const createProfile = useAppStore((s) => s.createProfile);
  const [step, setStep] = useState<'pick' | 'details'>('pick');
  const [character, setCharacter] = useState<CharacterConfig>(CHARACTER_PRESETS[0].config);
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [language, setLanguage] = useState<SupportedLanguage>('de');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await createProfile({
        name: name.trim(),
        age,
        language,
        character,
      });
      onClose();
    } catch (err) {
      console.error('[CreateProfileFlow] submit failed', err);
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-bg-card border-4 border-ink shadow-pixel-lg shadow-ink rounded-chunk p-8 max-w-3xl w-full my-auto">
        {step === 'pick' && (
          <>
            <PixelTitle size="md" className="mb-2 text-center">Wähle deinen Charakter</PixelTitle>
            <p className="text-center font-body font-bold text-white/70 mb-6">Du kannst ihn später noch ändern</p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {CHARACTER_PRESETS.map((preset) => {
                const isActive = character.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setCharacter(preset.config)}
                    className={`pixel-btn border-ink shadow-pixel-sm p-2 flex flex-col items-center gap-1 h-auto
                      ${isActive ? 'bg-primary-500 shadow-ink-soft' : 'bg-bg-mid hover:bg-bg-deep shadow-black'}`}
                  >
                    <PixelCharacter config={preset.config} size={90} bg={null} />
                    <span className="font-pixel text-[10px] text-white">{preset.label.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-3">
              <PixelButton variant="ghost" size="md" onClick={onClose}>Abbrechen</PixelButton>
              <PixelButton variant="primary" size="md" onClick={() => setStep('details')} iconRight={<PixelIcon name="arrow-right" size={20} tone="white" />}>
                Weiter
              </PixelButton>
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <PixelTitle size="md" className="mb-4 text-center">Erzähl uns von dir</PixelTitle>

            <div className="flex justify-center mb-6">
              <PixelCharacter config={character} size={140} />
            </div>

            <label className="block mb-2 font-body font-bold text-white/80 text-lg">{t('profile.name')}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              placeholder="Dein Name"
              className="w-full bg-bg-mid border-2 border-ink-soft rounded-chunk p-4 mb-4 text-white text-2xl font-body font-bold"
              maxLength={20}
            />

            <label className="block mb-2 font-body font-bold text-white/80 text-lg">{t('profile.age')}</label>
            <input
              type="number"
              value={age}
              min={4}
              max={14}
              onChange={(e) => setAge(parseInt(e.target.value) || 6)}
              className="w-full bg-bg-mid border-2 border-ink-soft rounded-chunk p-4 mb-4 text-white text-2xl font-body font-bold"
            />

            <label className="block mb-2 font-body font-bold text-white/80 text-lg">{t('profile.language')}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full bg-bg-mid border-2 border-ink-soft rounded-chunk p-4 mb-4 text-white text-2xl font-body font-bold"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
              ))}
            </select>

            {error && <p className="text-accent-danger text-sm mb-3 font-body font-bold">{error}</p>}

            <div className="flex gap-3 justify-between">
              <PixelButton
                variant="ghost"
                size="md"
                onClick={() => setStep('pick')}
                disabled={submitting}
                iconLeft={<PixelIcon name="arrow-left" size={20} tone="white" />}
              >
                Zurück
              </PixelButton>
              <PixelButton
                variant="success"
                size="md"
                onClick={handleSubmit}
                disabled={!name.trim() || submitting}
              >
                {submitting ? '…' : t('profile.create')}
              </PixelButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
