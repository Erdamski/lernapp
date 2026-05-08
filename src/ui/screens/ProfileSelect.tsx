import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@engine/state/store';
import AvatarSprite from '@ui/components/AvatarSprite';
import PixelCharacter from '@ui/components/PixelCharacter';
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
      <h1 className="text-5xl font-display mt-4 mb-8 text-center">{t('profile.select_title')}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl w-full">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              if (p.pin) setPinFor(p.id);
              else selectProfile(p.id);
            }}
            className="card-tile bg-white/5 hover:bg-white/10 p-4 flex flex-col items-center gap-3 btn-pop"
          >
            <AvatarSprite config={p.character} size={140} />
            <div className="text-2xl font-display">{p.name}</div>
            <div className="text-sm text-white/60">{p.age} J · {LANGUAGE_LABELS[p.language]}</div>
          </button>
        ))}

        <button
          onClick={() => setShowCreate(true)}
          className="card-tile bg-primary-500/20 hover:bg-primary-500/30 p-4 flex flex-col items-center gap-3 btn-pop border-dashed"
        >
          <div className="w-[140px] h-[140px] rounded-3xl border-4 border-dashed border-white/30 flex items-center justify-center text-7xl">+</div>
          <div className="text-2xl font-display">{t('profile.create_new')}</div>
        </button>
      </div>

      <button
        onClick={onParentZone}
        className="mt-10 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 font-display btn-pop"
      >
        🔒 {t('profile.parent_zone')}
      </button>

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card-tile bg-slate-800 p-6 max-w-3xl w-full my-auto">
        {step === 'pick' && (
          <>
            <h2 className="text-3xl font-display mb-2 text-center">Wähle deinen Charakter</h2>
            <p className="text-center text-white/60 mb-6">Du kannst ihn später noch ändern</p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {CHARACTER_PRESETS.map((preset) => {
                const isActive = character.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setCharacter(preset.config)}
                    className={`card-tile p-2 flex flex-col items-center gap-1 btn-pop ${
                      isActive ? 'bg-primary-500/40 ring-4 ring-primary-300' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <PixelCharacter config={preset.config} size={90} bg={null} />
                    <div className="text-sm font-display">{preset.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-3 rounded-full bg-white/10 font-display btn-pop">Abbrechen</button>
              <button
                onClick={() => setStep('details')}
                className="px-6 py-3 rounded-full bg-primary-500 font-display btn-pop"
              >
                Weiter →
              </button>
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <h2 className="text-3xl font-display mb-4 text-center">Erzähl uns von dir</h2>

            <div className="flex justify-center mb-6">
              <PixelCharacter config={character} size={140} />
            </div>

            <label className="block mb-2 text-white/70">{t('profile.name')}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              placeholder="Dein Name"
              className="w-full bg-slate-700 rounded-xl p-3 mb-3 text-white text-xl"
              maxLength={20}
            />

            <label className="block mb-2 text-white/70">{t('profile.age')}</label>
            <input
              type="number"
              value={age}
              min={4}
              max={14}
              onChange={(e) => setAge(parseInt(e.target.value) || 6)}
              className="w-full bg-slate-700 rounded-xl p-3 mb-3 text-white text-xl"
            />

            <label className="block mb-2 text-white/70">{t('profile.language')}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full bg-slate-700 rounded-xl p-3 mb-4 text-white text-xl"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
              ))}
            </select>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <div className="flex gap-3 justify-between">
              <button
                onClick={() => setStep('pick')}
                disabled={submitting}
                className="px-5 py-3 rounded-full bg-white/10 font-display btn-pop"
              >
                ← Zurück
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || submitting}
                className="px-6 py-3 rounded-full bg-primary-500 disabled:opacity-40 font-display btn-pop"
              >
                {submitting ? '…' : t('profile.create')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
